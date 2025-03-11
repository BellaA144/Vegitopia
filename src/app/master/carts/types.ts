export interface CartType {
  cart_id?: string | null | undefined
  product_id?: string | null | undefined
  name: string
  description: string
  stock: number
  quantity: number
  total_price?: number
}
