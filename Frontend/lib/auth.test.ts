import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Mock } from 'vitest'
import signOut from './auth'

describe('signOut', () => {
  beforeEach(() => {
    global.fetch = vi.fn() as Mock
  })

  it('should call signout API endpoint with POST', async () => {
    ;(global.fetch as Mock).mockResolvedValueOnce({ ok: true })

    await signOut()

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/auth/signout',
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('should include credentials and correct headers', async () => {
    ;(global.fetch as Mock).mockResolvedValueOnce({ ok: true })

    await signOut()

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
    )
  })

  it('should use NEXT_PUBLIC_API_URL if set', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com'
    ;(global.fetch as Mock).mockResolvedValueOnce({ ok: true })

    await signOut()

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/api/auth/signout',
      expect.any(Object)
    )

    delete process.env.NEXT_PUBLIC_API_URL
  })

  it('should handle errors gracefully', async () => {
    ;(global.fetch as Mock).mockRejectedValueOnce(new Error('Network error'))

    await expect(signOut()).resolves.toBeUndefined()
  })

  it('should return undefined', async () => {
    ;(global.fetch as Mock).mockResolvedValueOnce({ ok: true })

    const result = await signOut()

    expect(result).toBeUndefined()
  })
})
