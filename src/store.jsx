import { configureStore } from '@reduxjs/toolkit'
import messageReducer from './slice/messageSlice'
import cartReducer from './slice/cartSlice'

export const store = configureStore({
  reducer: {
    message: messageReducer,
    cart: cartReducer,
  },
})

export default store
