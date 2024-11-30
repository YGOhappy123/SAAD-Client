import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { onError } from '../../utils/error-handlers'
import { IResponseData, IOrder, OrderStatus } from '../../types'
import { useEffect, useState } from 'react'
import useAxiosIns from '../../hooks/useAxiosIns'
import toastConfig from '../../configs/toast'
import dayjs from 'dayjs'

const SORT_MAPPING = {
    '-createdAt': { createdAt: 'DESC' },
    '+createdAt': { createdAt: 'ASC' }
}

export default ({ enabledFetchOrders }: { enabledFetchOrders?: boolean }) => {
    const { t } = useTranslation()
    const [itemPerPage, setItemPerPage] = useState<number>(8)
    const [orders, setOrders] = useState<IOrder[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [total, setTotal] = useState<number>()
    const [current, setCurrent] = useState<number>(1)
    const [query, setQuery] = useState<string>('')
    const [sort, setSort] = useState<string>('')
    const queryClient = useQueryClient()
    const axios = useAxiosIns()

    const buildQuery = (values: {
        customerName: string
        searchTotalQuery: string
        status: OrderStatus | 'All'
        sort: string
        range: string[] | any[] | undefined
    }) => {
        const { customerName, sort, range, status, searchTotalQuery } = values
        const query: any = {}
        if (customerName) query.customerName = customerName
        if (status) query.status = status !== 'All' ? status : undefined
        if (range) {
            query.startTime = dayjs(range[0]).format('YYYY-MM-DD')
            query.endTime = dayjs(range[1]).format('YYYY-MM-DD')
        }
        if (searchTotalQuery) {
            const parsedTotalQuery = JSON.parse(searchTotalQuery)
            if (parsedTotalQuery['$gte']) query.minTotal = parsedTotalQuery['$gte']
            if (parsedTotalQuery['$lte']) query.maxTotal = parsedTotalQuery['$lte']
        }
        setQuery(JSON.stringify(query))
        if (sort) setSort(JSON.stringify((SORT_MAPPING as any)[sort]))
    }

    const searchOrdersQuery = useQuery(['search-orders', query, sort], {
        queryFn: () =>
            axios.get<IResponseData<IOrder[]>>(`/orders/all?skip=${itemPerPage * (current - 1)}&limit=${itemPerPage}&filter=${query}&sort=${sort}`),
        keepPreviousData: true,
        onError: onError,
        enabled: false,
        onSuccess: res => {
            const orders = res.data.data
            const total = res.data.total
            setTotal(total)
            setOrders(orders)
        }
    })

    const onResetFilterSearch = () => {
        setIsSearching(false)
        setQuery('')
        setSort('')
        setTimeout(() => fetchOrdersQuery.refetch(), 300)
    }

    const onFilterSearch = () => {
        searchOrdersQuery.refetch()
        setIsSearching(true)
    }

    useEffect(() => {
        if (isSearching) {
            searchOrdersQuery.refetch()
        }
    }, [current, itemPerPage])

    const fetchOrdersQuery = useQuery(['orders', current, itemPerPage], {
        queryFn: () => {
            if (!isSearching) return axios.get<IResponseData<IOrder[]>>(`/orders/all?skip=${itemPerPage * (current - 1)}&limit=${itemPerPage}`)
        },
        keepPreviousData: true,
        onError: onError,
        enabled: enabledFetchOrders,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true,
        refetchInterval: 10000,
        onSuccess: res => {
            if (!res) return
            const orders = res.data.data
            const total = res.data.total
            setTotal(total)
            setOrders(orders)
        }
    })

    const updateOrderStatusMutation = useMutation({
        mutationFn: ({ orderId, newStatus }: { orderId: number; newStatus: OrderStatus }) =>
            axios.patch<IResponseData<IOrder>>(`/orders/status/${orderId}`, {
                status: newStatus
            }),
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-orders')
                searchOrdersQuery.refetch()
            } else queryClient.invalidateQueries('orders')
            toast(t(res.data.message), toastConfig('success'))
        },
        onError: onError
    })

    const rejectOrderStatusMutation = useMutation({
        mutationFn: ({ orderId, rejectionReason }: { orderId: number; rejectionReason: string }) =>
            axios.patch<IResponseData<IOrder>>(`/orders/status/${orderId}`, {
                status: 'Rejected',
                rejectionReason: rejectionReason
            }),
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-orders')
                searchOrdersQuery.refetch()
            } else queryClient.invalidateQueries('orders')
            toast(t(res.data.message), toastConfig('success'))
        },
        onError: onError
    })

    return {
        fetchOrdersQuery,
        total,
        orders,
        current,
        setCurrent,
        updateOrderStatusMutation,
        rejectOrderStatusMutation,
        buildQuery,
        onFilterSearch,
        onResetFilterSearch,
        searchOrdersQuery,
        itemPerPage,
        setItemPerPage
    }
}
