<template>
  <div class="proxies">
    <NCard title="隧道管理">
      <div class="toolbar">
        <div class="search-box">
          <NInput v-model:value="searchText" placeholder="搜索隧道..." clearable style="user-select: none">
            <template #prefix>
              <NIcon>
                <SearchOutline />
              </NIcon>
            </template>
          </NInput>
        </div>

        <div class="toolbar-right">
          <NButtonGroup>
            <NButton :type="viewMode === 'grid' ? 'primary' : 'default'" @click="viewMode = 'grid'">
              <template #icon>
                <NIcon>
                  <GridOutline />
                </NIcon>
              </template>
              <span class="view-text">网格</span><span class="view-suffix">视图</span>
            </NButton>
            <NButton :type="viewMode === 'list' ? 'primary' : 'default'" @click="viewMode = 'list'">
              <template #icon>
                <NIcon>
                  <ListOutline />
                </NIcon>
              </template>
              <span class="view-text">列表</span><span class="view-suffix">视图</span>
            </NButton>
          </NButtonGroup>

          <NButton secondary @click="handleRefresh">
            <template #icon>
              <NIcon>
                <RefreshOutline />
              </NIcon>
            </template>刷新
          </NButton>
        </div>
      </div>

      <!-- 网格视图 -->
      <div v-if="viewMode === 'grid'" class="proxy-grid">
        <template v-if="filteredProxies.length">
          <NCard v-for="proxy in filteredProxies" :key="proxy.proxyId" class="proxy-card">
            <div class="proxy-header">
              <h3 class="proxy-title">
                {{ proxy.proxyName }}
              </h3>
              <div class="status-tags">
                <NTag :type="proxy.isOnline ? 'success' : 'error'" size="small">
                  {{ proxy.isOnline ? '在线' : '离线' }}
                </NTag>
                <NTag v-if="proxy.isBanned" type="error" size="small" style="margin-left: 4px">
                  已封禁
                </NTag>
                <NTag v-if="proxy.isDisabled" type="warning" size="small" style="margin-left: 4px">
                  已禁用
                </NTag>
              </div>
            </div>
            <div class="proxy-info">
              <div class="info-item">
                <span class="label">ID:</span>
                <span class="value">
                  <NTag type="info" size="small"># {{ proxy.proxyId }}</NTag>
                </span>
              </div>
              <div class="info-item">
                <span class="label">协议:</span>
                <span class="value">{{ proxy.proxyType.toUpperCase() }}</span>
              </div>
              <div class="info-item">
                <span class="label">远程端口：</span>
                <span class="value">{{ proxy.remotePort }}</span>
              </div>
              <div class="info-item" style="display: flex; align-items: flex-start">
                <span class="label">节点：</span>
                <span class="value" style="flex: 1; word-break: break-all;">{{ getNodeLabel(proxy.nodeId) }}</span>
              </div>
            </div>
            <div class="proxy-actions">
              <NButton secondary type="primary" size="small">
                <template #icon>
                  <NIcon>
                    <PlayOutline />
                  </NIcon>
                </template>
                启动
              </NButton>
              <NDropdown :options="dropdownOptions(proxy)" @select="key => handleSelect(key, proxy)" trigger="click">
                <NButton tertiary size="small">
                  <template #icon>
                    <NIcon>
                      <EllipsisHorizontalCircleOutline />
                    </NIcon>
                  </template>
                </NButton>
              </NDropdown>
            </div>
          </NCard>
        </template>
        <NEmpty v-else description="暂无隧道" class="no-data">
          <template #extra>
            <NButton secondary @click="() => router.push('/create-proxy')">
              <template #icon>
                <NIcon><AddOutline /></NIcon>
              </template>
              创建
            </NButton>
          </template>
        </NEmpty>
      </div>

      <!-- 列表视图 -->
      <template v-else>
        <NDataTable v-if="filteredProxies.length" :columns="columns" :data="filteredProxies"
          :style="{
            '.n-data-table-td': {
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '200px'
            }
          }" />
        <NEmpty v-else description="暂无隧道" class="no-data">
          <template #extra>
            <NButton secondary @click="() => router.push('/create-proxy')">
              <template #icon>
                <NIcon><AddOutline /></NIcon>
              </template>
              创建
            </NButton>
          </template>
        </NEmpty>
      </template>
    </NCard>

    <!-- 远程地址信息弹窗 -->
    <NModal v-model:show="showModal" preset="dialog" title="隧道详细信息">
      <template #header>
        <div>隧道详细信息</div>
      </template>
      <div v-if="selectedProxy" style="padding: 16px 0">
        <div class="modal-info-item">
          <span class="label">隧道名称：</span>
          <span class="value">{{ selectedProxy.proxyName }}</span>
        </div>
        <div class="modal-info-item">
          <span class="label">协议类型：</span>
          <span class="value">{{ selectedProxy.proxyType.toUpperCase() }}</span>
        </div>
        <div class="modal-info-item">
          <span class="label">本地端口：</span>
          <span class="value">{{ selectedProxy.localPort }}</span>
        </div>
        <div class="modal-info-item">
          <span class="label">本地地址：</span>
          <span class="value">{{ selectedProxy.localIp }}</span>
        </div>
        <div class="modal-info-item">
          <span class="label">节点名称：</span>
          <span class="value">{{ getNodeLabel(selectedProxy.nodeId).split(' - ')[1] }}</span>
        </div>
        <div class="modal-info-item">
          <span class="label">节点主机名：</span>
          <span class="value">{{ nodeOptions.find(node => node.value === selectedProxy?.nodeId)?.hostname || '-' }}</span>
        </div>
        <div class="modal-info-item">
          <span class="label">远程端口：</span>
          <span class="value">{{ selectedProxy.remotePort }}</span>
        </div>
        <div class="modal-info-item">
          <span class="label">上次启动时间：</span>
          <span class="value">{{ selectedProxy.lastStartTime || '从未启动' }}</span>
        </div>
        <div class="modal-info-item">
          <span class="label">上次关闭时间：</span>
          <span class="value">{{ selectedProxy.lastCloseTime || '从未关闭' }}</span>
        </div>
        <div class="modal-info-item">
          <span class="label">状态：</span>
          <NTag :type="selectedProxy.isOnline ? 'success' : 'error'" size="small">
            {{ selectedProxy.isOnline ? '在线' : '离线' }}
          </NTag>
          <NTag v-if="selectedProxy.isBanned" type="error" size="small" style="margin-left: 8px">
            已封禁
          </NTag>
        </div>
      </div>
    </NModal>

    <!-- 禁用/启用确认弹窗 -->
    <NModal v-model:show="showToggleModal" preset="dialog" 
      :title="proxyToOperate?.isDisabled ? '启用隧道' : '禁用隧道'" 
      style="width: 400px;"
      :show-icon="false">
      <div>确定要{{ proxyToOperate?.isDisabled ? '启用' : '禁用' }}隧道 "{{ proxyToOperate?.proxyName }}" 吗？</div>
      <template #action>
        <NButton secondary size="small" @click="showToggleModal = false">取消</NButton>
        <NButton secondary size="small" :type="proxyToOperate?.isDisabled ? 'success' : 'warning'" :loading="loading" @click="handleToggleConfirm">确定</NButton>
      </template>
    </NModal>

    <!-- 强制下线确认弹窗 -->
    <NModal v-model:show="showKickModal" preset="dialog" 
      title="强制下线隧道" 
      style="width: 400px;"
      :show-icon="false">
      <div>确定要强制下线隧道 "{{ proxyToOperate?.proxyName }}" 吗？</div>
      <template #action>
        <NButton secondary size="small" @click="showKickModal = false">取消</NButton>
        <NButton secondary size="small" type="warning" :loading="loading" @click="handleKickConfirm">确定</NButton>
      </template>
    </NModal>

    <!-- 删除确认弹窗 -->
    <NModal v-model:show="showDeleteModal" preset="dialog" 
      title="删除隧道" 
      style="width: 400px;"
      :show-icon="false">
      <div>确定要删除隧道 "{{ proxyToOperate?.proxyName }}" 吗？此操作不可恢复！</div>
      <template #action>
        <NButton secondary size="small" @click="showDeleteModal = false">取消</NButton>
        <NButton secondary size="small" type="error" :loading="loading" @click="handleDeleteClick">确定</NButton>
      </template>
    </NModal>

    <!-- 编辑隧道弹窗 -->
    <NModal v-model:show="showEditModal" preset="dialog" title="编辑隧道">
      <NForm ref="editFormRef" :model="editForm" :rules="rules" label-placement="left" label-width="120"
        require-mark-placement="right-hanging" size="medium" style="padding-top: 12px;">
        <NFormItem label="隧道名称" path="proxyName">
          <NInput v-model:value="editForm.proxyName" placeholder="请输入隧道名称" />
        </NFormItem>
        <NFormItem label="本地地址" path="localIp">
          <NInput v-model:value="editForm.localIp" placeholder="请输入本地地址" />
        </NFormItem>
        <NFormItem label="本地端口" path="localPort">
          <NInputNumber v-model:value="editForm.localPort" :min="1" :max="65535" placeholder="请输入本地端口" />
        </NFormItem>
        <NFormItem label="远程端口" path="remotePort">
            <NInputNumber v-model:value="editForm.remotePort" :min="1" :max="65535" placeholder="请输入远程端口" />
            <NButton size="medium" :loading="gettingFreePort" @click="handleGetFreePortForEdit">
              获取空闲端口
            </NButton>
        </NFormItem>
        <NFormItem v-if="editForm.proxyType === 'http' || editForm.proxyType === 'https'" label="绑定域名" path="domain">
          <NInput v-model:value="editForm.domain" placeholder="请输入绑定域名" />
        </NFormItem>

        <NDivider>高级配置</NDivider>
        <NText depth="3" style="padding-bottom: 15px; display: block;">
          提示：仅推荐技术用户使用, 一般用户请勿随意填写。请确保您的配置正确, 否则隧道可能无法启动。
        </NText>

        <NFormItem label="访问密钥" path="accessKey">
          <NInput v-model:value="editForm.accessKey" placeholder="请输入访问密钥" />
        </NFormItem>
        <NFormItem label="Host Header Rewrite" path="hostHeaderRewrite">
          <NInput v-model:value="editForm.hostHeaderRewrite" placeholder="请输入 Host 请求头重写值" />
        </NFormItem>
        <NFormItem label="X-From-Where" path="headerXFromWhere">
          <NInput v-model:value="editForm.headerXFromWhere" placeholder="请输入 X-From-Where 请求头值" />
        </NFormItem>
        <NFormItem label="Proxy Protocol" path="proxyProtocolVersion">
          <NSelect v-model:value="editForm.proxyProtocolVersion" :options="[
            { label: '不启用', value: '' },
            { label: 'v1', value: 'v1' },
            { label: 'v2', value: 'v2' }
          ]" placeholder="Proxy Protocol Version" />
        </NFormItem>
        <NFormItem label="其他选项">
          <div style="display: flex; gap: 16px;">
            <NSwitch v-model:value="editForm.useEncryption" :rail-style="switchButtonRailStyle">
              <template #checked>启用加密</template>
              <template #unchecked>禁用加密</template>
            </NSwitch>
            <NSwitch v-model:value="editForm.useCompression" :rail-style="switchButtonRailStyle">
              <template #checked>启用压缩</template>
              <template #unchecked>禁用压缩</template>
            </NSwitch>
          </div>
        </NFormItem>
      </NForm>
      <template #action>
        <NButton size="small" @click="showEditModal = false">取消</NButton>
        <NButton size="small" type="primary" :loading="loading" @click="handleEditSubmit">确定</NButton>
      </template>
    </NModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { NCard, NButton, NButtonGroup, NTag, NIcon, NModal, NInput, NDropdown, NForm, NFormItem, NSelect, NInputNumber, useMessage, type FormInst, NDivider, NSwitch, NText, NEmpty, NDataTable, NSpace, type DropdownOption } from 'naive-ui'
