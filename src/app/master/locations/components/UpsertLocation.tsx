'use client'

import { useEffect, useTransition } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid2'
import { DialogActions } from '@mui/material'

import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import CustomTextField from '@core/components/mui/TextField'
import Form from '@components/Form'

import type { LocationType } from '../types'

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zipCode: yup.string().matches(/^\d{5}$/, 'Must be a valid zip code')
})

type LocationDialogType = {
  open: boolean
  mode: 'add' | 'edit'
  initialLocation: LocationType | null
  setOpen: (open: boolean) => void
  onAddLocation: (location: LocationType) => void
  onUpdateLocation: (location: LocationType) => void
}

const UpsertLocation = ({
  open,
  mode,
  initialLocation,
  setOpen,
  onAddLocation,
  onUpdateLocation
}: LocationDialogType) => {
  const [isPending, startTransition] = useTransition()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<LocationType>({
    resolver: yupResolver(schema),
    defaultValues: { name: '', address: '', city: '', state: '', zipCode: '' }
  })

  useEffect(() => {
    if (initialLocation && mode === 'edit') {
      reset(initialLocation)
    } else {
      reset({ name: '', address: '', city: '', state: '', zipCode: '' })
    }
  }, [initialLocation, mode, reset])

  const onSubmit = (data: LocationType) => {
    startTransition(async () => {
      try {
        if (mode === 'add') {
          onAddLocation(data)
        } else if (initialLocation?.id) {
          onUpdateLocation({ ...initialLocation, ...data })
        }

        reset()
        setOpen(false)
      } catch (error) {
        console.error(`Error ${mode === 'add' ? 'adding' : 'updating'} location:`, error)
        alert(`Failed to ${mode === 'add' ? 'add' : 'update'} location`)
      }
    })
  }

  // ✅ **handleClose prevents closing on backdrop click or Escape key**
  const handleClose = (event: object, reason: 'backdropClick' | 'escapeKeyDown' | 'closeClick' | string) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') return
    handleCancel() // Calls handleCancel to ensure form resets
  }

  // ✅ **handleCancel resets the form & closes modal manually**
  const handleCancel = () => {
    reset()
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      closeAfterTransition={false}
      onClose={handleClose}
      aria-labelledby='form-dialog-title'
    >
      <DialogTitle id='form-dialog-title'>{mode === 'add' ? 'Add New Location' : 'Edit Location'}</DialogTitle>
      <DialogContent>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <Grid xs={12}>
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Name'
                    placeholder='Location Name'
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            <Grid xs={12}>
              <Controller
                name='address'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Address'
                    placeholder='Location Address'
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Grid>

            <Grid xs={12}>
              <Controller
                name='city'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='City'
                    placeholder='City'
                    error={!!errors.city}
                    helperText={errors.city?.message}
                  />
                )}
              />
            </Grid>

            <Grid xs={12}>
              <Controller
                name='state'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='State'
                    placeholder='State'
                    error={!!errors.state}
                    helperText={errors.state?.message}
                  />
                )}
              />
            </Grid>

            <Grid xs={12}>
              <Controller
                name='zipCode'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Zip Code'
                    placeholder='Zip Code'
                    error={!!errors.zipCode}
                    helperText={errors.zipCode?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
          <DialogActions>
            <Button variant='outlined' color='error' onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant='contained' type='submit' disabled={isPending}>
              {isPending ? 'Saving...' : mode === 'add' ? 'Add' : 'Update'}
            </Button>
          </DialogActions>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default UpsertLocation
