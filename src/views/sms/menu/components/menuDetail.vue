<template>
  <el-card class="form-container" shadow="never">
    <el-form
      ref="dataForm"
      :model="defaultData"
      :rules="rules"
      label-width="150px"
      size="small"
    >
      <el-form-item v-if="pageType=='update'" label="ID：">
        <el-input v-model="defaultData.id" :disabled="true" style="width: 250px" />
      </el-form-item>
      <el-form-item label="名称：" prop="name">
        <el-input v-model="defaultData.name" style="width: 250px" />
      </el-form-item>
      <el-form-item label="uri：" prop="uri">
        <el-input v-model="defaultData.uri" style="width: 250px" />
      </el-form-item>
      <el-form-item label="权限值：" prop="value">
        <el-input v-model="defaultData.value" style="width: 250px" />
      </el-form-item>
      <el-form-item label="类型：" prop="type">
        <el-select v-model="defaultData.type" placeholder="请选择">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="父ID：" prop="pid">
        <el-input v-model="defaultData.pid" style="width: 250px" @focus="handlePidFocus" />
      </el-form-item>
      <el-form-item label="组件：">
        <el-input v-model="defaultData.component" style="width: 250px" />
      </el-form-item>
      <el-form-item label="icon：">
        <el-input v-model="defaultData.icon" style="width: 250px" />
      </el-form-item>
      <el-form-item label="排序：" prop="sort">
        <el-input v-model="defaultData.sort" style="width: 250px" />
      </el-form-item>
      <el-form-item label="是否隐藏" prop="isHidden">
        <el-radio-group v-model="defaultData.isHidden">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button size="small" @click="handleBack()">返 回</el-button>
        <el-button v-if="checkPermission('menu:update')" type="primary" size="small" @click="handleConfirm()">确 定</el-button>
      </el-form-item>
    </el-form>

    <el-dialog
      :visible.sync="dialogVisible"
      title="选择"
    >
      <el-tree
        ref="tree"
        :check-strictly="true"
        :data="menuListData"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        class="permission-tree"
        @check-change="checkChange"
      />
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleDialogConfirm()">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>
<script>
import { getHierarchyList, save, get, update } from '@/api/menu'
import { formatDate } from '@/utils/date'
import checkPermission from '@/utils/permission'

const defaultData = {
  id: null,
  name: null,
  uri: null,
  value: null,
  type: null,
  pid: null,
  component: null,
  icon: null,
  sort: null,
  createTime: null,
  isHidden: null
}

export default {
  name: 'MenuDetail',
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
  props: {
    pageType: {
      type: String
    }
  },
  data() {
    return {
      listData: null,
      total: 0,
      listLoading: true,
      dialogVisible: false,
      dialogType: '',
      defaultData: Object.assign({}, defaultData),
      rules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        uri: [{ required: true, message: 'uri不能为空', trigger: 'blur' }],
        value: [{ required: true, message: '权限值不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
        pid: [{ required: true, message: '父ID不能为空', trigger: 'blur' }],
        sort: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
        isHidden: [{ required: true, message: '是否隐藏不能为空', trigger: 'blur' }]
      },
      typeOptions: [
        {
          value: 0,
          label: '目录'
        },
        {
          value: 1,
          label: '菜单'
        },
        {
          value: 2,
          label: '按钮'
        }
      ],
      menuListData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created() {
    if (this.pageType === 'update') {
      get(this.$route.query.id).then(response => {
        const data = response.data
        this.defaultData = Object.assign({}, data)
      })
    } else {
      this.defaultData = Object.assign({}, defaultData)
    }
  },
  methods: {
    checkPermission,
    handleConfirm() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$confirm('是否要确认?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            if (this.pageType === 'update') {
              update(this.defaultData.id, this.defaultData).then(response => {
                this.$message({
                  message: response.message,
                  type: 'success'
                })
                this.$router.back()
              })
            } else {
              save(this.defaultData).then(response => {
                this.$message({
                  message: response.message,
                  type: 'success'
                })
                this.$router.back()
              })
            }
          })
        }
      })
    },
    handleBack() {
      this.$router.back()
    },
    handleDialogConfirm() {
      this.defaultData.pid = this.$refs.tree.getCheckedNodes()[0].id
      this.dialogVisible = false
    },
    handlePidFocus() {
      this.dialogVisible = true
      getHierarchyList().then(response => {
        const data = response.data
        this.menuListData = this.generateMenuList(data)
        this.$refs.tree.setCheckedKeys([this.defaultData.pid])
      })
    },
    checkChange(node, isCheck, childrenIsCheck) {
      if (isCheck) {
        this.$refs.tree.setCheckedKeys([])
        this.$refs.tree.setCheckedKeys([node.id])
      }
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
          name: menu.name,
          disabled: menu.type === 2
        }
        // 遍历子菜单
        if (menu.smsMenuList) {
          data.children = this.generateMenuList(menu.smsMenuList, '/')
        }
        res.push(data)
      }
      return res
    }
  }
}
</script>
