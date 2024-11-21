import { ICustomer } from './auth'
import { IMilktea } from './product'

export interface IStatistics {
    currentCount: number
    previousCount: number
}

export interface ISalesData {
    totalUnits: number
    totalSales: number
}

export type MilkteaSale = Partial<IMilktea> & {
    quantity: number
    amount: number
}

export type CustomerTotalSpending = Partial<ICustomer> & {
    amount: number
}
