'use client'

import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Button, Card, CardHeader } from '@mui/material'

import styles from '@core/styles/table.module.css'

type DataTableType<T> = {
  data: T[]
  tableName: string
  columns: any
  setOpen: (open: boolean) => void
}

const DataTable = <T,>({ data, tableName, columns, setOpen }: DataTableType<T>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    filterFns: { fuzzy: () => false }
  })

  return (
    <Card>
      <CardHeader
        title={tableName}
        className='gap-2 flex-col items-start sm:flex-row sm:items-center'
        sx={{ '& .MuiCardHeader-action': { m: 0 } }}
        action={
          <Button variant='tonal' onClick={() => setOpen(true)}>
            Add New
          </Button>
        }
      />
      <div className='overflow-x-auto'>
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table
              .getRowModel()
              .rows.slice(0, 10) // example limit
              .map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default DataTable
