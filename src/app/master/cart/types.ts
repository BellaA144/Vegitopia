
export interface CartItem {
  cart_id: string
  product_id: string
  user_id: string
  quantity: number
  total_price: number
  product: {
    name: string
    price: number
    image_url: string | null
  }
}
