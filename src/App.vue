<template>
  <div class="page">
    <header class="topbar">
      <div class="logo">我们的纪念日</div>

      <nav class="nav">
        <RouterLink to="/">首页</RouterLink>
        <RouterLink to="/timeline">时间线</RouterLink>
        <RouterLink to="/gallery">相册</RouterLink>
        <RouterLink to="/letter">留言</RouterLink>
      </nav>
    </header>

    <router-view />
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>