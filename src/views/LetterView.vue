<template>
  <section class="section page-section">
    <h2>{{ letterTitle }}</h2>

    <p v-if="loading">加载中...</p>
    <p v-else-if="errorMsg" style="color: #d85b88;">加载失败：{{ errorMsg }}</p>

    <div v-else class="letter-card">
      <p class="letter-text">{{ letterBody }}</p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'

const letterTitle = ref('想对你说')
const letterBody = ref('')
const loading = ref(true)
const errorMsg = ref('')

onMounted(async () => {
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .eq('id', 1)
    .single()

  if (error) {
    errorMsg.value = error.message
  } else {
    letterTitle.value = data.letter_title
    letterBody.value = data.letter_body
  }

  loading.value = false
})
</script>