import { createBrowserHistory } from 'history'
const history = createBrowserHistory();
export default history;

export function forwardTo(location) {
  history.push(location);
}

export function goBack(){
  history.goBack();
}
