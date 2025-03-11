'use client'

import { useState, useTransition } from 'react'

import { Box, Skeleton } from '@mui/material'

import type { TransactionsType } from '../types'

import columns from '../columns'
import DataTableRowSelectionHistory from '@/components/DataTableRowSelectionHistory'
import { deleteAllTransactions } from '../actions'
import { showPromiseToast } from '@/utils/toastUtility'

type ProductsProps = {
  initialData: TransactionsType[]
}

export default function Transactions({ initialData }: ProductsProps) {
  const [transactions, setTransaction] = useState<TransactionsType[]>(initialData)
  const [isPending, startTransition] = useTransition()

  const handleDeleteAll = async () => {
    await showPromiseToast(
      async () => {
        const result = await deleteAllTransactions();
        if (!result) throw new Error("Failed to delete transactions");
        setTransaction([]);
      },
      {
        pending: "Deleting all transactions...",
        success: "All transactions deleted successfully!",
        error: "Failed to delete transactions",
      }
    );
  };


  return (
    <div>
      {isPending || !transactions ? (
        <Box>
          <Skeleton variant='rectangular' width='100%' height={50} />
          <Skeleton variant='rectangular' width='100%' height={50} sx={{ mt: 2 }} />
          <Skeleton variant='rectangular' width='100%' height={50} sx={{ mt: 2 }} />
        </Box>
      ) : (
        <DataTableRowSelectionHistory
          data={transactions}
          dynamicColumns={columns}
          tableName='Transaction History'
          onDeleteProduct={handleDeleteAll}
        />
      )}
    </div>
  )
}
