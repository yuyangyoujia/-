'use client'

import { Building2, Home, Palette, LayoutGrid, MapPin } from 'lucide-react'
import type { Community, CommunityType } from '@/types/community'
import { cn } from '@/lib/cn'

interface CommunityCardProps {
  community: Community
  selected?: boolean
  onSelect?: (community: Community) => void
}

const typeConfig: Record<
  CommunityType,
  { label: string; icon: React.ReactNode; color: string }
> = {
  coliving: {
    label: '共居',
    icon: <Home className="h-3 w-3" />,
    color: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  coworking: {
    label: '共享办公',
    icon: <Building2 className="h-3 w-3" />,
    color: 'bg-green-100 text-green-700 border-green-200',
  },
  opc: {
    label: '创作社区',
    icon: <Palette className="h-3 w-3" />,
    color: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  hybrid: {
    label: '综合',
    icon: <LayoutGrid className="h-3 w-3" />,
    color: 'bg-amber-100 text-amber-700 border-amber-200',
  },
}

export default function CommunityCard({
  community,
  selected,
  onSelect,
}: CommunityCardProps) {
  const tc = typeConfig[community.type]

  return (
    <button
      onClick={() => onSelect?.(community)}
      className={cn(
        'w-full text-left p-3 rounded-lg border transition-all',
        'hover:shadow-md hover:border-gray-300',
        selected
          ? 'border-blue-500 bg-blue-50 shadow-sm'
          : 'border-gray-200 bg-white'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-sm text-gray-900 truncate">
            {community.name}
          </h3>

          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">
              {community.city}
              {community.district ? ` · ${community.district}` : ''}
            </span>
          </div>
        </div>

        <span
          className={cn(
            'shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium border',
            tc.color
          )}
        >
          {tc.icon}
          {tc.label}
        </span>
      </div>

      <p className="mt-1.5 text-xs text-gray-500 line-clamp-2">
        {community.shortDescription}
      </p>

      {community.priceDescription && (
        <p className="mt-1 text-xs text-gray-400">
          💰 {community.priceDescription}
        </p>
      )}

      {community.tags.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {community.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px]"
            >
              {tag}
            </span>
          ))}
          {community.tags.length > 3 && (
            <span className="text-[10px] text-gray-400">
              +{community.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </button>
  )
}