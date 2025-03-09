'use client'

import { useState, useTransition } from 'react'

import { Box, Skeleton } from '@mui/material'

import type { OrderType } from '../types'

import columns from '../columns'
import UpsertOrder from './UpsertOrder'
import DataTableRowSelection from '@/components/DataTableRowSelection'

import { addOrder, deleteOrders, updateOrder } from '../actions'
import { showPromiseToast } from '@/utils/toastUtility'
import handleExportToCSV from '@/utils/exportToCSV'

type OrdersProps = {
  initialData: OrderType[]
}

export default function Orders({ initialData }: OrdersProps) {
  const [orders, setOrders] = useState<OrderType[]>(initialData)
  const [selectedRows, setSelectedRows] = useState<OrderType[]>([])
  const [open, setOpen] = useState<boolean>(false)
  const [mode, setMode] = useState<'add' | 'edit'>('add')
  const [isPending, startTransition] = useTransition()

  const handleAddOrder = async (newOrder: OrderType) => {
    startTransition(async () => {
      const addPromise = await showPromiseToast(() => addOrder(newOrder), {
        pending: 'Adding order...',
        success: 'Order added successfully!',
        error: 'Failed to add order'
      })

      if (addPromise) {
        setOrders(prev => [...prev, addPromise])
      }
    })
  }

  const handleDeleteOrders = async (deletedOrders: OrderType[]) => {
    startTransition(async () => {
      const deletePromise = await showPromiseToast(() => deleteOrders(deletedOrders), {
        pending: 'Deleting orders...',
        success: 'Orders deleted successfully!',
        error: 'Failed to delete orders'
      })

      if (deletePromise) {
        setOrders(prev => prev.filter(order => !deletedOrders.includes(order)))
      }
    })
  }

  const handleUpdateOrder = async (updatedOrder: OrderType) => {
    startTransition(async () => {
      const updatePromise = await showPromiseToast(() => updateOrder(updatedOrder), {
        pending: 'Updating order...',
        success: 'Order updated successfully!',
        error: 'Failed to update order'
      })

      if (updatePromise) {
        setOrders(prev => prev.map(order => (order.id === updatePromise.id ? updatePromise : order)))
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
      {isPending || !orders ? (
        <Box>
          <Skeleton variant='rectangular' width='100%' height={50} />
          <Skeleton variant='rectangular' width='100%' height={50} sx={{ mt: 2 }} />
          <Skeleton variant='rectangular' width='100%' height={50} sx={{ mt: 2 }} />
        </Box>
      ) : (
        <DataTableRowSelection
          data={orders}
          dynamicColumns={columns}
          tableName='Orders Table'
          setOpen={handleOpenAddModal}
          onSelectedRowsChange={setSelectedRows}
          onDeleteProduct={handleDeleteOrders}
          onEditProduct={handleOpenEditModal}
          onExportToCSV={() => handleExportToCSV(orders, 'Orders')}
        />
      )}
      <UpsertOrder
        open={open}
        setOpen={setOpen}
        mode={mode}
        initialOrder={mode === 'edit' && selectedRows.length === 1 ? selectedRows[0] : null}
        onAddOrder={handleAddOrder}
        onUpdateOrder={handleUpdateOrder}
      />
    </div>
  )
}
