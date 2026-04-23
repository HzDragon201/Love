<template>
  <section class="section page-section">
    <h2>我们的时间线</h2>
    <p class="section-desc">把重要的时刻，一点一点认真记录下来。</p>

    <p v-if="loading">加载中...</p>
    <p v-else-if="errorMsg" style="color: #d85b88;">加载失败：{{ errorMsg }}</p>

    <div v-else class="story-timeline">
      <div
        class="story-item"
        v-for="item in timelineMemories"
        :key="item.id"
      >
        <div class="story-date">{{ item.event_date }}</div>

        <div class="story-card">
          <div class="story-image-wrap">
            <img
              :src="item.cover_image_url"
              :alt="item.title"
              class="story-image"
            />
          </div>

          <div class="story-text">
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'

const timelineMemories = ref([])
const loading = ref(true)
const errorMsg = ref('')

onMounted(async () => {
  const { data, error } = await supabase
    .from('timeline_events')
    .select('*')
    .order('event_date', { ascending: true })

  if (error) {
    errorMsg.value = error.message
  } else {
    timelineMemories.value = data
  }

  loading.value = false
})
</script>