'use client'

import { useState, useTransition } from 'react'

import { Box, Skeleton } from '@mui/material'

import type { ProductType } from '../types'

import columns from '../columns'
import UpsertProduct from './UpsertProduct'
import DataTableRowSelection from '@/components/DataTableRowSelection'

import { addProduct, deleteProducts, updateProduct } from '../actions'
import { showPromiseToast } from '@/utils/toastUtility'
import handleExportToCSV from '@/utils/exportToCSV'

type ProductsProps = {
  initialData: ProductType[]
}

export default function Products({ initialData }: ProductsProps) {
  const [products, setProducts] = useState<ProductType[]>(initialData)
  const [selectedRows, setSelectedRows] = useState<ProductType[]>([])
  const [open, setOpen] = useState<boolean>(false)
  const [mode, setMode] = useState<'add' | 'edit'>('add')
  const [isPending, startTransition] = useTransition()

  const handleAddProduct = async (newProduct: ProductType) => {
    startTransition(async () => {
      const addPromise = await showPromiseToast(() => addProduct(newProduct), {
        pending: 'Adding product...',
        success: 'Product added successfully!',
        error: 'Failed to add product'
      })

      const added = addPromise

      if (added) {
        setProducts(prev => (prev ? [...prev, added] : [added]))
      }
    })
  }

  const handleDeleteProducts = async (deletedProducts: ProductType[]) => {
    startTransition(async () => {
      const deletePromise = await showPromiseToast(() => deleteProducts(deletedProducts), {
        pending: 'Deleting products...',
        success: 'Products deleted successfully!',
        error: 'Failed to delete products'
      })

      const deleted = deletePromise

      if (deleted) {
        setProducts(prev => prev.filter(product => !deletedProducts.includes(product)))
      }
    })
  }

  const handleUpdateProduct = async (updatedProduct: ProductType) => {
    startTransition(async () => {
      const updatePromise = await showPromiseToast(() => updateProduct(updatedProduct), {
        pending: 'Updating product...',
        success: 'Product updated successfully!',
        error: 'Failed to update product'
      })

      const savedProduct = await updatePromise

      if (savedProduct) {
        setProducts(prev => prev.map(p => (p.id === savedProduct.id ? savedProduct : p)))
      }
    })
  }

  const handleOpenAddModal = () => {
    setMode('add')
    setOpen(true)
  }

  const handleOpenEditModal = () => {
    setMode('edit')
    setOpen(true)
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
          tableName='Products Table'
          setOpen={handleOpenAddModal}
          onSelectedRowsChange={setSelectedRows}
          onDeleteProduct={handleDeleteProducts}
          onEditProduct={handleOpenEditModal}
          onExportToCSV={() => handleExportToCSV(products, 'Products')}
        />
      )}
      <UpsertProduct
        open={open}
        setOpen={setOpen}
        mode={mode}
        initialProduct={mode === 'edit' && selectedRows.length === 1 ? selectedRows[0] : null}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
      />
    </div>
  )
}
