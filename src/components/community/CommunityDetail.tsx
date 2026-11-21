'use client'

import { X, MapPin, Globe, Hash, Calendar } from 'lucide-react'
import type { Community, CommunityType } from '@/types/community'
import { cn } from '@/lib/cn'

interface CommunityDetailProps {
  community: Community
  onClose: () => void
}

const typeLabels: Record<CommunityType, string> = {
  coliving: '共居',
  coworking: '共享办公',
  opc: '开放创作社区',
  hybrid: '综合社区',
}

export default function CommunityDetail({
  community,
  onClose,
}: CommunityDetailProps) {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* 头部 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0">
        <h2 className="text-lg font-semibold text-gray-900 pr-2">
          {community.name}
        </h2>
        <button
          onClick={onClose}
          className="shrink-0 p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* 内容 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 类型标签 */}
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'inline-block px-2 py-0.5 rounded text-xs font-medium border',
              {
                'bg-blue-100 text-blue-700 border-blue-200':
                  community.type === 'coliving',
                'bg-green-100 text-green-700 border-green-200':
                  community.type === 'coworking',
                'bg-purple-100 text-purple-700 border-purple-200':
                  community.type === 'opc',
                'bg-amber-100 text-amber-700 border-amber-200':
                  community.type === 'hybrid',
              }
            )}
          >
            {typeLabels[community.type]}
          </span>
          {community.status === 'closed' && (
            <span className="inline-block px-2 py-0.5 rounded text-xs font-medium border bg-red-100 text-red-700 border-red-200">
              已关闭
            </span>
          )}
          {community.status === 'paused' && (
            <span className="inline-block px-2 py-0.5 rounded text-xs font-medium border bg-yellow-100 text-yellow-700 border-yellow-200">
              暂停运营
            </span>
          )}
        </div>

        {/* 位置 */}
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <p>
              {community.province} · {community.city}
              {community.district ? ` · ${community.district}` : ''}
            </p>
            {community.address && (
              <p className="text-gray-400 text-xs mt-0.5">
                {community.address}
              </p>
            )}
          </div>
        </div>

        {/* 描述 */}
        <p className="text-sm text-gray-600 leading-relaxed">
          {community.description}
        </p>

        {/* 价格 */}
        {community.priceDescription && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-900">💰 价格参考</p>
            <p className="text-sm text-gray-600 mt-1">
              {community.priceDescription}
            </p>
          </div>
        )}

        {/* 容量 */}
        {community.capacity && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Hash className="h-4 w-4" />
            <span>容纳 {community.capacity} 人</span>
          </div>
        )}

        {/* 标签 */}
        {community.tags.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-900 mb-1.5">标签</p>
            <div className="flex flex-wrap gap-1.5">
              {community.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 联系方式 */}
        {(community.website || community.wechat || community.xiaohongshu) && (
          <div>
            <p className="text-sm font-medium text-gray-900 mb-1.5">联系</p>
            <div className="space-y-1">
              {community.website && (
                <a
                  href={community.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                >
                  <Globe className="h-4 w-4" />
                  {community.website}
                </a>
              )}
              {community.wechat && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-600">💬</span>
                  微信：{community.wechat}
                </div>
              )}
              {community.xiaohongshu && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-red-500">📕</span>
                  小红书：{community.xiaohongshu}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 时间线 */}
        <div className="border-t border-gray-100 pt-3 mt-3">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar className="h-3 w-3" />
            <span>
              开业：{community.openedAt}
              {community.closedAt ? ` · 关闭：${community.closedAt}` : ''}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
            <span>最后更新：{community.updatedAt}</span>
          </div>
        </div>
      </div>
    </div>
  )
}