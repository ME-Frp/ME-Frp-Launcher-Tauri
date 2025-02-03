<template>
  <div class="auth-container">
    <NCard class="auth-card">
      <div class="auth-header">
        <div class="logo-link">
          <div class="title-with-icon" style="user-select: none">
            <NIcon size="32" :component="LogInOutline"/>
            <h2>登录 ME Frp</h2>
          </div>
        </div>
      </div>
      <NForm ref="formRef" :model="formValue" :rules="rules" style="user-select: none">
        <NFormItem path="username" label="用户名/邮箱">
          <NInput v-model:value="formValue.username" placeholder="请输入用户名或邮箱" />
        </NFormItem>
        <NFormItem path="password" label="密码">
          <NInput v-model:value="formValue.password" type="password" placeholder="请输入密码" show-password-on="click" />
        </NFormItem>
        <div class="form-footer">
          <router-link to="/iforgot" class="forgot-link">忘记密码？</router-link>
        </div>
        <NButton type="primary" block secondary strong @click="handleSubmit">
          登录
        </NButton>
        <div class="form-footer register-link">
          <span>还没有账号？</span>
          <router-link to="/register">立即注册</router-link>
        </div>
      </NForm>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NForm, NFormItem, NInput, NButton, NCard, NIcon, type FormRules, useMessage, type FormInst } from 'naive-ui'
import { LogInOutline } from '@vicons/ionicons5'
import { PublicApi } from '../../shared/api/public'

const router = useRouter()
const message = useMessage()
const formRef = ref<FormInst | null>(null)
const formValue = ref({
  username: '',
  password: ''
})

const rules: FormRules = {
  username: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur'
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: 'blur'
  }
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    const response = await PublicApi.login({
      username: formValue.value.username,
      password: formValue.value.password
    })
    
    if (response.data.code === 200) {
      localStorage.setItem('token', response.data.data.token)
      localStorage.setItem('username', response.data.data.username)
      localStorage.setItem('group', response.data.data.group)
      message.success('登录成功')
      await new Promise(resolve => setTimeout(resolve, 800))
      router.push('/home')
      window.location.reload()
    } else {
      message.error(response.data.message || '登录失败')
    }
  } catch (error: any) {
    if (error?.response?.data?.message) {
      message.error(error.response.data.message)
    } else {
      message.error('登录失败, 请重试')
    }
  }
}
</script>

<style lang="scss" scoped>
.auth-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-card {
  max-width: 420px;
}

.auth-header {
  text-align: center;
  margin-bottom: 24px;
}

.logo-link {
  text-decoration: none;
  color: inherit;
}

.title-with-icon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.title-with-icon :deep(svg) {
  color: #2196F3;
}

.logo-link h2 {
  font-size: 1.5rem;
  margin: 0;
  background: linear-gradient(45deg, #2196F3, #42A5F5);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  margin: -8px 0 16px;
}

.register-link {
  justify-content: center;
  margin: 16px 0 0;
  gap: 8px;
}

.register-link span {
  color: var(--n-text-color-2);
}

.register-link a {
  color: #2196F3;
  text-decoration: none;
}

.forgot-link {
  font-size: 0.9rem;
  color: var(--n-text-color-2);
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: #2196F3;
}
</style>