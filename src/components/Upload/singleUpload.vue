<template>
  <div>
    <el-upload
      :action="uploadUrl"
      :data="defaultData"
      list-type="picture"
      :multiple="false"
      :file-list="fileList"
      :show-file-list="showFileList"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10MB</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="fileList[0].url" alt="">
    </el-dialog>
  </div>
</template>
<script>
import { getVisitUrl, getUploadUrl } from '@/utils/file'

export default {
  name: 'SingleUpload',
  props: {
    value: String,
    folderName: String
  },
  data() {
    return {
      defaultData: {},
      uploadUrl: '',
      dialogVisible: false,
      baseUrl: ''
    }
  },
  computed: {
    imageUrl() {
      return getVisitUrl() + this.value
    },
    imageName() {
      if (this.value != null && this.value !== '') {
        return this.value.substr(this.value.lastIndexOf('/') + 1)
      } else {
        return null
      }
    },
    fileList() {
      return [{
        name: this.imageName,
        url: this.imageUrl
      }]
    },
    showFileList: {
      get: function() {
        return this.value !== null && this.value !== '' && this.value !== undefined
      },
      set: function(newValue) {
      }
    }
  },
  created() {
    this.defaultData.folderName = this.folderName
    this.uploadUrl = getUploadUrl()
  },
  methods: {
    emitInput(val) {
      this.$emit('input', val)
    },
    handleRemove(file, fileList) {
      this.emitInput('')
    },
    handlePreview(file) {
      this.dialogVisible = true
    },
    handleUploadSuccess(res, file) {
      if (res.code !== 200) {
        this.$message({
          message: res.message,
          type: 'error'
        })
        this.emitInput('')
      } else {
        this.emitInput(res.data.baseUrl)
      }
    }
  }
}
</script>
<style>

</style>

