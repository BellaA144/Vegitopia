export function logger(context: string, data: any, type: 'info' | 'warn' | 'error' = 'info') {
  if (type === 'info') console.info(`[INFO] [${context}]`, data)
  else if (type === 'warn') console.warn(`[WARN] [${context}]`, data)
  else console.error(`[ERROR] [${context}]`, data)
}
