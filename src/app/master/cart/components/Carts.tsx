'use client'

import { useState, useEffect, useTransition } from 'react'

import Image from 'next/image'

import { revalidatePath } from 'next/cache'

import { useRouter } from 'next/navigation'

import { Box, Typography, Button, IconButton, CircularProgress, TextField, Snackbar } from '@mui/material'

import { Add, Remove, Delete } from '@mui/icons-material'

import type { CartItem } from '../types'
import { createClient } from '@/utils/supabase/client'
import ConfirmationDialog from '@/components/ConfirmationDialog'

interface CartProps {
  initialData: CartItem[]
  user_id: string // Tambahkan user_id sebagai props
}

export default function Carts({ initialData, user_id }: CartProps) {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>(initialData)
  const [isPending, startTransition] = useTransition()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchCart() {
      if (initialData.length > 0) return

      try {
        const supabase = createClient()

        const { data, error } = await supabase
          .from('cart')
          .select(
            `
            cart_id,
            product_id,
            user_id,
            quantity,
            total_price,
            created_at,
            product:products(name, price, image_url)
          `
          )
          .eq('user_id', user_id) // Filter berdasarkan user_id
          .order('created_at', { ascending: false })

        if (error) {
          return
        }

        const formattedData = data.map(item => ({
          ...item,
          product: Array.isArray(item.product)
            ? item.product[0]
            : item.product || { name: 'Unknown', price: 0, image_url: '' }
        }))

        setCart(formattedData)
      } catch (err) {
        console.error('❌ Unexpected Error:', err)
      }
    }

    fetchCart()
  }, [initialData, user_id])

  async function updateQuantity(cart_id: string, newQuantity: number, product_price: number) {
    if (newQuantity < 1) return

    startTransition(async () => {
      const supabase = createClient()

      console.log(`🔄 Updating cart ${cart_id} with quantity ${newQuantity}`)

      const { error } = await supabase
        .from('cart')
        .update({ quantity: newQuantity, total_price: newQuantity * product_price })
        .eq('cart_id', cart_id)

      if (error) {
        console.error('❌ Update Quantity Error:', error)

        return
      }

      console.log('✅ Cart updated successfully')

      setCart(prevCart =>
        prevCart.map(item =>
          item.cart_id === cart_id ? { ...item, quantity: newQuantity, total_price: newQuantity * product_price } : item
        )
      )
      setSuccessMessage('Cart updated successfully!')
    })
  }

  async function removeItem(cart_id: string) {
    startTransition(async () => {
      const supabase = createClient()

      console.log(`🗑 Removing item ${cart_id}`)

      const { error } = await supabase.from('cart').delete().eq('cart_id', cart_id)

      if (error) {
        console.error('❌ Remove Item Error:', error)

        return
      }

      console.log('✅ Item removed successfully')

      setCart(prevCart => prevCart.filter(item => item.cart_id !== cart_id))
      setSuccessMessage('Item removed successfully!')
    })
  }

  const totalPrice = cart.reduce((sum, item) => sum + (item.total_price || 0), 0)

  const handleCheckout = async () => {
    try {
      setLoading(true)
      console.log('🛒 Checkout button clicked!')

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cart }) // Pastikan cart tidak undefined/null
      })

      console.log('🔄 Response received!', response)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Invalid response from server' }))

        throw new Error(errorData.message || 'Checkout failed')
      }

      const responseData = await response.json()

      console.log('✅ Checkout success!', responseData)

      router.refresh()

      revalidatePath('/master/cart')

      setSuccessMessage('Checkout success!')
    } catch (error) {
      console.error('❌ Checkout Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ p: 3, borderRadius: 2, boxShadow: 3, bgcolor: 'background.paper' }}>
      <Typography variant='h5' sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
        🛒 Your Cart
      </Typography>

      {isPending && <CircularProgress />}

      {cart.length === 0 ? (
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Typography variant='h6' sx={{ mt: 2, color: 'text.secondary' }}>
            🛒 Your cart is empty.
          </Typography>
        </Box>
      ) : (
        <>
          {cart.map(item => {
            const product = item.product

            return (
              <Box
                key={item.cart_id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  boxShadow: 1,
                  bgcolor: 'background.default',
                  mb: 2
                }}
              >
                {product.image_url && <Image src={product.image_url} alt={product.name} width={50} height={50} />}
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 'bold' }}>{product.name}</Typography>
                  <Typography color='text.secondary'>${product.price.toFixed(2)}</Typography>
                </Box>

                <IconButton onClick={() => updateQuantity(item.cart_id, item.quantity - 1, product.price)} size='small'>
                  <Remove fontSize='small' />
                </IconButton>

                <TextField
                  value={item.quantity}
                  onChange={e => updateQuantity(item.cart_id, parseInt(e.target.value, 10) || 1, product.price)}
                  type='number'
                  sx={{ width: 60 }}
                  inputProps={{ min: 1 }}
                  size='small'
                />

                <IconButton onClick={() => updateQuantity(item.cart_id, item.quantity + 1, product.price)} size='small'>
                  <Add fontSize='small' />
                </IconButton>

                <IconButton onClick={() => setDeleteItemId(item.cart_id)} color='error'>
                  <Delete />
                </IconButton>
              </Box>
            )
          })}

          <Typography variant='h6' sx={{ mt: 2, fontWeight: 'bold', textAlign: 'right' }}>
            Total: ${totalPrice.toFixed(2)}
          </Typography>

          <Button
            variant='contained'
            color='primary'
            sx={{ mt: 2 }}
            fullWidth
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Checkout'}
          </Button>
        </>
      )}

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(null)}
        message={successMessage}
      />

      <ConfirmationDialog
        open={!!deleteItemId}
        onClose={() => setDeleteItemId(null)}
        title='Remove Item'
        description='Are you sure you want to remove this item from your cart?'
        confirmLabel='Remove'
        onConfirm={() => {
          if (deleteItemId) removeItem(deleteItemId)
          setDeleteItemId(null)
        }}
      />
    </Box>
  )
}
