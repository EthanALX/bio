import { render, screen, userEvent } from '../../test-utils'
import Counter from '../Counter'

describe('Counter', () => {
  it('renders with initial count of 0', () => {
    render(<Counter />)
    
    expect(screen.getByText('Count: 0')).toBeInTheDocument()
  })

  it('increments count when increment button is clicked', async () => {
    const user = userEvent.setup()
    render(<Counter />)
    
    const incrementButton = screen.getByText('Increment')
    await user.click(incrementButton)
    
    expect(screen.getByText('Count: 1')).toBeInTheDocument()
  })

  it('decrements count when decrement button is clicked', async () => {
    const user = userEvent.setup()
    render(<Counter />)
    
    const incrementButton = screen.getByText('Increment')
    const decrementButton = screen.getByText('Decrement')
    
    // First increment to have a positive number
    await user.click(incrementButton)
    expect(screen.getByText('Count: 1')).toBeInTheDocument()
    
    // Then decrement
    await user.click(decrementButton)
    expect(screen.getByText('Count: 0')).toBeInTheDocument()
  })

  it('resets count to 0 when reset button is clicked', async () => {
    const user = userEvent.setup()
    render(<Counter />)
    
    const incrementButton = screen.getByText('Increment')
    const resetButton = screen.getByText('Reset')
    
    // Increment first
    await user.click(incrementButton)
    await user.click(incrementButton)
    expect(screen.getByText('Count: 2')).toBeInTheDocument()
    
    // Then reset
    await user.click(resetButton)
    expect(screen.getByText('Count: 0')).toBeInTheDocument()
  })

  it('has correct button labels', () => {
    render(<Counter />)
    
    expect(screen.getByText('Increment')).toBeInTheDocument()
    expect(screen.getByText('Decrement')).toBeInTheDocument()
    expect(screen.getByText('Reset')).toBeInTheDocument()
  })
})