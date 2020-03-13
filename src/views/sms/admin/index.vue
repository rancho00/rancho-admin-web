<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="用户名" style="width: 200px;" class="filter-item" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="search">
        搜索
      </el-button>
      <el-button v-if="checkPermission('admin:save')" class="filter-item" type="primary" icon="el-icon-edit" @click="save">
        添加
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      fit
      border
      highlight-current-row
      :data="listData"
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column prop="id" sortable="custom" label="ID" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="昵称" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="200">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | statusFormat }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="上次登陆时间" align="center" width="300">
        <template slot-scope="scope">{{ scope.row.lastLoginTime | formatDateTime }}</template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="300">
        <template slot-scope="scope">{{ scope.row.createTime | formatDateTime }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template v-if="row.username!=='admin'" slot-scope="{row}">
          <el-button v-if="checkPermission('admin:update')" type="primary" size="mini" @click="update(row)">
            编辑
          </el-button>
          <el-button v-if="checkPermission('admin:updateStatus')" v-show="row.status==1" size="mini" type="danger" @click="updateStatus(row.$index, row)">
            禁用
          </el-button>
          <el-button v-if="checkPermission('admin:updateStatus')" v-show="row.status==0" size="mini" type="success" @click="updateStatus(row.$index, row)">
            启用
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNumber" :limit.sync="listQuery.pageSize" @pagination="list" />

    <el-dialog
      :title="dialogType==='update'?'编辑':'添加'"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form
        ref="dataForm"
        :model="defaultData"
        :rules="rules"
        label-width="150px"
        size="small"
      >
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="defaultData.username" style="width: 250px" />
        </el-form-item>
        <el-form-item label="昵称：" prop="nickname">
          <el-input v-model="defaultData.nickname" style="width: 250px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="defaultData.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="defaultData.roleIdList" multiple placeholder="请选择" style="width: 250px">
            <el-option
              v-for="(item, index) in roleList"
              :key="item.name + index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleConfirm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { list, save, getById, update, updateStatus } from '@/api/admin'
import { getRoleList as roleList } from '@/api/role'
import { formatDate } from '@/utils/date'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import checkPermission from '@/utils/permission'

const defaultData = {
  id: null,
  username: null,
  status: 1,
  roleIdList: []
}

export default {
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'danger',
        1: 'success'
      }
      return statusMap[status]
    },
    statusFormat(status) {
      const statusMap = {
        0: '禁用',
        1: '启用'
      }
      return statusMap[status]
    },
    formatDate(time) {
      if (time == null || time === '') {
        return 'N/A'
      }
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd')
    },
    formatDateTime(time) {
      if (time == null || time === '') {
        return 'N/A'
      }
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  data() {
    return {
      listData: null,
      listQuery: {
        username: undefined,
        pageNumber: 1,
        pageSize: 10,
        orderBy: ''
      },
      total: 0,
      listLoading: true,
      dialogVisible: false,
      dialogType: '',
      defaultData: Object.assign({}, defaultData),
      rules: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }, { validator: (rule, value, callback) => {
          if (value.length < 4) {
            callback(new Error('用户名最少4位'))
          } else {
            callback()
          }
        } }],
        nickname: [{ required: true, message: '昵称不能为空', trigger: 'blur' }]
      },
      roleList: []
    }
  },
  created() {
    this.list()
    this.getRoleList()
  },
  methods: {
    checkPermission,
    search() {
      this.listQuery.pageNumber = 1
      this.list()
    },
    list() {
      this.listLoading = true
      list(this.listQuery).then(response => {
        this.listData = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    save() {
      this.dialogVisible = true
      this.dialogType = 'add'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.defaultData = Object.assign({}, defaultData)
    },
    update(row) {
      this.dialogVisible = true
      this.dialogType = 'update'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      getById(row.id).then(response => {
        const data = response.data
        this.defaultData = Object.assign({}, data)
      })
    },
    updateStatus(index, row) {
      this.$confirm('是否要修改该状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let status = row.status
        if (status === 1) {
          status = 0
        } else if (status === 0) {
          status = 1
        }
        updateStatus(row.id, { 'status': status }).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.list()
        })
      })
    },
    handleConfirm() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$confirm('是否要确认?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            if (this.dialogType === 'update') {
              update(this.defaultData.id, this.defaultData).then(response => {
                this.$message({
                  message: response.message,
                  type: 'success'
                })
                this.dialogVisible = false
                this.list()
              })
            } else {
              save(this.defaultData).then(response => {
                this.$message({
                  message: response.message,
                  type: 'success'
                })
                this.dialogVisible = false
                this.list()
              })
            }
          })
        }
      })
    },
    getRoleList() {
      roleList().then(response => {
        this.roleList = response.data
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        if (order === 'ascending') {
          this.listQuery.orderBy = 'id asc'
        } else {
          this.listQuery.orderBy = 'id desc'
        }
      }
      this.listQuery.pageNumber = 1
      this.list()
    }
  }
}
</script>
