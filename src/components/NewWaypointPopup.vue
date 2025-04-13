<template>
  <div class="new-popup">
    <h4>New Waypoint: {{ waypoint.name }}</h4>
    <div class="coords">
      <strong>Latitude:</strong> {{ waypoint.lat.toFixed(6) }}<br />
      <strong>Longitude:</strong> {{ waypoint.lng.toFixed(6) }}
    </div>
    <div class="buttons">
      <button class="popup-btn" @click="drive">Drive</button>
      <button class="popup-btn" @click="save">Save</button>
      <button class="popup-btn" @click="discard">Discard</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

interface Waypoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export default defineComponent({
  name: 'NewWaypointPopup',
  props: {
    waypoint: {
      type: Object as PropType<Waypoint>,
      required: true
    }
  },
  emits: ['decision'],
  methods: {
    drive() {
      this.$emit('decision', { decision: 'drive', waypoint: this.waypoint })
    },
    save() {
      this.$emit('decision', { decision: 'save', waypoint: this.waypoint })
    },
    discard() {
      this.$emit('decision', { decision: 'discard', waypoint: this.waypoint })
    }
  }
})
</script>

<style scoped>
.new-popup {
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
  gap: 0.5rem;
  margin-top: 1rem;
}
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
