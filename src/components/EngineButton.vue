<template>
  <button class="engine-btn" @click="ugvStore.toggleEngine()">
    <span>{{ ugvStore.engineOn ? 'Stop Engine' : 'Start Engine' }}</span>
  </button>
</template>

<script lang="ts" setup>
import { useUGVStore } from '@/store/ugv'
const ugvStore = useUGVStore()
</script>

<style scoped>
.engine-btn {
  position: fixed;
  top: 1rem;
  right: 1rem;
  background-color: rgba(128, 128, 128, 0.8);
  border: 2px solid black;
  border-radius: 6px;
  color: white;
  padding: 10px 20px;
  font-weight: bold;
  z-index: 1000;
  cursor: pointer;
}
</style>
