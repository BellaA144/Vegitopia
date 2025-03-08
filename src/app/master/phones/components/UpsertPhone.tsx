'use client'

import { useEffect, useTransition } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid2'

// Custom Components
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { DialogActions } from '@mui/material'

import CustomTextField from '@core/components/mui/TextField'
import Form from '@components/Form'

import type { PhoneType } from '../types'

// Validation Schema
const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  brand: yup.string().required('Brand is required'),
  price: yup.number().required('Price is required').positive('Price must be positive')
})

type PhoneDialogType = {
  open: boolean
  mode: 'add' | 'edit'
  initialPhone: PhoneType | null
  setOpen: (open: boolean) => void
  onAddPhone: (phone: PhoneType) => void
  onUpdatePhone: (phone: PhoneType) => void
}

const UpsertPhone = ({ open, mode, initialPhone, setOpen, onAddPhone, onUpdatePhone }: PhoneDialogType) => {
  const handleClose = (event: object, reason: string) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') return
    setOpen(false)
  }

  const [isPending, startTransition] = useTransition()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<PhoneType>({
    resolver: yupResolver(schema),
    defaultValues: { name: '', description: '', brand: '', price: 0 }
  })

  useEffect(() => {
    if (initialPhone && mode === 'edit') {
      reset(initialPhone)
    } else if (mode === 'add') {
      reset({ name: '', description: '', brand: '', price: 0 })
    }
  }, [initialPhone, mode, reset])

  const onSubmit = (data: PhoneType) => {
    startTransition(async () => {
      try {
        if (mode === 'add') {
          onAddPhone(data)
        } else if (initialPhone?.id) {
          onUpdatePhone({ ...initialPhone, ...data })
        }

        reset()
        setOpen(false)
      } catch (error) {
        console.error(`Error ${mode === 'add' ? 'adding' : 'updating'} phone:`, error)
        alert(`Failed to ${mode === 'add' ? 'add' : 'update'} phone`)
      }
    })
  }

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
      <DialogTitle id='form-dialog-title'>{mode === 'add' ? 'Add New Phone' : 'Edit Phone'}</DialogTitle>
      <DialogContent>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Name'
                    placeholder='Phone Name'
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name='description'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Description'
                    placeholder='Phone Description'
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name='brand'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Brand'
                    placeholder='Brand Name'
                    error={!!errors.brand}
                    helperText={errors.brand?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name='price'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type='number'
                    label='Price'
                    placeholder='Phone Price'
                    error={!!errors.price}
                    helperText={errors.price?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
          <DialogActions className='mt-4 p-0'>
            <Button variant='outlined' color='error' onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant='contained' type='submit' disabled={isPending} color={mode === 'add' ? 'primary' : 'info'}>
              {isPending ? (mode === 'add' ? 'Adding...' : 'Updating...') : mode === 'add' ? 'Add' : 'Update'}
            </Button>
          </DialogActions>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default UpsertPhone
