import { Suspense } from 'react'
import {
    OverallDashboardPage,
    CustomersDashboardPage,
    MilkteasDashboardPage,
    OrdersDashboardPage,
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
                <AuthProtector children={<DashboardLayout />} redirect="/auth" allowedRoles={['Admin']} />
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
