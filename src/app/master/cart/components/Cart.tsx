'use client'

import { useState, useEffect, useTransition } from 'react'

import Image from 'next/image'

import { Box, Typography, Button, IconButton, CircularProgress, TextField, Snackbar } from '@mui/material'

import { Add, Remove, Delete } from '@mui/icons-material'

import { createClient } from '@/utils/supabase/client'

import ConfirmationDialog from '@/components/ConfirmationDialog'

interface CartItem {
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

interface CartProps {
  initialData: CartItem[]
}

export default function Cart({ initialData }: CartProps) {
  const [cart, setCart] = useState<CartItem[]>(initialData)
  const [isPending, startTransition] = useTransition()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null)

  // Fetch cart data (fallback jika initialData kosong)
  useEffect(() => {
    if (initialData.length === 0) {
      async function fetchCart() {
        const supabase = createClient()

        const { data, error } = await supabase
          .from('cart')
          .select('cart_id, product_id, user_id, quantity, total_price, product:products(name, price, image_url)')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching cart:', error)
        } else {
          const formattedData = data.map(item => ({
            ...item,
            product: Array.isArray(item.product) ? item.product[0] : item.product
          }))

          setCart(formattedData)
        }
      }

      fetchCart()
    }
  }, [initialData])

  // Update quantity di database
  async function updateQuantity(cart_id: string, newQuantity: number, product_price: number) {
    if (newQuantity < 1) return

    startTransition(async () => {
      const supabase = createClient()

      const { error } = await supabase
        .from('cart')
        .update({ quantity: newQuantity, total_price: newQuantity * product_price })
        .eq('cart_id', cart_id)

      if (!error) {
        setCart(prevCart =>
          prevCart.map(item =>
            item.cart_id === cart_id
              ? { ...item, quantity: newQuantity, total_price: newQuantity * product_price }
              : item
          )
        )
        setSuccessMessage('Cart updated successfully!')
      }
    })
  }

  // Hapus item dari cart (setelah konfirmasi)
  async function removeItem(cart_id: string) {
    startTransition(async () => {
      const supabase = createClient()
      const { error } = await supabase.from('cart').delete().eq('cart_id', cart_id)

      if (!error) {
        setCart(prevCart => prevCart.filter(item => item.cart_id !== cart_id))
        setSuccessMessage('Item removed successfully!')
      }
    })
  }

  // Total harga semua item
  const totalPrice = cart.reduce((sum, item) => sum + item.total_price, 0)

  // return <div>Helloe</div>

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>🛒 Your Cart</Typography>

      {isPending && <CircularProgress />}

      {cart.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <>
          {cart.map((item) => (
            <Box key={item.cart_id} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              {item.product.image_url && (
                <Image src={item.product.image_url} alt={item.product.name} width={50} height={50} />
              )}
              <Box sx={{ flex: 1, ml: 2 }}>
                <Typography>{item.product.name}</Typography>
                <Typography>${item.product.price.toFixed(2)}</Typography>
              </Box>

              <IconButton onClick={() => updateQuantity(item.cart_id, item.quantity - 1, item.product.price)}>
                <Remove />
              </IconButton>

              {/* Input untuk ubah quantity langsung */}
              <TextField
                value={item.quantity}
                onChange={(e) => {
                  const newQty = parseInt(e.target.value, 10) || 1;

                  updateQuantity(item.cart_id, newQty, item.product.price);
                }}
                type="number"
                sx={{ width: 50, mx: 1 }}
                inputProps={{ min: 1 }}
              />

              <IconButton onClick={() => updateQuantity(item.cart_id, item.quantity + 1, item.product.price)}>
                <Add />
              </IconButton>

              <IconButton onClick={() => setDeleteItemId(item.cart_id)} color="error">
                <Delete />
              </IconButton>
            </Box>
          ))}

          {/* Total Harga Semua Item */}
          <Typography variant="h6" sx={{ mt: 2 }}>
            Total: ${totalPrice.toFixed(2)}
          </Typography>

          {/* Tombol Checkout */}
          <Button variant="contained" sx={{ mt: 2 }} fullWidth>
            Checkout
          </Button>
        </>
      )}

      {/* Notifikasi Sukses */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(null)}
        message={successMessage}
      />

      {/* Dialog Konfirmasi Hapus */}
      <ConfirmationDialog
        open={!!deleteItemId}
        onClose={() => setDeleteItemId(null)}
        title="Remove Item"
        description="Are you sure you want to remove this item from your cart?"
        confirmLabel="Remove"
        onConfirm={() => {
          if (deleteItemId) removeItem(deleteItemId);
          setDeleteItemId(null);
        }}
      />
    </Box>
  );
}
