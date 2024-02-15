import { isDatesSame } from "../dates.ts"

const dStr = '2024-01-01T00:00:00Z'

describe('services/dates.ts', () => {
  describe('compareDates', () => {
    it('should comparing of two nulls be true', () => {
      const d1 = null
      const d2 = null
      const result = isDatesSame(d1, d2)
      expect(result).toEqual(true)
    })
    it('should comparing with one of argument is null or undefined be false', () => {
      const dNull = null
      const d1 = new Date()
      let result = isDatesSame(dNull, d1)
      expect(result).toEqual(false)
      result = isDatesSame(dNull, dStr)
      expect(result).toEqual(false)
      result = isDatesSame(d1, dNull)
      expect(result).toEqual(false)
      result = isDatesSame(dStr, dNull)
      expect(result).toEqual(false)
      result = isDatesSame(undefined, d1)
      expect(result).toEqual(false)
    })
    it('should be true on compare the same dates (strings and date objects)', () => {
      const d1 = new Date(dStr)
      const d2 = new Date(dStr)
      let result = isDatesSame(d1, d2)
      expect(result).toEqual(true)
      result = isDatesSame(dStr, dStr)
      expect(result).toEqual(true)
      result = isDatesSame(dStr, d1)
      expect(result).toEqual(true)
    })
    it('should be falsy for different dates', () => {
      const dNow = new Date()
      const d1 = new Date(dStr)
      let result = isDatesSame(dNow, dStr)
      expect(result).toEqual(false)
      result = isDatesSame(dNow, d1)
      expect(result).toEqual(false)
    })
  })
})