import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { ICustomer, IResponseData } from '../../types'
import { onError } from '../../utils/error-handlers'
import toastConfig from '../../configs/toast'
import useAxiosIns from '../../hooks/useAxiosIns'
import dayjs from 'dayjs'

const SORT_MAPPING = {
    '-createdAt': { createdAt: 'DESC' },
    '+createdAt': { createdAt: 'ASC' }
}

export default ({ enabledFetchUsers }: { enabledFetchUsers?: boolean }) => {
    const { t } = useTranslation()
    const [itemPerPage, setItemPerPage] = useState<number>(8)
    const [users, setUsers] = useState<ICustomer[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [total, setTotal] = useState<number>()
    const [current, setCurrent] = useState<number>(1)
    const [query, setQuery] = useState<string>('')
    const [sort, setSort] = useState<string>('')
    const queryClient = useQueryClient()
    const axios = useAxiosIns()

    const buildQuery = (values: {
        searchEmail: string
        searchName: string
        searchPhoneNumber: string
        sort: string
        range: string[] | any[] | undefined
    }) => {
        const { searchEmail, searchName, searchPhoneNumber, sort, range } = values
        const query: any = {}

        if (searchEmail) query.email = searchEmail.trim()
        if (searchName) query.name = searchName.trim()
        if (searchPhoneNumber) query.phoneNumber = searchPhoneNumber.trim()
        if (range) {
            query.startTime = dayjs(range[0]).format('YYYY-MM-DD')
            query.endTime = dayjs(range[1]).format('YYYY-MM-DD')
        }
        setQuery(JSON.stringify(query))
        if (sort) setSort(JSON.stringify((SORT_MAPPING as any)[sort]))
    }

    const searchUsersQuery = useQuery(['search-users', query, sort, itemPerPage], {
        queryFn: () =>
            axios.get<IResponseData<ICustomer[]>>(
                `/users/customers/?skip=${itemPerPage * (current - 1)}&limit=${itemPerPage}&filter=${query}&sort=${sort}`
            ),
        keepPreviousData: true,
        onError: onError,
        enabled: false,
        onSuccess: res => {
            const users = res.data.data
            const total = res.data.total
            setTotal(total)
            setUsers(users)
        }
    })

    const onResetFilterSearch = () => {
        setIsSearching(false)
        setQuery('')
        setSort('')
        setTimeout(() => fetchUsersQuery.refetch(), 300)
    }

    const onFilterSearch = () => {
        searchUsersQuery.refetch()
        setIsSearching(true)
    }

    useEffect(() => {
        if (isSearching) {
            searchUsersQuery.refetch()
        }
    }, [current, itemPerPage])

    const fetchUsersQuery = useQuery(['users', current, itemPerPage], {
        queryFn: () => {
            if (!isSearching)
                return axios.get<IResponseData<ICustomer[]>>(`/users/customers?skip=${itemPerPage * (current - 1)}&limit=${itemPerPage}`)
        },
        keepPreviousData: true,
        onError: onError,
        enabled: enabledFetchUsers,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true,
        refetchInterval: 10000,
        onSuccess: res => {
            if (!res) return
            const users = res.data.data
            const total = res.data.total
            setTotal(total)
            setUsers(users)
        }
    })

    const updateProfileMutation = useMutation({
        mutationFn: ({ data }: { data: Partial<ICustomer> }) => axios.patch<IResponseData<any>>(`/users/profile`, data),
        onSuccess: res => {
            toast(t(res.data.message), toastConfig('success'))
        },
        onError: onError
    })

    const deleteUserMutation = useMutation({
        mutationFn: (userId: number) => axios.post<IResponseData<unknown>>(`/auth/deactivate/${userId}`),
        onSuccess: res => {
            if (isSearching) {
                queryClient.invalidateQueries('search-users')
                searchUsersQuery.refetch()
            } else queryClient.invalidateQueries('users')
            toast(t(res.data.message), toastConfig('success'))
        },
        onError: onError
    })

    return {
        fetchUsersQuery,
        total,
        users,
        current,
        setCurrent,
        deleteUserMutation,
        buildQuery,
        onFilterSearch,
        onResetFilterSearch,
        updateProfileMutation,
        searchUsersQuery,
        itemPerPage,
        setItemPerPage
    }
}
