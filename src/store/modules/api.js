const baseUrl = process.env.VUE_APP_BASE_API
const api = {
  state: {
    // 实时控制台
    visitUrl: 'http://123.57.164.79:8089/file',
    // 图片上传
    uploadUrl: 'http://123.57.164.79:8089/file/upload',
    // swagger
    swaggerApi: baseUrl + '/swagger-ui.html'
  }
}

export default api
