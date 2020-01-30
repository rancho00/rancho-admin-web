import { constantRoutes } from '@/router'
/* Layout */
import Layout from '@/layout'

const state = {
  routes: [],
  addRoutes: [],
  permissions: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  }
}

const actions = {
  generateRoutes({ commit }, menus) {
    return new Promise(resolve => {
      const accessedRoutes = generateRoutes(menus)
      commit('SET_ROUTES', accessedRoutes)
      commit('SET_PERMISSIONS', permissions)
      resolve(accessedRoutes)
    })
  }
}

const permissions = []
export function generateRoutes(menus) {
  const res = []
  menus.forEach(menu => {
    const data = {
      path: menu.uri,
      name: menu.name,
      meta: { title: menu.name, icon: menu.icon }
    }
    if (menu.type === 0) {
      data.component = Layout
    } else if (menu.type === 1) {
      data.component = () => import(`@/views/${menu.component}`)
    }
    if (menu.isHidden === 0) {
      data.hidden = false
    } else {
      data.hidden = true
    }
    if (menu.smsMenuList) {
      data.children = generateRoutes(menu.smsMenuList)
    }
    permissions.push(menu.value)
    res.push(data)
  })
  return res
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
