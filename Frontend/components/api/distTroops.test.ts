import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Mock } from 'vitest'
import { distTroops } from './distTroops'

describe('distTroops', () => {
  beforeEach(() => {
    global.fetch = vi.fn() as Mock
  })

  it('should succeed with valid parameters', async () => {
    ;(global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
    })

    await expect(distTroops(5, 'Palatin', '123')).resolves.toBeUndefined()
  })

  it('should throw error on 401 unauthorized', async () => {
    ;(global.fetch as Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
    })
    
    // TODO: Error Message muss in dazugehöriger component angepasst werden

    await expect(distTroops(5, 'Palatin', '123')).rejects.toThrow('Failed to distribute troops')
  })

  it('should throw error on 500 server error', async () => {
    ;(global.fetch as Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    })

    await expect(distTroops(5, 'Palatin', '123')).rejects.toThrow('Failed to create room')
  })

  it('should send correct parameters in body', async () => {
    ;(global.fetch as Mock).mockResolvedValueOnce({ ok: true })

    await distTroops(5, 'Palatin', '123')

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/game/distTroops',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ to: 'Palatin', sum: 5, roomId: '123' }),
      })
    )
  })
})
