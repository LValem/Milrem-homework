<template>
  <div class="home">
    <MapView
        ref="mapViewRef"
        @openNewWaypointPopup="newWaypoint = $event"
        @openWaypointPopup="activeWaypoint = $event"
    />
    <EngineButton />
    <WaypointList />
    <Location />
    <!-- Popup for new (unsaved) waypoint -->
    <NewWaypointPopup
        v-if="newWaypoint"
        :waypoint="newWaypoint"
        @decision="handleNewWaypointDecision"
    />
    <!-- Popup for saved waypoint (editing) -->
    <WaypointPopup
        v-if="activeWaypoint"
        :waypoint="activeWaypoint"
        @close="activeWaypoint = null"
        @deleted="activeWaypoint = null"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import MapView from '@/components/MapView.vue'
import EngineButton from '@/components/EngineButton.vue'
import WaypointList from '@/components/WaypointList.vue'
import Location from '@/components/Location.vue'
import WaypointPopup from '@/components/WaypointPopup.vue'
import NewWaypointPopup from '@/components/NewWaypointPopup.vue'
import { useUGVStore } from '@/store/ugv'

const mapViewRef = ref(null)
const activeWaypoint = ref(null)
const newWaypoint = ref(null)
const ugvStore = useUGVStore()

const handleNewWaypointDecision = (payload: { decision: string; waypoint: any }) => {
  if (payload.decision === 'save') {
    ugvStore.addWaypoint(payload.waypoint)
  } else if (payload.decision === 'discard') {
    mapViewRef.value?.removeWaypointMarker(payload.waypoint.id)
  } else if (payload.decision === 'drive') {
    ugvStore.updatePosition(payload.waypoint.lat, payload.waypoint.lng)
  }
  newWaypoint.value = null
}
</script>
