import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

// --- Types ---
export interface Address {
  street?: string;
  city?: string;
  province?: string;
  zip?: string;
}

export interface User {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  avatar: string | null;
  isVerified: boolean;
  addresses: Address[];
  createdAt: string | null;
  updatedAt: string | null;
}

const initialState: { value: User[]; loading: boolean; error: string | null } =
  {
    value: [],
    loading: false,
    error: null,
  };

// --- Thunks ---
export const fetchUsers = createAsyncThunk<User[]>(
  "user/fetchUsers",
  async (_, thunkAPI) => {
    try {
      const res = await fetch("http://10.34.126.49:2701/users/get-all-users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const response = await res.json();
      return response.response as User[]; // unwrap
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const fetchUserById = createAsyncThunk<User, string>(
  "user/fetchUserById",
  async (id, thunkAPI) => {
    try {
      const res = await fetch(`http://10.34.126.49:2701/users/get-user/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch user");
      const response = await res.json();
      return response.response as User; // unwrap
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const updateUserAsync = createAsyncThunk<User, User>(
  "user/updateUser",
  async (user, thunkAPI) => {
    try {
      const res = await fetch(
        `http://10.34.126.49:2701/users/update-user/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(user),
        }
      );
      if (!res.ok) throw new Error("Failed to update user");
      const response = await res.json();
      return response.response as User; // unwrap
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const deleteUserAsync = createAsyncThunk<string, string>(
  "user/deleteUser",
  async (id, thunkAPI) => {
    try {
      const res = await fetch(`http://10.34.126.49:2701/users/delete-user/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete user");
      // backend usually returns { status, message, response: id }
      const response = await res.json();
      return response.response ?? id;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// --- Slice ---
const userAction = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.value.push(action.payload);
    },
    setUser: (state, action: PayloadAction<User[]>) => {
      state.value = action.payload;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.value = state.value.map((u) =>
        u.id === action.payload.id ? { ...u, ...action.payload } : u
      );
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.value = state.value.filter((u) => u.id !== action.payload);
    },
    clearUser: (state) => {
      state.value = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.value = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        // replace or add single user
        const idx = state.value.findIndex((u) => u.id === action.payload.id);
        if (idx >= 0) state.value[idx] = action.payload;
        else state.value.push(action.payload);
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.value = state.value.map((u) =>
          u.id === action.payload.id ? action.payload : u
        );
      })
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        state.value = state.value.filter((u) => u.id !== action.payload);
      });
  },
});

export const { addUser, setUser, updateUser, removeUser, clearUser } =
  userAction.actions;
export default userAction.reducer;
