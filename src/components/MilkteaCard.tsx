import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button, Tooltip } from 'antd'
import { getI18n, useTranslation } from 'react-i18next'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { IMilktea } from '../types'
import { RootState } from '../store'

interface IProps {
    product: IMilktea
    handleClick: () => void
}

const MilkteaCard = ({ product, handleClick }: IProps) => {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const locale = getI18n().resolvedLanguage as 'vi' | 'en'
    const user = useSelector((state: RootState) => state.auth.user)

    const minPrice = (product.price?.S ?? product.price?.M ?? product.price?.L) as number
    const maxPrice = (product.price?.L ?? product.price?.M ?? product.price?.S) as number

    return (
        <div className="menu-card-wrapper">
            <div className="menu-card">
                <div className="image-wrapper">
                    <img src={product.image ?? 'alt-feature-img.png'} className="image" onClick={() => navigate(`/product/${product.milkteaId}`)} />
                </div>
                <div className="description">
                    <h5 className="name" onClick={() => navigate(`/product/${product.milkteaId}`)}>
                        {locale === 'vi' ? product.nameVi : product.nameEn}
                    </h5>
                    <p>{locale === 'vi' ? product.descriptionVi : product.descriptionEn}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h6 className="price">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(minPrice)}
                            {maxPrice > minPrice && ` - ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(maxPrice)}`}
                        </h6>
                        {(!user || user.role === 'User') && (
                            <Tooltip title={t('add to cart')} placement="bottom">
                                <Button
                                    type="primary"
                                    shape="circle"
                                    size="large"
                                    loading={false}
                                    icon={<ShoppingCartOutlined style={{ marginLeft: -1, marginTop: 3, fontSize: '1.3rem' }} />}
                                    onClick={handleClick}
                                />
                            </Tooltip>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MilkteaCard
