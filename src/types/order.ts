import { IAdmin, ICustomer, IStaff } from './auth'
import { IMilktea, ITopping } from './product'

export interface IOrder {
    id: number
    customerId: number
    totalPrice: number
    note?: string
    createdAt: string

    processingStaffId?: number
    rejectionReason?: string
    status: OrderStatus
    updatedAt: string

    customer?: Partial<ICustomer>
    items?: IOrderItem[]
    processingStaff?: Partial<IAdmin>
}

export type IOrderItem = {
    id?: number
    orderId?: number
    milkteaId: number
    size: string
    quantity: number
    price: number

    toppings?: Partial<IOrderItemTopping>[]
} & Partial<IMilktea>

export type IOrderItemTopping = {
    orderItemId?: number
    id: number
    price: number
} & Partial<ITopping>

export type OrderStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Done'
