import counterReducer from '../features/counter/counterSlice';
import authSlice from '../features/auth/authSlice';

const reducers = {
    counter: counterReducer,
    auth: authSlice
}

export default reducers;
