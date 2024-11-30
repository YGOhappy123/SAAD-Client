import { ICategory } from './category'

export interface IMilktea {
    id?: number
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
    isActive: boolean

    category?: Partial<ICategory>
    soldUnitsToday?: number
    soldUnitsThisWeek?: number
    soldUnitsThisMonth?: number
    soldUnitsThisYear?: number
}

export interface ITopping {
    id?: number
    nameVi: string
    nameEn: string
    descriptionVi: string
    descriptionEn: string
    price: number
    image: string | null
    isAvailable: boolean
    createdAt: string
    isActive: boolean
}

export type IProduct = IMilktea | ITopping

export interface ICartItem {
    id: number
    userId?: number
    milkteaId: number
    size: string
    quantity: number

    milktea?: Partial<IMilktea>
    toppings?: number[] | Partial<ITopping>[]
    price?: number
}
