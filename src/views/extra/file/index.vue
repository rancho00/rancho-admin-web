<template>
  <el-card class="form-container" shadow="never">
    <el-form
      ref="formData"
      :model="defaultData"
      :rules="rules"
      label-width="150px"
      size="small"
    >
      <el-form-item label="封面：" prop="url">
        <single-upload v-model="defaultData.url" :folder-name="folderName" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="handleConfirm()">确 定</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import SingleUpload from '@/components/Upload/singleUpload'

const defaultData = {
  url: null
}

export default {
  name: 'BannerDetail',
  components: { SingleUpload },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      defaultData: {},
      rules: {
        url: [{ required: true, message: 'url不能为空', trigger: 'blur' }]
      },
      folderName: 'bank'
    }
  },
  created() {
    this.defaultData = Object.assign({}, defaultData)
  },
  methods: {
    handleConfirm() {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          this.$confirm('是否要确认?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            console.log(this.defaultData)
          })
        }
      })
    }
  }
}
</script>

