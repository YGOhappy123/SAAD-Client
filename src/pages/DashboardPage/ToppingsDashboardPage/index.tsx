import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useMutation } from 'react-query'
import { getI18n, useTranslation } from 'react-i18next'
import { Col, Row, Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { exportToCSV } from '../../../utils/export-csv'
import { IResponseData, ITopping } from '../../../types'
import { RootState } from '../../../store'
import { buttonStyle, secondaryButtonStyle } from '../../../assets/styles/globalStyle'
import SortAndFilter from './SortAndFilter'
import ToppingsTable from './ToppingsTable'
import AddToppingModal from './AddToppingModal'
import UpdateToppingModal from './UpdateToppingModal'
import useAxiosIns from '../../../hooks/useAxiosIns'
import useTitle from '../../../hooks/useTitle'
import useProducts from '../../../services/toppings'
import dayjs from 'dayjs'
import '../../../assets/styles/pages/MilkteasDashboardPage.css'

export default function ToppingsDashboardPage() {
    const {
        fetchProductsQuery,
        products,
        total,
        addProductMutation,
        toggleProductHiddenStatusMutation,
        updateProductMutation,
        current,
        setCurrent,
        buildQuery,
        onFilterSearch,
        searchProductsQuery,
        onResetFilterSearch,
        itemPerPage,
        setItemPerPage
    } = useProducts({ enabledFetchProducts: true })

    const { t } = useTranslation()
    const axios = useAxiosIns()
    const locale = getI18n().resolvedLanguage as 'vi' | 'en'
    useTitle(`${t('Toppings')} - PMT`)

    const [shouldAddModalOpen, setAddModelOpen] = useState(false)
    const [shouldUpdateModalOpen, setUpdateModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<ITopping | null>(null)
    const user = useSelector((state: RootState) => state.auth.user)

    const onAddProduct = (values: Partial<ITopping>) => {
        addProductMutation.mutateAsync(values).finally(() => setAddModelOpen(false))
    }

    const onUpdateProduct = (values: Partial<ITopping>) => {
        updateProductMutation.mutateAsync({ productId: selectedProduct?.toppingId as number, data: values }).finally(() => setUpdateModalOpen(false))
    }

    const onDeleteProduct = (productId: number) => {
        toggleProductHiddenStatusMutation.mutate(productId)
    }

    const fetchAllProductsMutation = useMutation({
        mutationFn: () => axios.get<IResponseData<ITopping[]>>(`/product/getAllToppings?sort=${JSON.stringify({ toppingId: 'ASC' })}`)
    })

    const onExportToCSV = async () => {
        const { data } = await fetchAllProductsMutation.mutateAsync()
        const toppings = data?.data.map(rawProduct => ({
            [t('id').toString()]: rawProduct.toppingId,
            [t('created at')]: dayjs(rawProduct.createdAt).format('DD/MM/YYYY'),
            [t('name vi')]: rawProduct.nameVi,
            [t('name en')]: rawProduct.nameEn,
            [t('description vi')]: rawProduct.descriptionVi,
            [t('description en')]: rawProduct.descriptionEn,
            [t('unit price')]: `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rawProduct.price as number)}`,
            [t('is available') + '?']: rawProduct.isAvailable ? t('yes') : t('no')
        }))
        exportToCSV(toppings, `PMT_${locale === 'vi' ? 'Topping' : 'Toppings'}_${dayjs(Date.now()).format('DD/MM/YYYY')}`, [
            { wch: 10 },
            { wch: 20 },
            { wch: 40 },
            { wch: 40 },
            { wch: 100 },
            { wch: 100 },
            { wch: 15 },
            { wch: 15 }
        ])
    }

    return (
        <Row>
            <UpdateToppingModal
                isLoading={updateProductMutation.isLoading}
                onSubmit={onUpdateProduct}
                product={selectedProduct}
                shouldOpen={shouldUpdateModalOpen}
                onCancel={() => setUpdateModalOpen(false)}
            />

            <AddToppingModal
                onSubmit={onAddProduct}
                isLoading={addProductMutation.isLoading}
                shouldOpen={shouldAddModalOpen}
                onCancel={() => setAddModelOpen(false)}
            />

            <Col span={24}>
                <Row align="middle" style={{ marginBottom: 16 }}>
                    <Col span={12}>
                        <h2>{t('toppings')}</h2>
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
                                    loading={fetchAllProductsMutation.isLoading}
                                    onClick={() => onExportToCSV()}
                                >
                                    <strong>{t('export csv')}</strong>
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <ToppingsTable
                    total={total as number}
                    onDelete={onDeleteProduct}
                    onSelectProduct={product => {
                        setSelectedProduct(product)
                        setUpdateModalOpen(true)
                    }}
                    isLoading={
                        searchProductsQuery.isFetching ||
                        fetchProductsQuery.isFetching ||
                        toggleProductHiddenStatusMutation.isLoading ||
                        addProductMutation.isLoading ||
                        updateProductMutation.isLoading
                    }
                    products={products}
                    current={current}
                    setCurrent={setCurrent}
                    itemPerPage={itemPerPage}
                    setItemPerPage={newItemPerPage => setItemPerPage(newItemPerPage)}
                />
            </Col>
        </Row>
    )
}
