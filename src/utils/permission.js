import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export function checkPermission(value) {
  if (value && value.length > 0) {
    const permissions = store.getters && store.getters.permissions
    const hasPermission = permissions.some(permission => {
      return value === permission
    })

    if (!hasPermission) {
      return false
    }
    return true
  } else {
    console.error(`checkPermission的value参数异常`)
    return false
  }
}
