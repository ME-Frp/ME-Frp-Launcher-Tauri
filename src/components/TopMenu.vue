<template>
    <NLayoutHeader bordered position="absolute" style="height: 64px; z-index: 999;" data-tauri-drag-region>
      <div class="header-content" data-tauri-drag-region>
        <div class="left" data-tauri-drag-region>
          <!-- 仅在登录后显示菜单按钮 -->
          <template v-if="isLoggedIn">
            <NPopover trigger="click" placement="bottom-start" :show="showMenu" @update:show="showMenu = $event" data-tauri-drag-region>
              <template #trigger>
                <NButton text class="menu-trigger">
                  <NIcon size="24">
                    <MenuOutline />
                  </NIcon>
                </NButton>
              </template>
              <div class="mobile-menu" data-tauri-drag-region>
                <NMenu :options="[...menuOptions, {
                  label: '退出登录',
                  key: 'logout',
                  icon: renderIcon(ExitOutline)
                }]" :value="currentKey" :icon-size="22" style="user-select: none" @update:value="(key, item) => {
                if (key === 'logout') {
                  handleLogout()
                } else {
                  handleMenuSelect(key, item)
                }
              }" />
              </div>
            </NPopover>
          </template>
          <h2 class="logo" data-tauri-drag-region style="user-select: none">ME Frp</h2>
        </div>
        <div class="right" data-tauri-drag-region>
          <NButton text @click="handleMinimize" >
            <template #icon>
              <NIcon :size="28">
                <RemoveOutline />
              </NIcon>
            </template>
          </NButton>
          <NButton text @click="handleMaximize">
            <template #icon>
              <NIcon :size="20">
                <ScanOutline />
              </NIcon>
            </template>
          </NButton>
          <NButton text @click="handleClose">
            <template #icon>
              <NIcon :size="28">
                <CloseOutline />
              </NIcon>
            </template>
          </NButton>
        </div>
      </div>
    </NLayoutHeader>

    <!-- 仅在登录后显示移动端菜单抽屉 -->
    <NDrawer v-if="isLoggedIn" v-model:show="showMobileMenu" :width="280" placement="left" data-tauri-drag-region>
      <NDrawerContent title="菜单">
        <LeftMenu @select="showMobileMenu = false" />
      </NDrawerContent>
    </NDrawer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NLayoutHeader, NIcon, NButton, useDialog, useMessage, NPopover, NMenu, MenuOption, NDrawer, NDrawerContent } from 'naive-ui'
import { MenuOutline, CloseOutline, RemoveOutline, ScanOutline, ExitOutline } from '@vicons/ionicons5'
import { getMenuOptions, renderIcon } from '../shared/menuOptions'
import LeftMenu from './LeftMenu.vue'
import { exit } from '@tauri-apps/plugin-process'
import { getCurrentWindow, PhysicalSize } from '@tauri-apps/api/window'

const router = useRouter()
const route = useRoute()
const showMenu = ref(false)
const menuOptions = ref(getMenuOptions())
const dialog = useDialog()
const message = useMessage()
const showMobileMenu = ref(false)
const isMobile = ref(window.innerWidth <= 768)
const unMaximizedSize = ref(new PhysicalSize(0, 0))

// 判断是否已登录
const isLoggedIn = computed(() => {
  return !!localStorage.getItem('token')
})

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

const handleMinimize = async () => {
  await getCurrentWindow().minimize()
}

const handleMaximize = async () => {
  const isMaximized = await getCurrentWindow().isMaximized()
  if (isMaximized) {
    await getCurrentWindow().unmaximize()
    await getCurrentWindow().setSize(unMaximizedSize.value)
  } else {
    await getCurrentWindow().maximize()
  }
}

const handleClose = () => {
  dialog.warning({
    style: 'user-select: none',
    title: '提示',
    content: '确定要退出程序吗？',
    positiveText: '最小化到托盘',
    negativeText: '退出',
    onNegativeClick: async () => {
      await exit()
    },
    onPositiveClick: async () => {
      await getCurrentWindow().hide()
    }
  })
}

const handleMenuSelect = (_: any, item: MenuOption) => {
  router.push(item.link as string)
  showMenu.value = false
}

const currentKey = computed(() => {
  return (route.path.startsWith('/') ? route.path.slice(1) : route.path).replace('/', '-')
})

const handleResize = async () => {
  isMobile.value = window.innerWidth <= 768
  if (!getCurrentWindow().isMaximized()) {
    unMaximizedSize.value = await getCurrentWindow().outerSize()
  }
}

onMounted(async () => {
  window.addEventListener('resize', handleResize)
  unMaximizedSize.value = await getCurrentWindow().outerSize()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>