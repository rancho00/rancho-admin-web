<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="listQuery" :inline="true">
      <el-form-item label="用户名">
        <el-input
          v-model="listQuery.username"
          placeholder="请输入用户名"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="search">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="addAdmin"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="updateAdmin"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="addAdmin"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="download"
          :loading="downloadLoading"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="listLoading"
      fit
      border
      highlight-current-row
      :data="listData"
      style="width: 100%;"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40" align="center" />
      <el-table-column prop="id" sortable="custom" label="ID" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="昵称" align="center" width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="禁用/启用" align="center" width="300">
        <template slot-scope="scope" v-if="scope.row.username !== 'admin'">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @change="updateAdminStatus(scope.row.id, scope.row.status)"
          />
        </template>
      </el-table-column>
      <el-table-column label="上次登陆时间" align="center" width="300">
        <template slot-scope="scope">{{ scope.row.lastLoginTime | formatDateTime }}</template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="300">
        <template slot-scope="scope">{{ scope.row.createTime | formatDateTime }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{row}" v-if="row.username !== 'admin'">
          <el-button
            v-if="checkPermission('admin:update')"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="updateAdmin(row)"
          >编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNumber" :limit.sync="listQuery.pageSize" @pagination="getAdmins" />

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form
        ref="form"
        :model="formData"
        :rules="rules"
        label-width="150px"
        size="small"
      >
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="formData.username" style="width: 250px" />
        </el-form-item>
        <el-form-item label="昵称：" prop="nickname">
          <el-input v-model="formData.nickname" style="width: 250px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="formData.roleIds" multiple placeholder="请选择" style="width: 250px">
            <el-option
              v-for="(item, index) in roles"
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
import { getAdmins, addAdmin, getAdmin, updateAdmin, updateAdminStatus, download } from '@/api/admin'
import { getAllRoles } from '@/api/role'
import { formatDate } from '@/utils/date'
import Pagination from '@/components/Pagination'
import { downloadFile } from '@/utils/index'
import waves from '@/directive/waves'
import { checkPermission } from '@/utils/permission'

const defaultFormData = {
  id: null,
  username: null,
  status: 1,
  roleIds: []
}

const defaultQueryData = {
  username: null,
  pageNumber: 1,
  pageSize: 10,
  orderBy: ''
}

export default {
  components: { Pagination },
  directives: { waves },
  filters: {
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
      listLoading: true,
      listData: [],
      listQuery: Object.assign({}, defaultQueryData),
      total: 0,
      dialogVisible: false,
      dialogType: '',
      dialogTitle: '',
      formData: Object.assign({}, defaultFormData),
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
      roles: [],
      single: true,
      multiple: true,
      ids: [],
      downloadLoading: false
    }
  },
  created() {
    this.getAdmins()
    this.getAllRoles()
  },
  methods: {
    checkPermission,
    search() {
      this.listQuery.pageNumber = 1
      this.getAdmins()
    },
    getAdmins() {
      this.listLoading = true
      getAdmins(this.listQuery).then(response => {
        this.listData = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    reset() {
      this.listQuery = Object.assign({}, defaultQueryData)
      this.getAdmins()
    },
    addAdmin() {
      this.dialogVisible = true
      this.dialogType = 'add'
      this.dialogTitle = '新增'
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
      this.formData = Object.assign({}, defaultFormData)
    },
    updateAdmin(row) {
      this.dialogVisible = true
      this.dialogType = 'update'
      this.dialogTitle = '编辑'
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
      const id = row.id || this.ids
      getAdmin(id).then(response => {
        const data = response.data
        this.formData = Object.assign({}, data)
        if (data.adminRoles) {
          const roleIds = []
          data.adminRoles.forEach(adminRoel => {
            roleIds.push(adminRoel.roleId)
          })
          this.formData.roleIds = roleIds
        }
      })
    },
    updateAdminStatus(id, status) {
      this.$confirm('是否要修改该状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateAdminStatus(id, { 'status': status }).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.getAdmins()
        })
      })
    },
    handleConfirm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$confirm('是否要确认?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            if (this.dialogType === 'update') {
              updateAdmin(this.formData.id, this.formData).then(response => {
                this.$message({
                  message: response.message,
                  type: 'success'
                })
                this.dialogVisible = false
                this.getAdmins()
              })
            } else {
              addAdmin(this.formData).then(response => {
                this.$message({
                  message: response.message,
                  type: 'success'
                })
                this.dialogVisible = false
                this.getAdmins()
              })
            }
          })
        }
      })
    },
    getAllRoles() {
      getAllRoles().then(response => {
        this.roles = response.data
      })
    },
    download() {
      this.downloadLoading = true
      download(this.listQuery).then(result => {
        downloadFile(result, '用户列表', 'xlsx')
        this.downloadLoading = false
      }).catch(() => {
        this.downloadLoading = false
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
      this.getAdmins()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    }
  }
}
</script>