import { GridOutline, ListOutline, RefreshOutline, SearchOutline, InformationCircleOutline, CreateOutline, TrashOutline, PowerOutline, AddOutline, EllipsisHorizontalCircleOutline, PlayOutline } from '@vicons/ionicons5'
import { AuthApi } from '../../shared/api/auth'
import type { Proxy, UserNodeName } from '../../types'
import { switchButtonRailStyle } from '../../constants/theme'
import { useRouter } from 'vue-router'

const message = useMessage()
const loading = ref(false)
const proxies = ref<Proxy[]>([])
const viewMode = ref<'grid' | 'list'>('grid')
const searchText = ref('')
const nodeOptions = ref<{ label: string; value: number; hostname: string }[]>([])
const showModal = ref(false)
const selectedProxy = ref<Proxy | null>(null)
const showEditModal = ref(false)
const editFormRef = ref<FormInst | null>(null)
const editForm = ref({
  proxyId: 0,
  proxyName: '',
  localIp: '',
  localPort: 0,
  remotePort: 0,
  domain: '',
  location: '',
  accessKey: '',
  hostHeaderRewrite: '',
  headerXFromWhere: '',
  useEncryption: false,
  useCompression: false,
  proxyProtocolVersion: '',
  proxyType: '',
  nodeId: 0
})
const router = useRouter()
const gettingFreePort = ref(false)

