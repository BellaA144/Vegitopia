import { toast } from "react-toastify";

export function showPromiseToast<T>(
  promiseFunction: () => Promise<T>,
  messages: { pending: string; success: string; error: string }
) {
  return toast.promise(promiseFunction(), {
    pending: {
      render: () => <span>{messages.pending}</span>,
      style: { color: "gray" },
    },
    success: {
      render: () => <span>{messages.success}</span>,
      style: { color: "green" },
    },
    error: {
      render({ data }: any) {
        return <span>{messages.error}: {data?.message || ""}</span>;
      },
      style: { color: "red" },
    },
  });
}
