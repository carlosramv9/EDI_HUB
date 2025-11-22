import counterReducer from '../features/counter/counterSlice';
import authSlice from '../features/auth/authSlice';
import ordersSlice from '../features/orders/orderSlice';
import filterSlice  from '../features/filters/filterSlice';
import selectedOrdersSlice from '../features/selectedOrders/selectedOrdersSlice';

const reducers = {
    counter: counterReducer,
    auth: authSlice,
    orders: ordersSlice,
    filters: filterSlice,
    selectedOrders: selectedOrdersSlice
}

export default reducers;
