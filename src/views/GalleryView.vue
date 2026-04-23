<template>
  <section class="section page-section">
    <h2>我们的相册</h2>
    <p class="section-desc">这里收集了属于我们的珍贵瞬间。</p>

    <p v-if="loading">加载中...</p>
    <p v-else-if="errorMsg" style="color: #d85b88;">加载失败：{{ errorMsg }}</p>

    <div v-else class="gallery-grid">
      <div
        class="photo-card real-photo-card"
        v-for="photo in galleryPhotos"
        :key="photo.id"
      >
        <img :src="photo.image_url" :alt="photo.title" class="gallery-image" />
        <div class="photo-overlay">
          <h3>{{ photo.title }}</h3>
          <p>{{ photo.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'

const galleryPhotos = ref([])
const loading = ref(true)
const errorMsg = ref('')

onMounted(async () => {
  const { data, error } = await supabase
    .from('gallery_photos')
    .select('*')
    .order('shot_date', { ascending: true })

  if (error) {
    errorMsg.value = error.message
  } else {
    galleryPhotos.value = data
  }

  loading.value = false
})
</script>