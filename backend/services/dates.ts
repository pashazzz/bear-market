export const compareDates = (d1: Date | string | null | undefined, d2: Date | string | null | undefined): boolean => {
  if (d1 === d2) {
    return true
  }
  if (d1 === null && d2 !== null || d1 !== null && d2 === null) {
    return false
  }
  const date1 = d1 ? new Date(d1) : null
  const date2 = d2 ? new Date(d2) : null

  return date1?.getTime() === date2?.getTime()
}