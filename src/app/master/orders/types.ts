export interface OrderType {
  id?: string | null | undefined
  created_at?: string | null | undefined
  customer_name: string
  total_price: number
  status: 'pending' | 'completed' | 'canceled'
}
