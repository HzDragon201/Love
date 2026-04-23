<template>
  <section class="section page-section">
    <div class="login-card">
      <h2>后台登录</h2>
      <p class="section-desc">只有管理员账号可以进入内容管理页。</p>

      <form class="admin-form" @submit.prevent="handleLogin">
        <input v-model="email" type="email" placeholder="邮箱" required />
        <input v-model="password" type="password" placeholder="密码" required />

        <button type="submit" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>

      <div class="login-actions">
        <button class="secondary-btn" @click="handleSignup" :disabled="loading">
          {{ loading ? '处理中...' : '首次注册管理员账号' }}
        </button>
      </div>

      <p v-if="msg" class="admin-msg">{{ msg }}</p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const msg = ref('')

async function handleLogin() {
  loading.value = true
  msg.value = ''

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  loading.value = false

  if (error) {
    msg.value = `登录失败：${error.message}`
    return
  }

  router.push('/admin')
}

async function handleSignup() {
  loading.value = true
  msg.value = ''

  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  })

  loading.value = false

  if (error) {
    msg.value = `注册失败：${error.message}`
    return
  }

  msg.value = '注册成功。若邮箱确认已开启，请先去邮箱确认，再登录。'
}
</script>