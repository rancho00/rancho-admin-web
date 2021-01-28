<template>
  <div class="app-container">

    <el-form ref="queryForm" :model="listQuery" :inline="true">
      <el-form-item label="名称">
        <el-input
          v-model="listQuery.name"
          placeholder="请输入名称"
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
          plain
          icon="el-icon-plus"
          size="mini"
          @click="addMenu"
        >新增</el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="listLoading"
      fit
      border
      highlight-current-row
      :data="listData"
      row-key="id"
      style="width: 100%;"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="名称" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="图标" align="center" width="150">
        <template slot-scope="scope">
          <svg-icon v-if="scope.row.icon!=undefined" :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限值" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.permission }}</span>
        </template>
      </el-table-column>
      <el-table-column label="访问路径" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.uri }}</span>
        </template>
      </el-table-column>
      <el-table-column label="组件路径" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.component }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.status | statusFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="200">
        <template slot-scope="scope">{{ scope.row.createTime | formatDateTime }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{row}">
          <el-button
            v-if="checkPermission('menu:add')"
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="addMenu(row)"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="updateMenu(row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="deleteMenu(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" width="600px" append-to-body>
      <el-form ref="form" :model="formData" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单">
              <treeselect
                v-model="formData.pid"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级菜单"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="type">
              <el-radio-group v-model="formData.type">
                <el-radio :label="0">目录</el-radio>
                <el-radio :label="1">菜单</el-radio>
                <el-radio :label="2">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="formData.name" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="formData.type != 2" label="菜单图标">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
              >
                <IconSelect ref="iconSelect" @selected="iconSelect" />
                <el-input slot="reference" v-model="formData.icon" placeholder="点击选择图标" readonly>
                  <svg-icon
                    v-if="formData.icon"
                    slot="prefix"
                    :icon-class="formData.icon"
                    class="el-input__icon"
                    style="height: 32px;width: 16px;"
                  />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权限标识"   prop="icon">
              <el-input v-model="formData.permission" placeholder="请权限标识" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="访问路径">
              <el-input v-model="formData.uri" placeholder="请输入访问路径" />
            </el-form-item>
          </el-col>
          <el-col v-if="formData.type == '1'" :span="12">
            <el-form-item label="组件路径">
              <el-input v-model="formData.component" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序">
              <el-input-number v-model="formData.sort" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="formData.status">
                <el-radio :label="0">禁用</el-radio>
                <el-radio :label="1">正常</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
        <el-button size="small" @click="handleCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getTreeMenus, deleteMenu, updateMenu, addMenu, getMenu } from '@/api/menu'
import { formatDate } from '@/utils/date'
import { checkPermission } from '@/utils/permission'
import IconSelect from '@/components/IconSelect'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

const defaultQueryData = {
  name: null,
  pageNumber: 1,
  pageSize: 10,
  orderBy: ''
}

const defaultFormData = {
  pid: 0,
  name: undefined,
  icon: undefined,
  type: 0,
  sort: undefined,
  status: 0
}

export default {
  components: { IconSelect, Treeselect },
  filters: {
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
      listLoading: true,
      listQuery: {
        username: null
      },
      listData: [],
      dialogVisible: false,
      dialogType: '',
      formData: {},
      menuOptions: [],
      rules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '类型不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getMenus()
  },
  methods: {
    checkPermission,
    search() {
      this.getMenus()
    },
    reset() {
      this.listQuery = Object.assign({}, defaultQueryData)
      this.getAdmins()
    },
    getMenus() {
      this.listLoading = true
      getTreeMenus(this.listQuery).then(response => {
        this.listData = response.data
        this.listLoading = false
      })
    },
    addMenu(row) {
      this.getElTreeMenus()
      this.dialogType = 'add'
      this.formData = defaultFormData
      if (row != null && row.pid) {
        this.formData.pid = row.pid
      } else {
        this.formData.pid = '0'
      }
      this.dialogVisible = true
    },
    getElTreeMenus() {
      getTreeMenus(this.listQuery).then(response => {
        this.menuOptions = []
        const menu = { id: 0, name: '主类目', children: [] }
        menu.children = response.data
        this.menuOptions.push(menu)
      })
    },
    updateMenu(row) {
      getMenu(row.id).then(response => {
        const data = response.data
        this.formData = data
        this.getElTreeMenus()
        this.dialogType = 'update'
        this.dialogVisible = true
      })
    },
    deleteMenu(row) {
      this.$confirm('是否要删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMenu(row.id).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.getMenus()
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
              updateMenu(this.formData.id, this.formData).then(response => {
                this.$message({
                  message: response.message,
                  type: 'success'
                })
                this.dialogVisible = false
                this.getMenus()
              })
            } else {
              addMenu(this.formData).then(response => {
                this.$message({
                  message: response.message,
                  type: 'success'
                })
                this.dialogVisible = false
                this.getMenus()
              })
            }
          })
        }
      })
    },
    handleCancel() {
      this.$refs['form'].resetFields()
      this.dialogVisible = false
    },
    iconSelect(name) {
      this.formData.icon = name
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    }
  }
}
</script>
