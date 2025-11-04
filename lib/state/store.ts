import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userAction";
import orderReducer from "./slices/ordersAction";

export const store = configureStore({
  reducer: {
    user: userReducer,
    order: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
