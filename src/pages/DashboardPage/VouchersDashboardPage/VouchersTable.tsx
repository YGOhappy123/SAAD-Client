import { FC } from 'react'
import { useSelector } from 'react-redux'
import { Button, Modal, Table, Tag } from 'antd'
import { IVoucher } from '../../../types'
import { useTranslation } from 'react-i18next'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { buttonStyle } from '../../../assets/styles/globalStyle'
import dayjs from '../../../libs/dayjs'
import { RootState } from '../../../store'

interface VouchersTableProps {
    isLoading: boolean
    total: number
    vouchers: IVoucher[]
    current: number
    itemPerPage: number
    setItemPerPage: (newItemPerPage: number) => void
    setCurrent: (value: number) => void
    onDelete: (voucherId: string) => void
    onSelectVoucher: (voucher: IVoucher) => void
}

const VouchersTable: FC<VouchersTableProps> = ({
    current,
    setCurrent,
    isLoading,
    vouchers,
    onDelete,
    onSelectVoucher,
    total,
    itemPerPage,
    setItemPerPage
}) => {
    const { t } = useTranslation()
    const user = useSelector((state: RootState) => state.auth.user)

    const onDeleteBtnClick = (voucherId: string, isHidden: boolean | number) => {
        if (isHidden || user.role !== 'Admin') return

        Modal.confirm({
            icon: <ExclamationCircleFilled />,
            title: t('are you sure you want to disable this voucher? This operation cannot be undone'),
            okText: t('disable voucher'),
            cancelText: t('cancel'),
            onOk: () => {
                onDelete(voucherId)
            },
            okButtonProps: {
                danger: true,
                shape: 'round',
                style: { ...buttonStyle, width: '130px', marginLeft: '12px' }
            },
            cancelButtonProps: {
                type: 'text',
                shape: 'round',
                style: { ...buttonStyle, width: '100px' }
            }
        })
    }
    const onUpdateBtnClick = (voucher: IVoucher, isHidden: boolean | number) => {
        if (isHidden || user.role !== 'Admin') return
        onSelectVoucher(voucher)
    }

    const onChange = (values: any) => {
        const { current } = values
        setCurrent(current)
    }

    return (
        <>
            <Table
                style={{ width: '100%' }}
                rowKey={(record: IVoucher) => record.voucherId}
                onChange={onChange}
                loading={isLoading}
                columns={[
                    {
                        title: t('id'),
                        dataIndex: 'voucherId',
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
                        align: 'center',
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
                        title: t('code'),
                        dataIndex: 'code',
                        key: 'code',
                        align: 'center',
                        render: text => (
                            <Tag color="green" style={{ marginRight: 0 }}>
                                {text || (
                                    <small>
                                        <em>{t('not updated yet')}</em>
                                    </small>
                                )}
                            </Tag>
                        )
                    },
                    {
                        title: t('discount type'),
                        dataIndex: 'discountType',
                        key: 'discountType',
                        align: 'center',
                        render: text => (
                            <span>
                                {t(text.toLowerCase()) || (
                                    <small>
                                        <em>{t('not updated yet')}</em>
                                    </small>
                                )}
                            </span>
                        )
                    },
                    {
                        title: t('discount amount'),
                        key: 'discountAmount',
                        align: 'center',
                        render: (_, record) => {
                            const formattedValue =
                                record.discountType === 'Percent'
                                    ? `${record.discountAmount} %`
                                    : `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.discountAmount)}`

                            return (
                                <span>
                                    {formattedValue || (
                                        <small>
                                            <em>{t('not updated yet')}</em>
                                        </small>
                                    )}
                                </span>
                            )
                        }
                    },
                    {
                        title: t('total usage limit'),
                        dataIndex: 'totalUsageLimit',
                        key: 'totalUsageLimit',
                        align: 'center',
                        render: value => <span>{value}</span>
                    },
                    {
                        title: t('expired date'),
                        dataIndex: 'expiredDate',
                        key: 'expiredDate',
                        align: 'center',
                        render: text => (
                            <span>
                                {text ? (
                                    dayjs(text).format('DD/MM/YYYY HH:mm:ss')
                                ) : (
                                    <small>
                                        <em>{t('not updated yet')}</em>
                                    </small>
                                )}
                            </span>
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
                                        onClick={() => onUpdateBtnClick(record, record.isHidden)}
                                        shape="round"
                                        type="primary"
                                        disabled={record.isHidden || user.role !== 'Admin'}
                                    >
                                        {t('update')}
                                    </Button>
                                    <Button
                                        onClick={() => onDeleteBtnClick(record.voucherId, record.isHidden)}
                                        type="text"
                                        shape="round"
                                        danger
                                        style={{ border: '1px solid' }}
                                        disabled={record.isHidden || user.role !== 'Admin'}
                                    >
                                        {record.isHidden ? t('voucher disabled') : t('disable voucher')}
                                    </Button>
                                </div>
                            )
                        }
                    }
                ]}
                dataSource={vouchers}
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

export default VouchersTable
