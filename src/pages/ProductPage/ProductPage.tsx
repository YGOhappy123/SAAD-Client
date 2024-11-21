import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useQuery } from 'react-query'
import { getI18n, useTranslation } from 'react-i18next'
import { Breadcrumb, Button, Card, Image, Skeleton, Space } from 'antd'
import { HomeOutlined, ReadOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { IMilktea, IResponseData } from '../../types'
import { RootState } from '../../store'
import { containerStyle } from '../../assets/styles/globalStyle'
import AddToCartModal from '../../components/AddToCartModal'
import useTitle from '../../hooks/useTitle'
import useAxiosIns from '../../hooks/useAxiosIns'
import '../../assets/styles/pages/ProductPage.css'

const ProductPage = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const locale = getI18n().resolvedLanguage as 'vi' | 'en'
    const user = useSelector((state: RootState) => state.auth.user)
    const axios = useAxiosIns()

    useTitle(`${t('product')} - PMT`)
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const { productId } = useParams()
    const [openAddToCartModal, setOpenAddToCartModal] = useState(false)

    const getProductQuery = useQuery(['product', productId], {
        queryFn: () => axios.get<IResponseData<IMilktea>>(`/product/milktea/${productId}`),
        select: res => res.data,
        retry: 1,
        enabled: true,
        refetchOnWindowFocus: false
    })
    const product = getProductQuery.data?.data as IMilktea
    const minPrice = !product ? 0 : ((product.price?.S ?? product.price?.M ?? product.price?.L) as number)
    const maxPrice = !product ? 0 : ((product.price?.L ?? product.price?.M ?? product.price?.S) as number)

    return (
        <div className="product-page">
            <section className="container-wrapper">
                <div className="container" style={containerStyle}>
                    <div className="product-info-wrapper">
                        {getProductQuery.isLoading && (
                            <Card style={{ width: '100%', marginTop: 16, height: '700px' }}>
                                <Skeleton loading avatar active></Skeleton>
                            </Card>
                        )}

                        {!getProductQuery.isLoading && product && (
                            <>
                                <AddToCartModal
                                    shouldOpen={openAddToCartModal}
                                    product={product}
                                    isLoading={false}
                                    onCancel={() => setOpenAddToCartModal(false)}
                                />

                                <Breadcrumb
                                    items={[
                                        {
                                            title: (
                                                <Link to="/">
                                                    <HomeOutlined className="breadcrumb-item" />
                                                </Link>
                                            )
                                        },
                                        {
                                            title: (
                                                <Link to="/menu">
                                                    <span className="breadcrumb-item">{t('menu')}</span>
                                                </Link>
                                            )
                                        },
                                        {
                                            title: (
                                                <Link to={`/menu?category=${locale === 'vi' ? product.category?.nameVi : product.category?.nameEn}`}>
                                                    <span className="breadcrumb-item">
                                                        {locale === 'vi' ? product.category?.nameVi : product.category?.nameEn}
                                                    </span>
                                                </Link>
                                            )
                                        },
                                        {
                                            title: <span className="breadcrumb-item">{locale === 'vi' ? product.nameVi : product.nameEn}</span>
                                        }
                                    ]}
                                />

                                <div className="product-info">
                                    <div className="product-feature-images">
                                        <div className="active-image">
                                            {product.image ? (
                                                <Image src={product.image} width={430} height={430} />
                                            ) : (
                                                <Image
                                                    src="../alt-feature-img.png"
                                                    width={430}
                                                    height={430}
                                                    preview={false}
                                                    style={{ background: 'rgba(0, 0, 0, 0.8)' }}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <div className="product-desc">
                                        <div className="product-name">{locale === 'vi' ? product.nameVi : product.nameEn}</div>
                                        <div className="product-sold-units">
                                            <span style={{ fontSize: '1rem', fontWeight: 500 }}>{product.soldUnitsThisYear}</span>
                                            <span style={{ color: '#767676', textTransform: 'lowercase' }}>{`${
                                                (product.soldUnitsThisYear as number) > 1 ? t('units are') : t('unit is')
                                            } ${t('sold this year')}`}</span>
                                        </div>
                                        <p className="product-description">{locale === 'vi' ? product.descriptionVi : product.descriptionEn}</p>
                                        <div className="product-price">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(minPrice)}
                                            {maxPrice > minPrice &&
                                                ` - ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(maxPrice)}`}
                                        </div>
                                        <Space align="center" size={15} style={{ marginTop: 30 }}>
                                            {(!user || user.role === 'User') && (
                                                <>
                                                    {product.isAvailable ? (
                                                        <Button onClick={() => setOpenAddToCartModal(true)} className="product-atc-btn">
                                                            <ShoppingCartOutlined style={{ fontSize: '1.4rem' }} />
                                                            {t('add to cart')}
                                                        </Button>
                                                    ) : (
                                                        <Button disabled className="product-atc-btn">
                                                            {t('this item is currently unavailable')}
                                                        </Button>
                                                    )}
                                                </>
                                            )}

                                            <Button type="primary" onClick={() => navigate('/menu')} className="product-btm-btn">
                                                <ReadOutlined style={{ fontSize: '1.4rem' }} />
                                                {t('see the menu')}
                                            </Button>
                                        </Space>
                                    </div>
                                </div>
                            </>
                        )}

                        {!getProductQuery.isLoading && !product && (
                            <div className="product-not-found">
                                <span className="oops-title">Oops!</span>
                                <p>
                                    {locale === 'en' ? 'This product does not exist or has been deleted.' : 'Sản phẩm không tồn tại hoặc đã bị xóa.'}
                                </p>
                                <Space align="center" size={15} style={{ marginTop: 30 }}>
                                    <Button onClick={() => navigate('/')} className="product-bth-btn">
                                        <HomeOutlined style={{ fontSize: '1.4rem' }} />
                                        {t('back to home')}
                                    </Button>
                                    <Button type="primary" onClick={() => navigate('/menu')} className="product-btm-btn">
                                        <ReadOutlined style={{ fontSize: '1.4rem' }} />
                                        {t('see the menu')}
                                    </Button>
                                </Space>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}
export default ProductPage
