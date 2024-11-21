import { useQuery } from 'react-query'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { ICartItem, IMilktea, IResponseData, ITopping } from '../types'
import useAxiosIns from './useAxiosIns'

interface ICartValues {
    detailedItems: ICartItem[]
    totalPrice: number
}

const DEFAULT_CART_VALUES: ICartValues = {
    detailedItems: [],
    totalPrice: 0
}

const useCart = () => {
    const cartItems = useSelector((state: RootState) => state.app.cartItems)
    const axios = useAxiosIns()

    const fetchMilkteasQuery = useQuery(['products'], {
        queryFn: () => axios.get<IResponseData<IMilktea[]>>(`/product/getAllMilkTeas?filter=${JSON.stringify({ isHidden: false })}`),
        enabled: true,
        refetchIntervalInBackground: true,
        refetchInterval: 10000,
        select: res => res.data
    })

    const fetchToppingsQuery = useQuery(['toppings'], {
        queryFn: () => axios.get<IResponseData<ITopping[]>>(`/product/getAllToppings?filter=${JSON.stringify({ isHidden: false })}`),
        enabled: true,
        refetchIntervalInBackground: true,
        refetchInterval: 10000,
        select: res => res.data
    })

    const milkteas = fetchMilkteasQuery.data?.data ?? []
    const toppings = fetchToppingsQuery.data?.data ?? []

    const cartValues: ICartValues = useMemo(() => {
        if (milkteas.length === 0 || toppings.length === 0) return DEFAULT_CART_VALUES

        return cartItems.reduce((acc: ICartValues, item: ICartItem) => {
            const mt = milkteas.find(mt => mt.milkteaId === item.milkteaId) as IMilktea
            const tps = item.toppings?.map(tp => toppings.find(_tp => _tp.toppingId === tp)) as ITopping[]

            if (!mt || tps.some(tp => !tp)) return acc
            const qty = mt.isAvailable ? item.quantity : 0

            const milkteaPrice = mt.price[item.sizeId] as number
            const toppingsPrice = tps.reduce((_acc, _tp) => _acc + _tp.price, 0)

            return {
                detailedItems: [
                    ...acc.detailedItems,
                    {
                        ...item,
                        milktea: mt,
                        toppings: tps,
                        price: milkteaPrice + toppingsPrice,
                        quantity: qty
                    }
                ],
                totalPrice: acc.totalPrice + qty * (milkteaPrice + toppingsPrice)
            }
        }, DEFAULT_CART_VALUES)
    }, [cartItems, milkteas, toppings])

    return { ...cartValues, isLoading: cartValues.detailedItems.length <= 0 }
}

export default useCart
