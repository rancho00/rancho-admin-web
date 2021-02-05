const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.admin.token,
  avatar: state => state.admin.avatar,
  name: state => state.admin.name,
  roles: state => state.admin.roles,
  routes: state => state.route.routes,
  permissions: state => state.admin.permissions,
  swaggerApi: state => state.api.swaggerApi,
  druidApi: state => state.api.druidApi,
  type: state => state.admin.type,
  baseUrl: state => state.api.baseUrl

}
export default getters
