# RoboFriends

A React + Redux application that fetches a list of users from a public API and renders them as searchable "robot" cards, each with a procedurally generated avatar. Originally built as part of the **Zero To Mastery (ZTM)** React course and later extended with a Redux architecture and a full Jest / React Testing Library test suite.

> Live demo: https://ckapsalis2710.github.io/robofriends/

## What This Project Demonstrates

- **Class components, not hooks.** Every component in this app (`App`, `MainPage`, `ErrorBoundary`) that needs lifecycle methods or local state is implemented as an ES6 class component using `Component` and lifecycle hooks like `componentDidMount`, `componentDidCatch`, and `componentDidUpdate`. Purely presentational components (`Card`, `CardList`, `SearchBox`, `Scroll`) are simple stateless functional components.
- **Redux for state management.** Application state is centralized in a Redux store (`createStore` + `combineReducers`) rather than local component state:
  - `searchRobots` reducer holds the current search field text.
  - `requestRobots` reducer holds the fetched robots list, a `isPending` loading flag, and any `error`.
  - `react-redux`'s `connect()` is used in the `App` container to map state and dispatch to props (`mapStateToProps` / `mapDispatchToProps`), following the classic container/presentational component pattern.
- **Async data flow with Redux Thunk.** Since `fetch()` is asynchronous, `redux-thunk` middleware is used so that `requestRobots()` can be an action creator that dispatches multiple plain actions over time: `REQUEST_ROBOTS_PENDING` → then either `REQUEST_ROBOTS_SUCCESS` (with the payload) or `REQUEST_ROBOTS_FAILED` (with the error).
- **Action/reducer/constants separation.** Action types are centralized in `constants.js`, action creators in `actions.js`, and reducers in `reducers.js` — a standard, scalable Redux project layout.
- **Redux Logger middleware**, wired up in `index.js`, logs every dispatched action and the resulting state change to the console, which is useful for debugging the data flow during development.
- **Fetching data from an external API.** On mount, `App.componentDidMount` dispatches `requestRobots()`, which calls [JSONPlaceholder](https://jsonplaceholder.typicode.com/users) (a free fake REST API) to retrieve a list of users that are rendered as "robots."
- **Dynamic avatar images.** Each `Card` builds its image URL from [RoboHash](https://robohash.org/), seeded with the robot's `id`, so every card gets a unique, consistent robot avatar (`https://robohash.org/{id}?size=200x200`).
- **Client-side search/filtering.** `MainPage` filters the `robots` array on every render based on the current `searchField` from the Redux store, doing a case-insensitive substring match against each robot's name.
- **Conditional rendering / loading state.** `MainPage` renders a `Loading` message while `isPending` is `true`, instead of trying to render cards before data has arrived.
- **Error Boundary.** A custom `ErrorBoundary` class component wraps `CardList` and uses `componentDidCatch` to catch rendering errors in its children, showing a fallback UI ("Ooooops. This is not good") with a "Try Again" button instead of crashing the whole app. It also automatically resets its error state whenever its `children` prop changes.
- **Scrollable container.** A small `Scroll` component wraps the card list in a fixed-height, scrollable `div`, keeping the search box always visible while the results list scrolls independently.
- **Styling with Tachyons.** The UI is styled using the [Tachyons](https://tachyons.io/) functional CSS framework, avoiding custom CSS for most components.
- **PWA / service worker support.** The app is bootstrapped with Create React App's service worker registration (`serviceWorkerRegistration.js`) and Workbox packages, enabling offline/PWA capabilities out of the box.
- **Deployment to GitHub Pages**, configured via the `homepage` field in `package.json` and the `gh-pages` npm package/script.

## Testing

This project has a thorough automated test suite built with **Jest** (via `react-scripts test`) and **React Testing Library** (`@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`). Every major piece of the app — actions, reducers, and components — has a dedicated test file:

| File under test | Test file | What's covered |
|---|---|---|
| `actions.js` | `actions.test.js` | `setSearchField` action creator output; the `requestRobots` thunk dispatching `PENDING` → `SUCCESS`/`FAILED` against a mocked `fetch` |
| `reducers.js` | `reducers.test.js` | `searchRobots` and `requestRobots` reducers — initial state, each action type, and edge cases (e.g. error state preserving existing robots) |
| `Card.js` | `Card.test.js` | Snapshot test, correct rendering of name/email, correct RoboHash image URL construction |
| `CardList.js` | `CardList.test.js` | Snapshot test, correct number of cards rendered, empty-array/no-results state, correct props passed down to each `Card` |
| `SearchBox.js` | `SearchBox.test.js` | Snapshot test, `onChange` callback firing correctly as the user types (via `userEvent`) |
| `Scroll.js` | `Scroll.test.js` | Correct inline scroll styling, snapshot test |
| `ErrorBoundary.js` | `ErrorBoundary.test.js` | Normal rendering vs. caught errors, the "Try Again" recovery flow, auto-reset when children change, snapshot tests for both success/error states |
| `MainPage.js` | `MainPage.test.js` | Loading state, full rendering with mocked child components, search filtering logic, propagation of search input changes, empty-results state |

Notable testing techniques used:
- **Snapshot testing** (`toMatchSnapshot()`) to catch unintended markup changes — snapshot files live in `src/components/__snapshots__/`.
- **Mocking child components** with `jest.mock(...)` in `MainPage.test.js` to isolate the component under test from its children's implementation details.
- **Mocking `fetch`** in `actions.test.js` to test the async thunk's dispatch sequence without making real network calls.
- **`data-testid` attributes** added to key elements (`card-list-container`, `robot-card`) specifically to make them reliably queryable in tests.

### Running the tests

```bash
npm test                 # interactive watch mode
npm run test:coverage    # single run with a coverage report
npm run test:debug       # run with Node's inspector attached, for debugging
```

## Tech Stack

| Tool | Purpose |
|---|---|
| [React](https://reactjs.org/) 18 | UI library |
| [Redux](https://redux.js.org/) + [React-Redux](https://react-redux.js.org/) | Centralized application state management |
| [Redux Thunk](https://github.com/reduxjs/redux-thunk) | Middleware for async action creators (API calls) |
| [Redux Logger](https://github.com/LogRocket/redux-logger) | Dev-time logging of dispatched actions/state |
| [Create React App](https://github.com/facebook/create-react-app) | Project bootstrapping, dev server, and build tooling |
| [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) | Unit and component testing |
| [Tachyons](https://tachyons.io/) | Functional/utility-first CSS styling |
| [JSONPlaceholder](https://jsonplaceholder.typicode.com/) | Mock REST API providing the list of "robot" users |
| [RoboHash](https://robohash.org/) | Generates a unique robot avatar image per user id |
| [gh-pages](https://www.npmjs.com/package/gh-pages) | Deploys the production build to GitHub Pages |

## Project Structure

```
robofriends/
├── public/                          # Static HTML template and assets served by CRA
├── src/
│   ├── components/
│   │   ├── Card.js                  # Single robot card (functional)
│   │   ├── CardList.js              # Renders a list of Card components (functional)
│   │   ├── SearchBox.js             # Search input (functional)
│   │   ├── Scroll.js                # Scrollable wrapper (functional)
│   │   ├── ErrorBoundary.js         # Catches render errors in its children (class)
│   │   ├── MainPage.js              # Composes the page layout (class)
│   │   └── *.test.js / __snapshots__/  # Component tests + snapshots
│   ├── containers/
│   │   └── App.js                   # Connected root container (class, Redux connect())
│   ├── actions.js                   # Redux action creators (incl. requestRobots thunk)
│   ├── reducers.js                  # Redux reducers (searchRobots, requestRobots)
│   ├── constants.js                 # Redux action type constants
│   ├── robots.js                    # Local sample robot data
│   ├── index.js                     # Entry point: Redux store setup + render
│   └── *.test.js                    # Action/reducer tests
├── package.json
└── .gitignore
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- npm (comes bundled with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ckapsalis2710/robofriends.git
   cd robofriends
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser. The page automatically reloads as you edit the source files.

### Available Scripts

- **`npm start`** — Runs the app in development mode with hot reload.
- **`npm test`** — Launches the Jest test runner in interactive watch mode.
- **`npm run test:coverage`** — Runs the full test suite once and prints a coverage report.
- **`npm run test:debug`** — Runs tests with Node's debugger attached (`--inspect-brk --runInBand --no-cache`), useful for stepping through a failing test.
- **`npm run build`** — Builds an optimized, minified production bundle into the `build/` folder.
- **`npm run deploy`** — Builds the project and publishes the `build/` folder to the `gh-pages` branch via the `gh-pages` package, updating the live GitHub Pages site.
- **`npm run eject`** — Copies all underlying build configuration (Webpack, Babel, ESLint, etc.) into the project for full manual control. This is a one-way operation.

## Notes

This project started as a learning exercise from the ZTM (Zero To Mastery) React course and was later extended to practice Redux state management, async data flow with middleware, and writing a comprehensive Jest/React Testing Library test suite for both the Redux layer and the UI components.

## Learn More

- [React documentation](https://reactjs.org/)
- [Redux documentation](https://redux.js.org/)
- [React Testing Library documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [Tachyons documentation](https://tachyons.io/docs/)
