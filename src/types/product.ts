import { ICategory } from './category'

export interface IMilktea {
    milkteaId?: number
    nameVi: string
    nameEn: string
    descriptionVi: string
    descriptionEn: string
    price: {
        [size: string]: number | undefined
    }
    image: string | null
    isAvailable: boolean
    categoryId?: string
    createdAt: string
    isHidden: boolean

    category?: Partial<ICategory>
    soldUnitsToday?: number
    soldUnitsThisWeek?: number
    soldUnitsThisMonth?: number
    soldUnitsThisYear?: number
}

export interface ITopping {
    toppingId?: number
    nameVi: string
    nameEn: string
    descriptionVi: string
    descriptionEn: string
    price: number
    image: string | null
    isAvailable: boolean
    createdAt: string
    isHidden: boolean
}

export type IProduct = IMilktea | ITopping

export interface IVoucher {
    voucherId: string
    code: string
    discountType: 'Percent' | 'Fixed Amount'
    discountAmount: number
    totalUsageLimit: number
    expiredDate?: string
    createdAt: string
    isHidden: boolean
}

export interface ICartItem {
    cartItemId: number
    userId?: number
    milkteaId: number
    sizeId: string
    quantity: number

    milktea?: Partial<IMilktea>
    toppings?: number[] | Partial<ITopping>[]
    price?: number
}
