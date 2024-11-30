import { FC } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Avatar, Button, Divider, Modal, Table } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { IAdmin } from '../../../types'
import { RootState } from '../../../store'
import { buttonStyle } from '../../../assets/styles/globalStyle'
import dayjs from '../../../libs/dayjs'

interface AdminsTableProps {
    isLoading: boolean
    total: number
    admins: IAdmin[]
    current: number
    itemPerPage: number
    setItemPerPage: (newItemPerPage: number) => void
    setCurrent: (value: number) => void
    onDelete: (adminId: number) => void
}

const CustomersTable: FC<AdminsTableProps> = ({ current, setCurrent, isLoading, admins, total, setItemPerPage, itemPerPage, onDelete }) => {
    const { t } = useTranslation()
    const user = useSelector((state: RootState) => state.auth.user)

    const onDeleteBtnClick = (adminId: number, isActive: boolean) => {
        if (!isActive || adminId === user.id) return

        Modal.confirm({
            icon: <ExclamationCircleFilled />,
            title: t('are you sure you want to lock this account? This operation cannot be undone'),
            content: (
                <div>
                    <Divider style={{ margin: '10px 0', borderWidth: 2, borderColor: 'rgba(26, 26, 26, 0.12)' }} />
                </div>
            ),
            okText: t('lock account'),
            cancelText: t('cancel'),
            onOk: () => {
                onDelete(adminId)
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
                rowKey={(record: IAdmin) => record.id}
                onChange={onChange}
                loading={isLoading}
                columns={[
                    {
                        title: t('id') + ' ' + t('admin').toLocaleLowerCase(),
                        dataIndex: 'id',
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
                        title: 'Email',
                        dataIndex: 'email',
                        width: 280,
                        key: 'email',
                        render: text => (
                            <div>
                                {text || (
                                    <small>
                                        <em>{t('not updated yet')}</em>
                                    </small>
                                )}
                            </div>
                        )
                    },
                    {
                        title: 'Phone Number',
                        dataIndex: 'phoneNumber',
                        width: 180,
                        key: 'phoneNumber',
                        render: text => (
                            <div>
                                {text || (
                                    <small>
                                        <em>{t('not updated yet')}</em>
                                    </small>
                                )}
                            </div>
                        )
                    },
                    {
                        title: t('full name'),
                        key: 'fullName',
                        width: 200,
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
                        title: t('created by'),
                        dataIndex: 'createdBy',
                        key: 'createdBy',
                        align: 'center',
                        render: text => (
                            <span>
                                {text == null && (
                                    <small>
                                        <em>{t('none')}</em>
                                    </small>
                                )}
                                {text != null &&
                                    (text || (
                                        <small>
                                            <em>{t('not updated yet')}</em>
                                        </small>
                                    ))}
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
                                    onClick={() => onDeleteBtnClick(record.id, record.isActive as boolean)}
                                    shape="round"
                                    danger
                                    disabled={!record.isActive || record.id === user.id}
                                >
                                    {record.isActive ? t('lock account') : t('account disabled')}
                                </Button>
                            )
                        }
                    }
                ]}
                dataSource={admins}
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
