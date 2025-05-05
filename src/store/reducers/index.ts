import counterReducer from '../features/counter/counterSlice';
import authSlice from '../features/auth/authSlice';
import ordersSlice from '../features/orders/orderSlice';

const reducers = {
    counter: counterReducer,
    auth: authSlice,
    orders: ordersSlice
}

export default reducers;
