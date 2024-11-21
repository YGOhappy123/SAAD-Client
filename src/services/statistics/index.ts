import { useState } from 'react'
import { useQuery } from 'react-query'
import { onError } from '../../utils/error-handlers'
import { IStatistics, IResponseData, ICustomer, MilkteaSale, CustomerTotalSpending } from '../../types'
import useAxiosIns from '../../hooks/useAxiosIns'

interface StatisticsResponse {
    users: IStatistics
    orders: IStatistics
    revenues: IStatistics
}

interface PopularDataResponse {
    productsWithHighestSales: MilkteaSale[]
    newCustomers: Partial<ICustomer>[]
    usersWithHighestTotalOrderValue: CustomerTotalSpending[]
}

export default () => {
    const axios = useAxiosIns()
    const [type, setType] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily')

    const getStatisticsQuery = useQuery({
        queryKey: ['statistics', type],
        queryFn: () => axios.get<IResponseData<StatisticsResponse>>(`/statistic?type=${type}`),
        onError: onError,
        refetchOnWindowFocus: false,
        refetchInterval: 10000,
        refetchIntervalInBackground: true,
        select: res => res.data.data
    })

    const getPopularDataQuery = useQuery({
        queryKey: ['statistics-popular', type],
        queryFn: () => axios.get<IResponseData<PopularDataResponse>>(`/statistic/popular?type=${type}`),
        onError: onError,
        refetchOnWindowFocus: false,
        refetchInterval: 10000,
        refetchIntervalInBackground: true,
        select: res => res.data.data
    })

    return {
        getStatisticsQuery,
        getPopularDataQuery,
        type,
        setType
    }
}
