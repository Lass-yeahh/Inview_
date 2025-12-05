// Use the manual mock for react-router-dom so tests don't require the real package
jest.mock('react-router-dom');

import { render, screen } from "@testing-library/react";
// Require MemoryRouter from the mocked module at runtime so Jest's resolver
// doesn't attempt to resolve the real package during static import resolution.
const { MemoryRouter } = require('react-router-dom');
// Require App after mocking 'react-router-dom' so imports inside App
// will use the mocked module instead of trying to resolve the real package.
const App = require('./App').default;

describe("App Component", () => {
  test("renders login screen from App", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    // Wait for the element to appear (use screen.findByText for async elements)
    expect(screen.getByText(/Inview Login/i)).toBeInTheDocument();
  });
});
