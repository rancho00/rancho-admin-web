
export function handleTree(menus) {
  const elTreeMenus = []
  menus.forEach(menu => {
    const elTreeMenu = {}
    elTreeMenu.id = menu.id
    elTreeMenu.label = menu.name
    if (menu.children) {
      elTreeMenu.children = handleTree(menu.children)
    }
    elTreeMenus.push(elTreeMenu)
  })
  return elTreeMenus
}
