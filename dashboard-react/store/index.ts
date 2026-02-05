import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { FilterState, MapLayer } from "@/types"

interface MapState {
  center: [number, number]
  zoom: number
  layers: MapLayer[]
  selectedFeature: string | null
  setCenter: (center: [number, number]) => void
  setZoom: (zoom: number) => void
  toggleLayer: (id: string) => void
  setLayerOpacity: (id: string, opacity: number) => void
  setSelectedFeature: (id: string | null) => void
}

interface FilterStore {
  filters: FilterState
  setProvincia: (provincia: string | null) => void
  setCluster: (cluster: number | null) => void
  setPoblacionRange: (min: number, max: number) => void
  setTienePetroleo: (value: boolean | null) => void
  resetFilters: () => void
}

interface UIState {
  sidebarOpen: boolean
  activePage: string
  setSidebarOpen: (open: boolean) => void
  setActivePage: (page: string) => void
}

const defaultLayers: MapLayer[] = [
  { id: "parroquias", name: "Parroquias", visible: true, opacity: 0.7 },
  { id: "infraestructura", name: "Infraestructura Petrolera", visible: true, opacity: 0.8 },
  { id: "salud", name: "Establecimientos de Salud", visible: false, opacity: 0.7 },
]

const defaultFilters: FilterState = {
  provincia: null,
  cluster: null,
  minPoblacion: 0,
  maxPoblacion: 500000,
  tienePetroleo: null,
}

export const useMapStore = create<MapState>()(
  persist(
    (set) => ({
      center: [-78.5, -1.5],
      zoom: 6,
      layers: defaultLayers,
      selectedFeature: null,
      setCenter: (center) => set({ center }),
      setZoom: (zoom) => set({ zoom }),
      toggleLayer: (id) =>
        set((state) => ({
          layers: state.layers.map((l) =>
            l.id === id ? { ...l, visible: !l.visible } : l
          ),
        })),
      setLayerOpacity: (id, opacity) =>
        set((state) => ({
          layers: state.layers.map((l) =>
            l.id === id ? { ...l, opacity } : l
          ),
        })),
      setSelectedFeature: (id) => set({ selectedFeature: id }),
    }),
    {
      name: "map-storage",
    }
  )
)

export const useFilterStore = create<FilterStore>()((set) => ({
  filters: defaultFilters,
  setProvincia: (provincia) =>
    set((state) => ({ filters: { ...state.filters, provincia } })),
  setCluster: (cluster) =>
    set((state) => ({ filters: { ...state.filters, cluster } })),
  setPoblacionRange: (minPoblacion, maxPoblacion) =>
    set((state) => ({ filters: { ...state.filters, minPoblacion, maxPoblacion } })),
  setTienePetroleo: (tienePetroleo) =>
    set((state) => ({ filters: { ...state.filters, tienePetroleo } })),
  resetFilters: () => set({ filters: defaultFilters }),
}))

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: true,
  activePage: "/",
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setActivePage: (activePage) => set({ activePage }),
}))