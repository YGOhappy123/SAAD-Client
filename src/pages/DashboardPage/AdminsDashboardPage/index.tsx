import { useState } from 'react'
import { useMutation } from 'react-query'
import { getI18n, useTranslation } from 'react-i18next'
import { Col, Row, Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { IResponseData, IAdmin } from '../../../types'
import { exportToCSV } from '../../../utils/export-csv'
import { buttonStyle, secondaryButtonStyle } from '../../../assets/styles/globalStyle'
import AdminsTable from './AdminsTable'
import AddAdminModal from './AddAdminModal'
import useAdmins from '../../../services/admins'
import SortAndFilter from './SortAndFilter'
import useAxiosIns from '../../../hooks/useAxiosIns'
import useTitle from '../../../hooks/useTitle'
import dayjs from 'dayjs'

export default function AdminsDashboardPage() {
    const {
        total,
        admins,
        current,
        setCurrent,
        buildQuery,
        fetchAdminsQuery,
        searchAdminsQuery,
        addAdminMutation,
        deleteAdminMutation,
        itemPerPage,
        setItemPerPage,
        onFilterSearch,
        onResetFilterSearch
    } = useAdmins({ enabledFetchAdmins: true })

    const { t } = useTranslation()
    const locale = getI18n().resolvedLanguage as 'vi' | 'en'
    const axios = useAxiosIns()
    useTitle(`${t('admin')} - PMT`)

    const [shouldAddModalOpen, setAddModalOpen] = useState(false)

    const onAddAdmin = (values: Partial<IAdmin>) => {
        addAdminMutation.mutateAsync(values).then(() => setAddModalOpen(false))
    }

    const onDeleteAdmin = (adminId: number) => {
        deleteAdminMutation.mutateAsync(adminId)
    }

    const fetchAllAdminsMutation = useMutation({
        mutationFn: () => axios.get<IResponseData<IAdmin[]>>(`/admins?sort=${JSON.stringify({ id: 'ASC' })}`)
    })

    const onExportToCSV = async () => {
        const { data } = await fetchAllAdminsMutation.mutateAsync()
        const users = data?.data.map(rawAdmin => ({
            [t('id').toString()]: rawAdmin.id,
            [t('created at')]: dayjs(rawAdmin.createdAt).format('DD/MM/YYYY'),
            [t('last name')]: rawAdmin.lastName,
            [t('first name')]: rawAdmin.firstName,
            Email: rawAdmin.email,
            [t('created by')]: rawAdmin.createdBy ?? t('none')
        }))

        exportToCSV(users, `PMT_${locale === 'vi' ? 'Quản_Lý' : 'Admins'}_${dayjs(Date.now()).format('DD/MM/YYYY')}`, [
            { wch: 10 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 40 },
            { wch: 40 }
        ])
    }

    return (
        <Row>
            <AddAdminModal
                onSubmit={onAddAdmin}
                isLoading={addAdminMutation.isLoading}
                shouldOpen={shouldAddModalOpen}
                onCancel={() => setAddModalOpen(false)}
            />

            <Col span={24}>
                <Row align="middle" style={{ marginBottom: 16 }}>
                    <Col span={12}>
                        <h2>{t('admins')}</h2>
                    </Col>
                    <Col span={12}>
                        <Row align="middle" justify="end" gutter={8}>
                            <Col span={5}>
                                <SortAndFilter onChange={buildQuery} onSearch={onFilterSearch} onReset={onResetFilterSearch} />
                            </Col>
                            <Col span={5}>
                                <Button block shape="round" style={{ ...secondaryButtonStyle }} onClick={() => setAddModalOpen(true)}>
                                    <strong>+ {t('add')}</strong>
                                </Button>
                            </Col>
                            <Col span={5}>
                                <Button
                                    block
                                    icon={<DownloadOutlined style={{ marginRight: '4px' }} />}
                                    type="text"
                                    shape="round"
                                    loading={fetchAllAdminsMutation.isLoading}
                                    style={{ ...buttonStyle, border: '1px solid' }}
                                    onClick={() => onExportToCSV()}
                                >
                                    <strong>{t('export csv')}</strong>
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <AdminsTable
                    total={total as number}
                    isLoading={searchAdminsQuery.isFetching || fetchAdminsQuery.isFetching}
                    onDelete={onDeleteAdmin}
                    admins={admins}
                    current={current}
                    setCurrent={setCurrent}
                    itemPerPage={itemPerPage}
                    setItemPerPage={newItemPerPage => setItemPerPage(newItemPerPage)}
                />
            </Col>
        </Row>
    )
}
