import { Suspense } from 'react'
import AuthPage from '../pages/AuthPage'
import ErrorPage from '../pages/ErrorPage'

const authRouter = [
    {
        path: '/auth',
        element: (
            <Suspense>
                <AuthPage />
            </Suspense>
        ),
        errorElement: <ErrorPage />
    }
]

export default authRouter
