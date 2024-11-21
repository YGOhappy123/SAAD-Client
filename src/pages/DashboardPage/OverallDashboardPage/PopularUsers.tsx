import { Avatar, Button, Card, Table, Tag } from 'antd'
import { CustomerTotalSpending, ICustomer, IUser } from '../../../types'
import { getI18n, useTranslation } from 'react-i18next'
import { ColumnsType } from 'antd/es/table'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

interface PopularUsersProps {
    data?: CustomerTotalSpending[] | Partial<ICustomer>[]
    title?: string
    isLoading?: boolean
    highlightFieldDisplay?: string
    highlightField?: string
    type?: 'newest' | 'highestTotalOrderValue'
}

export default function PopularUsers({ highlightField, highlightFieldDisplay, type, data, title, isLoading }: PopularUsersProps) {
    const { t } = useTranslation()

    return (
        <Card
            title={title}
            style={{
                borderRadius: '12px',
                boxShadow: '0px 0px 16px rgba(17,17,26,0.1)',
                minHeight: '485px'
            }}
        >
            <Table
                size="small"
                style={{ width: '100%' }}
                rowKey={(record: CustomerTotalSpending | Partial<ICustomer>) => record.userId as number}
                loading={isLoading}
                columns={[
                    {
                        title: t('id') + ' ' + t('customer').toLocaleLowerCase(),
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
                        title: t('avatar'),
                        dataIndex: 'avatar',
                        key: 'avatar',
                        align: 'center',
                        render: avatar => <Avatar src={avatar} size="large" />
                    },
                    {
                        title: t('name'),
                        dataIndex: 'name',
                        key: 'name',
                        render: (_, record) => (
                            <div>
                                <div>{`${record.lastName} ${record.firstName}`}</div>
                            </div>
                        )
                    },
                    {
                        title: t('phone number'),
                        dataIndex: 'phoneNumber',
                        key: 'phoneNumber',
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
                        title: highlightFieldDisplay,
                        dataIndex: highlightField,
                        key: highlightField,
                        align: 'center',
                        render: value => (
                            <Tag color={type === 'newest' ? 'blue' : 'green'}>
                                <strong>
                                    {type === 'newest'
                                        ? dayjs(value).format('DD/MM/YYYY - HH:mm')
                                        : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}
                                </strong>
                            </Tag>
                        )
                    }
                ]}
                dataSource={data}
                pagination={false}
            />
        </Card>
    )
}
