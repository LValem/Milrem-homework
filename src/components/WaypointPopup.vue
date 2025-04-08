<template>
  <div class="popup">
    <h4>Edit {{ waypoint.name }}</h4>
    <input v-model="name" />
    <div class="buttons">
      <button @click="rename()">Rename</button>
      <button @click="deleteWp()">Delete</button>
      <button @click="drive()">Drive</button>
      <button @click="$emit('close')">Close</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUGVStore } from '@/store/ugv'
import { defineProps, ref } from 'vue'

// Use proper types if you have them
interface Waypoint {
  id: string
  name: string
  lat: number
  lng: number
}

const props = defineProps<{ waypoint: Waypoint }>()
const emit = defineEmits(['close'])

const ugvStore = useUGVStore()

// v-model on name field
const name = ref(props.waypoint.name)

// Methods
const rename = () => {
  ugvStore.renameWaypoint(props.waypoint.id, name.value)
}

const deleteWp = () => {
  ugvStore.deleteWaypoint(props.waypoint.id)
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
.buttons button {
  margin: 5px;
}
</style>
