<template>
  <div id="map" class="h-full w-full"></div>
</template>

<script lang="ts" setup>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { onMounted, ref } from 'vue'
import { useUGVStore } from '@/store/ugv'
import UGVIconImg from '@/assets/k9-thunder.jpg?url'

const map = ref<L.Map>()
const ugvStore = useUGVStore()
let longPressTimeout: any = null
const heading = ref(270)

// function to create a rotated image marker
const getRotatedIcon = () =>
    L.divIcon({
      className: 'ugv-marker',
      html: `<img src="${UGVIconImg}" alt="UGV" class="ugv-image" style="transform: rotate(${heading.value}deg);" />`,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    })

onMounted(() => {
  map.value = L.map('map', {attributionControl: false,}).setView([ugvStore.position.lat, ugvStore.position.lng], 16)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value)

  const ugvMarker = L.marker([ugvStore.position.lat, ugvStore.position.lng], {
    icon: getRotatedIcon(),
    draggable: false,
  }).addTo(map.value)

  ugvStore.$subscribe(() => {
    const { lat, lng } = ugvStore.position
    ugvMarker.setLatLng([lat, lng])

    // ⬇️ If engine is on, center the map on the UGV
    if (ugvStore.engineOn) {
      map.value?.setView([lat, lng], map.value.getZoom(), { animate: true })
    }
  })

  // Handle long press to open waypoint popup
  map.value.on('mousedown', (e: any) => {
    longPressTimeout = setTimeout(() => {
      const id = crypto.randomUUID()
      const latlng = e.latlng
      const name = `Waypoint-${ugvStore.waypoints.length + 1}`

      const popupContent = `
        <b>${name}</b><br/>
        <small><strong>Lat:</strong> ${latlng.lat.toFixed(6)}<br/>
        <strong>Lng:</strong> ${latlng.lng.toFixed(6)}</small><br/><br/>
        <button onclick="window.dispatchEvent(new CustomEvent('drive-to', { detail: ${JSON.stringify({
        lat: latlng.lat,
        lng: latlng.lng,
      })} }))">Drive</button>
        <button onclick="window.dispatchEvent(new CustomEvent('save-waypoint', { detail: ${JSON.stringify({
        id,
        name,
        lat: latlng.lat,
        lng: latlng.lng,
      })} }))">Save</button>
        <button onclick="window.dispatchEvent(new CustomEvent('discard-popup'))">Discard</button>
      `
      L.popup().setLatLng(latlng).setContent(popupContent).openOn(map.value!)
    }, 700)
  })

  map.value.on('dblclick', () => clearTimeout(longPressTimeout))

  const step = 0.0001
  const diagonalStepLng = 0.00005
  const diagonalStepLat = 0.000015
  const pressedKeys = new Set<string>()

  window.addEventListener('keydown', (e: KeyboardEvent) => {
    pressedKeys.add(e.key)

    if (!ugvStore.engineOn) {
      alert('Start the engine to move the UGV!')
      return
    }

    const {lat, lng} = ugvStore.position
    let newLat = lat
    let newLng = lng

    const up = pressedKeys.has('ArrowUp')
    const down = pressedKeys.has('ArrowDown')
    const left = pressedKeys.has('ArrowLeft')
    const right = pressedKeys.has('ArrowRight')

    if (up && left) {
      newLat += diagonalStepLat
      newLng -= diagonalStepLng
    } else if (up && right) {
      newLat += diagonalStepLat
      newLng += diagonalStepLng
    } else if (down && left) {
      newLat -= diagonalStepLat
      newLng -= diagonalStepLng
    } else if (down && right) {
      newLat -= diagonalStepLat
      newLng += diagonalStepLng
    }
    if (up) newLat += step
    if (down) newLat -= step
    if (left) newLng -= step
    if (right) newLng += step


    // Heading
    if (up && left) heading.value = 45   // ↖
    else if (up && right) heading.value = 135  // ↗
    else if (down && left) heading.value = 315 // ↙
    else if (down && right) heading.value = 225 // ↘
    else if (up) heading.value = 90     // ↑
    else if (down) heading.value = 270  // ↓
    else if (left) heading.value = 0    // ←
    else if (right) heading.value = 180 // →

    // Only update if something changed
    if (up || down || left || right) {
      ugvStore.updatePosition(newLat, newLng)
      ugvMarker.setIcon(getRotatedIcon())
    }
  })

  window.addEventListener('keyup', (e: KeyboardEvent) => {
    pressedKeys.delete(e.key)
  })

})
</script>

<style scoped>
#map {
  height: 100vh;
  width: 100%;
}
</style>
