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
          @click="addServe"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="updateServe"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="deleteServe"
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
      <el-table-column label="端口" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.port }}
        </template>
      </el-table-column>
      <el-table-column label="上传目录" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.uploadPath }}
        </template>
      </el-table-column>
      <el-table-column label="部署目录" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.deployPath }}
        </template>
      </el-table-column>
      <el-table-column label="备份目录" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.backupPath }}
        </template>
      </el-table-column>
      <el-table-column label="备份目录" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.backupPath }}
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
            @click="updateServe(scope.row)"
          >编辑
          </el-button>
          <el-button
            v-if="checkPermission('server:delete')"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="deleteServe(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNumber" :limit.sync="listQuery.pageSize" @pagination="getServes" />

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
        <el-form-item label="端口" prop="port">
          <el-input-number v-model.number="formData.port" placeholder="例如：8080" />
        </el-form-item>
        <el-form-item label="上传目录" prop="uploadPath">
          <el-input v-model="formData.uploadPath" placeholder="例如: /opt/upload" />
        </el-form-item>
        <el-form-item label="部署目录" prop="deployPath">
          <el-input v-model="formData.deployPath" placeholder="例如: /opt/app" />
        </el-form-item>
        <el-form-item label="备份目录" prop="backupPath">
          <el-input v-model="formData.backupPath" placeholder="例如: /opt/backup" />
        </el-form-item>
        <el-form-item label="部署脚本" prop="deployScript">
          <el-input v-model="formData.deployScript" :rows="3" type="textarea" autosize  placeholder="" />
        </el-form-item>
        <el-form-item label="启动脚本" prop="startScript">
          <el-input v-model="formData.startScript" :rows="3" type="textarea" autosize  placeholder="" />
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
import { getServes, addServe, updateServe, deleteServe } from '@/api/serve'
import { formatDate } from '@/utils/date'
import { checkPermission } from '@/utils/permission'
import Pagination from '@/components/Pagination'

const defaultFormData = {
  id: null,
  name: null,
  port: 8080,
  uploadPath: '/opt/upload',
  deployPath: '/opt/app',
  backupPath: '/opt/backup'
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
        port: [{ required: true, message: '端口不能为空', trigger: 'blur' }],
        uploadPath: [{ required: true, message: '上传目录不能为空', trigger: 'blur' }],
        deployPath: [{ required: true, message: '部署目录不能为空', trigger: 'blur' }],
        backupPath: [{ required: true, message: '备份目录不能为空', trigger: 'blur' }],
        deployScript: [{ required: true, message: '备份脚本不能为空', trigger: 'blur' }],
        startScript: [{ required: true, message: '备份脚本不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getServes()
  },
  methods: {
    checkPermission,
    search() {
      this.listQuery.pageNumber = 1
      this.getServes()
    },
    reset() {
      this.listQuery = Object.assign({}, defaultQueryData)
      this.getServes()
    },
    getServes() {
      this.listLoading = true
      getServes(this.listQuery).then(response => {
        this.listData = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    addServe() {
      this.formData = Object.assign({}, defaultFormData)
      this.dialogType = 'add'
      this.dialogTitle = '添加'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    updateServe(row) {
      this.dialogType = 'update'
      this.dialogTitle = '编辑'
      this.dialogVisible = true
      this.formData = Object.assign({}, row)
    },
    deleteServe(row) {
      this.$confirm('是否要删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const id = row.id || this.ids
        deleteServe(id).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.getServes()
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
              updateServe(this.formData.id, this.formData).then(response => {
                this.$message({
                  message: response.message,
                  type: 'success'
                })
                this.dialogVisible = false
                this.getServes()
              })
            } else if (this.dialogType === 'add') {
              addServe(this.formData).then(response => {
                this.$message({
                  message: response.message,
                  type: 'success'
                })
                this.dialogVisible = false
                this.getServes()
              })
            }
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
      this.getServes()
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
