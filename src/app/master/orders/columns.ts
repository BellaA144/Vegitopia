import { createColumnHelper } from '@tanstack/react-table'
import { parseISO, format } from 'date-fns'

import { caseInsensitiveSort, numericSort } from '@/utils/sorting'

import type { OrderType } from './types'

const columnHelper = createColumnHelper<OrderType>()

const columns = [
  columnHelper.accessor('customer_name', {
    header: 'Customer Name',
    enableSorting: true,
    sortingFn: caseInsensitiveSort,
    cell: info => info.getValue()
  }),
  columnHelper.accessor('total_price', {
    header: 'Total Price',
    enableSorting: true,
    sortingFn: numericSort,
    cell: info => info.getValue()
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    enableSorting: true,
    sortingFn: caseInsensitiveSort,
    cell: info => info.getValue()
  }),
  columnHelper.accessor('created_at', {
    header: 'Created At',
    enableSorting: true,
    sortingFn: 'datetime',
    cell: info => {
      const date = info.getValue()

      return date ? format(parseISO(date), 'yyyy-MM-dd HH:mm:ss') : '-'
    }
  })
]

export default columns
