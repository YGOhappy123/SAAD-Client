import { configureStore } from '@reduxjs/toolkit'
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './slices/auth.slice'
import appReducer from './slices/app.slice'

export const store = configureStore({
    reducer: {
        auth: persistReducer(
            {
                key: 'auth',
                version: 1,
                storage
            },
            authReducer
        ),
        app: persistReducer(
            {
                key: 'app',
                version: 1,
                storage
            },
            appReducer
        )
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            }
        })
})

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
