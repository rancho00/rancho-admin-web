<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-if="checkPermission('role:save')" class="filter-item" type="primary" icon="el-icon-edit" @click="save">
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
        <template v-if="scope.row.name!=='admin'" slot-scope="scope">
          <el-button v-if="checkPermission('role:update')" type="primary" size="small" @click="update(scope)">编辑</el-button>
          <el-button v-if="checkPermission('role:delete')" type="danger" size="small" @click="del(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNumber" :limit.sync="listQuery.pageSize" @pagination="list" />

    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType==='edit'?'编辑':'添加'"
    >
      <el-form
        ref="dataForm"
        :model="defaultData"
        :rules="rules"
        label-width="150px"
        size="small"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="defaultData.name" placeholder="名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="defaultData.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="描述"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="defaultData.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单">
          <el-tree
            ref="tree"
            :check-strictly="false"
            :data="menuListData"
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
import { list, save, get, del, update } from '@/api/role'
import { formatDate } from '@/utils/date'
import { getTreeMenuList } from '@/api/menu'
import Pagination from '@/components/Pagination'
import checkPermission from '@/utils/permission'

const defaultData = {
  id: null,
  name: '',
  description: '',
  status: 1,
  menuIdList: []
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
      menuListData: [],
      defaultData: Object.assign({}, defaultData),
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
    this.getMenuList()
    this.list()
  },
  methods: {
    checkPermission,
    getMenuList() {
      getTreeMenuList().then(response => {
        this.menuListData = this.generateMenuList(response.data)
      })
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
      this.defaultData = Object.assign({}, defaultData)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'add'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    update(scope) {
      this.dialogType = 'update'
      this.dialogVisible = true
      this.defaultData = Object.assign({}, scope.row)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        get(scope.row.id).then(response => {
          const checkedNodes = []
          response.data.menuIdList.forEach(menuId => {
            if (this.isFunctionNode(menuId, this.menuListData)) {
              checkedNodes.push(menuId)
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
    del(scope) {
      this.$confirm('是否要删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(scope.row.id).then(response => {
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
            this.defaultData.menuIdList = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
            const isEdit = this.dialogType === 'update'
            if (isEdit) {
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
