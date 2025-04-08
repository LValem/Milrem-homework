<!-- src/views/HomeView.vue -->
<template>
  <div class="home">
    <MapView />
    <EngineButton />
    <WaypointList />
    <Location />
  </div>
</template>

<script lang="ts" setup>
import MapView from '@/components/MapView.vue'
import EngineButton from '@/components/EngineButton.vue'
import WaypointList from '@/components/WaypointList.vue'
import Location from "@/components/Location.vue";
</script>
