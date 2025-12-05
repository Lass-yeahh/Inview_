// Use the manual mock in src/__mocks__/react-router-dom.js
// Don't require or try to load the real 'react-router-dom' here.
// A manual mock for 'react-router-dom' is provided in `src/__mocks__`.
jest.mock('react-router-dom');

// Do not require 'react-router-dom' here - tests should import
// { mockNavigate } from 'react-router-dom' inside the individual test
// files after calling `jest.mock('react-router-dom')` at the top of the file.

// Install and enable jest-dom matchers if available; ignore if not installed.
try {
    // newer versions of jest-dom export matchers from the package root
    require('@testing-library/jest-dom');
} catch (e) {
    // optional: @testing-library/jest-dom is not installed in this environment
}
