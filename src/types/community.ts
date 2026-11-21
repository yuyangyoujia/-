export type CommunityType = 'coliving' | 'coworking' | 'opc' | 'hybrid'
export type CommunityStatus = 'active' | 'closed' | 'paused'

export interface Community {
  id: string
  name: string
  slug: string
  type: CommunityType
  status: CommunityStatus

  // 位置
  city: string
  province: string
  district?: string
  address?: string
  coordinates: {
    lat: number
    lng: number
  }

  // 描述
  description: string
  shortDescription: string
  tags: string[]

  // 联系
  website?: string
  wechat?: string
  xiaohongshu?: string
  douyin?: string
  phone?: string

  // 运营
  openedAt: string // ISO date
  closedAt?: string
  priceDescription?: string // 文字描述价格区间
  capacity?: number

  // 媒体
  images?: string[]
  featuredImage?: string

  // 审核
  verifiedAt?: string
  sourceUrl?: string
  updatedAt: string
  createdAt: string
}

export type CommunityFilter = {
  type?: CommunityType[]
  province?: string
  city?: string
  status?: CommunityStatus
  tags?: string[]
  search?: string
}