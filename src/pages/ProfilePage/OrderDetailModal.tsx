import { getI18n, useTranslation } from 'react-i18next'
import { Button, Divider, Modal, Row, Table } from 'antd'
import { IOrder, IOrderItem, IOrderItemTopping } from '../../types'
import dayjs from 'dayjs'
import '../../assets/styles/pages/ProfilePage.css'

interface IModalProps {
    orderDetails: IOrder
    onClose: () => void
}

const OrderDetailModal = ({ orderDetails, onClose }: IModalProps) => {
    const { t } = useTranslation()
    const locale = getI18n().resolvedLanguage as 'en' | 'vi'

    return (
        <Modal
            title={t('order details')}
            open
            onCancel={onClose}
            width={900}
            footer={[
                <Button key="close" type="primary" onClick={onClose} disabled={!orderDetails} style={{ fontWeight: 500 }}>
                    {t('close')}
                </Button>
            ]}
        >
            <div className="order-details">
                <Divider style={{ margin: '12px 0', borderWidth: 2, borderColor: 'rgba(26, 26, 26, 0.12)' }} />
                <Table
                    dataSource={orderDetails.items}
                    pagination={false}
                    scroll={{ y: 180 }}
                    rowKey={(_, index) => index as number}
                    columns={[
                        {
                            title: t("product's name"),
                            width: 170,
                            render: (_, record: IOrderItem) => <span>{locale === 'vi' ? record.nameVi : record.nameEn}</span>
                        },
                        {
                            title: 'Topping',
                            width: 200,
                            render: (_, record) => (
                                <span>
                                    {record.toppings?.length === 0 ? (
                                        <em>{t('none')}</em>
                                    ) : (
                                        record.toppings
                                            ?.map(tp => {
                                                return `${locale === 'vi' ? tp.nameVi : tp.nameEn} (${new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                }).format(tp.price as number)})`
                                            })
                                            .join(', ')
                                    )}
                                </span>
                            )
                        },
                        {
                            title: t('size'),
                            dataIndex: 'sizeId',
                            align: 'center'
                        },
                        {
                            title: t('quantity'),
                            dataIndex: 'quantity',
                            align: 'center',
                            render: value => <span>{`${value}`.padStart(2, '0')}</span>
                        },
                        {
                            title: t("milk tea's price"),
                            dataIndex: 'price',
                            align: 'center',
                            render: value => <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}</span>
                        },
                        {
                            title: t('total'),
                            align: 'center',
                            render: (_, record) => (
                                <span>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                        (record.toppings as IOrderItemTopping[]).reduce((acc, tp) => (acc += tp.price), record.price as number)
                                    )}
                                </span>
                            )
                        },
                        {
                            title: `${t('availability')}?`,
                            dataIndex: 'isAvailable',
                            align: 'center',
                            render: value => <span>{value ? t('yes') : t('no')}</span>
                        }
                    ]}
                />

                <Divider style={{ margin: '12px 0', borderWidth: 2, borderColor: 'rgba(26, 26, 26, 0.12)' }} />
                <Row justify="space-between" align="middle">
                    <span className="bold-text">{t('order date')}:</span>
                    <span>{dayjs(orderDetails.createdAt).format('DD/MM/YYYY HH:mm')}</span>
                </Row>
                <Row justify="space-between" align="middle">
                    <span className="bold-text">{t('last time status updated')}:</span>
                    <span>{dayjs(orderDetails.updatedAt).format('DD/MM/YYYY HH:mm')}</span>
                </Row>
                <Row justify="space-between" align="middle">
                    <span className="bold-text">{t('total price (shipping not included)')}:</span>
                    <span className="bold-text">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderDetails.totalPrice)}
                    </span>
                </Row>

                <Divider style={{ margin: '12px 0', borderWidth: 2, borderColor: 'rgba(26, 26, 26, 0.12)' }} />
                <Row justify="space-between" align="middle">
                    <span className="bold-text">{t('status')}:</span>
                    <span className="bold-text">{t(orderDetails.status.toLocaleLowerCase())}</span>
                </Row>
                {orderDetails?.staff && (
                    <Row justify="space-between" align="middle">
                        <span className="bold-text">{t('staff in charge')}:</span>
                        <span>
                            {orderDetails.staff.lastName} {orderDetails.staff.firstName}
                        </span>
                    </Row>
                )}
                {orderDetails.rejectionReason && (
                    <Row>
                        <div className="rejection-reason">
                            <span className="bold-text">{t('rejection reason')}:</span> <span className="reason">{orderDetails.rejectionReason}</span>
                        </div>
                    </Row>
                )}

                <Divider style={{ margin: '12px 0', borderWidth: 2, borderColor: 'rgba(26, 26, 26, 0.12)' }} />
            </div>
        </Modal>
    )
}

export default OrderDetailModal
