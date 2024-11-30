import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getI18n, useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Avatar, Button, Divider, Form, Input, Tooltip, Image, Badge, ConfigProvider, Row, Modal } from 'antd'
import { CarryOutOutlined, HomeOutlined, LoadingOutlined } from '@ant-design/icons'
import { ICartItem, ITopping } from '../../types'
import { RootState } from '../../store'
import { setOrderNote } from '../../slices/app.slice'
import { buttonStyle, containerStyle, inputStyle } from '../../assets/styles/globalStyle'
import type { FormInstance } from 'antd/es/form'
import FooterModals from './InfoModals'
import Loading from '../../components/shared/Loading'
import dayjs from 'dayjs'
import useTitle from '../../hooks/useTitle'
import useCart from '../../hooks/useCart'
import useCartItems from '../../services/cart'
import useCheckout from '../../services/checkout'
import toastConfig from '../../configs/toast'
import '../../assets/styles/pages/CheckoutPage.css'

const CheckoutPage = () => {
    const { t } = useTranslation()
    const i18n = getI18n()
    const locale = i18n.resolvedLanguage as 'vi' | 'en'
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useTitle(`${t('checkout')} - PMT`)

    const user = useSelector((state: RootState) => state.auth.user)
    const orderNote = useSelector((state: RootState) => state.app.orderNote)
    const cartItems = useSelector((state: RootState) => state.app.cartItems)
    const { detailedItems, totalPrice, isLoading } = useCart()

    const formRef = useRef<FormInstance>(null)
    const [checkoutDisabled, setCheckoutDisabled] = useState<boolean>(false)
    const checkIsCheckoutAvailable = useCallback(() => {
        const currentTime = dayjs(new Date()).format('HH:mm')
        if (currentTime < '07:00' || currentTime > '22:00') {
            setCheckoutDisabled(true)
        } else {
            setCheckoutDisabled(false)
        }
    }, [])

    useEffect(() => {
        checkIsCheckoutAvailable()
        const timerId = setInterval(checkIsCheckoutAvailable, 60000)

        return () => clearInterval(timerId)
    }, [])
    useEffect(() => {
        formRef.current?.setFieldsValue({
            name: `${user.lastName} ${user.firstName}`,
            note: orderNote
        })
    }, [formRef.current])

    const { checkoutMutation } = useCheckout()
    const { resetCartItemsMutation } = useCartItems({ enabledFetchCartItems: false })
    const onFinish = async (values: any) => {
        if (checkoutDisabled) return
        const items = detailedItems
            .filter((item: ICartItem) => item.milktea?.isAvailable)
            .map((item: ICartItem) => ({
                milkteaId: item.milkteaId,
                size: item.size,
                quantity: item.quantity,
                toppings: (item.toppings as ITopping[]).map((tp: ITopping) => tp.id as number)
            }))

        Modal.confirm({
            icon: null,
            title: t(`your order total is {{total}}, please confirm before ordering`, {
                total: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)
            }),
            okText: t('confirm'),
            cancelText: t('cancel'),
            onOk: async () => {
                try {
                    const { data } = await checkoutMutation.mutateAsync({
                        items,
                        note: values?.note
                    })
                    resetCartItemsMutation.mutate()
                    dispatch(setOrderNote(''))
                    navigate(`/sales/thanks/${data.data}`)
                } catch (error) {
                    toast(t('error while creating your order, please try again later'), toastConfig('error'))
                }
            },
            okButtonProps: {
                type: 'primary',
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

    let content = null
    if (cartItems.length <= 0) {
        toast(t('your cart is currently empty, you cannot access checkout page'), toastConfig('error'))
        content = <Navigate to="/cart" replace />
    } else if (isLoading) {
        content = (
            <div className="checkout-page-loading">
                <Loading />
            </div>
        )
    } else if (detailedItems.every((item: ICartItem) => !item.milktea?.isAvailable)) {
        toast(t('items in your cart are all currently unavailable, you cannot access checkout page'), toastConfig('info'))
        content = <Navigate to="/cart" replace />
    } else {
        content = (
            <ConfigProvider
                theme={{ token: { colorPrimary: '#1a1a1a' } }}
                children={
                    <div className="checkout-page">
                        <div className="abs-btns">
                            <Tooltip title={t('change language')}>
                                {i18n.resolvedLanguage === 'en' && (
                                    <Avatar onClick={() => i18n.changeLanguage('vi')} src="/en.jpg" style={{ cursor: 'pointer' }}></Avatar>
                                )}
                                {i18n.resolvedLanguage === 'vi' && (
                                    <Avatar onClick={() => i18n.changeLanguage('en')} src="/vn.jpg" style={{ cursor: 'pointer' }}></Avatar>
                                )}
                            </Tooltip>
                        </div>

                        <div className="container" style={containerStyle}>
                            <div className="shipping-form-wrapper">
                                <div className="shipping-form__logo">
                                    <img src="/logo_invert.png" alt="logo" onClick={() => navigate('/')} />
                                </div>

                                <div className="shipping-form">
                                    <Form
                                        layout="vertical"
                                        onFinish={onFinish}
                                        ref={formRef}
                                        style={{
                                            flex: 1,
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}
                                    >
                                        <Form.Item
                                            name="name"
                                            rules={[
                                                { required: true, message: t('required').toString() },
                                                { whitespace: true, message: t('required').toString() }
                                            ]}
                                        >
                                            <Input size="large" spellCheck={false} placeholder={t('your name...').toString()} style={inputStyle} />
                                        </Form.Item>

                                        <Form.Item name="note">
                                            <Input.TextArea
                                                size="large"
                                                value={orderNote}
                                                onChange={e => dispatch(setOrderNote(e.target.value))}
                                                placeholder={t('order notes...').toString()}
                                                autoSize={{ minRows: 4 }}
                                                style={inputStyle}
                                                spellCheck="false"
                                            />
                                        </Form.Item>

                                        <Row align="middle" justify="space-between" style={{ marginTop: 'auto' }}>
                                            <div style={{ fontSize: '1rem', fontWeight: 500, cursor: 'pointer' }}>
                                                <div onClick={() => navigate('/')}>
                                                    <HomeOutlined /> {`${t('back to home')}`}
                                                </div>
                                                <div onClick={() => navigate('/cart')} style={{ marginTop: 4 }}>
                                                    <CarryOutOutlined /> {`${t('change quantity')}`}
                                                </div>
                                            </div>
                                            <Form.Item style={{ marginBottom: 0 }}>
                                                <Button
                                                    loading={checkoutMutation.isLoading}
                                                    disabled={checkoutDisabled}
                                                    size="large"
                                                    type="primary"
                                                    htmlType="submit"
                                                    className="submit-btn"
                                                >
                                                    {checkoutDisabled ? t('available from 7:00 to 22:00', { nsSeparator: false }) : t('checkout')}
                                                </Button>
                                            </Form.Item>
                                        </Row>
                                    </Form>
                                </div>
                                <Divider style={{ marginTop: 56, borderColor: 'rgba(26, 26, 26, 0.12)' }} />
                                <FooterModals />
                            </div>

                            <div className="cart-items">
                                <div className="items-wrapper">
                                    {detailedItems
                                        .filter((item: ICartItem) => item.milktea?.isAvailable)
                                        .map((item: ICartItem) => (
                                            <div key={item.id} className="checkout-cart-item">
                                                <Badge count={item.quantity} color="rgba(115, 115, 115, 0.9)">
                                                    <div className="item-image">
                                                        <div className="img-wrapper">
                                                            <Image src={item.milktea?.image ?? '../alt-feature-img.png'} />
                                                        </div>
                                                    </div>
                                                </Badge>
                                                <div className="item-name">
                                                    <h4 style={{ margin: '0 0 8px', fontWeight: 700 }}>
                                                        {locale === 'vi' ? item.milktea?.nameVi : item.milktea?.nameEn}
                                                        {` (${item.size})`}
                                                    </h4>
                                                    <span style={{ marginBottom: 4 }}>
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
                                                    </span>
                                                    <span>
                                                        {t('unit price')}:{' '}
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                                            item.price as number
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="item-price">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                                        (item.price as number) * item.quantity
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                </div>

                                <Divider style={{ borderColor: 'rgba(26, 26, 26, 0.12)' }} />
                                <div className="display-price">
                                    <span style={{ fontSize: '1rem', fontWeight: 500 }}>{t('total')}:</span>
                                    <span>
                                        <span style={{ marginRight: 9, fontSize: '0.75rem' }}>VND</span>
                                        <span style={{ fontSize: '1.5rem', fontWeight: 500 }}>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            />
        )
    }

    return content
}

export default CheckoutPage
