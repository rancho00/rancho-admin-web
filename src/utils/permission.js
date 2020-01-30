import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value && value.length > 0) {
    const psermissions = store.getters && store.getters.psermissions
    const hasPermission = psermissions.some(psermission => {
      return value === psermission
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
