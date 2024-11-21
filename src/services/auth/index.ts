import { toast } from 'react-toastify'
import { useMutation } from 'react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import toastConfig from '../../configs/toast'
import cookies from '../../libs/cookies'
import dayjs from '../../libs/dayjs'
import useAxiosIns from '../../hooks/useAxiosIns'
import { onError } from '../../utils/error-handlers'
import { IResponseData, IUser } from '../../types'
import { setUser, setLogged, signOut } from '../../slices/auth.slice'
import { setOrderNote, resetAppState } from '../../slices/app.slice'

interface SignInResponse {
    user: IUser
    accessToken: string
    refreshToken: string
}

interface SignUpResponse {
    username: string
    password: string
}

export default () => {
    const { t } = useTranslation()
    const axios = useAxiosIns()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const signInMutation = useMutation({
        mutationFn: (params: { account: { username: string; password: string }; showToastMessage?: boolean }) =>
            axios.post<IResponseData<SignInResponse>>(`/auth/login`, params.account),
        onError: onError,
        onSuccess: (res, variables) => {
            const { showToastMessage = true } = variables
            const redirectPath = cookies.get('redirect_path') || '/'
            const { user, accessToken, refreshToken } = res.data.data
            cookies.set('access_token', accessToken, { path: '/', expires: new Date(dayjs(Date.now()).add(30, 'day').toISOString()) })
            cookies.set('refresh_token', refreshToken, { path: '/', expires: new Date(dayjs(Date.now()).add(30, 'day').toISOString()) })

            navigate(redirectPath as string)
            dispatch(setLogged(true))
            dispatch(setUser(user))
            dispatch(resetAppState())

            if (showToastMessage) {
                toast(t(res.data.message), toastConfig('success'))
            }
        }
    })

    const signUpMutation = useMutation({
        mutationFn: (data: { username: string; password: string; firstName: string; lastName: string }) =>
            axios.post<IResponseData<SignUpResponse>>('/auth/register', data),
        onError: onError,
        onSuccess: res => {
            toast(t(res.data.message), toastConfig('success'))
            const { username, password } = res.data.data
            signInMutation.mutate({ account: { username, password }, showToastMessage: false })
        }
    })

    const googleAuthMutation = useMutation({
        mutationFn: (googleAccessToken: string) => axios.post('/auth/google-auth', { googleAccessToken }),
        onError: onError,
        onSuccess: res => {
            const redirectPath = cookies.get('redirect_path') || '/'
            toast(t(res.data.message), toastConfig('success'))
            const { user, accessToken, refreshToken } = res.data.data
            cookies.set('access_token', accessToken, { path: '/', expires: new Date(dayjs(Date.now()).add(30, 'day').toISOString()) })
            cookies.set('refresh_token', refreshToken, { path: '/', expires: new Date(dayjs(Date.now()).add(30, 'day').toISOString()) })

            navigate(redirectPath as string)
            dispatch(setLogged(true))
            dispatch(setUser(user))
            dispatch(resetAppState())
        }
    })

    const forgotPasswordMutation = useMutation({
        mutationFn: ({ email }: { email: string }) => axios.post<IResponseData<SignInResponse>>('/auth/forgot-password', { email }),
        onError: onError,
        onSuccess: res => {
            toast(t(res.data.message), toastConfig('success'))
        }
    })

    const resetPasswordMutation = useMutation({
        mutationFn: (data: { password: string; token: string }) => axios.post<IResponseData<SignUpResponse>>('/auth/reset-password', data),
        onError: onError,
        onSuccess: res => {
            toast(t(res.data.message), toastConfig('success'))
        }
    })

    const deactivateAccountMutation = useMutation({
        mutationFn: (data: { password: string; customerId: number }) =>
            axios.post<IResponseData<any>>(`/auth/deactivate/${data.customerId}`, { password: data.password }),
        onError: onError,
        onSuccess: res => {
            toast(t(res.data.message), toastConfig('success'))
            dispatch(signOut())
        }
    })

    const updatePasswordMutation = useMutation({
        mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
            axios.post<IResponseData<any>>(`/auth/change-password`, { currentPassword, newPassword }),
        onSuccess: res => {
            toast(t(res.data.message), toastConfig('success'))
        },
        onError: onError
    })

    return {
        signInMutation,
        forgotPasswordMutation,
        signUpMutation,
        googleAuthMutation,
        resetPasswordMutation,
        deactivateAccountMutation,
        updatePasswordMutation
    }
}
