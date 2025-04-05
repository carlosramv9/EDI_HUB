import { configureStore } from '@reduxjs/toolkit'
import reducers from '../store/reducers/index';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { TypedUseSelectorHook } from 'react-redux';

export const store = configureStore({
  reducer: reducers,
  devTools: {
    name: 'Edi Hub Redux',
    trace: process.env.NODE_ENV !== 'production',
    // traceLimit: 25,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Tipo de dispatch
export type AppDispatch = typeof store.dispatch;

// Crear hooks para despachar y seleccionar el estado
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
