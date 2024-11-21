import { Suspense } from 'react'
import FragmentLayout from '../layouts/Fragment'
import CheckoutPage from '../pages/CheckoutPage'
import ThankYouPage from '../pages/ThankYouPage'
import ErrorPage from '../pages/ErrorPage'
import AuthProtector from '../components/AuthProtector'

const salesRouter = [
    {
        path: '/sales',
        element: (
            <Suspense>
                <FragmentLayout />
            </Suspense>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                path: 'checkout',
                element: <AuthProtector children={<CheckoutPage />} redirect="/auth" allowedRoles={['User']} />
            },
            {
                path: 'thanks/:orderId',
                element: <AuthProtector children={<ThankYouPage />} redirect="/auth" allowedRoles={['User']} />
            }
        ]
    }
]

export default salesRouter
