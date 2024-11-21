import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Row, Col, Button } from 'antd'
import UsersSummary from './UsersSummary'
import RevenuesSummary from './RevenuesSummary'
import OrdersSummary from './OrdersSummary'
import PopularProducts from './PopularProducts'
import PopularUsers from './PopularUsers'
import useStatistics from '../../../services/statistics'
import useTitle from '../../../hooks/useTitle'

const DashboardPage = () => {
    const { t } = useTranslation()
    useTitle(`${t('dashboard')} - PMT`)

    const { getStatisticsQuery, getPopularDataQuery, setType } = useStatistics()

    const orders = getStatisticsQuery.data?.orders
    const revenues = getStatisticsQuery.data?.revenues
    const users = getStatisticsQuery.data?.users

    const productsWithHighestSales = getPopularDataQuery.data?.productsWithHighestSales || []
    const newCustomers = getPopularDataQuery.data?.newCustomers || []
    const usersWithHighestTotalOrderValue = getPopularDataQuery.data?.usersWithHighestTotalOrderValue || []

    const segmentedOptions = [
        {
            label: t('daily'),
            value: 'daily'
        },
        {
            label: t('weekly'),
            value: 'weekly'
        },
        {
            label: t('monthly'),
            value: 'monthly'
        },
        {
            label: t('yearly'),
            value: 'yearly'
        }
    ]
    const [selectedSegment, setSelectedSegment] = useState<string>(segmentedOptions[0].value)

    useEffect(() => {
        const segmentOption = segmentedOptions.find(option => option.value === selectedSegment)
        setType(segmentOption?.value as any)
    }, [selectedSegment])

    return (
        <Row>
            <Col span={24}>
                <Row align="middle" style={{ marginBottom: 16 }}>
                    <Col span={12}>
                        <h2>Dashboard</h2>
                    </Col>
                    <Col span={12}>
                        <Row align="middle" justify="end" gutter={8}>
                            <Col>
                                <Row>
                                    {segmentedOptions.map(option => (
                                        <Col key={option.label?.toString()}>
                                            <Button
                                                style={{ padding: '8px 0px', height: 'unset', minWidth: '90px' }}
                                                onClick={() => setSelectedSegment(option.value)}
                                                type={selectedSegment === option.value ? 'primary' : 'text'}
                                            >
                                                {option.label}
                                            </Button>
                                        </Col>
                                    ))}
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>

            <Col span={24}>
                <Row align="middle" justify="space-between" gutter={12}>
                    <Col lg={24} xl={8}>
                        <RevenuesSummary
                            loading={getStatisticsQuery.isLoading}
                            value={revenues?.currentCount}
                            previousValue={revenues?.previousCount}
                        />
                    </Col>
                    <Col lg={24} xl={8}>
                        <OrdersSummary loading={getStatisticsQuery.isLoading} value={orders?.currentCount} previousValue={orders?.previousCount} />
                    </Col>
                    <Col lg={24} xl={8}>
                        <UsersSummary loading={getStatisticsQuery.isLoading} value={users?.currentCount} previousValue={users?.previousCount} />
                    </Col>
                </Row>
            </Col>

            <Col span={24} style={{ padding: '12px 0' }}>
                <Row gutter={12}>
                    <Col span={24}>
                        <PopularProducts
                            isLoading={getPopularDataQuery.isLoading}
                            data={productsWithHighestSales}
                            title={t('products with the highest total sales').toString()}
                        />
                    </Col>
                </Row>
            </Col>

            <Col span={24}>
                <Row gutter={12}>
                    <Col lg={24} xl={12}>
                        <PopularUsers
                            isLoading={getPopularDataQuery.isLoading}
                            data={newCustomers}
                            highlightFieldDisplay={t('created at').toString()}
                            highlightField="createdAt"
                            type="newest"
                            title={t('newest customers').toString()}
                        />
                    </Col>
                    <Col lg={24} xl={12}>
                        <PopularUsers
                            isLoading={getPopularDataQuery.isLoading}
                            data={usersWithHighestTotalOrderValue}
                            highlightFieldDisplay={t('total order value').toString()}
                            type="highestTotalOrderValue"
                            highlightField="amount"
                            title={t('customers with highest total order value').toString()}
                        />
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default DashboardPage
