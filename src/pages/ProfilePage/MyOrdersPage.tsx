import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { Button, Empty, Select, Skeleton, Table } from 'antd'
import { containerStyle } from '../../assets/styles/globalStyle'
import { IOrder, IResponseData } from '../../types'
import type { IOrderItem, OrderStatus } from '../../types'
import ProfileSidebar from '../../components/ProfileSidebar'
import OrderDetailModal from './OrderDetailModal'
import useTitle from '../../hooks/useTitle'
import useAxiosIns from '../../hooks/useAxiosIns'
import dayjs from 'dayjs'
import '../../assets/styles/pages/ProfilePage.css'

const MyOrdersPage = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const axios = useAxiosIns()

    useTitle(`${t('my orders')} - PMT`)
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const [activeStatus, setActiveStatus] = useState<OrderStatus | ''>('')
    const [sortOption, setSortOption] = useState('')
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [activeOrder, setActiveOrder] = useState<IOrder | null>(null)

    const fetchOrdersQuery = useQuery(['my-orders', sortOption], {
        queryFn: () => axios.get<IResponseData<IOrder[]>>(`/orders/my-orders?sort=${sortOption}`),
        enabled: true,
        refetchIntervalInBackground: true,
        refetchInterval: 5 * 60 * 1000,
        select: res => res.data
    })
    const orders = fetchOrdersQuery.data?.data ?? []

    const ORDER_STATUSES = ['Pending', 'Accepted', 'Rejected', 'Done']
    const MATCHING_ITEMS = useMemo(
        () => orders.filter((order: IOrder) => order.status === activeStatus || activeStatus === ''),
        [activeStatus, orders]
    )

    return (
        <div className="profile-page">
            <section className="container-wrapper">
                <div className="container" style={containerStyle}>
                    <ProfileSidebar />

                    <div className="my-orders">
                        <div className="heading">{t('my orders')}</div>
                        {fetchOrdersQuery.isLoading && <Skeleton />}

                        {orders.length === 0 && !fetchOrdersQuery.isLoading && (
                            <div className="empty-order">
                                <div className="empty-order-discover">
                                    <h2>{t("you don't have any orders")}</h2>
                                    <h3>{t("let's start an order!")}</h3>
                                    <Button size="large" shape="round" onClick={() => navigate('/menu')} className="start-order-btn">
                                        {t('start order')}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {orders.length > 0 && !fetchOrdersQuery.isLoading && (
                            <div>
                                <div className="order-filter">
                                    <div className="status-options">
                                        {ORDER_STATUSES.map((status: string) => (
                                            <div
                                                key={status}
                                                onClick={() => setActiveStatus(prev => (prev !== status ? (status as OrderStatus) : ''))}
                                                className={`status-option-item ${activeStatus === status ? 'active' : ''}`}
                                            >
                                                {t(status.toLowerCase())}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="sort-options">
                                        <Select
                                            placeholder={t('sort by...').toString()}
                                            size="large"
                                            style={{ width: 200 }}
                                            dropdownStyle={{ padding: 5 }}
                                            value={sortOption}
                                            onChange={value => setSortOption(value)}
                                        >
                                            <Select.Option value="createdAt" className="sort-option-item">
                                                {t('oldest orders')}
                                            </Select.Option>
                                            <Select.Option value="" className="sort-option-item">
                                                {t('latest orders')}
                                            </Select.Option>
                                            <Select.Option value="totalPrice" className="sort-option-item">
                                                {t('total order value')}
                                            </Select.Option>
                                            <Select.Option value="status" className="sort-option-item">
                                                {t('order status')}
                                            </Select.Option>
                                        </Select>
                                    </div>
                                </div>
                                <div className="order-list">
                                    <Table
                                        dataSource={MATCHING_ITEMS}
                                        locale={{
                                            emptyText: (
                                                <Empty
                                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                    description={
                                                        <p style={{ margin: '15px 0 0', fontSize: 15, fontWeight: 500, fontStyle: 'italic' }}>
                                                            {t('you have no order with status')}: {t(activeStatus.toLocaleLowerCase())}.
                                                        </p>
                                                    }
                                                />
                                            )
                                        }}
                                        rowKey={(record: IOrder) => record.orderId}
                                        columns={[
                                            { title: t('order ID'), dataIndex: 'orderId', width: 150 },
                                            {
                                                title: t('order date'),
                                                dataIndex: 'createdAt',
                                                render: value => <span>{dayjs(value).format('DD/MM/YYYY HH:mm')}</span>
                                            },
                                            {
                                                title: t('quantity'),
                                                dataIndex: 'items',
                                                align: 'center',
                                                render: (value: IOrderItem[]) => {
                                                    const totalItems = value.reduce((acc: number, item: any) => {
                                                        return acc + item.quantity
                                                    }, 0)
                                                    return <span>{`${totalItems}`.padStart(2, '0')}</span>
                                                }
                                            },
                                            {
                                                title: t('total value'),
                                                dataIndex: 'totalPrice',
                                                align: 'center',
                                                render: (value: number) => (
                                                    <span>
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}
                                                    </span>
                                                )
                                            },
                                            {
                                                title: t('status'),
                                                dataIndex: 'status',
                                                width: 150,
                                                align: 'center',
                                                render: (value: OrderStatus) => (
                                                    <span className={`table-order-status ${value}`}>{t(value.toLocaleLowerCase())}</span>
                                                )
                                            },
                                            {
                                                title: t('details'),
                                                render: (_, record) => (
                                                    <Button
                                                        type="primary"
                                                        shape="round"
                                                        onClick={() => {
                                                            setActiveOrder(record)
                                                            setOpenModal(true)
                                                        }}
                                                        style={{ fontWeight: 500 }}
                                                    >
                                                        {t('view')}
                                                    </Button>
                                                )
                                            }
                                        ]}
                                        pagination={{ defaultPageSize: 4, showSizeChanger: false }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {openModal && activeOrder && (
                        <OrderDetailModal
                            orderDetails={activeOrder}
                            onClose={() => {
                                setOpenModal(false)
                            }}
                        />
                    )}
                </div>
            </section>
        </div>
    )
}

export default MyOrdersPage
