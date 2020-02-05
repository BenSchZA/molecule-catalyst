import history from '../../../utils/history';
import { shallow, mount } from 'enzyme';

import { shape } from 'prop-types';

// Instantiate router context
const router = {
  history: history,
  route: {
    location: {},
    match: {},
  },
};

const createContext = () => ({
  context: { router },
  childContextTypes: { router: shape({}) },
});

export function mountWrap(node) {
  return mount(node, createContext());
}

export function shallowWrap(node) {
  return shallow(node, createContext());
}