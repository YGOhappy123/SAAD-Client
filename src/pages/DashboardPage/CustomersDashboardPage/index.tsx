import { useMutation } from 'react-query'
import { getI18n, useTranslation } from 'react-i18next'
import { Col, Row, Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { IResponseData, ICustomer } from '../../../types'
import { exportToCSV } from '../../../utils/export-csv'
import { buttonStyle } from '../../../assets/styles/globalStyle'
import CustomersTable from './CustomersTable'
import useUsers from '../../../services/users'
import SortAndFilter from './SortAndFilter'
import useAxiosIns from '../../../hooks/useAxiosIns'
import useTitle from '../../../hooks/useTitle'
import dayjs from 'dayjs'

export default function CustomersDashboardPage() {
    const {
        fetchUsersQuery,
        users,
        total,
        deleteUserMutation,
        current,
        setCurrent,
        buildQuery,
        onFilterSearch,
        searchUsersQuery,
        onResetFilterSearch,
        itemPerPage,
        setItemPerPage
    } = useUsers({ enabledFetchUsers: true })

    const { t } = useTranslation()
    const axios = useAxiosIns()
    const locale = getI18n().resolvedLanguage as 'vi' | 'en'
    useTitle(`${t('customer')} - PMT`)

    const onDeleteUser = (userId: number) => {
        deleteUserMutation.mutate(userId)
    }

    const fetchAllUsersMutation = useMutation({
        mutationFn: () => axios.get<IResponseData<ICustomer[]>>(`/customers?sort=${JSON.stringify({ id: 'ASC' })}`)
    })

    const onExportToCSV = async () => {
        const { data } = await fetchAllUsersMutation.mutateAsync()
        const users = data?.data.map(rawUser => ({
            [t('id').toString()]: rawUser.id,
            [t('created at')]: dayjs(rawUser.createdAt).format('DD/MM/YYYY'),
            [t('last name')]: rawUser.lastName,
            [t('first name')]: rawUser.firstName,
            Email: rawUser.email ?? t('not updated yet'),
            [t('phone number')]: rawUser.phoneNumber ?? t('not updated yet'),
            [t('address')]: rawUser.address ?? t('not updated yet'),
            [t('orders this month')]: rawUser.totalOrdersThisMonth,
            [t('orders this year')]: rawUser.totalOrdersThisYear
        }))
        exportToCSV(users, `PMT_${locale === 'vi' ? 'Khách_Hàng' : 'Customers'}_${dayjs(Date.now()).format('DD/MM/YYYY')}`, [
            { wch: 10 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 40 },
            { wch: 20 },
            { wch: 70 },
            { wch: 20 },
            { wch: 20 }
        ])
    }

    return (
        <Row>
            <Col span={24}>
                <Row align="middle" style={{ marginBottom: 16 }}>
                    <Col span={12}>
                        <h2>{t('customers')}</h2>
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
                                    loading={fetchAllUsersMutation.isLoading}
                                    style={{ ...buttonStyle, border: '1px solid' }}
                                    onClick={() => onExportToCSV()}
                                >
                                    <strong>{t('export csv')}</strong>
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <CustomersTable
                    total={total as number}
                    onDelete={onDeleteUser}
                    isLoading={searchUsersQuery.isFetching || fetchUsersQuery.isFetching || deleteUserMutation.isLoading}
                    users={users}
                    current={current}
                    setCurrent={setCurrent}
                    itemPerPage={itemPerPage}
                    setItemPerPage={newItemPerPage => setItemPerPage(newItemPerPage)}
                />
            </Col>
        </Row>
    )
}
