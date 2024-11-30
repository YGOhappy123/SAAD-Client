import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ICartItem, IResponseData } from '../types'
import { Axios } from 'axios'

export interface AppState {
    cartItems: ICartItem[]
    orderNote: string
}

const initialState: AppState = {
    cartItems: [],
    orderNote: ''
}

export const fetchCartItems = createAsyncThunk('users/fetchCartItems', async (axios: Axios, { rejectWithValue }) => {
    try {
        const response = await axios.get<IResponseData<ICartItem[]>>(`/customers/cart/get-items`)
        return response.data
    } catch (error: any) {
        return rejectWithValue(error.response.data)
    }
})

export const addCartItem = createAsyncThunk(
    'users/addCartItem',
    async (
        { axios, milkteaId, size, toppings, quantity }: { axios: Axios; milkteaId: number; size: string; toppings: number[]; quantity: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post<IResponseData<ICartItem[]>>(`/customers/cart/add-item`, { milkteaId, size, toppings, quantity })
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const updateCartItem = createAsyncThunk(
    'users/updateCartItem',
    async (
        { axios, cartItemId, quantity, type }: { axios: Axios; cartItemId: number; quantity: number; type: 'increase' | 'decrease' },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.patch<IResponseData<any>>(`/customers/cart/update-item/${cartItemId}`, { quantity, type })
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const removeCartItem = createAsyncThunk(
    'users/removeCartItem',
    async ({ axios, cartItemId }: { axios: Axios; cartItemId: number }, { rejectWithValue }) => {
        try {
            const response = await axios.delete<IResponseData<any>>(`/customers/cart/remove-item/${cartItemId}`)
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const resetCartItems = createAsyncThunk('users/resetCartItems', async (axios: Axios, { rejectWithValue }) => {
    try {
        const response = await axios.post<IResponseData<any>>(`/customers/cart/reset`)
        return response.data
    } catch (error: any) {
        return rejectWithValue(error.response.data)
    }
})

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setOrderNote: (state, { payload }: { payload: string }) => {
            state.orderNote = payload
        },
        resetAppState: state => {
            return initialState
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchCartItems.fulfilled, (state, action) => {
            state.cartItems = action.payload.data
        })
    }
})

export const { setOrderNote, resetAppState } = appSlice.actions

export default appSlice.reducer
