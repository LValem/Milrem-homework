<template>
  <div class="waypoint-list">
    <h3>Saved Waypoints</h3>
    <ul>
      <li v-for="wp in ugvStore.waypoints" :key="wp.id" @click="selectWaypoint(wp)">
        {{ wp.name }}
      </li>
    </ul>
  </div>
  <WaypointPopup v-if="selected" :waypoint="selected" @close="selected = null" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useUGVStore } from '@/store/ugv'
import WaypointPopup from './WaypointPopup.vue'

const ugvStore = useUGVStore()
const selected = ref(null)
const selectWaypoint = (wp: any) => {
  selected.value = wp
}
</script>

<style scoped>
.waypoint-list {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  background-color: rgba(128, 128, 128, 0.8);
  border: 2px solid black;
  color: white;
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: bold;
  border-radius: 6px;
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  font-family: monospace;
  display: flex;
  flex-direction: column;
}
.waypoint-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.waypoint-list li {
  cursor: pointer;
  margin: 5px 0;
}
</style>
