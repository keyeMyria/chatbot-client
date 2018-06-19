import { sbConnect } from '../sendbirdActions';

// action constants
export const INIT_LOGIN = 'init_login';
export const LOGIN_SUCCESS = 'login_success';
export const LOGIN_FAIL = 'login_fail';

// actions
export const initLogin = () => {
    return { type: INIT_LOGIN };
}

export const login = ({ userId, nickname }) => {
    console.log('-XXX->login, userId=', userId, ', nick=', nickname);
    return (dispatch) => {
        sbConnect(userId, nickname)
        .then( (user) => loginSuccess(dispatch, user) )
        .catch( (error) => loginFail(dispatch, error) );
    }
}

const loginFail = (dispatch, error) => {
    dispatch({ 
        type: LOGIN_FAIL,
        payload: error
    });
}

const loginSuccess = (dispatch, user) => {
    dispatch({
        type: LOGIN_SUCCESS, 
        payload: user 
    });
}

// Reducer
const INITIAL_STATE = {
  error: '',
  user: null
}

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
      case INIT_LOGIN: 
          return { ...state, ...INITIAL_STATE };
      case LOGIN_SUCCESS: 
          return { ...state, ...INITIAL_STATE, user: action.payload };
      case LOGIN_FAIL:
          return { ...state, ...INITIAL_STATE, error: action.payload };
      default: 
          return state;
  }
};

export default reducer;
