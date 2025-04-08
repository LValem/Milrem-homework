import { defineStore } from 'pinia'

export const useUGVStore = defineStore('ugv', {
    state: () => ({
        engineOn: false,
        position: { lat: 59.239654, lng: 25.960111 },
        waypoints: [] as { id: string, name: string, lat: number, lng: number }[],
    }),
    actions: {
        toggleEngine() {
            this.engineOn = !this.engineOn
        },
        updatePosition(lat: number, lng: number) {
            this.position = { lat, lng }
        },
        addWaypoint(wp: { id: string, name: string, lat: number, lng: number }) {
            this.waypoints.push(wp)
        },
        deleteWaypoint(id: string) {
            this.waypoints = this.waypoints.filter(wp => wp.id !== id)
        },
        renameWaypoint(id: string, newName: string) {
            const wp = this.waypoints.find(wp => wp.id === id)
            if (wp) wp.name = newName
        },
    }
})
