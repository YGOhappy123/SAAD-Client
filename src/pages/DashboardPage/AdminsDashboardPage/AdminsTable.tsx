import { FC } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Avatar, Button, Table, Tag } from 'antd'
import { IAdmin } from '../../../types'
import { RootState } from '../../../store'
import dayjs from '../../../libs/dayjs'

interface AdminsTableProps {
    isLoading: boolean
    total: number
    admins: IAdmin[]
    current: number
    itemPerPage: number
    setItemPerPage: (newItemPerPage: number) => void
    setCurrent: (value: number) => void
    onSelectAdmin: (admin: IAdmin) => void
}

const CustomersTable: FC<AdminsTableProps> = ({ current, setCurrent, isLoading, admins, total, setItemPerPage, itemPerPage, onSelectAdmin }) => {
    const { t } = useTranslation()
    const user = useSelector((state: RootState) => state.auth.user)

    const onUpdateBtnClick = (admin: IAdmin) => {
        if (user.userId !== admin.adminId) return
        onSelectAdmin(admin)
    }
    const onChange = (values: any) => {
        const { current } = values
        setCurrent(current)
    }

    return (
        <>
            <Table
                style={{ width: '100%' }}
                rowKey={(record: IAdmin) => record.adminId}
                onChange={onChange}
                loading={isLoading}
                columns={[
                    {
                        title: t('id') + ' ' + t('admin').toLocaleLowerCase(),
                        dataIndex: 'adminId',
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
                        title: t('gender'),
                        dataIndex: 'gender',
                        key: 'gender',
                        align: 'center',
                        render: text => (
                            <Tag color={text === 'Male' ? 'blue' : 'pink'} style={{ marginRight: 0 }}>
                                {t(text.toLocaleLowerCase()) ?? (
                                    <small>
                                        <em>{t('not updated yet')}</em>
                                    </small>
                                )}
                            </Tag>
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
                                    onClick={() => onUpdateBtnClick(record)}
                                    shape="round"
                                    type="primary"
                                    disabled={user.userId !== record.adminId}
                                >
                                    {t('update')}
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
