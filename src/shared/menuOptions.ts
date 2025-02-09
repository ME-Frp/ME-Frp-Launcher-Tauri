import { h, Component } from 'vue'
import { HomeOutline, AddCircleOutline, AppsOutline, SettingsOutline, CreateOutline, InformationCircleOutline, StatsChartOutline, PeopleOutline, CloudyOutline, ConstructOutline, TerminalOutline, BuildOutline } from '@vicons/ionicons5' 
import { NIcon, type MenuOption } from 'naive-ui'

const baseMenuOptions: MenuOption[] = [
  {
    label: '首页',
    icon: renderIcon(HomeOutline),
    key: 'home',
    link: '/',
  },
  {
    label: '创建隧道',
    icon: renderIcon(AddCircleOutline),
    key: 'create-proxy',
    link: '/create-proxy',
  },
  {
    label: '隧道管理',
    icon: renderIcon(AppsOutline),
    key: 'manage-proxies',
    link: '/manage-proxies',
  },
  {
    label: '程序日志',
    icon: renderIcon(TerminalOutline),
    key: 'logs',
    link: '/logs',
  },
  {
    label: '节点监控',
    icon: renderIcon(StatsChartOutline),
    key: 'node-status',
    link: '/node-status',
  },
  {
    label: '程序设置',
    icon: renderIcon(SettingsOutline),
    key: 'profile',
    link: '/profile',
  },
  {
    label: '关于程序',
    icon: renderIcon(InformationCircleOutline),
    key: 'about',
    link: '/about',
  }
]

const adminMenuOptions: MenuOption = {
  label: '管理选项',
  icon: renderIcon(ConstructOutline),
  key: 'admin',
  children: [
    {
      label: '用户管理',
      key: 'admin-users',
      link: '/admin/users',
      icon: renderIcon(PeopleOutline)
    },
    {
      label: '节点管理',
      key: 'admin-nodes',
      link: '/admin/nodes',
      icon: renderIcon(CloudyOutline)
    },
    {
      label: '隧道管理',
      key: 'admin-proxies',
      link: '/admin/proxies',
      icon: renderIcon(AppsOutline)
    },
    {
      label: '产品管理',
      key: 'admin-products',
      link: '/admin/products',
      icon: renderIcon(BuildOutline)
    },
    {
      label: '系统管理',
      key: 'admin-system',
      link: '/admin/system',
      icon: renderIcon(CreateOutline)
    }
  ]
}

export function getMenuOptions(): MenuOption[] {
  const userGroup = localStorage.getItem('group')
  const options = [...baseMenuOptions]

  if (userGroup === 'admin') {
    options.push(adminMenuOptions)
  }
  return options
}

export function renderIcon(icon: Component) {
  return () => h(NIcon, {
    component: icon,
    size: 22
  })
}