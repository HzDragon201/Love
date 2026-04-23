<template>
  <section class="section page-section">
    <div class="admin-topbar">
      <div>
        <h2>内容管理</h2>
        <p class="section-desc">这里可以新增、查看和删除时间线事件、相册照片和留言内容。</p>
      </div>
      <button class="secondary-btn" @click="logout">退出登录</button>
    </div>

    <div class="admin-grid">
      <div class="form-card">
        <h3>新增时间线事件</h3>

        <form @submit.prevent="submitTimeline" class="admin-form">
          <input v-model="timelineForm.title" type="text" placeholder="标题" required />
          <input v-model="timelineForm.event_date" type="date" required />
          <textarea
            v-model="timelineForm.description"
            placeholder="事件描述"
            rows="5"
          ></textarea>
          <input type="file" accept="image/*" @change="handleTimelineFile" required />

          <button type="submit" :disabled="timelineLoading">
            {{ timelineLoading ? '上传中...' : '新增时间线事件' }}
          </button>
        </form>

        <p v-if="timelineMsg" class="admin-msg">{{ timelineMsg }}</p>
      </div>

      <div class="form-card">
        <h3>新增相册照片</h3>

        <form @submit.prevent="submitGallery" class="admin-form">
          <input v-model="galleryForm.title" type="text" placeholder="标题" required />
          <input v-model="galleryForm.shot_date" type="date" />
          <textarea
            v-model="galleryForm.description"
            placeholder="照片说明"
            rows="5"
          ></textarea>
          <input type="file" accept="image/*" @change="handleGalleryFile" required />

          <button type="submit" :disabled="galleryLoading">
            {{ galleryLoading ? '上传中...' : '新增相册照片' }}
          </button>
        </form>

        <p v-if="galleryMsg" class="admin-msg">{{ galleryMsg }}</p>
      </div>
    </div>

    <div class="manage-section">
      <h3>新增留言</h3>

      <form class="admin-form" @submit.prevent="submitLetter">
        <input
          v-model="letterForm.title"
          type="text"
          placeholder="留言标题"
          required
        />

        <textarea
          v-model="letterForm.body"
          placeholder="留言正文"
          rows="8"
          required
        ></textarea>

        <button type="submit" :disabled="letterLoading">
          {{ letterLoading ? '保存中...' : '新增留言' }}
        </button>
      </form>

      <p v-if="letterMsg" class="admin-msg">{{ letterMsg }}</p>
    </div>

    <div class="manage-section">
      <h3>已有留言</h3>

      <div v-if="letterList.length === 0" class="empty-tip">暂无留言内容</div>

      <div
        v-for="item in letterList"
        :key="item.id"
        class="manage-item"
      >
        <div class="manage-info">
          <div class="manage-title">{{ item.title }}</div>
          <div class="manage-meta">{{ formatDateTime(item.created_at) }}</div>
        </div>

        <button class="danger-btn" @click="deleteLetter(item)">
          删除
        </button>
      </div>
    </div>

    <div class="manage-section">
      <h3>已有时间线</h3>

      <div v-if="timelineList.length === 0" class="empty-tip">暂无时间线内容</div>

      <div
        v-for="item in timelineList"
        :key="item.id"
        class="manage-item"
      >
        <div class="manage-info">
          <div class="manage-title">{{ item.title }}</div>
          <div class="manage-meta">{{ item.event_date }}</div>
        </div>

        <button class="danger-btn" @click="deleteTimeline(item)">
          删除
        </button>
      </div>
    </div>

    <div class="manage-section">
      <h3>已有相册</h3>

      <div v-if="galleryList.length === 0" class="empty-tip">暂无相册内容</div>

      <div
        v-for="item in galleryList"
        :key="item.id"
        class="manage-item"
      >
        <div class="manage-info">
          <div class="manage-title">{{ item.title }}</div>
          <div class="manage-meta">{{ item.shot_date || '未填写日期' }}</div>
        </div>

        <button class="danger-btn" @click="deleteGallery(item)">
          删除
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'

const router = useRouter()

async function logout() {
  await supabase.auth.signOut()
  router.push('/login')
}

const timelineForm = ref({
  title: '',
  event_date: '',
  description: '',
})

const galleryForm = ref({
  title: '',
  shot_date: '',
  description: '',
})

const letterForm = ref({
  title: '',
  body: '',
})

const timelineFile = ref(null)
const galleryFile = ref(null)

const timelineLoading = ref(false)
const galleryLoading = ref(false)
const letterLoading = ref(false)

const timelineMsg = ref('')
const galleryMsg = ref('')
const letterMsg = ref('')

const timelineList = ref([])
const galleryList = ref([])
const letterList = ref([])

function handleTimelineFile(event) {
  timelineFile.value = event.target.files?.[0] || null
}

function handleGalleryFile(event) {
  galleryFile.value = event.target.files?.[0] || null
}

function getStoragePathFromUrl(url) {
  const marker = '/storage/v1/object/public/memories/'
  const index = url.indexOf(marker)
  if (index === -1) return null
  return decodeURIComponent(url.slice(index + marker.length))
}

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

async function loadTimelineList() {
  const { data, error } = await supabase
    .from('timeline_events')
    .select('*')
    .order('event_date', { ascending: false })

  if (error) {
    console.error('loadTimelineList error:', error)
    timelineMsg.value = `读取时间线失败：${error.message}`
    return
  }

  timelineList.value = data || []
}

