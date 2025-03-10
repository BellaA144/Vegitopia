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

import type { ProductType } from '../types'

// Validation Schema
const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  type: yup.string().required('Type is required')
})

type ProductDialogType = {
  open: boolean
  mode: 'add' | 'edit'
  initialProduct: ProductType | null
  setOpen: (open: boolean) => void
  onAddProduct: (product: ProductType) => void
  onUpdateProduct: (product: ProductType) => void
}

const UpsertProduct = ({ open, mode, initialProduct, setOpen, onAddProduct, onUpdateProduct }: ProductDialogType) => {
  const handleClose = (event: object, reason: 'backdropClick' | 'escapeKeyDown' | 'closeClick' | string) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      return
    }

    setOpen(false)
  }

  const [isPending, startTransition] = useTransition()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ProductType>({
    resolver: yupResolver(schema),
    defaultValues: { name: '', description: '', type: '' }
  })

  useEffect(() => {
    if (initialProduct && mode === 'edit') {
      reset(initialProduct)
    } else if (mode === 'add') {
      reset({ name: '', description: '', type: '' })
    }
  }, [initialProduct, mode, reset])

  const onSubmit = (data: ProductType) => {
    startTransition(async () => {
      try {
        if (mode === 'add') {
          onAddProduct(data)
        } else if (initialProduct && initialProduct.id) {
          onUpdateProduct({ ...initialProduct, ...data })
        }

        reset()
        setOpen(false)
      } catch (error) {
        console.error(`Error ${mode === 'add' ? 'adding' : 'updating'} product:`, error)
        alert(`Failed to ${mode === 'add' ? 'add' : 'update'} product`)
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
      <DialogTitle id='form-dialog-title'>{mode === 'add' ? 'Add New Product' : 'Edit Product'}</DialogTitle>
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
                    placeholder='Product Name'
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
                    placeholder='Product Description'
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name='type'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Type'
                    placeholder='Product Type'
                    error={!!errors.type}
                    helperText={errors.type?.message}
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

export default UpsertProduct
