// src/@core/components/ConfirmationDialog.tsx
'use client'

// React Imports
import type { ReactNode } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

type ConfirmationDialogProps = {
  open: boolean
  onClose: () => void
  title?: string
  description?: string | ReactNode
  onConfirm?: () => void
  cancelLabel?: string
  confirmLabel?: string
}

export default function ConfirmationDialog({
  open,
  onClose,
  title = 'Are you sure?',
  description = 'Do you want to proceed?',
  onConfirm,
  cancelLabel = 'Cancel',
  confirmLabel = 'OK'
}: ConfirmationDialogProps) {
  const handleClose = (event: object, reason: string) => {
    if (reason !== 'backdropClick') {
      onClose()
    }
  }

  const handleConfirmClick = () => {
    onClose()
    onConfirm?.()
  }

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      closeAfterTransition={false}
      onClose={handleClose}
    >
      <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>{description}</DialogContentText>
      </DialogContent>
      <DialogActions className='dialog-actions-dense'>
        <Button variant='outlined' onClick={onClose}>
          {cancelLabel}
        </Button>
        <Button variant='contained' onClick={handleConfirmClick} color='error'>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
