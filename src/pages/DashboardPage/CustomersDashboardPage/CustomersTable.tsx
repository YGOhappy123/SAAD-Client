import { FC } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Avatar, Button, Modal, Table } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { ICustomer } from '../../../types'
import { RootState } from '../../../store'
import { buttonStyle } from '../../../assets/styles/globalStyle'
import dayjs from '../../../libs/dayjs'

interface UsersTableProps {
    isLoading: boolean
    total: number
    users: ICustomer[]
    current: number
    itemPerPage: number
    setItemPerPage: (newItemPerPage: number) => void
    setCurrent: (value: number) => void
    onDelete: (userId: number) => void
}

const CustomersTable: FC<UsersTableProps> = ({ current, setCurrent, isLoading, users, onDelete, total, setItemPerPage, itemPerPage }) => {
    const { t } = useTranslation()
    const user = useSelector((state: RootState) => state.auth.user)

    const onDeleteBtnClick = (userId: number, isActive: boolean) => {
        if (!isActive || user.role !== 'Admin') return

        Modal.confirm({
            icon: <ExclamationCircleFilled />,
            title: t('are you sure you want to lock this account? This operation cannot be undone'),
            okText: t('lock account'),
            cancelText: t('cancel'),
            onOk: () => {
                onDelete(userId)
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
                rowKey={(record: ICustomer) => record.userId}
                onChange={onChange}
                loading={isLoading}
                columns={[
                    {
                        title: t('customer id'),
                        dataIndex: 'userId',
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
                        title: t('avatar'),
                        dataIndex: 'avatar',
                        key: 'avatar',
                        align: 'center',
                        render: src => <Avatar src={src} size="large" />
                    },
                    {
                        title: t('email and address'),
                        width: 320,
                        key: 'email',
                        render: (_, record) => (
                            <div>
                                <div>
                                    Email:{' '}
                                    {record.email || (
                                        <small>
                                            <em>{t('not updated yet')}</em>
                                        </small>
                                    )}
                                </div>
                                <div>
                                    {t('address')}:{' '}
                                    {record.address || (
                                        <small>
                                            <em>{t('not updated yet')}</em>
                                        </small>
                                    )}
                                </div>
                            </div>
                        )
                    },
                    {
                        title: t('phone number'),
                        dataIndex: 'phoneNumber',
                        key: 'phoneNumber',
                        align: 'center',
                        width: 120,
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
                        title: t('full name'),
                        key: 'fullName',
                        width: 240,
                        render: (_, record) => (
                            <span>
                                {`${record.lastName} ${record.firstName}` || (
                                    <small>
                                        <em>{t('not updated yet')}</em>
                                    </small>
                                )}
                            </span>
                        )
                    },
                    {
                        title: t('orders this month'),
                        dataIndex: 'totalOrdersThisMonth',
                        key: 'ordersThisMonth',
                        align: 'center',
                        render: text => (
                            <span>
                                {text ?? (
                                    <small>
                                        <em>{t('not updated yet')}</em>
                                    </small>
                                )}
                            </span>
                        )
                    },
                    {
                        title: t('orders this year'),
                        dataIndex: 'totalOrdersThisYear',
                        key: 'ordersThisYear',
                        align: 'center',
                        render: text => (
                            <span>
                                {text ?? (
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
                                <Button
                                    onClick={() => onDeleteBtnClick(record.userId, record.isActive as boolean)}
                                    type="text"
                                    shape="round"
                                    danger
                                    style={{ border: '1px solid' }}
                                    disabled={!record.isActive || user.role !== 'Admin'}
                                >
                                    {record.isActive ? t('lock account') : t('account disabled')}
                                </Button>
                            )
                        }
                    }
                ]}
                dataSource={users}
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

export default CustomersTable
