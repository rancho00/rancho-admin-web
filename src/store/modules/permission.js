import { constantRoutes, asyncRoutes } from '@/router'
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
  // menus.forEach(menu => {
  //   const data = {
  //     path: menu.uri,
  //     name: menu.name,
  //     meta: { title: menu.name, icon: menu.icon }
  //   }
  //   if (menu.type === 0) {
  //     data.component = Layout
  //   } else if (menu.type === 1) {
  //     data.component = () => import(`@/views/${menu.component}`)
  //   }
  //   if (menu.isHidden === 0) {
  //     data.hidden = false
  //   } else {
  //     data.hidden = true
  //   }
  //   if (menu.children) {
  //     data.children = generateRoutes(menu.children)
  //   }
  //   permissions.push(menu.value)
  //   res.push(data)
  // })
  menus.forEach(firstMenu => {
    let route = asyncRoutes.find(r => r.path === firstMenu.uri)
    if (!route) {
      route = {
        path: firstMenu.uri,
        name: firstMenu.name,
        meta: { title: firstMenu.name, icon: firstMenu.icon },
        component: Layout,
        hidden: false,
        children: []
      }
    }

    permissions.push(firstMenu.value)
    const children = []
    if (firstMenu.children) {
      firstMenu.children.forEach(secondMenu => {
        children.push({
          path: secondMenu.uri,
          name: secondMenu.name,
          meta: { title: secondMenu.name, icon: secondMenu.icon },
          component: () => import(`@/views/${secondMenu.component}`),
          hidden: false
        })
        permissions.push(secondMenu.value)
        if (secondMenu.children) {
          secondMenu.children.forEach(functionMenu => {
            children.push({
              path: functionMenu.uri,
              name: functionMenu.name,
              meta: { title: functionMenu.name, icon: functionMenu.icon },
              component: () => import(`@/views/${functionMenu.component}`),
              hidden: functionMenu.isHidden === 1
            })
            permissions.push(functionMenu.value)
          })
        }
      })
    }
    route.children = route.children.concat(children)
    res.push(route)
  })
  return res
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
