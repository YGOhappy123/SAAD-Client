export interface IUser {
    userId: number
    firstName: string
    lastName: string
    role: IRole
    createdAt: string

    email?: string
    address?: string
    phoneNumber?: string
    avatar?: string

    gender?: 'Male' | 'Female'
    hireDate?: string
    monthlySalary?: number
    createdBy?: number | string | null
}

export interface ICustomer {
    userId: number
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
    adminId: number
    firstName: string
    lastName: string
    createdAt: string

    email: string
    avatar?: string
    gender: 'Male' | 'Female'
    createdBy?: number | string | null
}

export type IRole = 'User' | 'Staff' | 'Admin'
