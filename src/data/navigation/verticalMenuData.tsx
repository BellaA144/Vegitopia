// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'

const verticalMenuData = (): VerticalMenuDataType[] => [
  {
    label: 'Home',
    href: '/home',
    icon: 'tabler-smart-home'
  },
  {
    label: 'Cart',
    href: '/master/carts',
    icon: 'tabler-shopping-cart'
  },
  {
    label: 'History',
    href: '/master/history',
    icon: 'tabler-history'
  }
]

export default verticalMenuData
