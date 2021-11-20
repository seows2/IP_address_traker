import React from 'react';
import { render, screen } from '@testing-library/react';
import 'jest-styled-components';
import ReactDOM from 'react-dom';
import App from '../App';

describe('<App />', () => {
  it('renders component correctly', () => {
    const { container } = render(<App />);
  });
});
