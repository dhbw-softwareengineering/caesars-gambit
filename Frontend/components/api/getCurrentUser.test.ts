import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Mock } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useGetCurrentUser } from './getCurrentUser'

describe('useGetCurrentUser', () => {
  beforeEach(() => {
    global.fetch = vi.fn() as Mock
  })

  it('should fetch current user on mount', async () => {
    ;(global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ username: 'testuser' }),
    })

    renderHook(() => useGetCurrentUser())

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/user/currentUser',
        expect.objectContaining({
          method: 'GET',
          credentials: 'include',
        })
      )
    })
  })

  it('should return user data after fetch', async () => {
    const mockUser = { username: 'john' }
    ;(global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockUser),
    })

    const { result } = renderHook(() => useGetCurrentUser())

    await waitFor(() => {
      expect(result.current).toEqual(mockUser)
    })
  })


  it('should use NEXT_PUBLIC_API_URL if provided', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com'
    ;(global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ username: 'test' }),
    })

    renderHook(() => useGetCurrentUser())

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/user/currentUser',
        expect.any(Object)
      )
    })

    delete process.env.NEXT_PUBLIC_API_URL
  })

  it('should include credentials in request', async () => {
    ;(global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ username: 'test' }),
    })

    renderHook(() => useGetCurrentUser())

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ credentials: 'include' })
      )
    })
  })
})
