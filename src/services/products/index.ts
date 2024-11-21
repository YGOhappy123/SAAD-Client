import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { onError } from '../../utils/error-handlers'
import { IResponseData, IMilktea } from '../../types'
import { useEffect, useState } from 'react'
import useAxiosIns from '../../hooks/useAxiosIns'
import toastConfig from '../../configs/toast'
import dayjs from 'dayjs'

const SORT_MAPPING = {
    '-createdAt': { createdAt: 'DESC' },
    '+createdAt': { createdAt: 'ASC' }
}

export default ({ enabledFetchProducts }: { enabledFetchProducts?: boolean }) => {
    const { t } = useTranslation()
    const [itemPerPage, setItemPerPage] = useState<number>(8)
    const [products, setProducts] = useState<IMilktea[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [total, setTotal] = useState<number>()
    const [current, setCurrent] = useState<number>(1)
    const [query, setQuery] = useState<string>('')
    const [sort, setSort] = useState<string>('')
    const queryClient = useQueryClient()
    const axios = useAxiosIns()

    const buildQuery = (values: {
        isAvailable: boolean
        searchPriceQuery: string
        searchCategory: number
        searchNameVi: string
        searchNameEn: string
        sort: string
        range: string[] | any[] | undefined
    }) => {
        const { isAvailable, searchPriceQuery, searchCategory, searchNameVi, searchNameEn, sort, range } = values

        const query: any = {}
        query.isAvailable = isAvailable
        if (searchCategory) query.categoryId = searchCategory
        if (searchNameVi) query.nameVi = searchNameVi.trim()
        if (searchNameEn) query.nameEn = searchNameEn.trim()
        if (searchPriceQuery) {
            const parsedPriceQuery = JSON.parse(searchPriceQuery)
            if (parsedPriceQuery['$gte']) query.minPrice = parsedPriceQuery['$gte']
            if (parsedPriceQuery['$lte']) query.maxPrice = parsedPriceQuery['$lte']
        }
        if (range) {
            query.startTime = dayjs(range[0]).format('YYYY-MM-DD')
            query.endTime = dayjs(range[1]).format('YYYY-MM-DD')
        }
        setQuery(JSON.stringify(query))
        if (sort) setSort(JSON.stringify((SORT_MAPPING as any)[sort]))
    }

    const searchProductsQuery = useQuery(['search-products', query, sort], {
        queryFn: () =>
            axios.get<IResponseData<IMilktea[]>>(
                `/product/getAllMilkTeas?skip=${itemPerPage * (current - 1)}&limit=${itemPerPage}&filter=${query}&sort=${sort}`
            ),
        keepPreviousData: true,
        onError: onError,
        enabled: false,
        onSuccess: res => {
            const products = res.data.data
            const total = res.data.total
            setTotal(total)
            setProducts(products)
        }
    })

    const onResetFilterSearch = () => {
        setIsSearching(false)
        setQuery('')
        setSort('')
        setTimeout(() => fetchProductsQuery.refetch(), 300)
    }

    const onFilterSearch = () => {
        searchProductsQuery.refetch()
        setIsSearching(true)
    }

    useEffect(() => {
        if (isSearching) {
            searchProductsQuery.refetch()
        }
    }, [current, itemPerPage])

    const fetchProductsQuery = useQuery(['products', current, itemPerPage], {
        queryFn: () => {
            if (!isSearching)
                return axios.get<IResponseData<IMilktea[]>>(`/product/getAllMilkTeas?skip=${itemPerPage * (current - 1)}&limit=${itemPerPage}`)
        },
        keepPreviousData: true,
        onError: onError,
        enabled: enabledFetchProducts,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true,
        refetchInterval: 10000,
        onSuccess: res => {
            if (!res) return
            const products = res.data.data
            const total = res.data.total
            setTotal(total)
            setProducts(products)
        }
    })

    const addProductMutation = useMutation({
        mutationFn: (data: Partial<IMilktea>) => axios.post<IResponseData<IMilktea>>('/product/addMilktea', data),
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-products')
                searchProductsQuery.refetch()
            } else queryClient.invalidateQueries('products')
            toast(t(res.data.message), toastConfig('success'))
        },
        onError: onError
    })

    const updateProductMutation = useMutation({
        mutationFn: ({ productId, data }: { productId: number; data: Partial<IMilktea> }) =>
            axios.patch<IResponseData<IMilktea>>(`/product/updateMilktea/${productId}`, data),
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-products')
                searchProductsQuery.refetch()
            } else queryClient.invalidateQueries('products')
            toast(t(res.data.message), toastConfig('success'))
        },
        onError: onError
    })

    const toggleProductHiddenStatusMutation = useMutation({
        mutationFn: (productId: number) => axios.patch<IResponseData<unknown>>(`/product/toggleMilktea/${productId}`),
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-products')
                searchProductsQuery.refetch()
            } else queryClient.invalidateQueries('products')
            toast(t(res.data.message), toastConfig('success'))
        },
        onError: onError
    })

    return {
        fetchProductsQuery,
        total,
        products,
        current,
        setCurrent,
        addProductMutation,
        toggleProductHiddenStatusMutation,
        updateProductMutation,
        buildQuery,
        onFilterSearch,
        onResetFilterSearch,
        searchProductsQuery,
        itemPerPage,
        setItemPerPage
    }
}
