'use client'

import { useMemo, useState, useEffect } from 'react'

import type { TextFieldProps } from '@mui/material'
import { Button, Card, CardHeader, Checkbox, MenuItem } from '@mui/material'
import TablePagination from '@mui/material/TablePagination'

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, Cell, SortingState } from '@tanstack/react-table'

import TablePaginationComponent from '@components/TablePaginationComponent'
import ConfirmationDialog from './ConfirmationDialog'

import styles from '@core/styles/table.module.css'
import CustomTextField from '@/@core/components/mui/TextField'

interface DebouncedInputProps extends Omit<TextFieldProps, 'onChange'> {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
}

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }: DebouncedInputProps) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, debounce, onChange])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

function globalContainsFilter<T extends Record<string, any>>(
  row: { original: T },
  columnId: string,
  filterValue: string
): boolean {
  if (!filterValue) return true

  const searchableValue = Object.values(row.original)
    .filter(val => val != null)
    .join(' ')
    .toLowerCase()

  return searchableValue.includes(filterValue.toLowerCase())
}

interface DataTableRowSelectionProps<T> {
  data: T[]
  tableName: string
  dynamicColumns: ColumnDef<T, any>[]
  onSelectedRowsChange?: (rows: T[]) => void
  setOpen: (open: boolean) => void
  onDeleteProduct?: (rows: T[]) => Promise<void>
  onEditProduct?: (row: T) => void
  onExportToCSV?: (rows: T[], filename: string) => void
}

export default function DataTableRowSelection<T extends { id?: string | undefined | null }>({
  data,
  tableName,
  dynamicColumns,
  onSelectedRowsChange,
  onDeleteProduct,
  setOpen,
  onEditProduct,
  onExportToCSV
}: DataTableRowSelectionProps<T>) {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [sorting, setSorting] = useState<SortingState>([])

  const selectedCount = Object.keys(rowSelection).length

  const sortableDynamicColumns = useMemo(
    () =>
      dynamicColumns.map(column => ({
        ...column,
        enableSorting: true
      })),
    [dynamicColumns]
  )

  const rowSelectColumn = useMemo<ColumnDef<T>>(
    () => ({
      id: 'select',
      enableSorting: false,
      header: ({ table }) => (
        <div className='flex items-center'>
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className='flex items-center'>
          <Checkbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        </div>
      )
    }),
    []
  )

  const modifiedColumns = useMemo<ColumnDef<T>[]>(
    () => [rowSelectColumn, ...sortableDynamicColumns],
    [rowSelectColumn, sortableDynamicColumns]
  )

  const table = useReactTable({
    data,
    columns: modifiedColumns,
    getRowId: row => String(row.id),
    state: {
      rowSelection,
      sorting,
      globalFilter: searchTerm
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: globalContainsFilter
  })

  useEffect(() => {
    const selectedData = table.getSelectedRowModel().flatRows.map(row => row.original)

    onSelectedRowsChange?.(selectedData)
  }, [rowSelection, table, onSelectedRowsChange])

  const currentPageRows = table.getRowModel().rows
  const filteredCount = table.getFilteredRowModel().rows.length

  const handleClickDelete = () => setDeleteDialogOpen(true)
  const handleCancelDelete = () => setDeleteDialogOpen(false)

  const handleConfirmDelete = async () => {
    setDeleteDialogOpen(false)
    if (!onDeleteProduct) return
    const selectedData = table.getSelectedRowModel().flatRows.map(row => row.original)

    await onDeleteProduct(selectedData)
  }

  const handleEdit = () => {
    if (!onEditProduct) return
    const selectedData = table.getSelectedRowModel().flatRows.map(row => row.original)

    if (selectedData.length === 1) {
      onEditProduct(selectedData[0])
    }
  }

  const handleExportToCSV = () => {
    if (!onExportToCSV) return

    onExportToCSV(data, tableName)
  }

  return (
    <Card>
      <CardHeader title={tableName} />
      {/* Controls Section */}
      <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
        <CustomTextField
          select
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value))
            table.setPageIndex(0)
          }}
          className='max-sm:is-full sm:is-[70px]'
        >
          {[5, 10, 15].map(pageSize => (
            <MenuItem key={pageSize} value={pageSize}>
              {pageSize}
            </MenuItem>
          ))}
        </CustomTextField>
        <div className='flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4'>
          {/* Show if 0 selected */}
          {selectedCount === 0 && (
            <DebouncedInput
              value={searchTerm}
              className='max-sm:is-full min-is-[250px]'
              onChange={value => setSearchTerm(String(value))}
              placeholder='Type to search data...'
            />
          )}

          {selectedCount === 0 && (
            <Button variant='tonal' color='secondary' onClick={handleExportToCSV}>
              Export to CSV
            </Button>
          )}

          {selectedCount === 0 && (
            <Button variant='tonal' onClick={() => setOpen(true)}>
              Add New
            </Button>
          )}

          {selectedCount === 1 && (
            <Button variant='tonal' color='info' onClick={handleEdit}>
              Edit Data
            </Button>
          )}

          {selectedCount > 0 && (
            <Button variant='tonal' color='error' onClick={handleClickDelete}>
              Delete Data
            </Button>
          )}
        </div>
      </div>
      {/* Table */}
      <div className='overflow-x-auto'>
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                  >
                    <div className='flex items-center gap-2'>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: <i className='tabler-chevron-up text-xl' />,
                        desc: <i className='tabler-chevron-down text-xl' />
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {currentPageRows.length === 0 ? (
              <tr>
                <td colSpan={modifiedColumns.length} className='text-center'>
                  No data found
                </td>
              </tr>
            ) : (
              currentPageRows.map(row => (
                <tr key={row.id} className={row.getIsSelected() ? 'selected' : ''}>
                  {row.getVisibleCells().map((cell: Cell<T, unknown>) => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TablePagination
        component={() => <TablePaginationComponent<T> table={table} />}
        count={filteredCount}
        page={table.getState().pagination.pageIndex}
        rowsPerPage={table.getState().pagination.pageSize}
        onPageChange={(_, newPage) => table.setPageIndex(newPage)}
        onRowsPerPageChange={e => {
          table.setPageSize(Number(e.target.value))
          table.setPageIndex(0)
        }}
      />
      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        title='Delete Confirmation'
        description='Are you sure you want to delete the selected rows?'
        confirmLabel='Delete'
        onConfirm={handleConfirmDelete}
      />
    </Card>
  )
}
