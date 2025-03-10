export interface TransactionsType {
  transaction_id: string
  user_id: { name: string }
  product_id: { name: string }
  quantity: number
  total_price: number
  transaction_date: string
}
