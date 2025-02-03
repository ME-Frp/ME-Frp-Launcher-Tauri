<template>
  <NConfigProvider :theme="theme" :theme-overrides="themeOverrides">
    <NDialogProvider>
      <NMessageProvider>
        <NNotificationProvider>
          <NLoadingBarProvider>
            <NLayout position="absolute">
              <NLayoutHeader bordered style="height: 64px; padding: 0">
                <TopMenu />
              </NLayoutHeader>
              <NLayout has-sider position="absolute" style="top: 64px">

                <template v-if="isLoggedIn">
                  <NLayoutSider v-if="!isMobile" bordered collapse-mode="width" :collapsed-width="64" :width="240"
                    :collapsed="collapsed" :native-scrollbar="false" show-trigger
                    @update:collapsed="collapsed = $event">
                    <LeftMenu />
                  </NLayoutSider>
                </template>
                <NLayout :native-scrollbar="false">
                  <NLayoutContent :style="contentStyle">
                    <RouterView v-slot="{ Component }">
                      <transition name="fade" mode="out-in" appear>
                        <component :is="Component" />
                      </transition>
                    </RouterView>
                  </NLayoutContent>
                </NLayout>
              </NLayout>
            </NLayout>
            <NGlobalStyle />
          </NLoadingBarProvider>
        </NNotificationProvider>
      </NMessageProvider>
    </NDialogProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import {
  NConfigProvider,
  NGlobalStyle,
  NMessageProvider,
  NDialogProvider,
  NNotificationProvider,
  NLoadingBarProvider,
  darkTheme,
  NLayout,
  NLayoutContent,
  NLayoutSider,
  NLayoutHeader,
} from 'naive-ui'

import { RouterView } from 'vue-router'
import { ref, computed, provide, onMounted, onUnmounted } from 'vue'
import TopMenu from './components/TopMenu.vue'
import LeftMenu from './components/LeftMenu.vue'

import { themeOverrides } from './constants/theme'

console.log(`    __  _________   ______         
   /  |/  / ____/  / ____/________ 
  / /|_/ / __/    / /_  / ___/ __ \\
 / /  / / /___   / __/ / /  / /_/ /
/_/  /_/_____/  /_/   /_/  / .___/ 
                          /_/      `);
console.log("Copyright 2025, The ME Frp Project Team.");
console.log("No redistribution allowed.");


// 主题状态
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
const isDarkMode = ref(prefersDark.matches)
const theme = computed(() => isDarkMode.value ? darkTheme : null)

// 监听系统主题变化
prefersDark.addEventListener('change', (e) => {
  isDarkMode.value = e.matches
})

// 主题切换函数
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
}

// 提供给全局使用
provide('theme', {
  isDarkMode,
  theme,
  toggleTheme
})
const collapsed = ref(false)
const isMobile = ref(window.innerWidth <= 700)
const isLoggedIn = computed(() => {
  return !!localStorage.getItem('token')
})
const contentStyle = computed(() => ({
  padding: isMobile.value ? '16px' : '24px'
}))

const handleResize = () => {
  isMobile.value = window.innerWidth <= 700
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
<style lang="scss">
@use "./assets/styles/dashboard.scss";
</style>
