import Immutable from 'seamless-immutable';

/* ------------- Action Constants ------------- */
export const START_UP = 'START_UP';

/* ------------- Actions ------------- */
export const startup = () => ({
    type: START_UP
});

/* ------------- Initial State ------------- */
const INITIAL_STATE = Immutable({
    initialized: false,
    user: null
});

/* ------------- Reducers ------------- */
const handleStartup = (state) => {
    return state;
};

const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case START_UP:
            return handleStartup(state);
        default:
            return state;
    }
};

export default reducer;