import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface OrderItem {
  designId: {
    _id: string;
    designName: string;
    imageUrl: string[];
    price: number;
  };
  quantity: number;
  price: number;
  size: string;
  color: string;
  _id: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  province: string;
  zip: string;
  fullName: string;
  phone: string;
  _id: string;
}

export interface Order {
  _id: string;
  userId: {
    fullName: string;
    email: string;
    id: string;
  };
  items: OrderItem[];
  status: string;
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  orderedAt: string;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
}

type OrderState = { value: Order[]; loading: boolean; error: string | null };

const initialState: OrderState = {
  value: [],
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk<Order[]>(
  "order/fetchOrders",
  async (_, thunkAPI) => {
    try {
      const res = await fetch("http://3.107.22.251:2701/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const response = await res.json();
      return response.response as Order[]; // unwrap array
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk<
  Order,
  { orderId: string; status: string }
>("order/updateOrderStatus", async ({ orderId, status }, thunkAPI) => {
  try {
    const res = await fetch(`http://3.107.22.251:2701/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) throw new Error("Failed to update order status");
    const response = await res.json();
    return response.response as Order;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.value = action.payload ?? [];
    },
    clearOrders: (state) => {
      state.value = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.value = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.value.findIndex((o) => o._id === action.payload._id);
        if (idx >= 0) {
          state.value[idx] = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setOrders, clearOrders } = orderSlice.actions;
export default orderSlice.reducer;
