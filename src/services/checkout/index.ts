import { useMutation } from 'react-query'
import { onError } from '../../utils/error-handlers'
import type { ICartItem, IResponseData } from '../../types'
import useAxiosIns from '../../hooks/useAxiosIns'

export default () => {
    const axios = useAxiosIns()

    const checkoutMutation = useMutation({
        mutationFn: (payload: { items: Partial<ICartItem>[]; note?: string }) => axios.post<IResponseData<any>>(`/orders/create-order`, payload),
        onError: onError,
        onSuccess: res => {}
    })

    return { checkoutMutation }
}
