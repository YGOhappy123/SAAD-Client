import { ICustomer, IStaff } from './auth'
import { IMilktea, ITopping, IVoucher } from './product'

export interface IOrder {
    orderId: number
    customerId: number
    totalPrice: number
    voucherId: number
    note?: string
    createdAt: string

    staffId?: number
    rejectionReason?: string
    status: OrderStatus
    updatedAt: string

    customer?: Partial<ICustomer>
    voucher?: Partial<IVoucher>
    items?: IOrderItem[]
    staff?: Partial<IStaff>
}

export type IOrderItem = {
    orderItemId?: number
    orderId?: number
    milkteaId: number
    sizeId: string
    quantity: number
    price: number

    toppings?: Partial<IOrderItemTopping>[]
} & Partial<IMilktea>

export type IOrderItemTopping = {
    orderItemId?: number
    toppingId: number
    price: number
} & Partial<ITopping>

export type OrderStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Done'
