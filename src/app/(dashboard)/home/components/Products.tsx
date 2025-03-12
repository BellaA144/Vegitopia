'use client'

import { useEffect, useState, useTransition } from 'react'

import { Box, Skeleton } from '@mui/material'

import type { ProductType } from '../types'
import { CartType } from '@/app/master/carts/types'

import columns from '../columns'
import UpsertProduct from './UpsertProduct'
import DataTableRowSelection from '@/components/DataTableRowSelection'

import { showPromiseToast } from '@/utils/toastUtility'
import { addToCart, getProducts } from '../actions'

type ProductsProps = {
  initialData: ProductType[]
}

export default function Products({ initialData }: ProductsProps) {
  const [products, setProducts] = useState<ProductType[]>(initialData)
  const [selectedRows, setSelectedRows] = useState<ProductType[]>([])
  const [open, setOpen] = useState<boolean>(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    async function fetchProducts() {
      const updatedProducts = await getProducts()
      console.log("Fetched products:", updatedProducts)
      setProducts(updatedProducts)
    }

    fetchProducts()
  }, [])

  const handleAddToCart = async (quantities: { [key: string]: number }) => {
    if (selectedRows.length === 0) return

    const cartItems: CartType[] = selectedRows.map(product => ({
      product_id: product.id!,
      name: product.name,
      description: product.description,
      quantity: quantities[product.id!] || 1,
      stock: product.stock,
      total_price: 0
    }))

    console.log("Cart items:", cartItems)

    startTransition(async () => {
      const addPromises = cartItems.map(async cartItem => {
        try {
          await showPromiseToast(() => addToCart(cartItem), {
            pending: 'Adding to cart...',
            success: 'Product added to cart successfully!',
            error: 'Error'
          })
        } catch (error: any) {
          console.log('Error adding to cart:', error)
        }
      })

      // Fetch updated products list setelah dimasukkan ke cart
      const updatedProducts = await getProducts()
      setProducts(updatedProducts)

      await Promise.all(addPromises)
      setOpen(false)
    })
  }

  return (
    <div>
      {isPending || !products ? (
        <Box>
          <Skeleton variant='rectangular' width='100%' height={50} />
          <Skeleton variant='rectangular' width='100%' height={50} sx={{ mt: 2 }} />
          <Skeleton variant='rectangular' width='100%' height={50} sx={{ mt: 2 }} />
        </Box>
      ) : (
        <DataTableRowSelection
          data={products}
          dynamicColumns={columns}
          tableName='Vegitopia Catalog'
          setOpen={() => setOpen(true)}
          onSelectedRowsChange={setSelectedRows}
        />
      )}
      <UpsertProduct open={open} setOpen={setOpen} onAddProduct={handleAddToCart} selectedRows={selectedRows} />
    </div>
  )
}
