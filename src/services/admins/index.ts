import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { IResponseData, IAdmin } from '../../types'
import { onError } from '../../utils/error-handlers'
import useAxiosIns from '../../hooks/useAxiosIns'
import toastConfig from '../../configs/toast'
import dayjs from 'dayjs'

const SORT_MAPPING = {
    '-createdAt': { createdAt: 'DESC' },
    '+createdAt': { createdAt: 'ASC' }
}

export default ({ enabledFetchAdmins }: { enabledFetchAdmins?: boolean }) => {
    const { t } = useTranslation()
    const [itemPerPage, setItemPerPage] = useState<number>(8)
    const [admins, setAdmins] = useState<IAdmin[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [total, setTotal] = useState<number>()
    const [current, setCurrent] = useState<number>(1)
    const [query, setQuery] = useState<string>('')
    const [sort, setSort] = useState<string>('')
    const queryClient = useQueryClient()
    const axios = useAxiosIns()

    const buildQuery = (values: { searchEmail: string; searchName: string; gender: string; sort: string; range: string[] | any[] | undefined }) => {
        const { searchEmail, searchName, gender, sort, range } = values
        const query: any = {}

        if (searchEmail) query.email = searchEmail.trim()
        if (searchName) query.name = searchName.trim()
        if (gender) query.gender = gender !== 'All' ? gender : undefined
        if (range) {
            query.startTime = dayjs(range[0]).format('YYYY-MM-DD')
            query.endTime = dayjs(range[1]).format('YYYY-MM-DD')
        }
        setQuery(JSON.stringify(query))
        if (sort) setSort(JSON.stringify((SORT_MAPPING as any)[sort]))
    }

    const searchAdminsQuery = useQuery(['search-admins', query, sort, itemPerPage], {
        queryFn: () =>
            axios.get<IResponseData<IAdmin[]>>(
                `/manage/admins?skip=${itemPerPage * (current - 1)}&limit=${itemPerPage}&filter=${query}&sort=${sort}`
            ),
        keepPreviousData: true,
        onError: onError,
        enabled: false,
        onSuccess: res => {
            const admins = res.data.data
            const total = res.data.total
            setTotal(total)
            setAdmins(admins)
        }
    })

    const onResetFilterSearch = () => {
        setIsSearching(false)
        setQuery('')
        setSort('')
        setTimeout(() => fetchAdminsQuery.refetch(), 300)
    }

    const onFilterSearch = () => {
        searchAdminsQuery.refetch()
        setIsSearching(true)
    }

    useEffect(() => {
        if (isSearching) {
            searchAdminsQuery.refetch()
        }
    }, [current, itemPerPage])

    const updateAdminMutation = useMutation({
        mutationFn: ({ adminId, data }: { adminId: number; data: Partial<IAdmin> }) =>
            axios.patch<IResponseData<any>>(`/manage/admins/${adminId}`, data),
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-admins')
                searchAdminsQuery.refetch()
            } else queryClient.invalidateQueries('admins')
            toast(t(res.data.message), toastConfig('success'))
        },
        onError: onError
    })

    const fetchAdminsQuery = useQuery(['admins', current, itemPerPage], {
        queryFn: () => {
            if (!isSearching) return axios.get<IResponseData<IAdmin[]>>(`/manage/admins?skip=${itemPerPage * (current - 1)}&limit=${itemPerPage}`)
        },
        keepPreviousData: true,
        onError: onError,
        enabled: enabledFetchAdmins,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true,
        refetchInterval: 10000,
        onSuccess: res => {
            if (!res) return
            const admins = res.data.data
            const total = res.data.total
            setTotal(total)
            setAdmins(admins)
        }
    })

    const addAdminMutation = useMutation({
        mutationFn: (data: Partial<IAdmin>) => axios.post<IResponseData<any>>('/manage/admins/new', data),
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-admins')
                searchAdminsQuery.refetch()
            } else queryClient.invalidateQueries('admins')
            toast(t(res.data.message), toastConfig('success'))
        },
        onError: onError
    })

    return {
        query,
        total,
        admins,
        current,
        setCurrent,
        buildQuery,
        fetchAdminsQuery,
        searchAdminsQuery,
        addAdminMutation,
        updateAdminMutation,
        itemPerPage,
        setItemPerPage,
        onFilterSearch,
        onResetFilterSearch
    }
}
