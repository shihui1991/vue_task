import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '工作台', icon: 'dashboard' }
      }
    ]
  },

  {
    path: '/task/modify',
    component: Layout,
    children: [
      {
        path: '',
        name: 'MineTaskModify',
        component: () => import('@/views/task/modify'),
        meta: { title: '填报每日任务', icon: 'form' }
      }
    ]
  },
  {
    path: '/mine/task',
    component: Layout,
    children: [
      {
        path: '',
        name: 'MineTask',
        component: () => import('@/views/task/mine'),
        meta: { title: '我的日报', icon: 'clipboard' }
      },
      {
        path: 'detail',
        name: 'MineTaskDetail',
        component: () => import('@/views/task/detail'),
        meta: { title: '日报详情', icon: 'skill' },
        hidden: true
      }
    ]
  },
  {
    path: '/mine/reply',
    component: Layout,
    children: [
      {
        path: '',
        name: 'MineTaskReply',
        component: () => import('@/views/mine/reply'),
        meta: { title: '我的消息', icon: 'message' }
      }
    ]
  },
  {
    path: '/task',
    component: Layout,
    children: [
      {
        path: '',
        name: 'TaskManager',
        component: () => import('@/views/task/index'),
        meta: { title: '日报管理', icon: 'education' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/partment',
    name: 'System',
    meta: { title: '系统管理', icon: 'international' },
    children: [
      {
        path: 'partment',
        name: 'Partment',
        component: () => import('@/views/partment/index'),
        meta: { title: '部门管理', icon: 'tree-table' }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/role/index'),
        meta: { title: '角色管理', icon: 'peoples' }
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/user/index'),
        meta: { title: '职员管理', icon: 'user' }
      },
      {
        path: 'jobRate',
        name: 'JobRate',
        component: () => import('@/views/jobRate/index'),
        meta: { title: '难度系数', icon: 'star' }
      },
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('@/views/menu/index'),
        meta: { title: '菜单管理', icon: 'nested' }
      },
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
