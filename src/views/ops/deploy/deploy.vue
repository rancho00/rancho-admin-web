<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    title="应用部署"
    width="400px">
    <el-upload
      :action="actionUrl"
      :headers="headers"
      :on-success="handleSuccess"
      :on-error="handleError"
      class="upload-demo"
      drag
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
      <div slot="tip" class="el-upload__tip">多个应用上传文件名称为all.zip,数据库更新脚本扩展名为.sql,上传成功后系统自动部署系统。</div>
    </el-upload>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="this.dialogVisible = false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'

export default {
  data() {
    return {
      dialogVisible
  : false,
      headers: {
        Authorization: getToken()
      },
      id: null
    }
  },
  computed: {
    ...mapGetters(['baseUrl']),
    actionUrl() {
      return this.baseUrl + '/deploy/' + this.id + '/autoDeploy'
    }
  },
  created() {
  },
  methods: {
    setRow(row) {
      this.id = row.id
    },
    handleSuccess(response, file, fileList) {
      this.dialogVisible = false
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500
      })
    }
  }
}
</script>
