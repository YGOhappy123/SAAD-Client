import { FC } from 'react'
import { useSelector } from 'react-redux'
import { getI18n, useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Button, Modal, Table, Tag, Avatar, Divider, Input } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { ICustomer, IOrder, IOrderItem, IStaff, OrderStatus } from '../../../types'
import { RootState } from '../../../store'
import { buttonStyle, inputStyle } from '../../../assets/styles/globalStyle'
import useOrders from '../../../services/orders'
import toastConfig from '../../../configs/toast'
import dayjs from '../../../libs/dayjs'

interface OrdersTableProps {
    isLoading: boolean
    total: number
    orders: IOrder[]
    current: number
    itemPerPage: number
    setItemPerPage: (newItemPerPage: number) => void
    setCurrent: (value: number) => void
}

const OrdersTable: FC<OrdersTableProps> = ({ current, setCurrent, isLoading, orders, total, itemPerPage, setItemPerPage }) => {
    const { t } = useTranslation()
    const locale = getI18n().resolvedLanguage as 'vi' | 'en'
    const user = useSelector((state: RootState) => state.auth.user)
    const { updateOrderStatusMutation, rejectOrderStatusMutation } = useOrders({ enabledFetchOrders: false })

    const onUpdateBtnClick = (order: IOrder, type: OrderStatus) => {
        if (user.role !== 'Staff') return
        if (type === 'Accepted' && order.status !== 'Pending') return
        if (type === 'Done' && ((order.status !== 'Pending' && order.staffId !== user.userId) || order.status !== 'Accepted')) return

        updateOrderStatusMutation.mutate({ orderId: order.id, newStatus: type })
    }

    let rejectionReason = ''
    const onRejectBtnClick = (order: IOrder) => {
        if (user.role !== 'Staff') return
        if (order.status !== 'Pending' && (order.staffId !== user.userId || order.status !== 'Accepted')) return

        Modal.confirm({
            icon: <ExclamationCircleFilled />,
            title: t('are you sure you want to reject this order? This operation cannot be undone'),
            content: (
                <div>
                    <Divider style={{ margin: '10px 0', borderWidth: 2, borderColor: 'rgba(26, 26, 26, 0.12)' }} />
                    <p>{t('please enter the rejection reason')}</p>
                    <Input
                        style={inputStyle}
                        onChange={e => (rejectionReason = e.target.value)}
                        placeholder={t('rejection reason') + ' ...'}
                        type="text"
                        spellCheck="false"
                    />
                    <Divider style={{ margin: '10px 0', borderWidth: 2, borderColor: 'rgba(26, 26, 26, 0.12)' }} />
                </div>
            ),
            okText: t('reject order'),
            cancelText: t('cancel'),
            onOk: () => {
                if (!rejectionReason.trim()) {
                    toast(t('MISSING_REJECTION_REASON'), toastConfig('error'))
                    return
                }

                rejectOrderStatusMutation.mutate({
                    orderId: order.id,
                    rejectionReason: rejectionReason.trim()
                })
            },
            okButtonProps: {
                danger: true,
                shape: 'round',
                style: { ...buttonStyle, width: '130px', marginLeft: '12px' }
            },
            cancelButtonProps: {
                type: 'text',
                shape: 'round',
                style: { ...buttonStyle, width: '100px', border: '1px solid' }
            }
        })
    }

    const onChange = (values: any) => {
        const { current } = values
        setCurrent(current)
    }

    return (
        <>
            <Table
                style={{ width: '100%' }}
                rowKey={(record: IOrder) => record.id}
                onChange={onChange}
                loading={isLoading}
                columns={[
                    {
                        title: t('id'),
                        dataIndex: 'orderId',
                        key: 'id',
                        render: text => (
                            <span>
                                {text || (
                                    <small>
                                        <em>{t('not updated yet')}</em>
                                    </small>
                                )}
                            </span>
                        )
                    },
                    {
                        title: t('created at'),
                        dataIndex: 'createdAt',
                        key: 'createdAt',
                        render: text => (
                            <span>
                                {dayjs(text).format('DD/MM/YYYY HH:mm:ss') || (
                                    <small>
                                        <em>{t('not updated yet')}</em>
                                    </small>
                                )}
                            </span>
                        )
                    },
                    {
                        title: t('customer'),
                        dataIndex: 'customer',
                        key: 'customer',
                        width: 200,
                        render: (value: Partial<ICustomer>) => (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Avatar src={value.avatar} size="large" style={{ flexShrink: 0 }} />
                                <span>{value.lastName + ' ' + value.firstName}</span>
                            </div>
                        )
                    },
                    {
                        title: t('items'),
                        dataIndex: 'items',
                        key: 'items',
                        width: 350,
                        render: (items: IOrderItem[]) => (
                            <>
                                {items.map((item, index) => (
                                    <div key={index} className="dashboard-order-item">
                                        <p>
                                            {t('product')}: {locale === 'vi' ? item.nameVi : item.nameEn} ({t('size')} {item.size}) x{' '}
                                            {`${item.quantity}`.padStart(2, '0')}
                                        </p>
                                        <p>
                                            Topping:{' '}
                                            {item.toppings?.length
                                                ? `${item.toppings.map(tp => (locale === 'vi' ? tp.nameVi : tp.nameEn)).join(', ')}`
                                                : t('none')}
                                        </p>
                                        {index !== items.length - 1 && <Divider style={{ borderColor: 'rgba(26, 26, 26, 0.12)' }} />}
                                    </div>
                                ))}
                            </>
                        )
                    },
                    {
                        title: t('total price'),
                        dataIndex: 'totalPrice',
                        key: 'totalPrice',
                        align: 'center',
                        render: text => (
                            <Tag color="green" style={{ marginRight: 0 }}>
                                {<>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text)}</> || (
                                    <small>
                                        <em>{t('not updated yet')}</em>
                                    </small>
                                )}
                            </Tag>
                        )
                    },
                    {
                        title: t('note'),
                        dataIndex: 'note',
                        key: 'note',
                        width: 200,
                        render: text => (
                            <span>
                                {text || (
                                    <small>
                                        <em>{t('none')}</em>
                                    </small>
                                )}
                            </span>
                        )
                    },
                    {
                        title: t('staff in charge'),
                        dataIndex: 'staff',
                        key: 'staff',
                        width: 200,
                        render: (value: Partial<IStaff>) => (
                            <>
                                {value ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <Avatar src={value.avatar} size="large" style={{ flexShrink: 0 }} />
                                        <span>{value.lastName + ' ' + value.firstName}</span>
                                    </div>
                                ) : (
                                    <small>
                                        <em>{t('not updated yet')}</em>
                                    </small>
                                )}
                            </>
                        )
                    },
                    {
                        title: t('status'),
                        dataIndex: 'status',
                        key: 'status',
                        align: 'center',
                        render: (text: OrderStatus, record) => (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                                <Tag
                                    color={text === 'Pending' ? 'blue' : text === 'Accepted' ? 'orange' : text === 'Done' ? 'green' : 'red'}
                                    style={{ marginRight: 0 }}
                                >
                                    {t(text.toLowerCase())}
                                </Tag>
                                {text === 'Rejected' && (
                                    <span>
                                        {t('reason')}: {record.rejectionReason}
                                    </span>
                                )}
                            </div>
                        )
                    },
                    {
                        title: t('action'),
                        key: 'action',
                        align: 'center',
                        render: (_, record) => {
                            return (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                                    <Button
                                        onClick={() => onUpdateBtnClick(record, 'Accepted')}
                                        shape="round"
                                        type="primary"
                                        disabled={user.role !== 'Staff' || record.status !== 'Pending'}
                                        style={{ minWidth: 180 }}
                                    >
                                        {t('accept order')}
                                    </Button>
                                    <Button
                                        onClick={() => onRejectBtnClick(record)}
                                        shape="round"
                                        danger
                                        disabled={
                                            user.role !== 'Staff' ||
                                            (record.status !== 'Pending' && (record.staffId !== user.userId || record.status !== 'Accepted'))
                                        }
                                        style={{ border: '1px solid', minWidth: 180 }}
                                    >
                                        {t('reject order')}
                                    </Button>
                                    <Button
                                        onClick={() => onUpdateBtnClick(record, 'Done')}
                                        type="link"
                                        shape="round"
                                        style={{ border: '1px solid', minWidth: 180 }}
                                        disabled={
                                            user.role !== 'Staff' ||
                                            (record.status !== 'Pending' && record.staffId !== user.userId) ||
                                            record.status !== 'Accepted'
                                        }
                                    >
                                        {t('mark as done')}
                                    </Button>
                                </div>
                            )
                        }
                    }
                ]}
                dataSource={orders}
                pagination={{
                    pageSize: itemPerPage,
                    total,
                    current,
                    onShowSizeChange: (_, size) => {
                        setItemPerPage(size)
                    }
                }}
            />
        </>
    )
}

export default OrdersTable
