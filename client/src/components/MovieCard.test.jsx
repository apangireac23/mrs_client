import { render, screen, fireEvent } from '@testing-library/react'
import { MovieCard } from './MovieCard'

const mockMovie = {
  movie_id: 'tmdb_155',
  title: 'The Dark Knight',
  poster_url: 'https://image.tmdb.org/poster.jpg',
  release_date: '2008-07-18',
}

const mockOnInteract = vi.fn()

describe('MovieCard', () => {
  beforeEach(() => {
    mockOnInteract.mockClear()
  })

  it('renders movie title and release date', () => {
    render(
      <MovieCard
        movie={mockMovie}
        pendingEvent={false}
        eventMessage=""
        onInteract={mockOnInteract}
      />
    )

    expect(screen.getByText('The Dark Knight')).toBeInTheDocument()
    expect(screen.getByText('2008-07-18')).toBeInTheDocument()
  })

  it('renders poster image when available', () => {
    render(
      <MovieCard
        movie={mockMovie}
        pendingEvent={false}
        eventMessage=""
        onInteract={mockOnInteract}
      />
    )

    expect(screen.getByAltText('The Dark Knight')).toBeInTheDocument()
    expect(screen.getByAltText('The Dark Knight')).toHaveAttribute(
      'src',
      'https://image.tmdb.org/poster.jpg'
    )
  })

  it('renders placeholder when no poster', () => {
    const movieWithoutPoster = { ...mockMovie, poster_url: null }

    render(
      <MovieCard
        movie={movieWithoutPoster}
        pendingEvent={false}
        eventMessage=""
        onInteract={mockOnInteract}
      />
    )

    expect(screen.getByText('No poster')).toBeInTheDocument()
  })

  it('calls onInteract with like action when like button clicked', () => {
    render(
      <MovieCard
        movie={mockMovie}
        pendingEvent={false}
        eventMessage=""
        onInteract={mockOnInteract}
      />
    )

    const likeButton = screen.getByLabelText('Like')
    fireEvent.click(likeButton)

    expect(mockOnInteract).toHaveBeenCalledWith('tmdb_155', 'like')
  })

  it('calls onInteract with watch action when watch button clicked', () => {
    render(
      <MovieCard
        movie={mockMovie}
        pendingEvent={false}
        eventMessage=""
        onInteract={mockOnInteract}
      />
    )

    const watchButton = screen.getByLabelText('Watch')
    fireEvent.click(watchButton)

    expect(mockOnInteract).toHaveBeenCalledWith('tmdb_155', 'watch')
  })

  it('calls onInteract with skip action when skip button clicked', () => {
    render(
      <MovieCard
        movie={mockMovie}
        pendingEvent={false}
        eventMessage=""
        onInteract={mockOnInteract}
      />
    )

    const skipButton = screen.getByLabelText('Skip')
    fireEvent.click(skipButton)

    expect(mockOnInteract).toHaveBeenCalledWith('tmdb_155', 'skip')
  })

  it('disables all buttons when pendingEvent is true', () => {
    render(
      <MovieCard
        movie={mockMovie}
        pendingEvent={true}
        eventMessage=""
        onInteract={mockOnInteract}
      />
    )

    expect(screen.getByLabelText('Like')).toBeDisabled()
    expect(screen.getByLabelText('Watch')).toBeDisabled()
    expect(screen.getByLabelText('Skip')).toBeDisabled()
  })

  it('displays event message when provided', () => {
    render(
      <MovieCard
        movie={mockMovie}
        pendingEvent={false}
        eventMessage="like saved"
        onInteract={mockOnInteract}
      />
    )

    expect(screen.getByText('like saved')).toBeInTheDocument()
  })

  it('displays empty feedback when no event message', () => {
    const { container } = render(
      <MovieCard
        movie={mockMovie}
        pendingEvent={false}
        eventMessage=""
        onInteract={mockOnInteract}
      />
    )

    const feedbackElement = container.querySelector('.event-feedback')
    expect(feedbackElement).toBeInTheDocument()
  })
})
