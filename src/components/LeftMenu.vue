<template>
  <NMenu style="user-select: none" :collapsed-width="64" :collapsed-icon-size="24" :options="[...menuOptions, {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon(ExitOutline)
  }]" :value="currentKey" :icon-size="22" @update:value="(key, item) => {
    if (key === 'logout') {
      handleLogout()
    } else {
      handleMenuSelect(key, item)
    }
  }" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ExitOutline } from '@vicons/ionicons5'
import { NMenu, type MenuOption, useDialog, useMessage } from 'naive-ui'
import { useRouter, useRoute } from 'vue-router'
import { getMenuOptions, renderIcon } from '../shared/menuOptions'

const emit = defineEmits(['select'])
const route = useRoute()
const router = useRouter()
const dialog = useDialog()
const message = useMessage()
const menuOptions = ref(getMenuOptions())

const handleMenuSelect = (_: any, item: MenuOption) => {
  router.push(item.link as string)
  emit('select')
}

const handleLogout = async () => {
  await dialog.warning({
    title: '提示',
    content: '确定要退出登录吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('group')
      message.success('已退出登录')
      await router.push('/login')
      window.location.reload()
    }
  })
}

const currentKey = computed(() => {
  return (route.path.startsWith('/') ? route.path.slice(1) : route.path).replace('/', '-')
})
</script>
