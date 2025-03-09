import { saveAs } from 'file-saver'

import Papa from 'papaparse'

export default function handleExportToCSV<T>(data: T[], filename: string) {
  const csv = Papa.unparse(data)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })

  saveAs(blob, `${filename}.csv`)
}
