import { Suspense } from 'react'
import {
    OverallDashboardPage,
    CustomersDashboardPage,
    MilkteasDashboardPage,
    OrdersDashboardPage,
    VouchersDashboardPage,
    CategoriesDashboardPage,
    StatisticsDashboardPage,
    ToppingsDashboardPage,
    AdminsDashboardPage
} from '../pages/DashboardPage'
import DashboardLayout from '../layouts/Dashboard'
import ErrorPage from '../pages/ErrorPage'
import AuthProtector from '../components/AuthProtector'

const dashboardRouter = [
    {
        path: '/dashboard',
        element: (
            <Suspense>
                <AuthProtector children={<DashboardLayout />} redirect="/auth" allowedRoles={['Admin', 'Staff']} />
            </Suspense>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                path: '',
                element: <OverallDashboardPage />
            },
            {
                path: 'customers',
                element: <CustomersDashboardPage />
            },
            {
                path: 'milkteas',
                element: <MilkteasDashboardPage />
            },
            {
                path: 'toppings',
                element: <ToppingsDashboardPage />
            },
            {
                path: 'vouchers',
                element: <VouchersDashboardPage />
            },
            {
                path: 'orders',
                element: <OrdersDashboardPage />
            },
            {
                path: 'categories',
                element: <CategoriesDashboardPage />
            },
            {
                path: 'statistics',
                element: <StatisticsDashboardPage />
            },
            {
                path: 'admins',
                element: <AuthProtector children={<AdminsDashboardPage />} redirect="/auth" allowedRoles={['Admin']} />
            }
        ]
    }
]

export default dashboardRouter