const rules = {
  proxyName: {
    required: true,
    message: '请输入隧道名称',
    trigger: 'blur',
    type: 'string'
  },
  localIp: {
    required: true,
    message: '请输入本地地址',
    trigger: 'blur',
    type: 'string'
  },
  localPort: {
    required: true,
    message: '请输入本地端口',
    trigger: 'blur',
    type: 'number',
    validator: (_rule: any, value: number) => {
      if (value < 1 || value > 65535) {
        return new Error('端口范围必须在 1-65535 之间')
      }
      return true
    }
  },
  remotePort: {
    required: true,
    message: '请输入远程端口',
    trigger: 'blur',
    type: 'number',
    validator: (_rule: any, value: number) => {
      if (editForm.value.proxyType === 'http' || editForm.value.proxyType === 'https') {
        return true
      }
      if (value < 1 || value > 65535) {
        return new Error('端口范围必须在 1-65535 之间')
      }
      return true
    }
  },
  domain: {
    type: 'string',
    trigger: 'blur',
    validator: (_rule: any, value: string) => {
      if (editForm.value.proxyType === 'http' || editForm.value.proxyType === 'https') {
        if (!value) {
          return new Error('请输入绑定域名')
        }
      }
      return true
    }
  }
} as const

// 过滤隧道列表
const filteredProxies = computed(() => {
  const search = searchText.value.toLowerCase()
  return proxies.value.filter(proxy =>
    proxy.proxyName.toLowerCase().includes(search) ||
    proxy.proxyType.toLowerCase().includes(search) ||
    (proxy.domain || '').toLowerCase().includes(search) ||
    getNodeLabel(proxy.nodeId).toLowerCase().includes(search)
  )
})

