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
  columnHelper.accessor('type', {
    cell: info => info.getValue(),
    header: 'Type',
    enableSorting: true,
    sortingFn: caseInsensitiveSort
  }),
  columnHelper.accessor('created_at', {
    cell: info => {
      const value = info.getValue()

      return value ? format(parseISO(value), 'yyyy-MM-dd HH:mm:ss') : '-'
    },
    header: 'Created At',
    enableSorting: true,
    sortingFn: 'datetime'
  })
]

export default columns