async function loadGalleryList() {
  const { data, error } = await supabase
    .from('gallery_photos')
    .select('*')
    .order('shot_date', { ascending: false })

  if (error) {
    console.error('loadGalleryList error:', error)
    galleryMsg.value = `读取相册失败：${error.message}`
    return
  }

  galleryList.value = data || []
}

async function loadLetterList() {
  const { data, error } = await supabase
    .from('letter_messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (!error) {
    letterList.value = data || []
  }
}

async function uploadImage(file, folder) {
  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const filePath = `${folder}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('memories')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  const { data } = supabase.storage
    .from('memories')
    .getPublicUrl(filePath)

  return data.publicUrl
}

async function submitTimeline() {
  if (!timelineFile.value) {
    timelineMsg.value = '请先选择图片'
    return
  }

  timelineLoading.value = true
  timelineMsg.value = ''

  try {
    const publicUrl = await uploadImage(timelineFile.value, 'timeline')

    const { error } = await supabase.from('timeline_events').insert([
      {
        title: timelineForm.value.title,
        event_date: timelineForm.value.event_date,
        description: timelineForm.value.description,
        cover_image_url: publicUrl,
      },
    ])

    if (error) throw error

    timelineMsg.value = '时间线事件新增成功'
    timelineForm.value = {
      title: '',
      event_date: '',
      description: '',
    }
    timelineFile.value = null

    await loadTimelineList()
  } catch (err) {
    console.error(err)
    timelineMsg.value = `新增失败：${err.message}`
  } finally {
    timelineLoading.value = false
  }
}

async function submitGallery() {
  if (!galleryFile.value) {
    galleryMsg.value = '请先选择图片'
    return
  }

  galleryLoading.value = true
  galleryMsg.value = ''

  try {
    const publicUrl = await uploadImage(galleryFile.value, 'gallery')

    const { error } = await supabase.from('gallery_photos').insert([
      {
        title: galleryForm.value.title,
        shot_date: galleryForm.value.shot_date || null,
        description: galleryForm.value.description,
        image_url: publicUrl,
      },
    ])

    if (error) throw error

    galleryMsg.value = '相册照片新增成功'
    galleryForm.value = {
      title: '',
      shot_date: '',
      description: '',
    }
    galleryFile.value = null

    await loadGalleryList()
  } catch (err) {
    console.error(err)
    galleryMsg.value = `新增失败：${err.message}`
  } finally {
    galleryLoading.value = false
  }
}

async function submitLetter() {
  letterLoading.value = true
  letterMsg.value = ''

  try {
    const { error } = await supabase
      .from('letter_messages')
      .insert([
        {
          title: letterForm.value.title,
          body: letterForm.value.body,
        },
      ])

    if (error) throw error

    letterMsg.value = '留言新增成功'
    letterForm.value = {
      title: '',
      body: '',
    }

    await loadLetterList()
  } catch (err) {
    console.error(err)
    letterMsg.value = `新增失败：${err.message}`
  } finally {
    letterLoading.value = false
  }
}

async function deleteTimeline(item) {
  const ok = window.confirm(`确定删除时间线“${item.title}”吗？`)
  if (!ok) return

  try {
    const { error } = await supabase
      .from('timeline_events')
      .delete()
      .eq('id', item.id)

    if (error) throw error

    const path = getStoragePathFromUrl(item.cover_image_url)
    if (path) {
      const { error: storageError } = await supabase.storage
        .from('memories')
        .remove([path])

      if (storageError) {
        timelineMsg.value = `记录已删除，但图片删除失败：${storageError.message}`
        await loadTimelineList()
        return
      }
    }

    timelineMsg.value = '时间线删除成功'
    await loadTimelineList()
  } catch (err) {
    console.error(err)
    timelineMsg.value = `删除失败：${err.message}`
  }
}

async function deleteGallery(item) {
  const ok = window.confirm(`确定删除相册“${item.title}”吗？`)
  if (!ok) return

  try {
    const { error } = await supabase
      .from('gallery_photos')
      .delete()
      .eq('id', item.id)

    if (error) throw error

    const path = getStoragePathFromUrl(item.image_url)
    if (path) {
      const { error: storageError } = await supabase.storage
        .from('memories')
        .remove([path])

      if (storageError) {
        galleryMsg.value = `记录已删除，但图片删除失败：${storageError.message}`
        await loadGalleryList()
        return
      }
    }

    galleryMsg.value = '相册删除成功'
    await loadGalleryList()
  } catch (err) {
    console.error(err)
    galleryMsg.value = `删除失败：${err.message}`
  }
}

async function deleteLetter(item) {
  const ok = window.confirm(`确定删除留言“${item.title}”吗？`)
  if (!ok) return

  try {
    const { error } = await supabase
      .from('letter_messages')
      .delete()
      .eq('id', item.id)

    if (error) throw error

    letterMsg.value = '留言删除成功'
    await loadLetterList()
  } catch (err) {
    console.error(err)
    letterMsg.value = `删除失败：${err.message}`
  }
}

onMounted(async () => {
  await loadTimelineList()
  await loadGalleryList()
  await loadLetterList()
})
</script>