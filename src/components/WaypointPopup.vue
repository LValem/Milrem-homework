<template>
  <div class="popup">
    <h4>Edit {{ waypoint.name }}</h4>
    <input v-model="name" />

    <div class="coords">
      <strong>Latitude:</strong> {{ waypoint.lat.toFixed(6) }}<br />
      <strong>Longitude:</strong> {{ waypoint.lng.toFixed(6) }}
    </div>

    <div class="buttons">
      <button class="popup-btn" @click="rename()">Rename</button>
      <button class="popup-btn" @click="deleteWp()">Delete</button>
      <button class="popup-btn" @click="drive()">Drive</button>
      <button class="popup-btn" @click="$emit('close')">Close</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUGVStore } from '@/store/ugv'
import { defineProps, ref } from 'vue'

interface Waypoint {
  id: string
  name: string
  lat: number
  lng: number
}

const props = defineProps<{ waypoint: Waypoint }>()
const emit = defineEmits(['close', 'deleted'])
const ugvStore = useUGVStore()
const name = ref(props.waypoint.name)
const rename = () => {
  ugvStore.renameWaypoint(props.waypoint.id, name.value)
}
const deleteWp = () => {
  ugvStore.deleteWaypoint(props.waypoint.id)
  emit('deleted', props.waypoint.id)
  emit('close')
}
const drive = () => {
  ugvStore.updatePosition(props.waypoint.lat, props.waypoint.lng)
}
</script>

<style scoped>
.popup {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  background: white;
  border: 1px solid black;
  padding: 1rem;
  z-index: 1000;
}
.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}
/* Shared button styling to match the engine toggle button */
.popup-btn {
  background-color: rgba(128, 128, 128, 0.8);
  border: 2px solid black;
  border-radius: 6px;
  color: white;
  padding: 10px 20px;
  font-weight: bold;
  cursor: pointer;
}
</style>
