import { FC, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getI18n, useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { Avatar, Button, Card, Col, Row, Skeleton } from 'antd'
import { IResponseData, ICategory, IMilktea } from '../types'
import { containerStyle } from '../assets/styles/globalStyle'
import useAxiosIns from '../hooks/useAxiosIns'
import MilkteaCard from './MilkteaCard'
import AddToCartModal from './AddToCartModal'
import '../assets/styles/components/Menu.css'

interface IProps {
    isMenuPage?: boolean
}

const Menu: FC<IProps> = ({ isMenuPage }) => {
    const { t } = useTranslation()
    const locale = getI18n().resolvedLanguage as 'vi' | 'en'
    const axios = useAxiosIns()
    const navigate = useNavigate()

    const DEFAULT_FILTER = { isAvailable: true, isActive: true }
    const [limit, setLimit] = useState<number | null>(6)
    const [prevLocale, setPrevLocale] = useState<'vi' | 'en'>()
    const [searchProductQuery, setSearchProductQuery] = useState<string>('')
    const [categoryQuery, setCategoryQuery] = useSearchParams()
    const [selectedProduct, setSelectedProduct] = useState<IMilktea | null>(null)
    const [openAddToCartModal, setOpenAddToCartModal] = useState(false)

    const fetchCategoriesQuery = useQuery(['menu-categories'], {
        queryFn: () => axios.get<IResponseData<ICategory[]>>(`/products/categories?filter=${JSON.stringify({ isActive: true })}`),
        enabled: true,
        refetchIntervalInBackground: true,
        refetchInterval: 10000,
        select: res => res.data
    })

    const fetchProductsQuery = useQuery(['menu-products', limit, searchProductQuery], {
        queryFn: () => axios.get<IResponseData<IMilktea[]>>(`/products/milkteas?filter=${searchProductQuery}&limit=${limit}`),
        enabled: true,
        refetchIntervalInBackground: true,
        refetchInterval: 10000,
        select: res => res.data
    })

    const categories = fetchCategoriesQuery.data?.data ?? []
    const products = fetchProductsQuery.data?.data ?? []

    useEffect(() => {
        if (isMenuPage) {
            setLimit(null)
        }
        return () => {}
    }, [isMenuPage])

    useEffect(() => {
        const activeCategory = categories?.find(category => (locale === 'vi' ? category.nameVi : category.nameEn) === categoryQuery.get('category'))
        if (activeCategory) {
            setSearchProductQuery(JSON.stringify({ categoryId: activeCategory.id, ...DEFAULT_FILTER }))
        } else {
            setSearchProductQuery(JSON.stringify({ ...DEFAULT_FILTER }))
        }
    }, [categoryQuery.get('category'), categories])

    useEffect(() => {
        setPrevLocale(locale)
        const newCategory = categories?.find(category => (prevLocale === 'vi' ? category.nameVi : category.nameEn) === categoryQuery.get('category'))
        if (newCategory != undefined) {
            setCategoryQuery({ category: locale === 'vi' ? newCategory.nameVi : newCategory.nameEn })
        }
    }, [locale])

    return (
        <>
            <AddToCartModal
                shouldOpen={openAddToCartModal}
                product={selectedProduct}
                isLoading={false}
                onCancel={() => setOpenAddToCartModal(false)}
            />

            <section className="menu">
                <div className="container" style={containerStyle}>
                    <h2 className="heading">{t('our menu')}</h2>
                    <ul className="filters-menu">
                        {fetchCategoriesQuery.isLoading && <Skeleton.Button active size="large" shape="round" block />}
                        {!fetchCategoriesQuery.isLoading && categories.length > 0 && (
                            <li
                                className={`filters-item ${!categoryQuery.get('category') ? 'active' : ''}`}
                                onClick={() => {
                                    setCategoryQuery({})
                                }}
                            >
                                {t('all')}
                            </li>
                        )}
                        {categories?.map(value => (
                            <li
                                className={`filters-item ${
                                    categoryQuery.get('category') === (locale === 'vi' ? value.nameVi : value.nameEn) ? 'active' : ''
                                }`}
                                key={value.id}
                                onClick={() => {
                                    setCategoryQuery({ category: locale === 'vi' ? value.nameVi : value.nameEn })
                                }}
                            >
                                {locale === 'vi' ? value.nameVi : value.nameEn}
                            </li>
                        ))}
                    </ul>

                    <div className="filter-content">
                        {fetchProductsQuery.isLoading && (
                            <Row style={{ width: '100%' }} gutter={12}>
                                {Array(limit ? limit : 20)
                                    .fill(0)
                                    .map((_, idx) => (
                                        <Col key={idx} span={8}>
                                            <Card loading style={{ height: '350px', width: '100%' }} />
                                        </Col>
                                    ))}
                            </Row>
                        )}

                        {products?.map(product => (
                            <MilkteaCard
                                key={product.id}
                                product={product}
                                handleClick={() => {
                                    setSelectedProduct(product)
                                    setOpenAddToCartModal(true)
                                }}
                            />
                        ))}

                        {!fetchProductsQuery.isLoading && !products.length && (
                            <Row style={{ width: '100%' }} justify="center">
                                <Col style={{ textAlign: 'center' }}>
                                    <Avatar src="/empty-cart.png" size={340} />
                                    <h4 className="heading">{t('cannot find any products')}</h4>
                                </Col>
                            </Row>
                        )}
                    </div>

                    {!isMenuPage && (
                        <div style={{ marginTop: 45, display: 'flex', justifyContent: 'center' }}>
                            <Button type="primary" shape="round" size="large" className="view-more-btn" onClick={() => navigate('/menu')}>
                                {t('view more')}
                            </Button>
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}

export default Menu
