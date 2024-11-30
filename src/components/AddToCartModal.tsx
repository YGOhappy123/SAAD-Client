import { useCallback, useEffect, useMemo, useState } from 'react'
import { Modal, Row, Col, Button, Space } from 'antd'
import { getI18n, useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { IMilktea, IResponseData, ITopping } from '../types'
import { buttonStyle, secondaryButtonStyle } from '../assets/styles/globalStyle'
import useCartItems from '../services/cart'
import useAxiosIns from '../hooks/useAxiosIns'

interface IProps {
    shouldOpen: boolean
    product: IMilktea | null
    isLoading: boolean
    onCancel: () => void
}

type MilkTeaSize = 's' | 'm' | 'l'

const AddToCartModal = ({ shouldOpen, product, isLoading, onCancel }: IProps) => {
    const { t } = useTranslation()
    const locale = getI18n().resolvedLanguage as 'vi' | 'en'
    const axios = useAxiosIns()
    const { addCartItemMutation } = useCartItems({ enabledFetchCartItems: false })

    const DEFAULT_FILTER = { isAvailable: true, isActive: true }
    const fetchToppingsQuery = useQuery(['add-to-cart-toppings'], {
        queryFn: () => axios.get<IResponseData<ITopping[]>>(`/products/toppings?filter=${JSON.stringify(DEFAULT_FILTER)}`),
        enabled: true,
        refetchIntervalInBackground: true,
        refetchInterval: 10000,
        select: res => res.data
    })
    const toppings = fetchToppingsQuery.data?.data ?? []

    const [chosenSize, setChosenSize] = useState<MilkTeaSize>('s')
    const [chosenToppings, setChosenToppings] = useState<ITopping[]>([])
    const [chosenQuantity, setChosenQuantity] = useState(1)

    const availableSizes = useMemo(() => {
        const sizes = []
        if (product?.price?.s != null) sizes.push('s')
        if (product?.price?.m != null) sizes.push('m')
        if (product?.price?.l != null) sizes.push('l')
        return sizes
    }, [product])

    const handleChooseTopping = useCallback(
        (topping: ITopping) => {
            const isExist = chosenToppings.some(item => item.id === topping.id)
            if (isExist) {
                setChosenToppings(prev => prev.filter(item => item.id !== topping.id))
            } else {
                setChosenToppings(prev => [...prev, topping])
            }
        },
        [chosenToppings]
    )

    useEffect(() => resetForm(), [product])

    const resetForm = () => {
        setChosenSize(availableSizes[0] as MilkTeaSize)
        setChosenToppings([])
        setChosenQuantity(1)
    }

    const total = useMemo(() => {
        if (!product) return 0

        let total = product.price[chosenSize] as number
        total += chosenToppings.reduce((acc, item) => {
            return (acc += item.price)
        }, 0)
        total *= chosenQuantity

        return total
    }, [product, chosenSize, chosenToppings, chosenQuantity])

    const addItemToCart = () => {
        addCartItemMutation
            .mutateAsync({
                milkteaId: product?.id as number,
                size: chosenSize.toUpperCase(),
                toppings: chosenToppings.map(item => item.id).sort() as number[],
                quantity: chosenQuantity
            })
            .finally(() => {
                resetForm()
                onCancel()
            })
    }

    if (!product) return null

    return (
        <Modal
            className="atcm"
            open={shouldOpen}
            onCancel={onCancel}
            title={<h3 className="atcm-title">{t('add milktea to cart')}</h3>}
            width={650}
            footer={
                <Row align="middle" justify="end" gutter={12}>
                    <Col span={6}>
                        <Button
                            loading={isLoading}
                            block
                            type="text"
                            shape="round"
                            style={{ ...buttonStyle, border: '1px solid' }}
                            onClick={onCancel}
                        >
                            <strong>{t('cancel')}</strong>
                        </Button>
                    </Col>
                    <Col span={6}>
                        <Button loading={isLoading} onClick={addItemToCart} block shape="round" style={secondaryButtonStyle}>
                            <strong>{t('add')}</strong>
                        </Button>
                    </Col>
                </Row>
            }
        >
            <div className="atcm-product">
                <div className="atcm-img-wrapper">
                    <img src={product.image || 'alt-feature-img.png'} alt="product" />
                </div>
                <div className="atcm-product-info">
                    <h3 className="title">{locale === 'vi' ? product.nameVi : product.nameEn}</h3>
                    <p className="desc">{locale === 'vi' ? product.descriptionVi : product.descriptionEn}</p>
                    <div className="atcm-quantity-and-total">
                        <Space.Compact className="quantity">
                            <Button
                                disabled={chosenQuantity === 1}
                                type="text"
                                onClick={() => setChosenQuantity(prev => (prev === 1 ? 1 : prev - 1))}
                            >
                                -
                            </Button>
                            <span>{`${chosenQuantity}`.padStart(2, '0')}</span>
                            <Button type="text" onClick={() => setChosenQuantity(prev => prev + 1)}>
                                +
                            </Button>
                        </Space.Compact>
                        <span className="total">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</span>
                    </div>
                </div>
            </div>

            <div className="atcm-form">
                <h4 className="title">{t('choose size')}</h4>
                <div className="values-group">
                    {availableSizes.map(size => (
                        <label key={size} className="item" htmlFor={size}>
                            <input
                                type="radio"
                                name="size"
                                id={size}
                                checked={chosenSize === size}
                                onChange={() => setChosenSize(size as MilkTeaSize)}
                            />
                            <span>
                                {size.toUpperCase()}
                                {' - '}
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price[size] as number)}
                            </span>
                        </label>
                    ))}
                </div>

                <h4 className="title">{t('choose toppings')}</h4>
                <div className="values-group">
                    {toppings.map(topping => (
                        <label key={topping.id} className="item wfull" htmlFor={topping.id?.toString()}>
                            <input
                                type="checkbox"
                                name="topping"
                                id={topping.id?.toString()}
                                checked={chosenToppings.some(item => item.id === topping.id)}
                                onChange={() => handleChooseTopping(topping)}
                            />
                            <span>{topping.nameVi}</span>
                            <span className="topping-price">
                                + {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(topping.price)}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </Modal>
    )
}

export default AddToCartModal
