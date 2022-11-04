import { combineReducers } from "redux";
import userSlice from "./features/userSlice";
import cartSlice from "./features/cartSlice";
import paymentSlice from "./features/paymentSlice";

const rootReducer = combineReducers({
  cart: cartSlice,
  user: userSlice,
  payment: paymentSlice,
});

export default rootReducer;
