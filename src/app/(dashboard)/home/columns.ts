import { createColumnHelper } from '@tanstack/react-table'
import { format, parseISO } from 'date-fns'

import type { ProductType } from './types'
import { caseInsensitiveSort } from '@/utils/sorting'

const columnHelper = createColumnHelper<ProductType>()

const columns = [
  columnHelper.accessor('name', {
    cell: info => info.getValue(),
    header: 'Name',
    enableSorting: true,
    sortingFn: caseInsensitiveSort
  }),
  columnHelper.accessor('description', {
    cell: info => info.getValue(),
    header: 'Description',
    enableSorting: true,
    sortingFn: caseInsensitiveSort
  }),
  columnHelper.accessor('price', {
    cell: info => info.getValue(),
    header: 'Price',
    enableSorting: true,
    sortingFn: caseInsensitiveSort
  }),
  columnHelper.accessor('stock', {
    cell: info => info.getValue(),
    header: 'Stock',
    enableSorting: true,
    sortingFn: caseInsensitiveSort
  }),
  columnHelper.accessor('type', {
    cell: info => info.getValue(),
    header: 'Type',
    enableSorting: true,
    sortingFn: caseInsensitiveSort
  })
]

export default columns
