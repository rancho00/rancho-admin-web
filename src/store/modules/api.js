const baseUrl = process.env.VUE_APP_BASE_API
const api = {
  state: {
    // baseUrl
    baseUrl: baseUrl,
    // swagger
    swaggerApi: baseUrl + '/swagger-ui.html',
    // druid
    druidApi: baseUrl + '/druid/index.html',
    fileVisitUrl: baseUrl + '/file',
    fileUploadUrl: baseUrl + '/file/upload'
  }
}

export default api
