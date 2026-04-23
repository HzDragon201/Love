<template>
  <section class="section page-section">
    <h2>想对你说</h2>
    <p class="section-desc">这里记录着想对你说的每一句话。</p>

    <p v-if="loading">加载中...</p>
    <p v-else-if="errorMsg" style="color: #d85b88;">加载失败：{{ errorMsg }}</p>

    <div v-else class="letter-list">
      <div v-if="letterList.length === 0" class="empty-tip">暂时还没有留言内容</div>

      <div
        v-for="item in letterList"
        :key="item.id"
        class="letter-card"
      >
        <div class="letter-header">
          <h3>{{ item.title }}</h3>
          <span class="letter-time">{{ formatDateTime(item.created_at) }}</span>
        </div>

        <p class="letter-text">{{ item.body }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'

const letterList = ref([])
const loading = ref(true)
const errorMsg = ref('')

function formatDateTime(value) {
  if (!value) return ''
  const d = new Date(value)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${day} ${h}:${min}`
}

onMounted(async () => {
  const { data, error } = await supabase
    .from('letter_messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    errorMsg.value = error.message
  } else {
    letterList.value = data || []
  }

  loading.value = false
})
</script>