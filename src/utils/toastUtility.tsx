import { toast } from 'react-toastify'

export function showPromiseToast<T>(
  promiseFunction: () => Promise<T>,
  messages: { pending: string; success: string; error: string }
) {
  return toast.promise(promiseFunction(), {
    pending: messages.pending,
    success: messages.success,
    error: {
      render({ data }: any) {
        return `${messages.error}: ${data?.message || ''}`
      }
    }
  })
}
