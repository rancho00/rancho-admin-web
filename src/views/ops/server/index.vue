<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="listQuery" :inline="true">
      <el-form-item>
        <el-input
          v-model="listQuery.ip"
          placeholder="请输入ip"
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
          @click="addServer"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="updateServer"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="deleteServer"
        >删除</el-button>
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
      <el-table-column type="selection" width="40" align="center"/>
      <el-table-column prop="id" sortable="custom" label="ID" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" width="200">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="IP" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.ip }}
        </template>
      </el-table-column>
      <el-table-column label="端口" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.port }}
        </template>
      </el-table-column>
      <el-table-column label="账号" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.account }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="300">
        <template slot-scope="scope">{{ scope.row.createTime | formatDateTime }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template  slot-scope="scope">
          <el-button
            v-if="checkPermission('server:update')"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="updateServer(scope.row)"
          >编辑
          </el-button>
          <el-button
            v-if="checkPermission('server:delete')"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="deleteServer(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNumber" :limit.sync="listQuery.pageSize" @pagination="getServers" />

    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogTitle"
    >
      <el-form
        ref="form"
        :model="formData"
        :rules="rules"
        label-width="150px"
        size="small"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" placeholder="名称" />
        </el-form-item>
        <el-form-item label="IP" prop="ip">
          <el-input v-model="formData.ip" placeholder="IP" />
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input v-model="formData.port" placeholder="端口" />
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model="formData.account" placeholder="账号" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" type="password" style="width: 200px" />
          <el-button :loading="connectLoading" type="success" style="align: right;" @click="connectServer">测试连接</el-button>
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
import { getServers, addServer, updateServer, deleteServer, connectServer } from '@/api/server'
import { formatDate } from '@/utils/date'
import { checkPermission } from '@/utils/permission'
import Pagination from '@/components/Pagination'

const defaultFormData = {
  id: null,
  name: null,
  ip: null,
  port: null,
  password: null,
  account: null
}

const defaultQueryData = {
  ip: null
}

export default {
  components: { Pagination },
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
      listQuery: {
        ip: null,
        pageNumber: 1,
        pageSize: 10
      },
      listData: [],
      total: 0,
      single: true,
      multiple: true,
      ids: [],
      dialogVisible: false,
      formData: Object.assign({}, defaultFormData),
      dialogTitle: '',
      dialogType: '',
      rules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        ip: [{ required: true, message: 'IP不能为空', trigger: 'blur' }],
        port: [{ required: true, message: '端口不能为空', trigger: 'blur' }],
        account: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      },
      connectLoading: false
    }
  },
  created() {
    this.getServers()
  },
  methods: {
    checkPermission,
    search() {
      this.listQuery.pageNumber = 1
      this.getServers()
    },
    reset() {
      this.listQuery = Object.assign({}, defaultQueryData)
      this.getServers()
    },
    getServers() {
      this.listLoading = true
      getServers(this.listQuery).then(response => {
        this.listData = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    addServer() {
      this.formData = Object.assign({}, defaultFormData)
      this.dialogType = 'add'
      this.dialogTitle = '添加'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    updateServer(row) {
      this.dialogType = 'update'
      this.dialogTitle = '编辑'
      this.dialogVisible = true
      this.formData = Object.assign({}, row)
    },
    deleteServer(row) {
      this.$confirm('是否要删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const id = row.id || this.ids
        deleteServer(id).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.getServers()
        })
      })
    },
    handleConfirm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$confirm('是否要确认?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.dialogType === 'update') {
              updateServer(this.formData.id, this.formData).then(response => {
                this.$message({
                  message: response.message,
                  type: 'success'
                })
                this.dialogVisible = false
                this.getServers()
              })
            } else if (this.dialogType === 'add') {
              addServer(this.formData).then(response => {
                this.$message({
                  message: response.message,
                  type: 'success'
                })
                this.dialogVisible = false
                this.getServers()
              })
            }
          })
        }
      })
    },
    connectServer() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.connectLoading = true
          connectServer(this.formData).then((res) => {
            this.connectLoading = false
            this.$notify({
              title: res.data ? '连接成功' : '连接失败',
              type: res.data ? 'success' : 'error',
              duration: 2500
            })
          }).catch(() => {
            this.connectLoading = false
          })
        }
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
      this.getServers()
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
