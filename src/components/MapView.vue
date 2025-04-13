<template>
  <div id="map" class="h-full w-full"></div>
</template>

<script lang="ts" setup>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { onMounted, ref, watch, defineEmits } from 'vue'
import { useUGVStore } from '@/store/ugv'
import UGVIconImg from '@/assets/k9-thunder.jpg?url'
const emit = defineEmits(['openNewWaypointPopup','openWaypointPopup'])

const map = ref<L.Map>()
const ugvStore = useUGVStore()
let longPressTimeout: ReturnType<typeof setTimeout> | null = null
const heading = ref(270)
const waypointMarkers = new Map<string, L.Marker>()

const getRotatedIcon = () =>
    L.divIcon({
      className: 'ugv-marker',
      html: `<img src="${UGVIconImg}" alt="UGV" class="ugv-image" style="transform: rotate(${heading.value}deg);" />`,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    })

onMounted(() => {
  map.value = L.map('map', { attributionControl: false })
      .setView([ugvStore.position.lat, ugvStore.position.lng], 16)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value)

  const ugvMarker = L.marker([ugvStore.position.lat, ugvStore.position.lng], {
    icon: getRotatedIcon(),
    draggable: false,
  }).addTo(map.value)

  ugvStore.$subscribe(() => {
    const { lat, lng } = ugvStore.position
    ugvMarker.setLatLng([lat, lng])
    if (ugvStore.engineOn) {
      map.value?.setView([lat, lng], map.value.getZoom(), { animate: true })
    }
  })

  let isDragging = false
  let pressStartPoint: L.Point | null = null

  map.value.on('mousedown', (e: L.LeafletMouseEvent) => {
    isDragging = false
    pressStartPoint = map.value?.mouseEventToContainerPoint(e.originalEvent) ?? null

    longPressTimeout = setTimeout(() => {
      if (!isDragging) {
        const id = crypto.randomUUID()
        const latlng = e.latlng
        const name = `Waypoint-${ugvStore.waypoints.length + 1}`
        const waypoint = { id, name, lat: latlng.lat, lng: latlng.lng }
        const marker = L.marker([latlng.lat, latlng.lng]).addTo(map.value!)
        waypointMarkers.set(id, marker)
        marker.on('click', () => {
          emit('openNewWaypointPopup', waypoint)
        })

        emit('openNewWaypointPopup', waypoint)

        const bounds = L.latLngBounds([
          [ugvStore.position.lat, ugvStore.position.lng],
          [latlng.lat, latlng.lng]
        ])
        map.value?.fitBounds(bounds, { padding: [50, 50] })
      }
    }, 2000)
  })

  map.value.on('mouseup', () => {
    if (longPressTimeout) clearTimeout(longPressTimeout)
  })
  map.value.on('mousemove', (e: L.LeafletMouseEvent) => {
    if (pressStartPoint && !isDragging) {
      const currentPoint = map.value?.mouseEventToContainerPoint(e.originalEvent)
      const distance = currentPoint?.distanceTo(pressStartPoint)
      if (distance && distance > 5) {
        isDragging = true
        if (longPressTimeout) clearTimeout(longPressTimeout)
      }
    }
  })
  map.value.on('dblclick', () => {
    if (longPressTimeout) clearTimeout(longPressTimeout)
  })

  watch(
      () => ugvStore.waypoints,
      (newWaypoints) => {
        waypointMarkers.forEach((marker, id) => {
          if (!newWaypoints.find(wp => wp.id === id)) {
            map.value?.removeLayer(marker)
            waypointMarkers.delete(id)
          }
        })
        newWaypoints.forEach(wp => {
          if (!waypointMarkers.has(wp.id)) {
            const marker = L.marker([wp.lat, wp.lng]).addTo(map.value!)
            marker.on('click', () => {
              emit('openWaypointPopup', wp)
            })
            waypointMarkers.set(wp.id, marker)
          }
        })
      },
      { deep: true, immediate: true }
  )

  // Keyboard controls for UGV movement.
  const step = 0.0001
  const diagonalStepLng = 0.000025
  const diagonalStepLat = 0.000025
  const pressedKeys = new Set<string>()

  window.addEventListener('keydown', (e: KeyboardEvent) => {
    pressedKeys.add(e.key)
    if (!ugvStore.engineOn) {
      alert('Start the engine to move the UGV!')
      return
    }
    const { lat, lng } = ugvStore.position
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

    if (up && left) heading.value = 45
    else if (up && right) heading.value = 135
    else if (down && left) heading.value = 315
    else if (down && right) heading.value = 225
    else if (up) heading.value = 90
    else if (down) heading.value = 270
    else if (left) heading.value = 0
    else if (right) heading.value = 180

    if (up || down || left || right) {
      ugvStore.updatePosition(newLat, newLng)
      ugvMarker.setIcon(getRotatedIcon())
    }
  })

  window.addEventListener('keyup', (e: KeyboardEvent) => {
    pressedKeys.delete(e.key)
  })
})

const removeWaypointMarker = (id: string) => {
  const marker = waypointMarkers.get(id)
  if (marker) {
    map.value?.removeLayer(marker)
    waypointMarkers.delete(id)
  }
}
defineExpose({ removeWaypointMarker })
</script>

<style scoped>
#map {
  height: 100vh;
  width: 100%;
}
</style>
