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

export interface IStaff {
    staffId: number
    firstName: string
    lastName: string
    createdAt: string

    email: string
    address: string
    phoneNumber: string
    avatar: string

    gender: 'Male' | 'Female'
    hireDate: string
    monthlySalary: number
    createdBy: number | string | null
    isWorking?: boolean
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
}

export type IRole = 'Customer' | 'Admin'
