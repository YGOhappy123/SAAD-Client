import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import toastConfig from '../configs/toast'
import cookies from '../libs/cookies'
import { axiosIns } from './useAxiosIns'
import { signOut } from '../slices/auth.slice'
import dayjs from '../libs/dayjs'

const useRefreshTokenFn = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleError = () => {
        toast(t('login session expired, please login again'), toastConfig('info'))
        dispatch(signOut())
        navigate('/auth')
    }

    const refreshTokenFn = async () =>
        new Promise<string | null>((resolve, reject) => {
            axiosIns({
                url: '/auth/refresh',
                method: 'POST',
                validateStatus: null,
                data: {
                    refreshToken: cookies.get('refresh_token') || localStorage.getItem('refresh_token')
                }
            })
                .then(res => {
                    const { accessToken } = res?.data?.data
                    if (accessToken) {
                        cookies.set('access_token', accessToken, { path: '/', expires: new Date(dayjs(Date.now()).add(30, 'day').toISOString()) })
                        resolve(accessToken)
                    } else {
                        handleError()
                        resolve(null)
                    }
                })
                .catch(error => {
                    handleError()
                    reject(error)
                })
        })

    return refreshTokenFn
}

export default useRefreshTokenFn
