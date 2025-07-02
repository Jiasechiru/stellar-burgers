import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../utils/burger-api';
import { TOrder } from '../utils/types';

interface OrderState {
  order: TOrder | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  order: null,
  loading: false,
  error: null
};

export const placeOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('order/placeOrder', async (ingredientIds, { rejectWithValue }) => {
  try {
    const res = await orderBurgerApi(ingredientIds);
    return res.order;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Order failed');
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder(state) {
      state.order = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Order failed';
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
