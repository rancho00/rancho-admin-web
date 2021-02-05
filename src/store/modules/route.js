import { constantRoutes } from '@/router'
import Layout from '@/layout'
import { getRoutes } from '@/api/admin'

const state = {
  routes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {

  getRoutes({ commit, state }) {
    return new Promise((resolve, reject) => {
      getRoutes().then(response => {
        const routes = response.data
        const accessedRoutes = generateRoutes(routes)
        commit('SET_ROUTES', accessedRoutes)
        resolve(routes)
      }).catch(error => {
        reject(error)
      })
    })
  },

  generateRoutes({ commit }, menus) {
    return new Promise(resolve => {
      const accessedRoutes = generateRoutes(menus)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export function generateRoutes(routes) {
  // const res = []
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
  // menus.forEach(firstMenu => {
  //   let route = asyncRoutes.find(r => r.path === firstMenu.uri)
  //   if (!route) {
  //     route = {
  //       path: firstMenu.uri,
  //       name: firstMenu.name,
  //       meta: { title: firstMenu.name, icon: firstMenu.icon },
  //       component: Layout,
  //       hidden: false,
  //       children: []
  //     }
  //   }
  //
  //   permissions.push(firstMenu.value)
  //   const children = []
  //   if (firstMenu.children) {
  //     firstMenu.children.forEach(secondMenu => {
  //       children.push({
  //         path: secondMenu.uri,
  //         name: secondMenu.name,
  //         meta: { title: secondMenu.name, icon: secondMenu.icon },
  //         component: () => import(`@/views/${secondMenu.component}`),
  //         hidden: false
  //       })
  //       permissions.push(secondMenu.value)
  //       if (secondMenu.children) {
  //         secondMenu.children.forEach(functionMenu => {
  //           children.push({
  //             path: functionMenu.uri,
  //             name: functionMenu.name,
  //             meta: { title: functionMenu.name, icon: functionMenu.icon },
  //             component: () => import(`@/views/${functionMenu.component}`),
  //             hidden: functionMenu.isHidden === 1
  //           })
  //           permissions.push(functionMenu.value)
  //         })
  //       }
  //     })
  //   }
  //   route.children = route.children.concat(children)
  //   res.push(route)
  // })
  routes.forEach(route => {
    route.component = Layout
    route.alwaysShow = true
    if (route.children !== undefined) {
      route.children.forEach(nextRoute => {
        nextRoute.component = loadView(nextRoute.component)
      })
    }
  })
  return routes
}

export const loadView = (view) => {
  return (resolve) => require([`@/views/${view}`], resolve)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
