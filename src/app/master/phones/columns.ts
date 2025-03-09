import { createColumnHelper } from '@tanstack/react-table'
import { parseISO, format } from 'date-fns'

import { caseInsensitiveSort, numericSort } from '@/utils/sorting'

import type { PhoneType } from './types'

const columnHelper = createColumnHelper<PhoneType>()

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: info => info.getValue(),
    enableSorting: true,
    sortingFn: caseInsensitiveSort
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    cell: info => info.getValue(),
    enableSorting: true,
    sortingFn: caseInsensitiveSort
  }),
  columnHelper.accessor('brand', {
    header: 'Brand',
    cell: info => info.getValue(),
    enableSorting: true,
    sortingFn: caseInsensitiveSort
  }),
  columnHelper.accessor('price', {
    header: 'Price',
    cell: info => `$${info.getValue().toFixed(2)}`,
    enableSorting: true,
    sortingFn: numericSort
  }),
  columnHelper.accessor('created_at', {
    header: 'Created At',
    cell: info => (info.getValue() ? format(parseISO(info.getValue()!), 'yyyy-MM-dd HH:mm:ss') : '-'),
    enableSorting: true,
    sortingFn: 'datetime'
  })
]

export default columns
