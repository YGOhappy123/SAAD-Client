import { useState } from 'react'
import { getI18n, useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import { Col, Row, Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { buttonStyle, secondaryButtonStyle } from '../../../assets/styles/globalStyle'
import { ICategory, IResponseData } from '../../../types'
import { exportToCSV } from '../../../utils/export-csv'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import SortAndFilter from './SortAndFilter'
import CategoriesTable from './CategoriesTable'
import UpdateCategoryModal from './UpdateCategoryModal'
import AddCategoryModal from './AddCategoryModal'
import useTitle from '../../../hooks/useTitle'
import useAxiosIns from '../../../hooks/useAxiosIns'
import useCategories from '../../../services/categories'
import dayjs from 'dayjs'

const CategoriesDashboardPage = () => {
    const { t } = useTranslation()
    const locale = getI18n().resolvedLanguage as 'vi' | 'en'
    const axios = useAxiosIns()
    useTitle(`${t('categories')} - PMT`)

    const user = useSelector((state: RootState) => state.auth.user)
    const [shouldAddModalOpen, setAddModalOpen] = useState(false)
    const [shouldUpdateModalOpen, setUpdateModalOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null)

    const {
        fetchCategoriesQuery,
        categories,
        total,
        addCategoryMutation,
        toggleCategoryHiddenStatusMutation,
        updateCategoryMutation,
        current,
        setCurrent,
        buildQuery,
        onFilterSearch,
        searchCategoriesQuery,
        onResetFilterSearch,
        itemPerPage,
        setItemPerPage
    } = useCategories({ enabledFetchCategories: true })

    const onAddCategory = (values: Partial<ICategory>) => {
        addCategoryMutation.mutateAsync(values).finally(() => setAddModalOpen(false))
    }

    const onUpdateCategory = (values: Partial<ICategory>) => {
        updateCategoryMutation.mutateAsync({ categoryId: selectedCategory?.categoryId as number, data: values })
    }

    const onDeleteCategory = (categoryId: number) => {
        toggleCategoryHiddenStatusMutation.mutate(categoryId)
    }

    const fetchAllCategoriesMutation = useMutation({
        mutationFn: () => axios.get<IResponseData<ICategory[]>>(`/category/get?sort=${JSON.stringify({ categoryId: 'ASC' })}`)
    })

    const onExportToCSV = async () => {
        const { data } = await fetchAllCategoriesMutation.mutateAsync()
        const categories = data?.data.map(rawCategory => ({
            [t('id').toString()]: rawCategory.categoryId,
            [t('created at')]: dayjs(rawCategory.createdAt).format('DD/MM/YYYY'),
            [t('name vi')]: rawCategory.nameVi,
            [t('name en')]: rawCategory.nameEn
        }))

        exportToCSV(categories, `PMT_${locale === 'vi' ? 'Danh_Mục' : 'Categories'}_${dayjs(Date.now()).format('DD/MM/YYYY')}`, [
            { wch: 10 },
            { wch: 20 },
            { wch: 40 },
            { wch: 40 }
        ])
    }

    return (
        <Row>
            <UpdateCategoryModal
                isLoading={updateCategoryMutation.isLoading}
                onSubmit={onUpdateCategory}
                category={selectedCategory}
                shouldOpen={shouldUpdateModalOpen}
                onCancel={() => setUpdateModalOpen(false)}
            />

            <AddCategoryModal
                onSubmit={onAddCategory}
                isLoading={addCategoryMutation.isLoading}
                shouldOpen={shouldAddModalOpen}
                onCancel={() => setAddModalOpen(false)}
            />

            <Col span={24}>
                <Row align="middle" style={{ marginBottom: 16 }}>
                    <Col span={12}>
                        <h2>{t('categories')}</h2>
                    </Col>
                    <Col span={12}>
                        <Row align="middle" justify="end" gutter={8}>
                            <Col span={5}>
                                <SortAndFilter onChange={buildQuery} onSearch={onFilterSearch} onReset={onResetFilterSearch} />
                            </Col>
                            {user.role === 'Admin' && (
                                <Col span={5}>
                                    <Button block shape="round" style={{ ...secondaryButtonStyle }} onClick={() => setAddModalOpen(true)}>
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
                                    loading={fetchAllCategoriesMutation.isLoading}
                                    style={{ ...buttonStyle, border: '1px solid' }}
                                    onClick={() => onExportToCSV()}
                                >
                                    <strong>{t('export csv')}</strong>
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <CategoriesTable
                    total={total as number}
                    onDelete={onDeleteCategory}
                    onSelectCategory={category => {
                        setSelectedCategory(category)
                        setUpdateModalOpen(true)
                    }}
                    isLoading={
                        searchCategoriesQuery.isFetching ||
                        fetchCategoriesQuery.isFetching ||
                        toggleCategoryHiddenStatusMutation.isLoading ||
                        addCategoryMutation.isLoading ||
                        updateCategoryMutation.isLoading
                    }
                    categories={categories}
                    current={current}
                    setCurrent={setCurrent}
                    itemPerPage={itemPerPage}
                    setItemPerPage={newItemPerPage => setItemPerPage(newItemPerPage)}
                />
            </Col>
        </Row>
    )
}

export default CategoriesDashboardPage
