# TaskFlow

A Kanban board built with React. Create tasks, set a priority, deadline, label, and progress, then drag them between columns as the work moves forward. Everything is saved in the browser.

This is a front end portfolio project with no backend. The sample tasks are example data.

## Features

- Four columns: To Do, In Progress, Done, and Blocked
- Drag and drop between columns, plus arrow buttons for keyboard and touch use
- Add, edit, and delete tasks, with a confirmation before deleting
- Priority tags, labels, deadlines, and a progress bar for each task
- Overdue warning for unfinished tasks that are past their deadline
- Live search across titles and descriptions, and a priority filter
- Board summary with total, done, blocked, and overdue counts
- Tasks are saved in the browser and restored on the next visit
- Form validation with an inline message, and the Escape key closes the dialog

## Tech stack

- React 19 with function components
- `useReducer` and Context for state, with no extra state library
- Vite, Vitest, Testing Library, and Oxlint
- Native HTML drag and drop, no drag and drop library
- Plain CSS

## Getting started

You need Node.js 20 or newer.

```bash
git clone https://github.com/devrajraisal/kanban-task-manager.git
cd kanban-task-manager
npm install
npm run dev
```

Open the address that Vite prints.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Create a production build in `dist` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run the linter |
| `npm test` | Run the unit and integration tests |

## Project structure

```
src/
  components/   Header, controls, column, task card, and task dialog
  data/         Sample tasks
  state/        Reducer, task helpers, context, and provider
  utils/        Date helpers
  App.jsx       Page layout and dialog state
legacy/         The original single file HTML version
```

## Design decisions

- **A pure reducer holds the board logic.** Adding, editing, deleting, and moving tasks all go through one reducer, which is easy to test without rendering anything.
- **Invalid input is rejected in one place.** A task needs a title, and status, priority, deadline, and progress are cleaned before they are stored. Saved data is checked in the same way when it is loaded.
- **Task text is rendered as text.** React escapes content, so a title such as `<img onerror=...>` is shown as plain text and never runs. A test covers this.
- **Deadlines are plain date strings.** Comparing `YYYY-MM-DD` strings avoids time zone mistakes when deciding what is overdue.
- **Sample deadlines are relative to today.** The demo board always looks current, and one task is overdue on purpose to show the warning.

## Notes

Native browser drag and drop works well with a mouse but is limited on many touch screens. On a phone or tablet, use the arrow buttons on each card to move tasks.

## Tests

The tests cover the reducer, the task helpers, the date helpers, and the main flows on screen: adding, editing, deleting, searching, filtering, moving by button and by drop, and restoring saved tasks.

```bash
npm test
```

## Original version

The first version of this project was a single HTML file. It is kept in the `legacy` folder for reference.

## License

MIT. See the `LICENSE` file.
