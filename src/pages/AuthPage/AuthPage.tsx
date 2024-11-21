import { FC, useState, useEffect } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getI18n, useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useGoogleLogin } from '@react-oauth/google'
import { Form, Button, Divider, Tooltip, Avatar, ConfigProvider } from 'antd'
import { SignInInputs, SignUpInputs, ForgotInputs, ResetInputs } from './AuthInputGroups'
import { RootState } from '../../store'
import { buttonStyle } from '../../assets/styles/globalStyle'
import useAuth from '../../services/auth'
import useTitle from '../../hooks/useTitle'
import toastConfig from '../../configs/toast'
import '../../assets/styles/pages/AuthPage.css'

export type FormType = 'signIn' | 'signUp' | 'forgot' | 'reset'

const AuthPage: FC = () => {
    const { t } = useTranslation()
    const i18n = getI18n()
    useTitle(`${t('account')} - PMT`)

    const [form] = Form.useForm()
    const [formType, setFormType] = useState<FormType>('signIn')
    const { signInMutation, forgotPasswordMutation, googleAuthMutation, signUpMutation, resetPasswordMutation } = useAuth()
    const [query, setQuery] = useSearchParams()
    const isLogged = useSelector(
        (state: RootState) => state.auth.isLogged,
        () => true
    )

    const onSignIn = async (values: any) => {
        signInMutation.mutate({ account: values, showToastMessage: true })
    }

    const onSignUp = (values: any) => {
        signUpMutation.mutate(values)
    }

    const onForgotPassword = async (values: any) => {
        await forgotPasswordMutation.mutateAsync({ email: values.email })
        form.resetFields()
    }

    const onResetPassword = async (values: any) => {
        const token = query.get('token') as string
        if (!token) {
            toast(t('you can only use this feature though the link that is attached to the email'), toastConfig('info'))
            return
        }
        await resetPasswordMutation.mutateAsync({ password: values.password, token })
        form.resetFields()
        query.delete('token')
        query.set('type', 'signIn')
        setQuery(query)
    }

    const formEventHandlers = {
        signIn: (values: any) => onSignIn(values),
        signUp: (values: any) => onSignUp(values),
        forgot: (values: any) => onForgotPassword(values),
        reset: (values: any) => onResetPassword(values)
    }

    const onFinish = (values: any) => {
        formEventHandlers[formType](values)
    }

    useEffect(() => {
        if (query.get('type')) {
            setFormType(query.get('type') as FormType)
        }
    }, [query])

    const handleGoogleAuth = useGoogleLogin({
        onSuccess: async res => {
            googleAuthMutation.mutate(res.access_token)
        }
    })

    let content = null
    if (isLogged) {
        toast(t('you have already logged in'), toastConfig('error'))
        content = <Navigate to="/" />
    } else {
        content = (
            <div className="auth-page">
                <div className="abs-btns">
                    <Tooltip title={t('change language')}>
                        {i18n.resolvedLanguage === 'en' && (
                            <Avatar onClick={() => i18n.changeLanguage('vi')} src="/en.jpg" style={{ cursor: 'pointer' }}></Avatar>
                        )}
                        {i18n.resolvedLanguage === 'vi' && (
                            <Avatar onClick={() => i18n.changeLanguage('en')} src="/vn.jpg" style={{ cursor: 'pointer' }}></Avatar>
                        )}
                    </Tooltip>
                </div>

                <ConfigProvider
                    theme={{ token: { colorError: '#3700b3' } }}
                    children={
                        <Form layout="vertical" className="auth-form" onFinish={onFinish} form={form} autoComplete="off">
                            {formType === 'signIn' && <SignInInputs setFormType={setFormType} isLoading={signInMutation.isLoading} />}
                            {formType === 'signUp' && <SignUpInputs isLoading={signUpMutation.isLoading} />}
                            {formType === 'forgot' && <ForgotInputs isLoading={forgotPasswordMutation.isLoading} />}
                            {formType === 'reset' && <ResetInputs isLoading={resetPasswordMutation.isLoading} />}

                            {formType !== 'forgot' && formType !== 'reset' && (
                                <>
                                    <Divider style={{ borderColor: '#101319', marginBottom: '8px' }}>
                                        {formType === 'signIn' ? t('or sign in using') : t('or sign up using')}{' '}
                                    </Divider>
                                    <Button
                                        shape="round"
                                        size="large"
                                        block
                                        onClick={() => handleGoogleAuth()}
                                        style={buttonStyle}
                                        className="google-auth-btn"
                                    >
                                        <img src="/google-brand.png" />
                                        {formType === 'signIn' ? t('sign in with Google') : t('sign up with Google')}
                                    </Button>
                                </>
                            )}

                            <div className="text-center">
                                {formType === 'signIn' ? t("don't have an account?") + ' ' : t('already have an account?') + ' '}
                                <strong onClick={() => setFormType(formType === 'signIn' ? 'signUp' : 'signIn')}>
                                    {formType === 'signIn' ? t('sign up') : t('sign in')}
                                </strong>
                            </div>
                        </Form>
                    }
                />
            </div>
        )
    }

    return content
}

export default AuthPage
