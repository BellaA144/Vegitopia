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
  quantities: yup.object().required()
})

type ProductDialogType = {
  open: boolean
  setOpen: (open: boolean) => void
  onAddProduct: (quantities: { [key: string]: number }) => Promise<void>
  selectedRows: ProductType[]
}

const UpsertProduct = ({ open, setOpen, onAddProduct, selectedRows }: ProductDialogType) => {
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
  } = useForm<{ quantities: { [key: string]: number } }>({
    resolver: yupResolver(schema),
    defaultValues: { quantities: {} }
  })

  const onSubmit = (data: { quantities: { [key: string]: number } }) => {
    startTransition(async () => {
      try {
        await onAddProduct(data.quantities)
        reset()
        setOpen(false)
      } catch (error) {
        console.error('Error adding product:', error)
        alert('Failed to add product')
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
      <DialogTitle id='form-dialog-title'>Add Product to Cart</DialogTitle>
      <DialogContent>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            {selectedRows.map((product, index) => (
              <Grid key={product.id ?? `fallback-${index}`} component='div' sx={{ width: '100%' }}>
                <Controller
                  name={`quantities.${String(product.id ?? `fallback-${index}`)}`}
                  control={control}
                  defaultValue={1}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      type='number'
                      label={`Quantity for ${product.name ?? 'Unknown Product'}`}
                      placeholder='Product Quantity'
                      error={!!errors.quantities?.[String(product.id ?? `fallback-${index}`)]}
                      helperText={errors.quantities?.[String(product.id ?? `fallback-${index}`)]?.message}
                      onChange={e => {
                        const value = e.target.value
                        if (value === '') {
                          field.onChange(value)
                        } else {
                          const numericValue = Number(value)
                          field.onChange(numericValue < 1 ? 1 : numericValue)
                        }
                      }}
                    />
                  )}
                />
              </Grid>
            ))}
          </Grid>

          <DialogActions className='mt-4 p-0'>
            <Button variant='outlined' color='error' onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant='contained' type='submit' disabled={isPending} color='primary'>
              {isPending ? 'Adding...' : 'Add'}
            </Button>
          </DialogActions>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default UpsertProduct
