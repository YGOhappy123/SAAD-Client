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
import { IResponseData, IRole, IUser } from '../../types'
import { setUser, setLogged, signOut } from '../../slices/auth.slice'
import { setOrderNote, resetAppState } from '../../slices/app.slice'

interface SignInResponse {
    user: IUser
    accessToken: string
    refreshToken: string
}

export default () => {
    const { t } = useTranslation()
    const axios = useAxiosIns()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const signInMutation = useMutation({
        mutationFn: (params: { account: { username: string; password: string }; showToastMessage?: boolean }) =>
            axios.post<IResponseData<SignInResponse>>(`/auth/sign-in`, params.account),
        onError: onError,
        onSuccess: res => {
            const redirectPath = cookies.get('redirect_path') || '/'
            const { user, accessToken, refreshToken } = res.data.data
            cookies.set('access_token', accessToken, { path: '/', expires: new Date(dayjs(Date.now()).add(30, 'day').toISOString()) })
            cookies.set('refresh_token', refreshToken, { path: '/', expires: new Date(dayjs(Date.now()).add(30, 'day').toISOString()) })

            navigate(redirectPath as string)
            dispatch(setLogged(true))
            dispatch(setUser(user))
            dispatch(resetAppState())
            toast(t(res.data.message), toastConfig('success'))
        }
    })

    const signUpMutation = useMutation({
        mutationFn: (data: { username: string; password: string; firstName: string; lastName: string }) =>
            axios.post<IResponseData<SignInResponse>>('/auth/sign-up', data),
        onError: onError,
        onSuccess: res => {
            const redirectPath = cookies.get('redirect_path') || '/'
            const { user, accessToken, refreshToken } = res.data.data
            cookies.set('access_token', accessToken, { path: '/', expires: new Date(dayjs(Date.now()).add(30, 'day').toISOString()) })
            cookies.set('refresh_token', refreshToken, { path: '/', expires: new Date(dayjs(Date.now()).add(30, 'day').toISOString()) })

            navigate(redirectPath as string)
            dispatch(setLogged(true))
            dispatch(setUser(user))
            dispatch(resetAppState())
            toast(t(res.data.message), toastConfig('success'))
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
        mutationFn: (data: { resetPasswordToken: string; password: string; confirmPassword: string }) =>
            axios.post<IResponseData<any>>('/auth/reset-password', data),
        onError: onError,
        onSuccess: res => {
            toast(t(res.data.message), toastConfig('success'))
        }
    })

    const deactivateAccountMutation = useMutation({
        mutationFn: (data: { targetUserId: number; targetUserRole: IRole }) =>
            axios.post<IResponseData<any>>(`/auth/deactivate-account`, {
                targetUserId: data.targetUserId,
                targetUserRole: data.targetUserRole
            }),
        onError: onError,
        onSuccess: res => {
            toast(t(res.data.message), toastConfig('success'))
            dispatch(signOut())
        }
    })

    const updatePasswordMutation = useMutation({
        mutationFn: ({ oldPassword, newPassword, confirmPassword }: { oldPassword: string; newPassword: string; confirmPassword: string }) =>
            axios.post<IResponseData<any>>(`/auth/change-password`, { oldPassword, newPassword, confirmPassword }),
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
