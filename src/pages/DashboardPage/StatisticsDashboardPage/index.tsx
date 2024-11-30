import { useState } from 'react'
import { useQuery } from 'react-query'
import { getI18n, useTranslation } from 'react-i18next'
import { Row, Col, Select, Empty, Card, Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { IMilktea, IResponseData } from '../../../types'
import { exportToCSV } from '../../../utils/export-csv'
import { buttonStyle } from '../../../assets/styles/globalStyle'
import RevenuesChart from './RevenuesChart'
import ProductCard from './ProductCard'
import useAxiosIns from '../../../hooks/useAxiosIns'
import dayjs from '../../../libs/dayjs'

export default function OverallDashboardPage() {
    const { t } = useTranslation()
    const axios = useAxiosIns()
    const locale = getI18n().resolvedLanguage as 'vi' | 'en'
    const [type, setType] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily')

    const getRevenuesChartQuery = useQuery({
        queryKey: ['revenues-chart', type, locale],
        queryFn: () => axios.get<IResponseData<any>>(`/statistic/revenues?type=${type}`),
        refetchIntervalInBackground: true,
        refetchInterval: 10000,
        select: res => res.data?.data
    })

    const getMilkteasQuery = useQuery({
        queryKey: 'statistic-milkteas',
        queryFn: () => axios.get<IResponseData<IMilktea[]>>(`/products/milkteas`),
        refetchIntervalInBackground: true,
        refetchInterval: 10000,
        select: res => res.data?.data
    })

    const milkteas = getMilkteasQuery.data

    return (
        <Row>
            <Col span={24} style={{ marginBottom: 16 }}>
                <Row align="middle">
                    <Col span={12}>
                        <h2>{t('statistics')}</h2>
                    </Col>
                    <Col span={12}></Col>
                </Row>
            </Col>

            <Col span={24}>
                <RevenuesChart
                    loading={getRevenuesChartQuery.isLoading}
                    data={getRevenuesChartQuery.data}
                    extra={
                        <Select value={type} size="large" style={{ width: 200 }} dropdownStyle={{ padding: 5 }} onChange={value => setType(value)}>
                            <Select.Option value="daily" className="sort-option-item">
                                {t('daily')}
                            </Select.Option>
                            <Select.Option value="weekly" className="sort-option-item">
                                {t('weekly')}
                            </Select.Option>
                            <Select.Option value="monthly" className="sort-option-item">
                                {t('monthly')}
                            </Select.Option>
                            <Select.Option value="yearly" className="sort-option-item">
                                {t('yearly')}
                            </Select.Option>
                        </Select>
                    }
                />
            </Col>
            <Col span={24} style={{ padding: '24px 0' }}>
                <Row align="middle" justify="space-between">
                    <Col style={{ marginBottom: 16 }}>
                        <h2>{t('products overall')}</h2>
                    </Col>
                </Row>
                {getMilkteasQuery.isLoading && (
                    <Row style={{ width: '100%' }} gutter={12}>
                        {Array(20)
                            .fill(0)
                            .map((_, idx) => (
                                <Col key={idx} span={8}>
                                    <Card loading style={{ height: '350px', width: '100%' }} />
                                </Col>
                            ))}
                    </Row>
                )}
                {!getMilkteasQuery.isLoading && milkteas?.length && (
                    <Row gutter={12}>
                        {milkteas?.map(milktea => (
                            <Col xs={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }} key={milktea.id} style={{ paddingBottom: '24px' }}>
                                <ProductCard product={milktea} />
                            </Col>
                        ))}
                    </Row>
                )}
                {!getMilkteasQuery.isLoading && milkteas?.length === 0 && (
                    <Row gutter={12} align="middle" justify="center">
                        <Col>
                            <Empty />
                        </Col>
                    </Row>
                )}
            </Col>
        </Row>
    )
}
