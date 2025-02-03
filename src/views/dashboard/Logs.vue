<template>
  <div class="logs">
    <NCard title="程序日志" class="single-card">
      <template #header-extra>
        <NSpace>
          <NButton @click="clearLogs" type="warning" size="medium" secondary>
            <template #icon>
              <NIcon>
                <TrashOutline />
              </NIcon>
            </template>
            清空
          </NButton>
          <NButton @click="refreshLogs" size="medium" secondary>
            <template #icon>
              <NIcon>
                <RefreshOutline />
              </NIcon>
            </template>
            刷新
          </NButton>
        </NSpace>
      </template>

      <NSpace vertical :size="16">
        <div class="logs-content" ref="logsRef">
          <NScrollbar style="max-height: calc(100vh - 250px)">
            <div v-if="logs.length === 0" class="empty-logs">
              <NEmpty description="暂无日志记录" />
            </div>
            <div v-else>
              <div v-for="(log, index) in logs" :key="index" class="log-item">
                <span class="time">[{{ formatTime(log.time) }}]</span>
                <span class="message" v-html="parseAnsi(log.message)"></span>
              </div>
            </div>
          </NScrollbar>
        </div>
      </NSpace>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject, watch, Ref, onUnmounted } from 'vue'
import {
  NCard,
  NButton,
  NSpace,
  NScrollbar,
  useMessage,
  NEmpty,
  NIcon
} from 'naive-ui'
import { TrashOutline, RefreshOutline } from '@vicons/ionicons5'
import Convert from 'ansi-to-html'
import { listen } from '@tauri-apps/api/event'
// import { invoke } from '@tauri-apps/api/tauri'

interface LogItem {
  time: number
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'
  message: string
}

const message = useMessage()
const logs = ref<LogItem[]>([])
const logsRef = ref<HTMLElement | null>(null)
let convert = new Convert({
  fg: '#333',
  bg: '#fff',
  newline: true,
  escapeXML: true,
  stream: false,
  colors: {

  }
})

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  const pad = (n: number) => n.toString().padStart(2, '0')

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

const parseAnsi = (text: string) => {
  return convert.toHtml(text)
}

const refreshLogs = async () => {
  try {
    // TODO: 从后端获取日志
    // const newLogs = await invoke('get_logs')
    // logs.value = newLogs

    // 测试数据（包含ANSI颜色）
    logs.value = [
      {
        time: Date.now(),
        level: 'INFO', 
        message: '开始启动 ME Frp 隧道, 配置文件 [.\\frpc.toml]'
      },
      {
        time: Date.now() - 100,
        level: 'INFO',
        message: '尝试连接到节点...'
      },
      {
        time: Date.now() - 200,
        level: 'INFO',
        message: '\x1b[32m[1549a15025578255]\x1b[0m 登录节点成功, RunId: [\x1b[36m1549a15025578255\x1b[0m]'
      },
      {
        time: Date.now() - 300,
        level: 'INFO',
        message: '\x1b[32m[1549a15025578255]\x1b[0m 隧道 [\x1b[36m**************.111\x1b[0m] 登记成功'
      },
      {
        time: Date.now() - 400,
        level: 'INFO',
        message: '\x1b[32m[1549a15025578255]\x1b[0m 启动 [tcp] 隧道 [\x1b[36m**************.111\x1b[0m] 成功, 您可以使用 [\x1b[33m111.222.222.222:6000\x1b[0m] 访问您的服务'
      },
      {
        time: Date.now() - 500,
        level: 'INFO',
        message: '开始启动 ME Frp 隧道, 当前正在使用快捷启动'
      },
      {
        time: Date.now() - 600,
        level: 'INFO',
        message: '尝试连接到节点...'
      },
      {
        time: Date.now() - 700,
        level: 'INFO', 
        message: '\x1b[32m[**************-32d4c14d2c6c5340]\x1b[0m 登录节点成功, RunId: [\x1b[36m**************-32d4c14d2c6c5340\x1b[0m]'
      },
      {
        time: Date.now() - 800,
        level: 'INFO',
        message: '\x1b[32m[**************-32d4c14d2c6c5340]\x1b[0m 隧道 [\x1b[36m**************.mcslfuture\x1b[0m] 登记成功'
      },
      {
        time: Date.now() - 900,
        level: 'INFO',
        message: '\x1b[32m[**************-32d4c14d2c6c5340]\x1b[0m 启动 [tcp] 隧道 [\x1b[36m**************.mcslfuture\x1b[0m] 成功, 您可以使用 [\x1b[33m111.222.222.222:63649\x1b[0m] 访问您的服务'
      }
    ]
    scrollToBottom()
  } catch (err) {
    message.error('获取日志失败')
  }
}

const clearLogs = async () => {
  try {
    // TODO: 调用后端清空日志
    // await invoke('clear_logs')
    logs.value = []
  } catch (err) {
    message.error('清空日志失败')
  }
}

const scrollToBottom = () => {
  if (logsRef.value) {
    const scrollbar = logsRef.value.querySelector('.n-scrollbar-container')
    if (scrollbar) {
      scrollbar.scrollTop = scrollbar.scrollHeight
    }
  }
}

// 为深色模式添加配置更新
const updateAnsiConverter = (isDark: boolean) => {
  convert = new Convert({
    fg: isDark ? '#fff' : '#333',
    bg: isDark ? '#000' : '#fff',
    newline: true,
    escapeXML: true,
    stream: false
  })
}

// 注入主题相关函数
const { isDarkMode } = inject('theme') as {
  isDarkMode: Ref<boolean>
}
watch(isDarkMode, (newValue) => {
  updateAnsiConverter(newValue)
})

// 监听日志事件
onMounted(() => {
  refreshLogs()
  onUnmounted(async () => {
    const unlisten = await listen<LogItem>('frpc-log', (event) => {
      logs.value.push({
        time: event.payload.time,
        level: 'INFO',
        message: event.payload.message
      })
      scrollToBottom()
    })
    unlisten()
  })
})



// 启动 FrpC
// const startFrpc = async () => {
//   try {
//     // await invoke('start_frpc', { configPath: 'path/to/frpc.ini' })
//     message.success('FrpC 已启动')
//   } catch (err) {
//     message.error(err as string)
//   }
// }

// // 停止 FrpC
// const stopFrpc = async () => {
//   try {
//     // await invoke('stop_frpc')
//     message.success('FrpC 已停止')
//   } catch (err) {
//     message.error(err as string)
//   }
// }
</script>

<style lang="scss" scoped>
@use '../../assets/styles/dashboard/logs.scss';
</style>
