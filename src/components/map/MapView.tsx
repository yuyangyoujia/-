'use client'

import { useEffect, useRef, useState } from 'react'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { Community } from '@/types/community'

interface MapViewProps {
  communities: Community[]
  onSelectCommunity?: (community: Community) => void
  selectedId?: string
  className?: string
}

// 中国中心点
const CHINA_CENTER: [number, number] = [104.0, 35.0]
const DEFAULT_ZOOM = 4.5

export default function MapView({
  communities,
  onSelectCommunity,
  selectedId,
  className,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const markers = useRef<maplibregl.Marker[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    const m = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: [
              'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          },
        },
        layers: [
          {
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: CHINA_CENTER,
      zoom: DEFAULT_ZOOM,
      attributionControl: false,
    })

    m.addControl(new maplibregl.NavigationControl(), 'top-right')
    m.addControl(new maplibregl.AttributionControl({ compact: true }))

    m.on('load', () => {
      setLoaded(true)
    })

    map.current = m

    return () => {
      m.remove()
      map.current = null
    }
  }, [])

  // 更新标记点
  useEffect(() => {
    if (!map.current || !loaded) return

    // 清除旧标记
    markers.current.forEach((marker) => marker.remove())
    markers.current = []

    const typeColors: Record<string, string> = {
      coliving: '#3b82f6', // 蓝
      coworking: '#10b981', // 绿
      opc: '#8b5cf6', // 紫
      hybrid: '#f59e0b', // 橙
    }

    communities.forEach((community) => {
      const color = typeColors[community.type] || '#6b7280'
      const isSelected = community.id === selectedId
      const size = isSelected ? 16 : 12

      // 创建自定义 marker
      const el = document.createElement('div')
      el.className = 'cursor-pointer transition-transform hover:scale-125'
      el.innerHTML = `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}"
          stroke="${isSelected ? '#fff' : color}" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
        </svg>
      `
      el.style.width = `${size}px`
      el.style.height = `${size}px`

      if (isSelected) {
        el.style.filter = 'drop-shadow(0 0 4px rgba(0,0,0,0.5))'
        el.style.zIndex = '999'
      }

      el.addEventListener('click', () => {
        onSelectCommunity?.(community)
      })

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([community.coordinates.lng, community.coordinates.lat])
        .addTo(map.current!)

      markers.current.push(marker)
    })
  }, [communities, loaded, selectedId, onSelectCommunity])

  return (
    <div ref={mapContainer} className={`h-full w-full ${className ?? ''}`} />
  )
}