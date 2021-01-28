<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="addRole"
          v-if="checkPermission('role:add')"
        >新增</el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="listLoading"
      fit
      border
      highlight-current-row
      :data="listData"
      style="width: 100%;"
    >
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" width="200">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="200">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | statusFormat }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="300">
        <template slot-scope="scope">{{ scope.row.createTime | formatDateTime }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template  slot-scope="scope">
          <el-button
            v-if="checkPermission('role:update')"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="updateRole(scope)"
          >编辑
          </el-button>
          <el-button
            v-if="checkPermission('role:update')"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="updateRoleMenu(scope)"
          >授权菜单
          </el-button>
          <el-button
            v-if="checkPermission('role:delete')"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="deleteRole(scope)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNumber" :limit.sync="listQuery.pageSize" @pagination="getRoles" />

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
        <el-form-item label="描述">
          <el-input
            v-model="formData.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="描述"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单" v-if="this.dialogType === 'updateMenu'">
          <el-tree
            ref="tree"
            :check-strictly="false"
            :data="menus"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            class="permission-tree"
          />
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
import { getRoles, addRole, getRoleMenus, updateRole, updateRoleMenu, deleteRole } from '@/api/role'
import { formatDate } from '@/utils/date'
import { getTreeMenus } from '@/api/menu'
import Pagination from '@/components/Pagination'
import { checkPermission } from '@/utils/permission'

const formData = {
  id: null,
  name: '',
  description: '',
  status: 1
}

export default {
  components: { Pagination },
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
      listData: [],
      listQuery: {
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      listLoading: true,
      dialogVisible: false,
      menus: [],
      formData: Object.assign({}, formData),
      dialogTitle: '',
      dialogType: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      rules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getRoles()
    this.getMenus()
  },
  methods: {
    checkPermission,
    getMenus() {
      getTreeMenus().then(response => {
        this.menus = this.generateMenuList(response.data)
      })
    },
    getRoles() {
      this.listLoading = true
      getRoles(this.listQuery).then(response => {
        this.listData = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    addRole() {
      this.formData = Object.assign({}, formData)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'add'
      this.dialogTitle = '添加'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    updateRole(scope) {
      this.dialogType = 'update'
      this.dialogTitle = '编辑'
      this.dialogVisible = true
      this.formData = Object.assign({}, scope.row)
    },
    updateRoleMenu(scope) {
      this.dialogType = 'updateMenu'
      this.dialogTitle = '授权菜单'
      this.dialogVisible = true
      this.formData = Object.assign({}, scope.row)
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
        getRoleMenus(scope.row.id).then(response => {
          const checkedNodes = []
          response.data.forEach(roleMenu => {
            if (this.isFunctionNode(roleMenu.menuId, this.menus)) {
              checkedNodes.push(roleMenu.menuId)
            }
          })
          this.$refs.tree.setCheckedKeys(checkedNodes)
        })
      })
    },
    isFunctionNode(menuId, menuList) {
      for (let i = 0; i < menuList.length; i++) {
        const menu = menuList[i]
        if (menuId === menu.id) {
          return menu.children.length === 0
        }
        if (menu.children.length > 0) {
          const isFunctionNode = this.isFunctionNode(menuId, menu.children)
          if (isFunctionNode !== undefined) {
            return isFunctionNode
          }
        }
      }
    },
    deleteRole(scope) {
      this.$confirm('是否要删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole(scope.row.id).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.getRoles()
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
              updateRole(this.formData.id, this.formData).then(response => {
                this.$message({
                  message: response.message,
                  type: 'success'
                })
                this.dialogVisible = false
                this.getRoles()
              })
            } else if (this.dialogType === 'updateMenu') {
              updateRoleMenu(this.formData.id, this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())).then(response => {
                this.$message({
                  message: response.message,
                  type: 'success'
                })
                this.dialogVisible = false
                this.getRoles()
              })
            } else {
              addRole(this.formData).then(response => {
                this.$message({
                  message: response.message,
                  type: 'success'
                })
                this.dialogVisible = false
                this.getRoles()
              })
            }
          })
        }
      })
    },
    /**
       * 根据生成菜单
       * @param routes
       * @param basePath
       * @returns {[]}
       */
    generateMenuList(smsMenuList, basePath = '/') {
      const res = []
      for (const menu of smsMenuList) {
        const data = {
          id: menu.id,
          name: menu.name
        }
        // 遍历子菜单
        if (menu.children) {
          data.children = this.generateMenuList(menu.children, '/')
        }
        res.push(data)
      }
      return res
    }
  }
}
</script>
