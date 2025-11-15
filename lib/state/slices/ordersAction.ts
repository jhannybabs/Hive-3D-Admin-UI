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

export interface Payment {
  _id: string;
  paymentMethod: "paymongo_gcash" | "cod";
  status: "unpaid" | "paid";
  amount: number;
  createdAt?: string;
  updatedAt?: string;
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
  paymentStatus?: string;
  paymentId?: Payment;
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
      return response.response as Order[];
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
    const res = await fetch(
      `http://3.107.22.251:2701/orders/${orderId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!res.ok) throw new Error("Failed to update order status");
    const response = await res.json();
    return response.response as Order;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const updateCODPaymentStatus = createAsyncThunk<
  Order,
  { orderId: string; status: "paid" | "unpaid" }
>("order/updateCODPaymentStatus", async ({ orderId, status }, thunkAPI) => {
  try {
    // Use the generic payment status endpoint that works for both COD and GCash
    const res = await fetch(
      `http://3.107.22.251:2701/payments/update-payment-status/${orderId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status }),
      }
    );
    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage = `Failed to update payment status (${res.status})`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const response = await res.json();

    // Check if response structure is correct
    if (!response || typeof response !== "object") {
      throw new Error("Invalid response from server");
    }

    if (!response.response) {
      throw new Error(
        "Invalid response structure from server - missing 'response' field"
      );
    }

    if (!response.response.order) {
      const errorMsg =
        response.message ||
        "Invalid response structure from server - missing 'order' field";
      throw new Error(errorMsg);
    }

    const order = response.response.order;

    // Ensure _id exists (in case lean() converts it)
    if (!order._id && order.id) {
      order._id = order.id;
    }

    if (!order._id) {
      throw new Error("Order missing _id field");
    }

    return order as Order;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.message || "Failed to update payment status"
    );
  }
});

export const confirmCODPayment = createAsyncThunk<Order, string>(
  "order/confirmCODPayment",
  async (orderId, thunkAPI) => {
    try {
      const res = await fetch(
        `http://3.107.22.251:2701/payments/confirm-cod/${orderId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = `Failed to confirm COD payment (${res.status})`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      const response = await res.json();
      
      // Check if response structure is correct
      if (!response || typeof response !== 'object') {
        throw new Error("Invalid response from server");
      }
      
      if (!response.response) {
        throw new Error("Invalid response structure from server - missing 'response' field");
      }
      
      if (!response.response.order) {
        const errorMsg = response.message || "Invalid response structure from server - missing 'order' field";
        throw new Error(errorMsg);
      }
      
      const order = response.response.order;
      
      // Ensure _id exists (in case lean() converts it)
      if (!order._id && order.id) {
        order._id = order.id;
      }
      
      if (!order._id) {
        throw new Error("Order missing _id field");
      }
      
      return order as Order;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || "Failed to confirm COD payment");
    }
  }
);

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
        if (idx >= 0) state.value[idx] = action.payload;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCODPaymentStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCODPaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload._id) {
          const idx = state.value.findIndex((o) => o._id === action.payload._id);
          if (idx >= 0) state.value[idx] = action.payload;
        }
      })
      .addCase(updateCODPaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(confirmCODPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(confirmCODPayment.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload._id) {
          const idx = state.value.findIndex((o) => o._id === action.payload._id);
          if (idx >= 0) state.value[idx] = action.payload;
        }
      })
      .addCase(confirmCODPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setOrders, clearOrders } = orderSlice.actions;
export default orderSlice.reducer;
