<template>
  <div class="app-container">
    <el-form
      ref="form"
      :model="formData"
      :rules="rules"
      label-width="150px"
      size="small"
    >
      <el-form-item label="应用" prop="deployId">
        <el-select v-model="formData.deployId" placeholder="请选择" style="width: 100%" @change="handleChange">
          <el-option
            v-for="(deploy, index) in deploys"
            :key="deploy.id + index"
            :label="deploy.serve.name"
            :value="deploy.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="条数" prop="num">
        <el-select v-model="formData.num" placeholder="请选择" style="width: 100%">
          <el-option
            v-for="(item, index) in nums"
            :key="item.value + index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="load()">加载</el-button>
      <el-card v-for="(value,key,index) in items" class="box-card" style="width: 50%;height: 400px;overflow:auto">
        <div slot="header" class="clearfix">
          <span>{{ key }}</span>
          <div v-for="(item) in value">{{ item }}</div>
        </div>
      </el-card>
    </el-form>
  </div>
</template>

<script>
import { getDeploys } from '@/api/deploy'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['name'])
  },
  data() {
    return {
      loading: true,
      deploys: [],
      deploy: {},
      formData: {},
      listQuery: {
        pageNumber: 1,
        pageSize: 999
      },
      rules: {
        deployId: [{ required: true, message: '应用不能为空', trigger: 'blur' }],
        num: [{ required: true, message: '条数不能为空', trigger: 'blur' }]
      },
      nums: [{
        value: '100',
        label: '100'
      }, {
        value: '500',
        label: '500'
      }, {
        value: '1000',
        label: '1000'
      }],
      items: []
    }
  },
  created() {
    this.initWebSocket()
  },
  methods: {
    getDeploys() {
      this.loading = true
      getDeploys(this.listQuery).then(response => {
        this.deploys = response.data.list
      })
    },
    load() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const msg = {}
          msg.type = 'log'
          const data = {}
          data.count = this.formData.num
          data.deploy = this.deploy
          msg.data = data
          this.websock.send(JSON.stringify(msg))
        }
      })
    },
    handleChange(v) {
      this.deploys.forEach(deploy => {
        if (deploy.id === v) {
          this.deploy = deploy
        }
      })
    },
    initWebSocket() {
      const wsUri = process.env.VUE_APP_WS_API + '/webSocket'
      this.websock = new WebSocket(wsUri + '/' + this.name)
      this.websock.onopen = this.webSocketOnOpen
      this.websock.onerror = this.webSocketOnError
      this.websock.onmessage = this.webSocketOnMessage
    },
    webSocketOnOpen(e) {
      this.getDeploys()
    },
    webSocketOnError(e) {
      this.$notify({
        title: 'WebSocket连接发生错误',
        type: 'error',
        duration: 0
      })
    },
    webSocketOnMessage(e) {
      this.items = JSON.parse(e.data)
    }
  }
}
</script>

