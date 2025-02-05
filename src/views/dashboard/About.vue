<template>
  <div class="about">
    <NCard title="关于 ME Frp Launcher" class="single-card">
      <NSpace vertical :size="24">
        <NDescriptions label-placement="left" bordered :column="1">
          <NDescriptionsItem label="版本">
            v1.0.0
          </NDescriptionsItem>
          <NDescriptionsItem label="开发者">
            <div class="user-info">
              <NAvatar round size="small" src="https://www.lxhtt.cn/img/avatar.webp" />
              <span>落雪无痕LxHTT</span>
            </div>
          </NDescriptionsItem>
          <NDescriptionsItem label="技术栈">
            <NSpace>
              <NTag type="success" style="cursor: pointer" @click="openUrl('https://vuejs.org')">
                Vue 3
              </NTag>
              <NTag type="info" style="cursor: pointer" @click="openUrl('https://www.typescriptlang.org')">
                TypeScript
              </NTag>
              <NTag type="warning" style="cursor: pointer" @click="openUrl('https://www.naiveui.com')">
                Naive UI
              </NTag>
              <NTag type="error" style="cursor: pointer" @click="openUrl('https://vitejs.dev')">
                Vite
              </NTag>
              <NTag type="warning" style="cursor: pointer" @click="openUrl('https://www.tauri.app')">
                Tauri
              </NTag>
            </NSpace>
          </NDescriptionsItem>
        </NDescriptions>
        <div>
          <span>
            ME Frp 5.0 除 <strong>设计框架/程序框架及 <a href="https://github.com/fatedier/frp" target="_blank">Frp 项目原有代码</a></strong> 以外,
            其他所有组件均为自主研发, 受《中华人民共和国著作权法》保护。
          </span><br>
          <span>
            中国内网穿透联盟致力于聚集各个行业同僚, 可在 <a href="https://xn--v6qw21h0gd43u.xn--fiqs8s" target="_blank">内网穿透.中国</a> 了解更多信息。
          </span><br>
          <span>
            如需了解我们的相关规定, 请访问相应链接: <a href="https://preview.mefrp.com/terms" target="_blank">服务条款</a>&nbsp;
              <a href="https://preview.mefrp.com/privacy" target="_blank">隐私政策</a>&nbsp;
                <a href="https://preview.mefrp.com/content" target="_blank">内容策略</a>
          </span>
        </div>
      </NSpace>
    </NCard>
    <NCard title="联系方式" class="single-card">
      <NSpace horizontal :size="10">
        <NCard title="官方 QQ 群聊" class="contact-info">
          <NSpace align="center">
            <NTag type="success" size="small">推荐</NTag>
            <a href="https://qm.qq.com/q/9iibikyupG" target="_blank">1019501085</a>
          </NSpace>
        </NCard>
        <NCard title="官方用户支持邮箱" class="contact-info">
          <NSpace align="center">
            <NTag type="warning" size="small">慢速</NTag>
            <a href="mailto:support@mefrp.com" target="_blank">support@mefrp.com</a>
          </NSpace>
        </NCard>
      </NSpace>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { NCard, NSpace, NDescriptions, NDescriptionsItem, NTag, NAvatar } from 'naive-ui'

const openUrl = (url: string) => {
  window.open(url, '_blank')
}
</script>

<style lang="scss" scoped>
@use '../../assets/styles/dashboard/about.scss';
</style>