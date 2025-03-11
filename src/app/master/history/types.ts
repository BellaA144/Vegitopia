export interface TransactionsType {
  transaction_id: string
  product_id: {
    name: string
    description: string
  }
  quantity: number
  total_price: number
  transaction_date: string
}
