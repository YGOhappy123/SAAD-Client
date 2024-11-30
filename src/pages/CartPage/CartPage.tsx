import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getI18n, useTranslation } from 'react-i18next'
import { Button, ConfigProvider, Input, Table, Image, Tooltip, Avatar } from 'antd'
import { LockOutlined, DeleteOutlined } from '@ant-design/icons'
import { ICartItem, IMilktea, ITopping } from '../../types'
import { RootState } from '../../store'
import { setOrderNote } from '../../slices/app.slice'
import { containerStyle } from '../../assets/styles/globalStyle'
import QuantityInput from '../../components/shared/QuantityInput'
import useTitle from '../../hooks/useTitle'
import useCart from '../../hooks/useCart'
import useCartItems from '../../services/cart'
import '../../assets/styles/pages/CartPage.css'

const CartPage = () => {
    const { t } = useTranslation()
    const locale = getI18n().resolvedLanguage as 'vi' | 'en'
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useTitle(`${t('cart')} - PMT`)
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const orderNote = useSelector((state: RootState) => state.app.orderNote)
    const cartItems = useSelector((state: RootState) => state.app.cartItems)
    const { detailedItems, totalPrice } = useCart()
    const { addCartItemMutation, updateCartItemMutation, removeCartItemMutation } = useCartItems({
        enabledFetchCartItems: true
    })

    return (
        <ConfigProvider
            theme={{ token: { colorPrimary: '#1a1a1a' } }}
            children={
                <div className="cart-page">
                    <section className="container-wrapper">
                        <div className="container" style={containerStyle}>
                            {cartItems.length > 0 ? (
                                <>
                                    <div className="heading-and-progress">
                                        <h2 className="heading">{t('my cart')}</h2>
                                    </div>

                                    <div className="cart-items-wrapper">
                                        <div className="cart-items">
                                            <Table
                                                pagination={false}
                                                rowKey={(record: ICartItem) => record.id}
                                                columns={[
                                                    {
                                                        title: t('feature image'),
                                                        dataIndex: 'milktea',
                                                        width: 150,
                                                        render: (value: IMilktea) => {
                                                            return (
                                                                <div className={`item-image ${value.isAvailable ? '' : 'unavailable'}`}>
                                                                    <Image src={value.image ?? ''} />
                                                                </div>
                                                            )
                                                        }
                                                    },
                                                    {
                                                        title: t("product's info"),
                                                        render: (value: any, record: ICartItem) => {
                                                            return (
                                                                <>
                                                                    <strong
                                                                        onClick={() => navigate(`/product/${record.milkteaId}`)}
                                                                        style={{ cursor: 'pointer' }}
                                                                    >
                                                                        {locale === 'vi' ? record.milktea?.nameVi : record.milktea?.nameEn}
                                                                    </strong>
                                                                    <p className="item-toppings" style={{ margin: '4px 0' }}>
                                                                        Topping:{' '}
                                                                        {record.toppings?.length === 0 ? (
                                                                            <span>{t('none')}</span>
                                                                        ) : (
                                                                            <span>
                                                                                {record.toppings
                                                                                    ?.map(tp =>
                                                                                        locale === 'vi'
                                                                                            ? (tp as ITopping).nameVi
                                                                                            : (tp as ITopping).nameEn
                                                                                    )
                                                                                    .join(', ')}
                                                                            </span>
                                                                        )}
                                                                    </p>
                                                                    {!record.milktea?.isAvailable && (
                                                                        <p style={{ marginBlock: 2, fontSize: 13 }}>
                                                                            {t('this product is currently unavailable')}
                                                                        </p>
                                                                    )}
                                                                </>
                                                            )
                                                        }
                                                    },
                                                    {
                                                        title: t('size'),
                                                        dataIndex: 'size',
                                                        align: 'center',
                                                        width: 80,
                                                        render: value => {
                                                            return <span>{value}</span>
                                                        }
                                                    },
                                                    {
                                                        title: t('unit price'),
                                                        dataIndex: 'price',
                                                        align: 'center',
                                                        width: 120,
                                                        render: value => {
                                                            return (
                                                                <span>
                                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                                                        value
                                                                    )}
                                                                </span>
                                                            )
                                                        }
                                                    },
                                                    {
                                                        title: t('quantity'),
                                                        dataIndex: 'quantity',
                                                        align: 'center',
                                                        width: 150,
                                                        render: (value: number, record: ICartItem) => {
                                                            return (
                                                                <div
                                                                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
                                                                >
                                                                    <QuantityInput
                                                                        loading={removeCartItemMutation.isLoading || addCartItemMutation.isLoading}
                                                                        initValue={value}
                                                                        onChange={newValue => {
                                                                            const quantity = newValue - value
                                                                            if (quantity === 0) return
                                                                            if (newValue === 0)
                                                                                return removeCartItemMutation.mutate({
                                                                                    cartItemId: record.id
                                                                                })
                                                                            return updateCartItemMutation.mutate({
                                                                                cartItemId: record.id,
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
                                                                            onClick={() => removeCartItemMutation.mutate({ cartItemId: record.id })}
                                                                        />
                                                                    </Tooltip>
                                                                </div>
                                                            )
                                                        }
                                                    },
                                                    {
                                                        title: t('total'),
                                                        align: 'center',
                                                        width: 120,
                                                        render: (value: any, record: ICartItem) => {
                                                            return (
                                                                <span>
                                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                                                        (record.price as number) * record.quantity
                                                                    )}
                                                                </span>
                                                            )
                                                        }
                                                    }
                                                ]}
                                                dataSource={detailedItems}
                                            />
                                        </div>

                                        <div className="order-summary">
                                            <div className="subtotal">
                                                <span>{t('subtotal')}:</span>
                                                <span>
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                                                </span>
                                            </div>
                                            <div className="total">
                                                <span>{t('total')}:</span>
                                                <span>{`${totalPrice.toLocaleString('vi-VN')} VNĐ`}</span>
                                            </div>
                                            <p style={{ margin: '8px 0 0', color: 'rgba(26, 26, 26, 0.7)' }}>{t('VAT included')}.</p>
                                            <Input.TextArea
                                                value={orderNote}
                                                onChange={e => dispatch(setOrderNote(e.target.value))}
                                                placeholder={t('order notes...').toString()}
                                                spellCheck={false}
                                                autoSize={{ minRows: 4 }}
                                                className="order-notes"
                                            />
                                            <Button
                                                type="primary"
                                                shape="round"
                                                block
                                                disabled={detailedItems.every((item: ICartItem) => item.milktea?.isAvailable === false)}
                                                className="checkout-btn"
                                                onClick={() => navigate('/sales/checkout')}
                                            >
                                                <LockOutlined />
                                                {t('checkout')}
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Avatar src="/empty-cart.png" size={340} />
                                    <h4 style={{ fontSize: '1rem', fontWeight: 400 }}>{t('your cart is empty')}</h4>
                                    <Button
                                        type="primary"
                                        size="large"
                                        shape="round"
                                        className="continue-btn"
                                        onClick={() => {
                                            navigate('/menu')
                                        }}
                                    >
                                        {t('see our menu')}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            }
        />
    )
}

export default CartPage
