// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { BoardProvider } from './state/BoardProvider'

beforeEach(() => window.localStorage.clear())
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

const renderApp = () => {
  render(<BoardProvider><App /></BoardProvider>)
  return userEvent.setup()
}
const column = (name) => screen.getByRole('region', { name: `${name} column` })

describe('TaskFlow board', () => {
  it('shows the sample tasks in their columns', () => {
    renderApp()
    expect(within(column('To Do')).getByText('Write unit tests')).toBeTruthy()
    expect(within(column('Done')).getByText('Set up React project')).toBeTruthy()
    expect(within(column('Blocked')).getByText('Payment integration')).toBeTruthy()
  })

  it('adds a task from the modal and saves it', async () => {
    const user = renderApp()
    await user.click(screen.getByRole('button', { name: '+ Add task' }))
    await user.type(screen.getByLabelText(/Title/), 'Prepare demo')
    await user.click(screen.getByRole('button', { name: 'Add task' }))
    expect(within(column('To Do')).getByText('Prepare demo')).toBeTruthy()
    expect(window.localStorage.getItem('taskflow:v1')).toContain('Prepare demo')
  })

  it('requires a title', async () => {
    const user = renderApp()
    await user.click(screen.getByRole('button', { name: '+ Add task' }))
    await user.click(screen.getByRole('button', { name: 'Add task' }))
    expect(screen.getByRole('alert').textContent).toBe('Title is required.')
  })

  it('renders task text as plain text instead of HTML', async () => {
    const user = renderApp()
    await user.click(screen.getByRole('button', { name: '+ Add task' }))
    await user.type(screen.getByLabelText(/Title/), '<img src=x onerror=alert(1)>')
    await user.click(screen.getByRole('button', { name: 'Add task' }))
    expect(screen.getByText('<img src=x onerror=alert(1)>')).toBeTruthy()
    expect(document.querySelector('img')).toBeNull()
  })

  it('filters by search text and priority', async () => {
    const user = renderApp()
    await user.type(screen.getByLabelText('Search tasks'), 'redux')
    expect(screen.getByText('Implement Redux state')).toBeTruthy()
    expect(screen.queryByText('Write unit tests')).toBeNull()
    await user.clear(screen.getByLabelText('Search tasks'))
    await user.selectOptions(screen.getByLabelText('Filter by priority'), 'low')
    expect(screen.getByText('Deploy the app')).toBeTruthy()
    expect(screen.queryByText('Write unit tests')).toBeNull()
  })

  it('moves a task with the arrow buttons', async () => {
    const user = renderApp()
    await user.click(screen.getByRole('button', { name: 'Move Write unit tests right' }))
    expect(within(column('In Progress')).getByText('Write unit tests')).toBeTruthy()
    expect(within(column('To Do')).queryByText('Write unit tests')).toBeNull()
  })

  it('moves a task by dropping it on another column', () => {
    renderApp()
    fireEvent.drop(screen.getByTestId('zone-done'), { dataTransfer: { getData: () => '5' } })
    expect(within(column('Done')).getByText('Write unit tests')).toBeTruthy()
  })

  it('deletes a task only after confirmation', async () => {
    const user = renderApp()
    const confirm = vi.spyOn(window, 'confirm').mockReturnValueOnce(false).mockReturnValueOnce(true)
    await user.click(screen.getByRole('button', { name: 'Delete Write unit tests' }))
    expect(screen.getByText('Write unit tests')).toBeTruthy()
    await user.click(screen.getByRole('button', { name: 'Delete Write unit tests' }))
    expect(screen.queryByText('Write unit tests')).toBeNull()
    expect(confirm).toHaveBeenCalledTimes(2)
  })

  it('edits an existing task', async () => {
    const user = renderApp()
    await user.click(screen.getByRole('button', { name: 'Edit Write unit tests' }))
    const title = screen.getByLabelText(/Title/)
    await user.clear(title)
    await user.type(title, 'Write more tests')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))
    expect(screen.getByText('Write more tests')).toBeTruthy()
    expect(screen.queryByText('Write unit tests')).toBeNull()
  })

  it('restores saved tasks on the next visit', async () => {
    const user = renderApp()
    await user.click(screen.getByRole('button', { name: 'Move Write unit tests right' }))
    cleanup()
    renderApp()
    expect(within(column('In Progress')).getByText('Write unit tests')).toBeTruthy()
  })

  it('shows the overdue count in the summary', () => {
    renderApp()
    const summary = screen.getByLabelText('Board summary')
    expect(within(summary).getByText('Overdue').nextSibling.textContent).toBe('1')
  })
})
