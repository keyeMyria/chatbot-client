/*import {
  createNavigationReducer
} from 'react-navigation-redux-helpers';
*/
import { NavigationActions } from 'react-navigation';
import AppNavigation from '../Navigation/AppNavigation';

const INITIAL_STATE = AppNavigation.router.getStateForAction(NavigationActions.init());


export const reducer = (state = INITIAL_STATE, action) => {
  const newState = AppNavigation.router.getStateForAction(action, state)
  return newState || state
}

//export const reducer = createNavigationReducer(AppNavigation);