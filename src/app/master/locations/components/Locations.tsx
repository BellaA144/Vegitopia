'use client'

import { useState, useTransition } from 'react'

import { Box, Skeleton } from '@mui/material'

import type { LocationType } from '../types'

import columns from '../columns'
import UpsertLocation from './UpsertLocation'
import DataTableRowSelection from '@/components/DataTableRowSelection'

import { addLocation, deleteLocations, updateLocation } from '../actions'
import { showPromiseToast } from '@/utils/toastUtility'
import handleExportToCSV from '@/utils/exportToCSV'

type LocationsProps = {
  initialData: LocationType[]
}

export default function Locations({ initialData }: LocationsProps) {
  const [locations, setLocations] = useState<LocationType[]>(initialData)
  const [selectedRows, setSelectedRows] = useState<LocationType[]>([])
  const [open, setOpen] = useState<boolean>(false)
  const [mode, setMode] = useState<'add' | 'edit'>('add')
  const [isPending, startTransition] = useTransition()

  const handleAddLocation = async (newLocation: LocationType) => {
    startTransition(async () => {
      const addPromise = await showPromiseToast(() => addLocation(newLocation), {
        pending: 'Adding location...',
        success: 'Location added successfully!',
        error: 'Failed to add location'
      })

      const added = addPromise

      if (added) {
        setLocations(prev => (prev ? [...prev, added] : [added]))
      }
    })
  }

  const handleDeleteLocations = async (deletedLocations: LocationType[]) => {
    startTransition(async () => {
      const deletePromise = await showPromiseToast(() => deleteLocations(deletedLocations), {
        pending: 'Deleting locations...',
        success: 'Locations deleted successfully!',
        error: 'Failed to delete locations'
      })

      if (deletePromise) {
        setLocations(prev => prev.filter(location => !deletedLocations.includes(location)))
      }
    })
  }

  const handleUpdateLocation = async (updatedLocation: LocationType) => {
    startTransition(async () => {
      const updatePromise = await showPromiseToast(() => updateLocation(updatedLocation), {
        pending: 'Updating location...',
        success: 'Location updated successfully!',
        error: 'Failed to update location'
      })

      const savedLocation = await updatePromise

      if (savedLocation) {
        setLocations(prev => prev.map(l => (l.id === savedLocation.id ? savedLocation : l)))
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
      {isPending || !locations ? (
        <Box>
          <Skeleton variant='rectangular' width='100%' height={50} />
          <Skeleton variant='rectangular' width='100%' height={50} sx={{ mt: 2 }} />
          <Skeleton variant='rectangular' width='100%' height={50} sx={{ mt: 2 }} />
        </Box>
      ) : (
        <DataTableRowSelection
          data={locations}
          dynamicColumns={columns}
          tableName='Locations Table'
          setOpen={handleOpenAddModal}
          onSelectedRowsChange={setSelectedRows}
          onDeleteProduct={handleDeleteLocations}
          onEditProduct={handleOpenEditModal}
          onExportToCSV={() => handleExportToCSV(locations, 'Locations')}
        />
      )}
      <UpsertLocation
        open={open}
        setOpen={setOpen}
        mode={mode}
        initialLocation={mode === 'edit' && selectedRows.length === 1 ? selectedRows[0] : null}
        onAddLocation={handleAddLocation}
        onUpdateLocation={handleUpdateLocation}
      />
    </div>
  )
}
