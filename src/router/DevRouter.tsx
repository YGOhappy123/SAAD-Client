import DevPage from '../pages/DevPage'
import ErrorPage from '../pages/ErrorPage'

const devRouter = [
    {
        path: '/dev',
        element: <DevPage />,
        errorElement: <ErrorPage />
    }
]

export default devRouter
