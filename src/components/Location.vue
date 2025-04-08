<template>
  <div class="location-box">
    <span><strong>UGV Position:</strong></span>
    <span>Lat: {{ position.lat.toFixed(6) }}</span>
    <span>Lng: {{ position.lng.toFixed(6) }}</span>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useUGVStore } from '@/store/ugv'

const ugvStore = useUGVStore()
const position = computed(() => ugvStore.position)
</script>

<style scoped>
.location-box {
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(128, 128, 128, 0.8);
  border: 2px solid black;
  color: white;
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: bold;
  border-radius: 6px;
  z-index: 1000;
  font-family: monospace;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  max-width: 300px;
  white-space: nowrap;
}
</style>
