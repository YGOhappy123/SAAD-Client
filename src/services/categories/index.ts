import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { onError } from '../../utils/error-handlers'
import { IResponseData, ICategory } from '../../types'
import { useEffect, useState } from 'react'
import useAxiosIns from '../../hooks/useAxiosIns'
import toastConfig from '../../configs/toast'
import dayjs from 'dayjs'

const SORT_MAPPING = {
    '-createdAt': { createdAt: 'DESC' },
    '+createdAt': { createdAt: 'ASC' }
}

export default ({ enabledFetchCategories }: { enabledFetchCategories?: boolean }) => {
    const { t } = useTranslation()
    const [itemPerPage, setItemPerPage] = useState<number>(8)
    const [categories, setCategories] = useState<ICategory[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [total, setTotal] = useState<number>()
    const [current, setCurrent] = useState<number>(1)
    const [query, setQuery] = useState<string>('')
    const [sort, setSort] = useState<string>('')
    const queryClient = useQueryClient()
    const axios = useAxiosIns()

    const buildQuery = (values: { searchNameVi: string; searchNameEn: string; sort: string; range: string[] | any[] | undefined }) => {
        const { searchNameVi, searchNameEn, sort, range } = values
        const query: any = {}

        if (searchNameVi) query.nameVi = searchNameVi.trim()
        if (searchNameEn) query.nameEn = searchNameEn.trim()
        if (range) {
            query.startTime = dayjs(range[0]).format('YYYY-MM-DD')
            query.endTime = dayjs(range[1]).format('YYYY-MM-DD')
        }
        setQuery(JSON.stringify(query))
        if (sort) setSort(JSON.stringify((SORT_MAPPING as any)[sort]))
    }

    const searchCategoriesQuery = useQuery(['search-categories', query, sort], {
        queryFn: () =>
            axios.get<IResponseData<ICategory[]>>(
                `/category/get?skip=${itemPerPage * (current - 1)}&limit=${itemPerPage}&filter=${query}&sort=${sort}`
            ),
        keepPreviousData: true,
        onError: onError,
        enabled: false,
        onSuccess: res => {
            const categories = res.data.data
            const total = res.data.total
            setTotal(total)
            setCategories(categories)
        }
    })

    const onResetFilterSearch = () => {
        setIsSearching(false)
        setQuery('')
        setSort('')
        setTimeout(() => fetchCategoriesQuery.refetch(), 300)
    }

    const onFilterSearch = () => {
        searchCategoriesQuery.refetch()
        setIsSearching(true)
    }

    useEffect(() => {
        if (isSearching) {
            searchCategoriesQuery.refetch()
        }
    }, [current, itemPerPage])

    const fetchCategoriesQuery = useQuery(['categories', current, itemPerPage], {
        queryFn: () => {
            if (!isSearching) return axios.get<IResponseData<ICategory[]>>(`/category/get?skip=${itemPerPage * (current - 1)}&limit=${itemPerPage}`)
        },
        keepPreviousData: true,
        onError: onError,
        enabled: enabledFetchCategories,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true,
        refetchInterval: 10000,
        onSuccess: res => {
            if (!res) return
            const categories = res.data.data
            const total = res.data.total
            setTotal(total)
            setCategories(categories)
        }
    })

    const addCategoryMutation = useMutation({
        mutationFn: (data: Partial<ICategory>) => axios.post<IResponseData<any>>('/category/add', data),
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-categories')
                searchCategoriesQuery.refetch()
            } else queryClient.invalidateQueries('categories')
            toast(t(res.data.message), toastConfig('success'))
        },
        onError: onError
    })

    const updateCategoryMutation = useMutation({
        mutationFn: ({ categoryId, data }: { categoryId: number; data: Partial<ICategory> }) =>
            axios.patch<IResponseData<ICategory>>(`/category/update/${categoryId}`, data),
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-categories')
                searchCategoriesQuery.refetch()
            } else queryClient.invalidateQueries('categories')
            toast(t(res.data.message), toastConfig('success'))
        },
        onError: onError
    })

    const toggleCategoryHiddenStatusMutation = useMutation({
        mutationFn: (categoryId: number) => axios.patch<IResponseData<unknown>>(`/category/toggle/${categoryId}`),
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-categories')
                searchCategoriesQuery.refetch()
            } else queryClient.invalidateQueries('categories')
            toast(t(res.data.message), toastConfig('success'))
        },
        onError: onError
    })

    return {
        fetchCategoriesQuery,
        total,
        categories,
        current,
        setCurrent,
        addCategoryMutation,
        toggleCategoryHiddenStatusMutation,
        updateCategoryMutation,
        buildQuery,
        onFilterSearch,
        onResetFilterSearch,
        searchCategoriesQuery,
        itemPerPage,
        setItemPerPage
    }
}
