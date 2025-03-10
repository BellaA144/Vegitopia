'use client'

import { useState, useTransition } from 'react'

import { Box, Skeleton } from '@mui/material'

import type { PhoneType } from '../types'

import columns from '../columns'
import UpsertPhone from './UpsertPhone'
import DataTableRowSelection from '@/components/DataTableRowSelection'

import { addPhone, deletePhones, updatePhone } from '../actions'
import { showPromiseToast } from '@/utils/toastUtility'
import handleExportToCSV from '@/utils/exportToCSV'

type PhonesProps = {
  initialData: PhoneType[]
}

export default function Phones({ initialData }: PhonesProps) {
  const [phones, setPhones] = useState<PhoneType[]>(initialData)
  const [selectedRows, setSelectedRows] = useState<PhoneType[]>([])
  const [open, setOpen] = useState<boolean>(false)
  const [mode, setMode] = useState<'add' | 'edit'>('add')
  const [isPending, startTransition] = useTransition()

  const handleAddPhone = async (newPhone: PhoneType) => {
    startTransition(async () => {
      const addPromise = await showPromiseToast(() => addPhone(newPhone), {
        pending: 'Adding phone...',
        success: 'Phone added successfully!',
        error: 'Failed to add phone'
      })

      const added = addPromise

      if (added) {
        setPhones(prev => (prev ? [...prev, added] : [added]))
      }
    })
  }

  const handleDeletePhones = async (deletedPhones: PhoneType[]) => {
    startTransition(async () => {
      const deletePromise = await showPromiseToast(() => deletePhones(deletedPhones), {
        pending: 'Deleting phones...',
        success: 'Phones deleted successfully!',
        error: 'Failed to delete phones'
      })

      const deleted = deletePromise

      if (deleted) {
        setPhones(prev => prev.filter(phone => !deletedPhones.includes(phone)))
      }
    })
  }

  const handleUpdatePhone = async (updatedPhone: PhoneType) => {
    startTransition(async () => {
      const updatePromise = await showPromiseToast(() => updatePhone(updatedPhone), {
        pending: 'Updating phone...',
        success: 'Phone updated successfully!',
        error: 'Failed to update phone'
      })

      const savedPhone = await updatePromise

      if (savedPhone) {
        setPhones(prev => prev.map(p => (p.id === savedPhone.id ? savedPhone : p)))
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
      {isPending || !phones ? (
        <Box>
          <Skeleton variant='rectangular' width='100%' height={50} />
          <Skeleton variant='rectangular' width='100%' height={50} sx={{ mt: 2 }} />
          <Skeleton variant='rectangular' width='100%' height={50} sx={{ mt: 2 }} />
        </Box>
      ) : (
        <DataTableRowSelection
          data={phones}
          dynamicColumns={columns}
          tableName='Phones Table'
          setOpen={handleOpenAddModal}
          onSelectedRowsChange={setSelectedRows}
          onDeleteProduct={handleDeletePhones}
          onEditProduct={handleOpenEditModal}
          onExportToCSV={() => handleExportToCSV(phones, 'Phones')}
        />
      )}
      <UpsertPhone
        open={open}
        setOpen={setOpen}
        mode={mode}
        initialPhone={mode === 'edit' && selectedRows.length === 1 ? selectedRows[0] : null}
        onAddPhone={handleAddPhone}
        onUpdatePhone={handleUpdatePhone}
      />
    </div>
  )
}
