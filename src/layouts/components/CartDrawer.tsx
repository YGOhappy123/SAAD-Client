import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getI18n, useTranslation } from 'react-i18next'
import { Avatar, Button, Divider, Drawer, Image, Tooltip, Modal } from 'antd'
import { DeleteOutlined, ExclamationCircleFilled, LockOutlined } from '@ant-design/icons'
import { ICartItem, ITopping } from '../../types'
import { RootState } from '../../store'
import { buttonStyle } from '../../assets/styles/globalStyle'
import QuantityInput from '../../components/shared/QuantityInput'
import useCart from '../../hooks/useCart'
import useCartItems from '../../services/cart'

interface IProps {
    isCartOpen: boolean
    setIsCartOpen: (value: boolean) => void
}

const CartDrawer = ({ isCartOpen, setIsCartOpen }: IProps) => {
    const { t } = useTranslation()
    const locale = getI18n().resolvedLanguage as 'vi' | 'en'
    const navigate = useNavigate()
    const cartItems = useSelector((state: RootState) => state.app.cartItems)
    const { detailedItems, totalPrice } = useCart()
    const { addCartItemMutation, updateCartItemMutation, removeCartItemMutation, resetCartItemsMutation } = useCartItems({
        enabledFetchCartItems: true
    })

    const handleResetCartBtnClick = () => {
        Modal.confirm({
            icon: <ExclamationCircleFilled />,
            title: t('are you sure that you want to remove all items from cart ?'),
            okText: t('delete'),
            cancelText: t('cancel'),
            onOk: () => {
                resetCartItemsMutation.mutate()
            },
            okButtonProps: {
                danger: true,
                shape: 'round',
                style: { ...buttonStyle, width: '100px', marginLeft: '12px' }
            },
            cancelButtonProps: {
                type: 'text',
                shape: 'round',
                style: { ...buttonStyle, width: '100px' }
            }
        })
    }

    return (
        <Drawer
            open={isCartOpen}
            onClose={() => {
                setIsCartOpen(false)
            }}
            title={t('cart')}
            width={600}
            extra={
                cartItems.length !== 0 && (
                    <Button loading={resetCartItemsMutation.isLoading} onClick={handleResetCartBtnClick}>
                        {t('reset cart')}
                    </Button>
                )
            }
        >
            <div className={`cart-content ${cartItems.length === 0 ? 'no-items' : ''}`}>
                {cartItems.length === 0 ? (
                    <div style={{ marginTop: 45, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar src="/empty-cart.png" size={340} />
                        <h4 className="heading">{t('your cart is empty')}</h4>
                        <Button
                            type="primary"
                            size="large"
                            shape="round"
                            className="continue-btn"
                            onClick={() => {
                                setIsCartOpen(false)
                                navigate('/menu')
                            }}
                        >
                            {t('see our menu')}
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="cart-items">
                            {detailedItems.map((item: ICartItem) => (
                                <div key={item.cartItemId} className={`cart-item ${item.quantity === 0 ? 'unavailable' : ''}`}>
                                    <div className="item-image">
                                        {item.milktea?.image ? (
                                            <Image src={item.milktea?.image} />
                                        ) : (
                                            <Image src="alt-feature-img.png" preview={false} />
                                        )}
                                    </div>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <h4
                                            className="item-name"
                                            onClick={() => {
                                                setIsCartOpen(false)
                                                navigate(`/product/${item.milkteaId}`)
                                            }}
                                        >
                                            {locale === 'vi' ? item.milktea?.nameVi : item.milktea?.nameEn} ({item.sizeId})
                                        </h4>
                                        <p className="item-toppings">
                                            Topping:{' '}
                                            {item.toppings?.length === 0 ? (
                                                <span>{t('none')}</span>
                                            ) : (
                                                <span>
                                                    {item.toppings
                                                        ?.map(tp => (locale === 'vi' ? (tp as ITopping).nameVi : (tp as ITopping).nameEn))
                                                        .join(', ')}
                                                </span>
                                            )}
                                        </p>
                                        <p className="item-price">
                                            {t('unit price')}:{' '}
                                            {item.quantity
                                                ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price as number)
                                                : t('this product is currently unavailable')}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                        <QuantityInput
                                            loading={removeCartItemMutation.isLoading || addCartItemMutation.isLoading}
                                            initValue={item.quantity}
                                            onChange={newValue => {
                                                const quantity = newValue - item.quantity
                                                if (quantity === 0) return
                                                if (newValue === 0) return removeCartItemMutation.mutate({ cartItemId: item.cartItemId })
                                                return updateCartItemMutation.mutate({
                                                    cartItemId: item.cartItemId,
                                                    quantity: Math.abs(quantity),
                                                    type: quantity > 0 ? 'increase' : 'decrease'
                                                })
                                            }}
                                        />
                                        <Tooltip title={t('delete item')} placement="bottom">
                                            <Button
                                                type="primary"
                                                danger
                                                shape="circle"
                                                loading={removeCartItemMutation.isLoading}
                                                icon={<DeleteOutlined />}
                                                onClick={() => removeCartItemMutation.mutate({ cartItemId: item.cartItemId })}
                                            />
                                        </Tooltip>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Divider style={{ borderColor: 'rgba(26, 26, 26, 0.12)' }} />

                        <div className="cart-footer">
                            <h5 className="total-price">
                                <span>{t('subtotal')}:</span>
                                <span>{`${totalPrice.toLocaleString('en-US')} VND`}</span>
                            </h5>
                            <p>{t('VAT included')}.</p>
                            <div style={{ marginTop: 24, display: 'flex', gap: 8 }}>
                                <Button
                                    type="primary"
                                    shape="round"
                                    className="see-cart-btn"
                                    onClick={() => {
                                        setIsCartOpen(false)
                                        navigate('/cart')
                                    }}
                                >
                                    {t('view my cart')}
                                </Button>
                                <Button shape="round" className="checkout-btn" onClick={() => navigate('/sales/checkout')}>
                                    <LockOutlined />
                                    {t('checkout')}
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Drawer>
    )
}

export default CartDrawer
