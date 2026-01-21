import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store'

interface AuthState {
    userInfo: {
        email: string | null
    } | null
}

const initialState: AuthState = {
    userInfo: null,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ email: string }>
        ) => {
            state.userInfo = { email: action.payload.email }
        },
        logout: (state) => {
            state.userInfo = null
        },
    },
})

export const { setCredentials, logout } = authSlice.actions

export const selectCurrentUser = (state: RootState) => state.auth.userInfo

export default authSlice.reducer
