import { createSlice } from "@reduxjs/toolkit";

const paymentReducer = createSlice({
  name: "payment",
  initialState: {
    product: [],
  },
  reducers: {
    addProductToPayMent: (state, action) => {
      state.product = action.payload;
    },
    removeAllProductPayment: (state, action) => {
      state.product = [];
    },
  },
});

export const { addProductToPayMent, removeAllProductPayment } =
  paymentReducer.actions;

export const SelectProductPayment = (state) => state.payment.product;

export default paymentReducer.reducer;
