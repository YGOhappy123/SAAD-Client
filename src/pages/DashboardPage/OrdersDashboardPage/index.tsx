import { useMutation } from 'react-query'
import { getI18n, useTranslation } from 'react-i18next'
import { Col, Row, Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { IOrder, IResponseData } from '../../../types'
import { exportToCSV } from '../../../utils/export-csv'
import { buttonStyle } from '../../../assets/styles/globalStyle'
import OrdersTable from './OrdersTable'
import SortAndFilter from './SortAndFilter'
import useOrders from '../../../services/orders'
import useTitle from '../../../hooks/useTitle'
import useAxiosIns from '../../../hooks/useAxiosIns'
import dayjs from 'dayjs'
import '../../../assets/styles/pages/MilkteasDashboardPage.css'

export default function UsersDashboardPage() {
    const {
        fetchOrdersQuery,
        orders,
        total,
        current,
        setCurrent,
        buildQuery,
        onFilterSearch,
        searchOrdersQuery,
        onResetFilterSearch,
        itemPerPage,
        setItemPerPage
    } = useOrders({ enabledFetchOrders: true })

    const { t } = useTranslation()
    const locale = getI18n().resolvedLanguage as 'vi' | 'en'
    useTitle(`${t('orders')} - PMT`)
    const axios = useAxiosIns()

    const fetchAllOrdersMutation = useMutation({
        mutationFn: () => axios.get<IResponseData<IOrder[]>>(`/orders/all`)
    })

    const onExportToCSV = async () => {
        const { data } = await fetchAllOrdersMutation.mutateAsync()
        const orders = data?.data.map(rawOrder => ({
            [t('id').toString()]: rawOrder.orderId,
            [t('created at')]: dayjs(rawOrder.createdAt).format('DD/MM/YYYY'),
            [t('customer')]: `${rawOrder.customer?.lastName} ${rawOrder.customer?.firstName}`,
            [t('items')]: rawOrder.items
                ?.map(item => `${locale === 'vi' ? item.nameVi : item.nameEn} (Size ${item.sizeId} x ${item.quantity})`)
                .join('; '),
            [t('total price')]: `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rawOrder.totalPrice)}`,
            [t('note')]: rawOrder.note ?? t('none'),
            [t('staff in charge')]: rawOrder.staff ? `${rawOrder.staff.lastName} ${rawOrder.staff.firstName}` : t('not updated yet'),
            [t('status')]: t(rawOrder.status.toLocaleLowerCase()),
            [t('rejection reason')]: rawOrder.rejectionReason
        }))
        exportToCSV(orders, `PMT_${locale === 'vi' ? 'Đơn_Hàng' : 'Orders'}_${dayjs(Date.now()).format('DD/MM/YYYY')}`, [
            { wch: 10 },
            { wch: 20 },
            { wch: 20 },
            { wch: 80 },
            { wch: 15 },
            { wch: 40 },
            { wch: 20 },
            { wch: 20 },
            { wch: 40 }
        ])
    }

    return (
        <Row>
            <Col span={24}>
                <Row align="middle" style={{ marginBottom: 16 }}>
                    <Col span={12}>
                        <h2>{t('orders')}</h2>
                    </Col>
                    <Col span={12}>
                        <Row align="middle" justify="end" gutter={8}>
                            <Col span={5}>
                                <SortAndFilter onChange={buildQuery} onSearch={onFilterSearch} onReset={onResetFilterSearch} />
                            </Col>
                            <Col span={5}>
                                <Button
                                    block
                                    icon={<DownloadOutlined style={{ marginRight: '4px' }} />}
                                    type="text"
                                    shape="round"
                                    style={{ ...buttonStyle, border: '1px solid' }}
                                    loading={fetchAllOrdersMutation.isLoading}
                                    onClick={() => onExportToCSV()}
                                >
                                    <strong>{t('export csv')}</strong>
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <OrdersTable
                    total={total as number}
                    isLoading={searchOrdersQuery.isFetching || fetchOrdersQuery.isFetching}
                    orders={orders}
                    current={current}
                    setCurrent={setCurrent}
                    itemPerPage={itemPerPage}
                    setItemPerPage={newItemPerPage => setItemPerPage(newItemPerPage)}
                />
            </Col>
        </Row>
    )
}
