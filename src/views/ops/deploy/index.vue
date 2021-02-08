<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="addDeploy"
          v-if="checkPermission('deploy:add')"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="updateDeploy"
          v-if="checkPermission('deploy:update')"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="deleteDeploy"
          v-if="checkPermission('deploy:delete')"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-upload"
          size="mini"
          :disabled="single"
          @click="restore"
          v-if="checkPermission('deploy:execute')"
        >回退</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-upload"
          size="mini"
          :disabled="single"
          @click="serverStatus"
          v-if="checkPermission('deploy:execute')"
        >状态查询</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-upload"
          size="mini"
          :disabled="single"
          @click="startServer"
          v-if="checkPermission('deploy:delete')"
        >启动</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-upload"
          size="mini"
          :disabled="single"
          @click="stopServer"
          v-if="checkPermission('deploy:execute')"
        >停止</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-upload"
          size="mini"
          :disabled="single"
          @click="autoDeploy"
          v-if="checkPermission('deploy:execute')"
        >一键部署</el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="listLoading"
      fit
      border
      highlight-current-row
      :data="listData"
      style="width: 100%;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40" align="center"/>
      <el-table-column label="ID" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="服务ID" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.serveId }}
        </template>
      </el-table-column>
      <el-table-column label="服务名称" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.serve.name }}
        </template>
      </el-table-column>
      <el-table-column label="服务器ID" align="center"  width="200">
        <template slot-scope="scope">
          {{ scope.row.servers | formatServerId}}
        </template>
      </el-table-column>
      <el-table-column label="服务器名称" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.servers | formatServerName}}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="300">
        <template slot-scope="scope">{{ scope.row.createTime | formatDateTime }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template  slot-scope="scope">
          <el-button
            v-if="checkPermission('deploy:update')"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="updateDeploy(scope.row)"
          >编辑
          </el-button>
          <el-button
            v-if="checkPermission('deploy:delete')"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="deleteDeploy(scope.row)"
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
        <el-form-item label="服务">
          <el-select v-model="formData.serveId" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="(item, index) in serves"
              :key="item.value + index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="服务器">
          <el-select v-model="formData.serverIds" multiple placeholder="请选择" style="width: 100%">
            <el-option
              v-for="(item, index) in servers"
              :key="item.value + index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleConfirm()">确 定</el-button>
      </span>
    </el-dialog>

    <deploy ref="deploy"/>

    <restore ref="restore"/>
  </div>
</template>

<script>
import { getDeploys, addDeploy, getDeploy, updateDeploy, deleteDeploy, getServers, getServes, startServer, stopServer, serverStatus } from '@/api/deploy'
import { formatDate } from '@/utils/date'
import { checkPermission } from '@/utils/permission'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
import restore from './restore'
import deploy from './deploy'

const defaultQueryData = {
  ip: null
}

export default {
  components: { Pagination, restore, deploy },
  computed: {
    ...mapGetters(['name'])
  },
  filters: {
    formatServerId(servers) {
      const res = []
      servers.forEach(server => {
        res.push(server.id)
      })
      return res.join(",")
    },
    formatServerName(servers) {
      const res = []
      servers.forEach(server => {
        res.push(server.name)
      })
      return res.join(",")
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
      formData: {},
      dialogTitle: '',
      dialogType: '',
      rules: {
        server: [{ required: true, message: '服务器不能为空', trigger: 'blur' }],
        serve: [{ required: true, message: '服务不能为空', trigger: 'blur' }]
      },
      servers: [],
      serves: []
    }
  },
  created() {
    this.getDeploys()
    this.getServers()
    this.getServes()
    this.initWebSocket()
  },
  methods: {
    checkPermission,
    search() {
      this.listQuery.pageNumber = 1
      this.getDeploys()
    },
    reset() {
      this.listQuery = Object.assign({}, defaultQueryData)
      this.getDeploys()
    },
    getDeploys() {
      this.listLoading = true
      getDeploys(this.listQuery).then(response => {
        this.listData = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    getServers() {
      getServers().then(response => {
        this.servers = response.data
      })
    },
    getServes() {
      getServes().then(response => {
        this.serves = response.data
      })
    },
    addDeploy() {
      this.formData = {}
      this.dialogType = 'add'
      this.dialogTitle = '添加'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    updateDeploy(row) {
      const id = row.id || this.ids
      getDeploy(id).then(response => {
        const data = response.data
        const serverIds = []
        data.servers.forEach(server => {
          serverIds.push(server.id)
        })
        data.serverIds = serverIds
        this.formData = data
        this.dialogType = 'update'
        this.dialogTitle = '编辑'
        this.dialogVisible = true
      })
    },
    deleteDeploy(row) {
      this.$confirm('是否要删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const id = row.id || this.ids
        deleteDeploy(id).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.getDeploys()
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
              updateDeploy(this.formData.id,this.formData).then(response => {
                this.$message({
                  message: response.message,
                  type: 'success'
                })
                this.dialogVisible = false
                this.getDeploys()
              })
            } else if (this.dialogType === 'add') {
              addDeploy(this.formData).then(response => {
                this.$message({
                  message: response.message,
                  type: 'success'
                })
                this.dialogVisible = false
                this.getDeploys()
              })
            }
          })
        }
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    initWebSocket() {
      const wsUri = process.env.VUE_APP_WS_API + '/webSocket'
      this.websock = new WebSocket(wsUri + '/' + this.name)
      this.websock.onerror = this.webSocketOnError
      this.websock.onmessage = this.webSocketOnMessage
    },
    webSocketOnError(e) {
      this.$notify({
        title: 'WebSocket连接发生错误',
        type: 'error',
        duration: 0
      })
    },
    webSocketOnMessage(e) {
      const data = JSON.parse(e.data)
      if (data.msgType === 'INFO') {
        this.$notify({
          title: '',
          message: data.msg,
          type: 'success',
          dangerouslyUseHTMLString: true,
          duration: 5500
        })
      } else if (data.msgType === 'ERROR') {
        this.$notify({
          title: '',
          message: data.msg,
          dangerouslyUseHTMLString: true,
          type: 'error',
          duration: 0
        })
      }
    },
    autoDeploy() {
      getDeploy(this.ids).then(response => {
        const data = response.data
        this.$refs.deploy.setRow(data)
        this.$refs.deploy.dialogVisible = true
      })
    },
    restore() {
      getDeploy(this.ids).then(response => {
        const data = response.data
        this.$refs.restore.getDeployHistorys(data)
        this.$refs.restore.dialogVisible = true
      })
    },
    startServer() {
      startServer(this.ids).then(response => {
      }).catch(err => {
        console.log('error:' + err.response.data.message)
      })
    },
    stopServer() {
      stopServer(this.ids).then(response => {
      }).catch(err => {
        console.log('error:' + err.response.data.message)
      })
    },
    serverStatus() {
      serverStatus(this.ids).then(response => {
      }).catch(err => {
        console.log('error:' + err.response.data.message)
      })
    }
  }
}
</script>
