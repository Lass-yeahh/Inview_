const React = require('react');
const mockNavigate = jest.fn();

// Simple MemoryRouter mock: record the initialEntries[0] as the current test location
const MemoryRouter = ({ children, initialEntries }) => {
    if (initialEntries && initialEntries.length) {
        global.__TEST_LOCATION__ = initialEntries[0];
    } else if (!global.__TEST_LOCATION__) {
        global.__TEST_LOCATION__ = '/';
    }
    return React.createElement('div', null, children);
};
const BrowserRouter = MemoryRouter;

// Routes mock: pick the first Route child whose `path` matches the current test location
const Routes = ({ children }) => {
    const path = global.__TEST_LOCATION__ || '/';
    const childrenArray = React.Children.toArray(children);

    for (const child of childrenArray) {
        if (!child || !child.props) continue;
        const p = child.props.path;
        if (p === path) {
            return child.props.element || child.props.children || React.createElement('div');
        }
    }

    // no match -> render nothing
    return React.createElement('div', null);
};

// Route renders its `element` prop when provided
const Route = ({ children, element }) => (element ? element : React.createElement('div', null, children));
const Outlet = ({ children }) => React.createElement('div', null, children);
const Link = ({ to, children, ...rest }) => React.createElement('a', { href: to, ...rest }, children);

const useNavigate = () => mockNavigate;
const useLocation = () => ({ pathname: global.__TEST_LOCATION__ || '/' });

module.exports = {
    MemoryRouter,
    BrowserRouter,
    Routes,
    Route,
    Link,
    Outlet,
    useNavigate,
    useLocation,
    // expose mock for assertions in tests if needed
    mockNavigate,
    __esModule: true,
};