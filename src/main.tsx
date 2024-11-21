import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { ToastContainer } from 'react-toastify'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ConfigProvider } from 'antd'
import { store } from './store'
import getRouter from './router/index'
import 'react-toastify/dist/ReactToastify.css'
import './assets/styles/index.css'
import './libs/i18n'

const isDev = import.meta.env.VITE_NODE_ENV === 'dev'
const GG_CLIENT_ID = import.meta.env.VITE_GG_CLIENT_ID
const persistor = persistStore(store)
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <GoogleOAuthProvider clientId={GG_CLIENT_ID}>
        <ConfigProvider
            theme={{ token: { colorPrimary: '#FFBE33', colorPrimaryHover: '#E69C00' } }}
            children={
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <QueryClientProvider client={queryClient}>
                            <RouterProvider router={getRouter(isDev)} />
                        </QueryClientProvider>
                    </PersistGate>
                    <ToastContainer />
                </Provider>
            }
        />
    </GoogleOAuthProvider>
)
