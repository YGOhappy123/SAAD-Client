import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { fetchCartItems, addCartItem, updateCartItem, removeCartItem, resetCartItems } from '../../slices/app.slice'
import { RootState } from '../../store'
import useAxiosIns from '../../hooks/useAxiosIns'
import toastConfig from '../../configs/toast'

export default ({ enabledFetchCartItems }: { enabledFetchCartItems: boolean }) => {
    const { t } = useTranslation()
    const axios = useAxiosIns()
    const query = useQueryClient()
    const isLogged = useSelector((state: RootState) => state.auth.isLogged)
    const dispatch = useDispatch()

    const fetchCartItemsQuery = useQuery({
        queryKey: 'cartItems',
        queryFn: () => dispatch(fetchCartItems(axios) as any),
        enabled: enabledFetchCartItems,
        refetchOnWindowFocus: false,
        refetchInterval: 10000
    })

    const addCartItemMutation = useMutation({
        mutationFn: ({ milkteaId, size, toppings, quantity }: { milkteaId: number; size: string; toppings: number[]; quantity: number }) => {
            if (!isLogged) return toast(t('you must be logged in to do this operation').toString(), toastConfig('info'))
            return dispatch(addCartItem({ axios, milkteaId, size, toppings, quantity }) as any)
        },
        onSuccess: () => query.invalidateQueries(['cartItems'])
    })

    const updateCartItemMutation = useMutation({
        mutationFn: ({ cartItemId, quantity, type }: { cartItemId: number; quantity: number; type: 'increase' | 'decrease' }) =>
            dispatch(updateCartItem({ axios, cartItemId, quantity, type }) as any),
        onSuccess: () => query.invalidateQueries(['cartItems'])
    })

    const removeCartItemMutation = useMutation({
        mutationFn: ({ cartItemId }: { cartItemId: number }) => dispatch(removeCartItem({ axios, cartItemId }) as any),
        onSuccess: () => query.invalidateQueries(['cartItems'])
    })

    const resetCartItemsMutation = useMutation({
        mutationFn: () => dispatch(resetCartItems(axios) as any),
        onSuccess: () => query.invalidateQueries(['cartItems'])
    })

    return { fetchCartItemsQuery, resetCartItemsMutation, removeCartItemMutation, addCartItemMutation, updateCartItemMutation }
}
