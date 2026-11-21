'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import type { Community, CommunityType } from '@/types/community'
import { communities } from '@/data/communities'
import FilterBar from '@/components/community/FilterBar'
import CommunityCard from '@/components/community/CommunityCard'
import CommunityDetail from '@/components/community/CommunityDetail'
import { cn } from '@/lib/cn'

// 动态导入地图（不 hydration）
const MapView = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
      加载地图...
    </div>
  ),
})

export default function Home() {
  const [search, setSearch] = useState('')
  const [activeTypes, setActiveTypes] = useState<CommunityType[]>([])
  const [activeProvince, setActiveProvince] = useState<string | null>(null)
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(
    null
  )
  const [showList, setShowList] = useState(true)

  // 筛选逻辑
  const filtered = useMemo(() => {
    let result = communities

    // 搜索
    if (search.trim()) {
      const term = search.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.city.toLowerCase().includes(term) ||
          c.tags.some((t) => t.toLowerCase().includes(term)) ||
          c.shortDescription.toLowerCase().includes(term)
      )
    }

    // 类型
    if (activeTypes.length > 0) {
      result = result.filter((c) => activeTypes.includes(c.type))
    }

    // 省份
    if (activeProvince) {
      result = result.filter((c) => c.province === activeProvince)
    }

    return result
  }, [search, activeTypes, activeProvince])

  const provinces = useMemo(
    () => [...new Set(communities.map((c) => c.province))],
    []
  )

  const cities = useMemo(
    () => [...new Set(communities.map((c) => c.city))],
    []
  )

  const handleSelectProvince = (province: string | null) => {
    setActiveProvince(province)
    if (province) {
      setShowList(true)
    }
  }

  return (
    <div className="h-screen flex flex-col">
      {/* 顶栏 */}
      <header className="shrink-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-gray-900">
              <span className="text-blue-600">Comu</span>Page
            </h1>
            <span className="text-xs text-gray-400 hidden sm:inline">
              中国数字游民社区地图
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">
              {filtered.length} 个社区
            </span>
            <button
              onClick={() => setShowList(!showList)}
              className={cn(
                'text-xs px-2.5 py-1 rounded-md border transition-colors',
                showList
                  ? 'bg-blue-50 border-blue-200 text-blue-600'
                  : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
              )}
            >
              列表
            </button>
          </div>
        </div>
      </header>

      {/* 主体：地图 + 侧边栏 */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* 地图（全尺寸背景） */}
        <div className="absolute inset-0">
          <MapView
            communities={filtered}
            onSelectCommunity={setSelectedCommunity}
            selectedId={selectedCommunity?.id}
          />
        </div>

        {/* 侧边栏 */}
        <div
          className={cn(
            'relative z-1 transition-all duration-300 ease-in-out',
            showList ? 'w-full sm:w-96' : 'w-0 sm:w-0'
          )}
        >
          <div
            className={cn(
              'h-full bg-white/95 backdrop-blur-sm border-r border-gray-200 overflow-hidden transition-opacity',
              showList ? 'opacity-100' : 'opacity-0'
            )}
          >
            <div className="h-full flex flex-col">
              {/* 筛选 */}
              <div className="shrink-0 p-3 border-b border-gray-100">
                <FilterBar
                  provinces={provinces}
                  cities={cities}
                  onSearch={setSearch}
                  onFilterType={setActiveTypes}
                  onFilterProvince={handleSelectProvince}
                  activeTypes={activeTypes}
                  activeProvince={activeProvince}
                />
              </div>

              {/* 列表 */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {filtered.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    没有找到匹配的社区
                  </div>
                ) : (
                  filtered.map((community) => (
                    <CommunityCard
                      key={community.id}
                      community={community}
                      selected={selectedCommunity?.id === community.id}
                      onSelect={(c) => {
                        setSelectedCommunity(c)
                        // 手机上选择后自动滚动地图不太需要，但选中的社区会高亮标记
                      }}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 详情面板（选中社区时在右侧弹出） */}
        {selectedCommunity && (
          <>
            {/* 手机：覆盖式面板 */}
            <div className="sm:hidden fixed inset-0 z-50 flex flex-col">
              <div
                className="flex-1 bg-black/30"
                onClick={() => setSelectedCommunity(null)}
              />
              <div className="max-h-[70vh] bg-white rounded-t-xl overflow-hidden shadow-xl">
                <CommunityDetail
                  community={selectedCommunity}
                  onClose={() => setSelectedCommunity(null)}
                />
              </div>
            </div>

            {/* 桌面：右侧面板 */}
            <div className="hidden sm:block relative z-1 w-80 border-l border-gray-200 bg-white shadow-sm">
              <CommunityDetail
                community={selectedCommunity}
                onClose={() => setSelectedCommunity(null)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}