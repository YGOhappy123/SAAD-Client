import { useState } from 'react'
import { useMutation } from 'react-query'
import { useSelector } from 'react-redux'
import { getI18n, useTranslation } from 'react-i18next'
import { Col, Row, Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { exportToCSV } from '../../../utils/export-csv'
import { IResponseData, IVoucher } from '../../../types'
import { RootState } from '../../../store'
import { buttonStyle, secondaryButtonStyle } from '../../../assets/styles/globalStyle'
import AddVoucherModal from './AddVoucherModal'
import UpdateVoucherModal from './UpdateVoucherModal'
import SortAndFilter from './SortAndFilter'
import VouchersTable from './VouchersTable'
import useVouchers from '../../../services/vouchers'
import useTitle from '../../../hooks/useTitle'
import useAxiosIns from '../../../hooks/useAxiosIns'
import dayjs from 'dayjs'

export default function UsersDashboardPage() {
    const {
        fetchVouchersQuery,
        vouchers,
        total,
        addVoucherMutation,
        disableVoucherMutation,
        updateVoucherMutation,
        current,
        setCurrent,
        buildQuery,
        onFilterSearch,
        searchVouchersQuery,
        onResetFilterSearch,
        itemPerPage,
        setItemPerPage
    } = useVouchers({ enabledFetchVouchers: true })

    const { t } = useTranslation()
    const axios = useAxiosIns()
    const locale = getI18n().resolvedLanguage as 'vi' | 'en'
    useTitle(`${t('vouchers')} - PMT`)

    const user = useSelector((state: RootState) => state.auth.user)
    const [shouldAddModalOpen, setAddModelOpen] = useState(false)
    const [shouldUpdateModalOpen, setUpdateModalOpen] = useState(false)
    const [selectedVoucher, setSelectedVoucher] = useState<IVoucher | null>(null)

    const onAddVoucher = (values: IVoucher) => {
        addVoucherMutation.mutateAsync(values).finally(() => setAddModelOpen(false))
    }
    const onUpdateVoucher = (values: IVoucher) => {
        updateVoucherMutation.mutateAsync({ voucherId: selectedVoucher?.voucherId as string, data: values }).finally(() => setUpdateModalOpen(false))
    }
    const onDeleteVoucher = (voucherId: string) => {
        disableVoucherMutation.mutate(voucherId)
    }

    const fetchAllVouchersMutation = useMutation({
        mutationFn: () => axios.get<IResponseData<IVoucher[]>>(`/vouchers/all?sort=${JSON.stringify({ voucherId: 'ASC' })}`)
    })

    const onExportToCSV = async () => {
        const { data } = await fetchAllVouchersMutation.mutateAsync()
        const vouchers = data?.data.map(rawVoucher => ({
            [t('id').toString()]: rawVoucher.voucherId,
            [t('created at')]: dayjs(rawVoucher.createdAt).format('DD/MM/YYYY'),
            [t('code')]: rawVoucher.code,
            [t('discount type')]: t(rawVoucher.discountType.toLocaleLowerCase()),
            [t('discount amount')]:
                rawVoucher.discountType === 'Percent'
                    ? `${rawVoucher.discountAmount} %`
                    : `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rawVoucher.discountAmount)}`,
            [t('total usage limit')]: rawVoucher.totalUsageLimit,
            [t('expired date')]: rawVoucher.expiredDate ? dayjs(rawVoucher.expiredDate).format('DD/MM/YYYY') : t('none')
        }))
        exportToCSV(vouchers, `PMT_${locale === 'vi' ? 'Mã_Giảm_Giá' : 'Vouchers'}_${dayjs(Date.now()).format('DD/MM/YYYY')}`, [
            { wch: 10 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 }
        ])
    }

    return (
        <Row>
            <UpdateVoucherModal
                isLoading={updateVoucherMutation.isLoading}
                onSubmit={onUpdateVoucher}
                voucher={selectedVoucher}
                shouldOpen={shouldUpdateModalOpen}
                onCancel={() => setUpdateModalOpen(false)}
            />
            <AddVoucherModal
                onSubmit={onAddVoucher}
                isLoading={addVoucherMutation.isLoading}
                shouldOpen={shouldAddModalOpen}
                onCancel={() => setAddModelOpen(false)}
            />

            <Col span={24}>
                <Row align="middle" style={{ marginBottom: 16 }}>
                    <Col span={12}>
                        <h2>{t('vouchers')}</h2>
                    </Col>
                    <Col span={12}>
                        <Row align="middle" justify="end" gutter={8}>
                            <Col span={5}>
                                <SortAndFilter onChange={buildQuery} onSearch={onFilterSearch} onReset={onResetFilterSearch} />
                            </Col>
                            {user.role === 'Admin' && (
                                <Col span={5}>
                                    <Button block shape="round" style={{ ...secondaryButtonStyle }} onClick={() => setAddModelOpen(true)}>
                                        <strong>+ {t('add')}</strong>
                                    </Button>
                                </Col>
                            )}
                            <Col span={5}>
                                <Button
                                    block
                                    icon={<DownloadOutlined style={{ marginRight: '4px' }} />}
                                    type="text"
                                    shape="round"
                                    style={{ ...buttonStyle, border: '1px solid' }}
                                    loading={fetchAllVouchersMutation.isLoading}
                                    onClick={() => onExportToCSV()}
                                >
                                    <strong>{t('export csv')}</strong>
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <VouchersTable
                    total={total as number}
                    onDelete={onDeleteVoucher}
                    onSelectVoucher={voucher => {
                        setSelectedVoucher(voucher)
                        setUpdateModalOpen(true)
                    }}
                    isLoading={
                        searchVouchersQuery.isFetching ||
                        fetchVouchersQuery.isFetching ||
                        disableVoucherMutation.isLoading ||
                        addVoucherMutation.isLoading ||
                        updateVoucherMutation.isLoading
                    }
                    vouchers={vouchers}
                    current={current}
                    setCurrent={setCurrent}
                    itemPerPage={itemPerPage}
                    setItemPerPage={newItemPerPage => setItemPerPage(newItemPerPage)}
                />
            </Col>
        </Row>
    )
}