const handleRefresh = async () => {
  loading.value = true
  try {
    const res = await AuthApi.getUserProxies()
    if (res.data.code === 200) {
      proxies.value = res.data.data
    } else {
      message.error(res.data.message || '获取隧道列表失败')
    }
  } catch (error: any) {
    message.error(error?.response?.data?.message || '获取隧道列表失败')
  } finally {
    loading.value = false
  }
}

const getNodeLabel = (nodeId: number) => {
  const node = nodeOptions.value.find(node => node.value === nodeId)
  return node ? `#${nodeId} - ${node.label}` : `#${nodeId}`
}

// 获取节点列表
const fetchNodes = async () => {
  try {
    const res = await AuthApi.getNodeNames()
    if (res.data.code === 200) {
      nodeOptions.value = res.data.data.map((node: UserNodeName) => ({
        label: node.name,
        value: node.nodeId,
        hostname: node.hostname
      }))
    }
  } catch (error: any) {
    message.error('获取节点列表失败')
  }
}

// 初始化数据
fetchNodes()
handleRefresh()

function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const showToggleModal = ref(false)
const showKickModal = ref(false)
const proxyToOperate = ref<Proxy | null>(null)

const toggleModalTitle = computed(() => {
  if (!proxyToOperate.value) return ''
  return proxyToOperate.value.isDisabled ? '启用隧道' : '禁用隧道'
})

