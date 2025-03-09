'use client'

import { useEffect, useTransition } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid2'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { DialogActions, MenuItem } from '@mui/material'

import CustomTextField from '@core/components/mui/TextField'
import Form from '@components/Form'
import type { OrderType } from '../types'

const schema = yup.object().shape({
  customer_name: yup.string().required('Customer name is required'),
  total_price: yup.number().positive().required('Total price is required'),
  status: yup.mixed<'pending' | 'completed' | 'canceled'>().oneOf(['pending', 'completed', 'canceled']).required()
})

type OrderDialogProps = {
  open: boolean
  mode: 'add' | 'edit'
  initialOrder: OrderType | null
  setOpen: (open: boolean) => void
  onAddOrder: (order: OrderType) => void
  onUpdateOrder: (order: OrderType) => void
}

const UpsertOrder = ({ open, mode, initialOrder, setOpen, onAddOrder, onUpdateOrder }: OrderDialogProps) => {
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
  } = useForm<OrderType>({
    resolver: yupResolver(schema),
    defaultValues: { customer_name: '', total_price: 0, status: 'pending' }
  })

  useEffect(() => {
    if (initialOrder && mode === 'edit') {
      reset(initialOrder)
    } else if (mode === 'add') {
      reset({ customer_name: '', total_price: 0, status: 'pending' })
    }
  }, [initialOrder, mode, reset])

  const onSubmit = (data: OrderType) => {
    startTransition(async () => {
      try {
        if (mode === 'add') {
          onAddOrder(data)
        } else if (initialOrder && initialOrder.id) {
          onUpdateOrder({ ...initialOrder, ...data })
        }

        reset()
        setOpen(false)
      } catch (error) {
        console.error(`Error ${mode === 'add' ? 'adding' : 'updating'} order:`, error)
        alert(`Failed to ${mode === 'add' ? 'add' : 'update'} order`)
      }
    })
  }

  const handleCancel = () => {
    reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} disableEscapeKeyDown onClose={handleClose} aria-labelledby='form-dialog-title'>
      <DialogTitle id='form-dialog-title'>{mode === 'add' ? 'Add New Order' : 'Edit Order'}</DialogTitle>
      <DialogContent>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
              <Controller
                name='customer_name'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Customer Name'
                    placeholder='Enter customer name'
                    error={!!errors.customer_name}
                    helperText={errors.customer_name?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name='total_price'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    type='number'
                    fullWidth
                    label='Total Price'
                    placeholder='Enter total price'
                    error={!!errors.total_price}
                    helperText={errors.total_price?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name='status'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} select fullWidth label='Status' error={!!errors.status}>
                    <MenuItem value='pending'>Pending</MenuItem>
                    <MenuItem value='completed'>Completed</MenuItem>
                    <MenuItem value='canceled'>Canceled</MenuItem>
                  </CustomTextField>
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

export default UpsertOrder
