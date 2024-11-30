import { useQuery } from 'react-query'
import { useMemo, useState } from 'react'
import { getI18n, useTranslation } from 'react-i18next'
import { Avatar, Card, Col, Row } from 'antd'
import { DollarOutlined, DropboxOutlined } from '@ant-design/icons'
import { ICategory, IMilktea, IResponseData, ISalesData } from '../../../types'
import useAxiosIns from '../../../hooks/useAxiosIns'
import '../../../assets/styles/pages/ProfilePage.css'

interface IProductCardProps {
    product: IMilktea
}

interface ProductSalesDataByTime {
    daily: ISalesData
    weekly: ISalesData
    monthly: ISalesData
    yearly: ISalesData
}

export default function ProductCard({ product }: IProductCardProps) {
    const { t } = useTranslation()
    const locale = getI18n().resolvedLanguage as 'vi' | 'en'
    const axios = useAxiosIns()

    const [type, setType] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily')

    const getProductSalesDataQuery = useQuery({
        queryKey: ['product-sales-data', product.id],
        queryFn: () => axios.get<IResponseData<ProductSalesDataByTime>>(`/statistic/products/${product.id}`),
        refetchIntervalInBackground: true,
        refetchInterval: 10000,
        select: res => res.data?.data
    })

    const salesData = getProductSalesDataQuery.data
    const { totalSales, totalUnits } = useMemo(() => {
        if (!salesData) return { totalSales: 0, totalUnits: 0 }

        switch (type) {
            case 'daily':
                return salesData.daily
            case 'weekly':
                return salesData.weekly
            case 'monthly':
                return salesData.monthly
            case 'yearly':
                return salesData.yearly
        }
    }, [type, getProductSalesDataQuery.isFetching])

    const minPrice = (product.price?.s ?? product.price?.m ?? product.price?.l) as number
    const maxPrice = (product.price?.l ?? product.price?.m ?? product.price?.s) as number

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

    return (
        <Card
            style={{
                marginTop: '60px',
                position: 'relative',
                minHeight: '300px',
                textAlign: 'center',
                borderRadius: '12px',
                boxShadow: '0px 0px 16px rgba(17,17,26,0.1)'
            }}
        >
            <Avatar
                style={{
                    position: 'absolute',
                    top: '-55px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    border: '5px solid white',
                    backgroundColor: '#f5f5f5'
                }}
                size={110}
                src={product.image || '../alt-feature-img.png'}
            />

            <Row justify="center">
                <Col>
                    <div style={{ fontSize: '30px', margin: '40px 0 0', color: '#ffbe33' }}>
                        <strong>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(minPrice)}
                            {maxPrice > minPrice && ` - ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(maxPrice)}`}
                        </strong>
                    </div>
                    <div style={{ margin: '12px 0' }}>
                        <strong style={{ fontSize: '20px', color: '#222831' }}>{locale === 'vi' ? product.nameVi : product.nameEn}</strong>
                        <div style={{ fontSize: '14px', color: '#222831', fontWeight: 600 }}>
                            {locale === 'vi' ? (product.category as ICategory).nameVi : (product.category as ICategory).nameEn}
                        </div>
                    </div>

                    <div className="product-card-desc" style={{ maxWidth: 407 }}>
                        {t('description')}: {locale === 'vi' ? product.descriptionVi : product.descriptionEn}
                    </div>
                    <div style={{ margin: '12px 0' }} className="my-orders">
                        <strong style={{ fontSize: '20px' }}>{t('overall')}</strong>
                        <div className="order-filter" style={{ marginTop: '12px' }}>
                            <div className="status-options" style={{ justifyContent: 'center' }}>
                                {segmentedOptions.map(option => (
                                    <div
                                        onClick={() => setType(option.value as any)}
                                        key={option.value}
                                        className={`status-option-item ${type === option.value ? 'active' : ''}`}
                                    >
                                        <small>{option.label}</small>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Row align="middle" justify="space-between" style={{ padding: '12px 0 0' }}>
                            <Col style={{ fontSize: '18px', fontWeight: 500 }}>
                                <div>
                                    <DollarOutlined /> {t('total sales')}
                                </div>
                            </Col>
                            <Col style={{ fontSize: '18px', fontWeight: 500 }}>
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalSales ?? 0)}
                            </Col>
                        </Row>
                        <Row align="middle" justify="space-between" style={{ padding: '12px 0 0' }}>
                            <Col style={{ fontSize: '18px', fontWeight: 500 }}>
                                <div>
                                    <DropboxOutlined /> {t('total units')}
                                </div>
                            </Col>
                            <Col style={{ fontSize: '18px', fontWeight: 500 }}>{totalUnits ?? 0}</Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </Card>
    )
}