const toggleModalContent = computed(() => {
  if (!proxyToOperate.value) return ''
  return proxyToOperate.value.isDisabled ? '确认要启用此隧道吗？' : '确认要禁用此隧道吗？'
})

const dropdownOptions = (proxy: Proxy): DropdownOption[] => [
  {
    label: '查看详情',
    key: 'view',
    type: 'info',
    icon: () => h(NIcon, null, { default: () => h(InformationCircleOutline) })
  },
  {
    type: 'divider',
    key: 'd1'
  },
  {
    label: '编辑',
    key: 'edit',
    type: 'primary',
    icon: () => h(NIcon, null, { default: () => h(CreateOutline) })
  },
  {
    label: '强制下线',
    key: 'kickProxy',
    type: 'warning',
    disabled: !proxy.isOnline,
    icon: () => h(NIcon, null, { default: () => h(PowerOutline) })
  },
  {
    type: 'divider',
    key: 'd2'
  },
  {
    label: proxy.isDisabled ? '启用' : '禁用',
    key: 'toggle',
    type: proxy.isDisabled ? 'success' : 'warning',
    icon: () => h(NIcon, null, { default: () => h(PowerOutline) })
  },
  {
    label: '删除',
    key: 'delete',
    type: 'error',
    icon: () => h(NIcon, null, { default: () => h(TrashOutline) })
  }
]

const handleSelect = (key: string | number, proxy: Proxy) => {
  proxyToOperate.value = proxy
  switch (key) {
    case 'view':
      selectedProxy.value = proxy
      showModal.value = true
      break
    case 'edit':
      handleEdit(proxy)
      break
    case 'kickProxy':
      showKickModal.value = true
      break
    case 'toggle':
      showToggleModal.value = true
      break
    case 'delete':
      showDeleteModal.value = true
      break
  }
}

const handleToggleConfirm = async () => {
  if (!proxyToOperate.value) return
  try {
    loading.value = true
    await AuthApi.toggleProxy(proxyToOperate.value.proxyId, !proxyToOperate.value.isDisabled)
    message.success(proxyToOperate.value.isDisabled ? '启用隧道成功' : '禁用隧道成功')
    handleRefresh()
  } catch (error: any) {
    message.error(error?.response?.data?.message || '操作失败')
  } finally {
    loading.value = false
    showToggleModal.value = false
  }
}

const handleKickClick = (proxy: Proxy) => {
  proxyToOperate.value = proxy
  showKickModal.value = true
}

const handleKickConfirm = async () => {
  if (!proxyToOperate.value) return
  try {
    loading.value = true
    await AuthApi.kickProxy(proxyToOperate.value.proxyId)
    message.success('强制下线成功')
    handleRefresh()
  } catch (error: any) {
    message.error(error?.response?.data?.message || '强制下线失败')
  } finally {
    loading.value = false
    showKickModal.value = false
  }
}

