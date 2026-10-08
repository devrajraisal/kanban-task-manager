import { addDays } from '../utils/dates'

// Sample tasks. Deadlines are relative to today so the board always looks current,
// and one task is overdue on purpose to show the warning style.
export function createSeedTasks(today) {
  const t = (id, title, description, status, priority, offset, label, progress) => ({
    id, title, description, status, priority, deadline: addDays(today, offset), label, progress,
  })
  return [
    t(1, 'Design landing page mockup', 'Create wireframes for home, about, and contact pages.', 'done', 'high', -12, 'Design', 100),
    t(2, 'Set up React project', 'Initialize the project with Vite and agree on a folder structure.', 'done', 'high', -10, 'Frontend', 100),
    t(3, 'Build product listing API', 'Create REST endpoints for fetching, filtering, and paginating products.', 'progress', 'high', 5, 'Backend', 65),
    t(4, 'Implement Redux state', 'Set up Redux Toolkit slices for cart, wishlist, and auth.', 'progress', 'medium', -2, 'Frontend', 40),
    t(5, 'Write unit tests', 'Add tests for utility functions and key components.', 'todo', 'medium', 12, 'Testing', 0),
    t(6, 'Deploy the app', 'Configure environment variables and set up a CI pipeline.', 'todo', 'low', 16, 'DevOps', 0),
    t(7, 'Payment integration', 'Blocked while waiting for API keys from the client.', 'blocked', 'high', 9, 'Backend', 10),
  ]
}
