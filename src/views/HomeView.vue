<template>
  <section class="hero">
    <div class="floating-icon heart heart-1">❤</div>
    <div class="floating-icon heart heart-2">❤</div>
    <div class="floating-icon rose rose-1">🌹</div>
    <div class="floating-icon rose rose-2">🌹</div>

    <div class="hero-content">
      <p class="eyebrow">For You</p>
      <h1>{{ title }}</h1>
      <p class="subtitle">
        从相遇到现在，每一天都值得被认真记录。
      </p>

      <div class="days-card">
        <span class="days-label">我们已经一起走过</span>
        <span class="days-number">{{ daysTogether }}</span>
        <span class="days-label">天</span>
      </div>

      <p class="date-tip">纪念起点：{{ anniversaryText }}</p>
    </div>
  </section>

  <section class="section" id="story">
    <h2>关于我们</h2>
    <p>
      这里以后可以写你们的故事，比如第一次认识、第一次见面、第一次约会，
      或者你想对她说的话。
    </p>
  </section>
</template>

<script setup>
const title = '我们的周年纪念网站'
const anniversaryDate = new Date('2023-04-25')

const today = new Date()
const diffTime = today.getTime() - anniversaryDate.getTime()
const daysTogether = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)))

const anniversaryText = `${anniversaryDate.getFullYear()}-${String(
  anniversaryDate.getMonth() + 1
).padStart(2, '0')}-${String(anniversaryDate.getDate()).padStart(2, '0')}`
</script>