const handleEdit = (proxy: Proxy) => {
  editForm.value = {
    proxyId: proxy.proxyId,
    proxyName: proxy.proxyName,
    localIp: proxy.localIp,
    localPort: proxy.localPort,
    remotePort: proxy.remotePort,
    domain: proxy.domain || '',
    location: proxy.location || '',
    accessKey: proxy.accessKey || '',
    hostHeaderRewrite: proxy.hostHeaderRewrite || '',
    headerXFromWhere: proxy.headerXFromWhere || '',
    useEncryption: proxy.useEncryption || false,
    useCompression: proxy.useCompression || false,
    proxyProtocolVersion: proxy.proxyProtocolVersion || '',
    proxyType: proxy.proxyType,
    nodeId: proxy.nodeId
  }
  showEditModal.value = true
}

const handleEditSubmit = () => {
  editFormRef.value?.validate(async (errors) => {
    if (!errors) {
      loading.value = true
      try {
        await AuthApi.updateProxy(editForm.value)
        message.success('更新隧道成功')
        showEditModal.value = false
        handleRefresh()
      } catch (error: any) {
        message.error(error?.response?.data?.message || '更新隧道失败')
      } finally {
        loading.value = false
      }
    }
  })
}

const showDeleteModal = ref(false)

const handleDeleteClick = async () => {
  if (!proxyToOperate.value) return
  try {
    loading.value = true
    await AuthApi.deleteProxy(proxyToOperate.value.proxyId)
    message.success('删除隧道成功')
    showDeleteModal.value = false
    handleRefresh()
  } catch (error: any) {
    message.error(error?.response?.data?.message || '删除隧道失败')
  } finally {
    loading.value = false
  }
}

const handleGetFreePortForEdit = async () => {
  try {
    gettingFreePort.value = true
    const protocol = editForm.value.proxyType === 'udp' ? 'udp' : 'tcp'
    const res = await AuthApi.getFreeNodePort({ 
      nodeId: editForm.value.nodeId,
      protocol
    })
    if (res.data.code === 200) {
      editForm.value.remotePort = res.data.data
    } else {
      message.error(res.data.message || '获取空闲端口失败')
    }
  } catch (error: any) {
    message.error(error?.response?.data?.message || '获取空闲端口失败')
  } finally {
    gettingFreePort.value = false
  }
}

const columns = [
  {
    title: 'ID',
    key: 'proxyId',
    render(row) {
      return h(NTag, { type: 'info', size: 'medium' }, { default: () => `# ${row.proxyId}` })
    }
  },
  {
    title: '名称',
    key: 'proxyName',
    render(row) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.proxyName)
    }
  },
  {
    title: '类型',
    key: 'proxyType',
    render(row) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.proxyType.toUpperCase())
    }
  },
  {
    title: '远程端口',
    key: 'remotePort',
    render(row) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.remotePort)
    }
  },
  {
    title: '节点',
    key: 'nodeId',
    render(row) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, getNodeLabel(row.nodeId))
    }
  },
  {
    title: '状态',
    key: 'status',
    render(row) {
      return h(NSpace, { size: 4 }, {
        default: () => [
          h(NTag, {
            type: row.isOnline ? 'success' : 'error',
            size: 'small'
          }, { default: () => row.isOnline ? '在线' : '离线' }),
          row.isBanned && h(NTag, {
            type: 'error',
            size: 'small'
          }, { default: () => '已封禁' }),
          row.isDisabled && h(NTag, {
            type: 'warning',
            size: 'small'
          }, { default: () => '已禁用' })
        ].filter(Boolean)
      })
    }
  },
  {
    title: '操作',
    key: 'actions',
    render(row) {
      return h(NDropdown, {
        trigger: 'click',
        options: dropdownOptions(row),
        onSelect: (key: string) => handleSelect(key, row),
        placement: 'bottom'
      }, {
        default: () => h(NButton, {
          text: true,
          style: 'display: flex; align-items: center;'
        }, {
          icon: () => h(NIcon, null, {
            default: () => h(EllipsisHorizontalCircleOutline)
          })
        })
      })
    }
  }
]
</script>

<style lang="scss" scoped>
@use '../../assets/styles/dashboard/manageProxies.scss';
</style>