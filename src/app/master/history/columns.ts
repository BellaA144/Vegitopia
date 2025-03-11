import { createColumnHelper } from '@tanstack/react-table'
import { format, parseISO } from 'date-fns'

import type { TransactionsType } from './types'
import { caseInsensitiveSort } from '@/utils/sorting'

const columnHelper = createColumnHelper<TransactionsType>()

const columns = [
  columnHelper.accessor('transaction_id', {
    cell: info => info.getValue(),
    header: 'Transaction ID',
    enableSorting: true,
    sortingFn: caseInsensitiveSort
  }),
  columnHelper.accessor('product_id.name', {
    cell: info => info.getValue(),
    header: 'Product Name',
    enableSorting: true,
    sortingFn: caseInsensitiveSort
  }),
  columnHelper.accessor('product_id.description', {
    cell: info => info.getValue(),
    header: 'Product Description',
    enableSorting: true,
    sortingFn: caseInsensitiveSort
  }),
  columnHelper.accessor('quantity', {
    cell: info => info.getValue(),
    header: 'Quantity',
    enableSorting: true,
    sortingFn: caseInsensitiveSort
  }),
  columnHelper.accessor('total_price', {
    cell: info => info.getValue(),
    header: 'Price',
    enableSorting: true,
    sortingFn: caseInsensitiveSort
  }),
  columnHelper.accessor('transaction_date', {
    cell: info => {
      const value = info.getValue()

      return value ? format(parseISO(value), 'yyyy-MM-dd HH:mm:ss') : '-'
    },
    header: 'Transaction Date',
    enableSorting: true,
    sortingFn: 'datetime'
  })
]

export default columns
