import { render, screen, fireEvent } from '@testing-library/react'
import { FileUpload } from '../FileUpload'

// Mock axios
jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({ data: { filename: 'test.txt' } })),
}))

describe('FileUpload', () => {
  it('renders file input and upload button', () => {
    render(<FileUpload />)
    
    expect(screen.getByRole('button', { name: /upload file/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/file/i)).toBeInTheDocument()
  })

  it('disables upload button when no file selected', () => {
    render(<FileUpload />)
    
    const uploadButton = screen.getByRole('button', { name: /upload file/i })
    expect(uploadButton).toBeDisabled()
  })
})
