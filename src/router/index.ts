import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/Login.vue'),
      meta: {
        title: '登录',
        requiresGuest: true
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/Register.vue'),
      meta: {
        title: '注册',
        requiresGuest: true
      }
    },
    {
      path: '/iforgot',
      name: 'iforgot',
      component: () => import('../views/auth/iForgot.vue'),
      meta: {
        title: '找回密码',
        requiresGuest: true
      }
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/dashboard/Home.vue'),
      meta: { title: '控制台' }
    },
    {
      path: '/create-proxy',
      name: 'create-proxy',
      component: () => import('../views/dashboard/CreateProxy.vue'),
      meta: { title: '创建隧道' }
    },
    {
      path: '/manage-proxies',
      name: 'manage-proxies',
      component: () => import('../views/dashboard/ManageProxies.vue'),
      meta: { title: '隧道管理' }
    },
    {
      path: '/logs',
      name: 'logs',
      component: () => import('../views/dashboard/Logs.vue'),
      meta: { title: '程序日志' }
    },
    {
      path: '/node-status',
      name: 'node-status',
      component: () => import('../views/dashboard/NodeStatus.vue'),
      meta: { title: '节点监控' }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/dashboard/Profile.vue'),
      meta: { title: '个人中心' }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/dashboard/About.vue'),
      meta: { title: '关于程序' }
    },
    {
      path: '/admin',
      name: 'admin',
      redirect: '/admin/users',
      children: [
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('../views/dashboard/admin/Users.vue'),
          meta: {
            title: '用户管理',
            requiresAdmin: true
          }
        },
        {
          path: 'nodes',
          name: 'admin-nodes',
          component: () => import('../views/dashboard/admin/Nodes.vue'),
          meta: {
            title: '节点管理',
            requiresAdmin: true
          }
        },
        {
          path: 'proxies',
          name: 'admin-proxies',
          component: () => import('../views/dashboard/admin/Proxies.vue'),
          meta: {
            title: '隧道管理',
            requiresAdmin: true
          }
        },
        {
          path: 'products',
          name: 'admin-products',
          component: () => import('../views/dashboard/admin/Products.vue'),
          meta: {
            title: '产品管理',
            requiresAdmin: true
          }
        },
        {
          path: 'system',
          name: 'admin-system',
          component: () => import('../views/dashboard/admin/System.vue'),
          meta: {
            title: '系统管理',
            requiresAdmin: true
          }
        }]
    },
  ]
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  const isAdmin = localStorage.getItem('group') === 'admin'

  if (to.meta.requiresAuth && !token) {
    next('/login')
    return
  }

  if (to.meta.requiresAdmin && !isAdmin) {
    next('/home')
    return
  }

  if (to.meta.requiresGuest && token) {
    next('/home')
    return
  }

  if (to.path === '/') {
  } else if (to.path === '/login') {
    document.title = '登录到 ME Frp 5.0'
  } else if (to.path === '/register') {
    document.title = '注册 ME Frp 账户'
  } else if (to.path === '/iforgot') {
    document.title = '找回 ME Frp 账户'
  } else {
    document.title = `${to.meta.title} | ME Frp 5.0 管理面板`
  }

  next()
})

export default router

export { default as routes } from './index'
