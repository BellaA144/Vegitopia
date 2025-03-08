export const caseInsensitiveSort = (rowA: any, rowB: any, columnId: string) => {
  const a = String(rowA.getValue(columnId) || '').toLowerCase()
  const b = String(rowB.getValue(columnId) || '').toLowerCase()

  return a < b ? -1 : a > b ? 1 : 0
}

export const numericSort = (rowA: any, rowB: any, columnId: string) => {
  const valueA = rowA.getValue(columnId)
  const valueB = rowB.getValue(columnId)

  return valueA - valueB
}
