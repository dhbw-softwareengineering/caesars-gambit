import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GameLogic } from './GameLogic'

describe('GameLogic - Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderProps = {
    roomId: 'test-room',
    token: 'test-token',
    gameStateJson: JSON.stringify({
      territories: {
        'Palatin': { owner: 'Player1', troops: 5 },
        'Laterno': { owner: 'Player2', troops: 3 },
      },
    }),
  }

  describe('Render Props Pattern', () => {
    it('should render children via render props', () => {
      render(
        <GameLogic {...renderProps}>
          {(props) => (
            <div data-testid="game-content">
              Mode: {props.mode}
            </div>
          )}
        </GameLogic>
      )

      expect(screen.getByTestId('game-content')).toBeInTheDocument()
    })

    it('should provide mode in render props', () => {
      render(
        <GameLogic {...renderProps}>
          {(props) => (
            <div data-testid="mode-display">{props.mode}</div>
          )}
        </GameLogic>
      )

      expect(screen.getByTestId('mode-display')).toHaveTextContent('view')
    })

    it('should provide troop count in render props', () => {
      render(
        <GameLogic {...renderProps}>
          {(props) => (
            <div data-testid="troop-count">{props.troopCount}</div>
          )}
        </GameLogic>
      )

      expect(screen.getByTestId('troop-count')).toHaveTextContent('1')
    })

    it('should provide setMode function', () => {
      render(
        <GameLogic {...renderProps}>
          {(props) => (
            <button
              data-testid="mode-button"
              onClick={() => props.setMode('attack')}
            >
              Attack
            </button>
          )}
        </GameLogic>
      )

      expect(screen.getByTestId('mode-button')).toBeInTheDocument()
    })
  })

  describe('Mode Switching', () => {
    it('should start in view mode', () => {
      render(
        <GameLogic {...renderProps}>
          {(props) => (
            <div>{props.mode === 'view' ? 'View Mode' : 'Other Mode'}</div>
          )}
        </GameLogic>
      )

      expect(screen.getByText('View Mode')).toBeInTheDocument()
    })

    it('should switch to attack mode', async () => {
      const user = userEvent.setup()
      render(
        <GameLogic {...renderProps}>
          {(props) => (
            <>
              <div data-testid="current-mode">{props.mode}</div>
              <button onClick={() => props.setMode('attack')}>
                Start Attack
              </button>
            </>
          )}
        </GameLogic>
      )

      const button = screen.getByRole('button', { name: /Start Attack/ })
      await user.click(button)

      expect(screen.getByTestId('current-mode')).toHaveTextContent('attack')
    })

    it('should preserve troop count when changing mode', async () => {
      const user = userEvent.setup()
      render(
        <GameLogic {...renderProps}>
          {(props) => (
            <>
              <div data-testid="troop-count">{props.troopCount}</div>
              <button onClick={() => props.incrementTroops()}>
                Increment
              </button>
              <button onClick={() => props.setMode('place')}>
                Switch Mode
              </button>
            </>
          )}
        </GameLogic>
      )

      const incrementBtn = screen.getByRole('button', { name: /Increment/ })
      await user.click(incrementBtn)
      await user.click(incrementBtn)

      expect(screen.getByTestId('troop-count')).toHaveTextContent('3')

      const switchBtn = screen.getByRole('button', { name: /Switch Mode/ })
      await user.click(switchBtn)

      expect(screen.getByTestId('troop-count')).toHaveTextContent('3')
    })
  })

  describe('Troop Counter UI', () => {
    it('should render increment button', () => {
      render(
        <GameLogic {...renderProps}>
          {(props) => (
            <button onClick={() => props.incrementTroops()}>+</button>
          )}
        </GameLogic>
      )

      expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument()
    })

    it('should render decrement button', () => {
      render(
        <GameLogic {...renderProps}>
          {(props) => (
            <button onClick={() => props.decrementTroops()}>-</button>
          )}
        </GameLogic>
      )

      expect(screen.getByRole('button', { name: '-' })).toBeInTheDocument()
    })

    it('should update count on increment click', async () => {
      const user = userEvent.setup()
      render(
        <GameLogic {...renderProps}>
          {(props) => (
            <>
              <div data-testid="count">{props.troopCount}</div>
              <button onClick={() => props.incrementTroops()}>+</button>
            </>
          )}
        </GameLogic>
      )

      const button = screen.getByRole('button', { name: '+' })
      await user.click(button)

      expect(screen.getByTestId('count')).toHaveTextContent('2')
    })

    it('should update count on decrement click', async () => {
      const user = userEvent.setup()
      render(
        <GameLogic {...renderProps}>
          {(props) => (
            <>
              <div data-testid="count">{props.troopCount}</div>
              <button onClick={() => props.incrementTroops()}>+</button>
              <button onClick={() => props.decrementTroops()}>-</button>
            </>
          )}
        </GameLogic>
      )

      // Increment to 3
      const plusBtn = screen.getByRole('button', { name: '+' })
      await user.click(plusBtn)
      await user.click(plusBtn)

      expect(screen.getByTestId('count')).toHaveTextContent('3')

      // Decrement back to 2
      const minusBtn = screen.getByRole('button', { name: '-' })
      await user.click(minusBtn)

      expect(screen.getByTestId('count')).toHaveTextContent('2')
    })

    it('should not decrement below 1', async () => {
      const user = userEvent.setup()
      render(
        <GameLogic {...renderProps}>
          {(props) => (
            <>
              <div data-testid="count">{props.troopCount}</div>
              <button onClick={() => props.decrementTroops()}>-</button>
            </>
          )}
        </GameLogic>
      )

      const button = screen.getByRole('button', { name: '-' })
      await user.click(button)
      await user.click(button)
      await user.click(button)

      expect(screen.getByTestId('count')).toHaveTextContent('1')
    })

    it('should allow setTroopCount with direct value', async () => {
      const user = userEvent.setup()
      render(
        <GameLogic {...renderProps}>
          {(props) => (
            <>
              <div data-testid="count">{props.troopCount}</div>
              <button onClick={() => props.setTroopCount(5)}>Set to 5</button>
            </>
          )}
        </GameLogic>
      )

      expect(screen.getByTestId('count')).toHaveTextContent('1')

      await user.click(screen.getByRole('button', { name: /Set to 5/ }))

      expect(screen.getByTestId('count')).toHaveTextContent('5')
    })
  })

  describe('Region Selection Display', () => {
    it('should display active region', () => {
      render(
        <GameLogic {...renderProps}>
          {(props) => (
            <div data-testid="active-region">
              {props.activeRegionId || 'None'}
            </div>
          )}
        </GameLogic>
      )

      expect(screen.getByTestId('active-region')).toHaveTextContent('None')
    })

    it('should display selected from region in attack mode', () => {
      render(
        <GameLogic {...renderProps}>
          {(props) => (
            <div data-testid="from-region">
              {props.mode === 'attack'
                ? props.selectedFromRegionId || 'Select'
                : 'N/A'}
            </div>
          )}
        </GameLogic>
      )

      expect(screen.getByTestId('from-region')).toHaveTextContent('N/A')
    })

    it('should display selected to region', () => {
      render(
        <GameLogic {...renderProps}>
          {(props) => (
            <div data-testid="to-region">
              {props.selectedToRegionId || 'None'}
            </div>
          )}
        </GameLogic>
      )

      expect(screen.getByTestId('to-region')).toHaveTextContent('None')
    })
  })

  describe('Confirmation Actions', () => {
     it('should render confirm attack button', async () => {
      const user = userEvent.setup()
      render(
        <GameLogic {...renderProps}>
          {(props) => (
            <>
              <button onClick={() => props.setMode('attack')}>
                Attack Mode
              </button>
              {props.mode === 'attack' && (
                <button onClick={() => props.confirmAttack()}>Confirm Attack</button>
              )}
            </>
          )}
        </GameLogic>
      )
      await user.click(screen.getByRole('button', { name: /Attack Mode/i }))
      expect(
        screen.getByRole('button', { name: /Confirm Attack/i })
      ).toBeInTheDocument()

    })

    it('should call confirmAttack when mode is attack', async () => {
      const user = userEvent.setup()
      const mockConfirm = vi.fn()

      render(
        <GameLogic {...renderProps}>
          {(props) => (
            <>
              <button onClick={() => props.setMode('attack')}>
                Attack Mode
              </button>
              <button
                onClick={async () => {
                  await props.confirmAttack()
                  mockConfirm()
                }}
              >
                Confirm
              </button>
            </>
          )}
        </GameLogic>
      )

      const attackBtn = screen.getByRole('button', { name: /Attack Mode/ })
      await user.click(attackBtn)

      const confirmBtn = screen.getByRole('button', { name: /Confirm/ })
      await user.click(confirmBtn)

      expect(mockConfirm).toHaveBeenCalled()
    })
  })

  describe('Game State Integration', () => {
    it('should receive gameStateJson prop', () => {
      const gameState = JSON.stringify({
        territories: { Palatin: { troops: 5 } },
      })

      render(
        <GameLogic {...renderProps} gameStateJson={gameState}>
          {() => (
            <div data-testid="game-state-ready">Ready</div>
          )}
        </GameLogic>
      )

      expect(screen.getByTestId('game-state-ready')).toBeInTheDocument()
    })

    it('should handle null gameStateJson', () => {
      render(
        <GameLogic {...renderProps} gameStateJson={null}>
          {(props) => (
            <div data-testid="loading">
              {props.gameStateJson ? 'Loaded' : 'Loading'}
            </div>
          )}
        </GameLogic>
      )

      expect(screen.getByTestId('loading')).toHaveTextContent('Loading')
    })
  })
})
