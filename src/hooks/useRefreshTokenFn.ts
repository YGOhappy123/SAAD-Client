import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { AxiosInstance } from 'axios'
import { toast } from 'react-toastify'
import { signOut } from '../slices/auth.slice'
import dayjs from '../libs/dayjs'
import toastConfig from '../configs/toast'
import cookies from '../libs/cookies'

const useRefreshTokenFn = (axiosIns: AxiosInstance) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleError = () => {
        toast(t('login session expired, please login again'), toastConfig('info'))
        dispatch(signOut())
        navigate('/auth')
    }

    const refreshTokenFn = async (refreshToken: string) =>
        new Promise<string | null>((resolve, reject) => {
            axiosIns({
                url: '/auth/refresh',
                method: 'POST',
                validateStatus: null,
                data: {
                    refreshToken: refreshToken
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
