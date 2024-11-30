import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useMutation, useQuery } from 'react-query'
import { getI18n, useTranslation } from 'react-i18next'
import { Col, Row, Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { exportToCSV } from '../../../utils/export-csv'
import { ICategory, IResponseData, IMilktea } from '../../../types'
import { RootState } from '../../../store'
import { buttonStyle, secondaryButtonStyle } from '../../../assets/styles/globalStyle'
import SortAndFilter from './SortAndFilter'
import MilkteasTable from './MilkteasTable'
import AddMilkteaModal from './AddMilkteaModal'
import UpdateMilkteaModal from './UpdateMilkteaModal'
import useAxiosIns from '../../../hooks/useAxiosIns'
import useTitle from '../../../hooks/useTitle'
import useDebounce from '../../../hooks/useDebounce'
import useProducts from '../../../services/products'
import dayjs from 'dayjs'
import '../../../assets/styles/pages/MilkteasDashboardPage.css'

export default function MilkteasDashboardPage() {
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
    useTitle(`${t('milkteas')} - PMT`)

    const [shouldAddModalOpen, setAddModelOpen] = useState(false)
    const [shouldUpdateModalOpen, setUpdateModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<IMilktea | null>(null)
    const [searchCategory, setSearchCategory] = useState<string>('')
    const [query, setQuery] = useState<string>('')
    const debouncedSearchCategory = useDebounce(searchCategory)
    const user = useSelector((state: RootState) => state.auth.user)

    const fetchAllCategoriesQuery = useQuery(['categories-all', query], {
        queryFn: () => {
            return axios.get<IResponseData<ICategory[]>>(`/category/get?filter=${query}`)
        },
        refetchOnWindowFocus: false,
        enabled: false,
        select: res => res.data
    })
    const categories = fetchAllCategoriesQuery.data?.data || []

    const onAddProduct = (values: Partial<IMilktea>) => {
        addProductMutation.mutateAsync(values).finally(() => setAddModelOpen(false))
    }

    const onUpdateProduct = async (values: Partial<IMilktea>) => {
        await updateProductMutation.mutateAsync({ productId: selectedProduct?.milkteaId as number, data: values })
    }

    const onDeleteProduct = (productId: number) => {
        toggleProductHiddenStatusMutation.mutate(productId)
    }

    const fetchAllProductsMutation = useMutation({
        mutationFn: () => axios.get<IResponseData<IMilktea[]>>(`/product/getAllMilkTeas?sort=${JSON.stringify({ milkteaId: 'ASC' })}`)
    })

    const onExportToCSV = async () => {
        const { data } = await fetchAllProductsMutation.mutateAsync()
        const milkteas = data?.data.map(rawProduct => ({
            [t('id').toString()]: rawProduct.milkteaId,
            [t('created at')]: dayjs(rawProduct.createdAt).format('DD/MM/YYYY'),
            [t('name vi')]: rawProduct.nameVi,
            [t('name en')]: rawProduct.nameEn,
            [t('description vi')]: rawProduct.descriptionVi,
            [t('description en')]: rawProduct.descriptionEn,
            [t('unit price')]: Object.entries(rawProduct.price)
                .map(item => `${item[0]}-${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item[1] as number)}`)
                .join(', '),
            [t('category')]: locale === 'vi' ? rawProduct.category?.nameVi : rawProduct.category?.nameEn,
            [t('is available') + '?']: rawProduct.isAvailable ? t('yes') : t('no')
        }))

        exportToCSV(milkteas, `PMT_${locale === 'vi' ? 'Trà_Sữa' : 'Milk_Teas'}_${dayjs(Date.now()).format('DD/MM/YYYY')}`, [
            { wch: 10 },
            { wch: 20 },
            { wch: 40 },
            { wch: 40 },
            { wch: 100 },
            { wch: 100 },
            { wch: 40 },
            { wch: 25 },
            { wch: 15 }
        ])
    }

    useEffect(() => {
        if (!debouncedSearchCategory || !(debouncedSearchCategory as string).trim()) {
            setQuery('')
        } else {
            const query: any = {}
            query[`name.${locale}`] = { $regex: `^${debouncedSearchCategory}` }
            setQuery(JSON.stringify(query))
        }
    }, [debouncedSearchCategory])

    useEffect(() => {
        fetchAllCategoriesQuery.refetch()
    }, [query, shouldUpdateModalOpen, shouldAddModalOpen])

    return (
        <Row>
            <UpdateMilkteaModal
                isLoading={updateProductMutation.isLoading}
                onSubmit={onUpdateProduct}
                product={selectedProduct}
                shouldOpen={shouldUpdateModalOpen}
                closeModal={() => setUpdateModalOpen(false)}
                categories={categories}
                isLoadingCategory={fetchAllCategoriesQuery.isLoading}
                onSearchCategory={value => setSearchCategory(value)}
                onCategoryChange={() => setQuery('')}
                onCancel={() => setUpdateModalOpen(false)}
            />

            <AddMilkteaModal
                onSubmit={onAddProduct}
                isLoading={addProductMutation.isLoading}
                shouldOpen={shouldAddModalOpen}
                categories={categories.filter(item => !item.isActive)}
                isLoadingCategory={fetchAllCategoriesQuery.isLoading}
                onSearchCategory={value => setSearchCategory(value)}
                onCategoryChange={() => setQuery('')}
                onCancel={() => setAddModelOpen(false)}
            />

            <Col span={24}>
                <Row align="middle" style={{ marginBottom: 16 }}>
                    <Col span={12}>
                        <h2>{t('milkteas')}</h2>
                    </Col>
                    <Col span={12}>
                        <Row align="middle" justify="end" gutter={8}>
                            <Col span={5}>
                                <SortAndFilter
                                    categories={categories}
                                    onChange={buildQuery}
                                    onSearch={onFilterSearch}
                                    onReset={onResetFilterSearch}
                                />
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

                <MilkteasTable
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
