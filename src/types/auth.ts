export interface IUser {
    id: number
    firstName: string
    lastName: string
    role: IRole
    createdAt: string

    email?: string
    address?: string
    phoneNumber?: string
    avatar?: string

    createdById?: number | string | null
    createdBy?: IAdmin | null
}

export interface ICustomer {
    id: number
    firstName: string
    lastName: string
    createdAt: string

    email?: string
    address?: string
    phoneNumber?: string
    avatar?: string

    totalOrdersThisMonth?: number
    totalOrdersThisYear?: number
    isActive?: boolean
}

export interface IAdmin {
    id: number
    firstName: string
    lastName: string
    createdAt: string

    email: string
    avatar?: string
    createdBy?: IAdmin | null
    createdById?: number | string | null
    isActive?: boolean
}

export type IRole = 'Customer' | 'Admin'
