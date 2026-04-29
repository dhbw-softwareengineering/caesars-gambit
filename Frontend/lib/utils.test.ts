import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn - Tailwind Merge', () => {
  it('should combine single class strings', () => {
    expect(cn('px-4', 'py-3')).toContain('px-4')
    expect(cn('px-4', 'py-3')).toContain('py-3')
  })

  it('should handle arrays of classes', () => {
    const result = cn(['px-4', 'py-3'])
    expect(result).toContain('px-4')
    expect(result).toContain('py-3')
  })

  it('should handle undefined and null', () => {
    const result = cn('px-4', undefined, null, 'py-3')
    expect(result).toContain('px-4')
    expect(result).toContain('py-3')
  })

  it('should merge conflicting tailwind classes', () => {
    const result = cn('px-2', 'px-4')
    expect(result).toContain('px-4')
    expect(result).not.toContain('px-2')
  })

  it('should merge conflicting background classes', () => {
    const result = cn('bg-red-500', 'bg-blue-500')
    expect(result).toContain('bg-blue-500')
    expect(result).not.toContain('bg-red-500')
  })

  it('should keep non-conflicting classes', () => {
    const result = cn('px-4', 'text-lg', 'font-bold')
    expect(result).toContain('px-4')
    expect(result).toContain('text-lg')
    expect(result).toContain('font-bold')
  })

  it('should handle conditional classes', () => {
    const isActive = true
    const result = cn('base', isActive && 'active')
    expect(result).toContain('base')
    expect(result).toContain('active')
  })

  it('should exclude conditional classes when false', () => {
    const isActive = false
    const result = cn('base', isActive && 'active')
    expect(result).toContain('base')
    expect(result).not.toContain('active')
  })

})
