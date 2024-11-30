import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button, Form, Input, Select } from 'antd'
import { IUser } from '../../types'
import { RootState } from '../../store'
import { setUser } from '../../slices/auth.slice'
import { containerStyle, inputStyle } from '../../assets/styles/globalStyle'
import type { FormInstance } from 'antd/es/form'
import ProfileSidebar from '../../components/ProfileSidebar'
import useTitle from '../../hooks/useTitle'
import useUsers from '../../services/users'
import useAdmins from '../../services/admins'
import '../../assets/styles/pages/ProfilePage.css'

const ProfilePage = () => {
    const { t } = useTranslation()
    const { updateProfileMutation } = useUsers({ enabledFetchUsers: false })
    const { updateAdminMutation } = useAdmins({ enabledFetchAdmins: false })
    const dispatch = useDispatch()

    useTitle(`${t('edit account')} - PMT`)
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const user: IUser = useSelector((state: RootState) => state.auth.user)
    useEffect(() => setFormDefaultValues(), [user])

    const setFormDefaultValues = () => {
        formRef.current?.setFieldsValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user?.phoneNumber,
            address: user?.address
        })
    }

    const formRef = useRef<FormInstance>(null)
    const onFinish = (values: any) => {
        if (user.role === 'Admin') {
            delete values.email
        }

        if (user.role === 'Customer') {
            updateProfileMutation
                .mutateAsync({
                    data: { ...values, email: values.email || null, phoneNumber: values.phoneNumber || null, address: values.address || null }
                })
                .then(() => {
                    dispatch(setUser({ ...user, ...values }))
                })
                .catch(() => setFormDefaultValues())
        } else {
            updateAdminMutation
                .mutateAsync({ data: values })
                .then(() => {
                    dispatch(setUser({ ...user, ...values }))
                })
                .catch(() => setFormDefaultValues())
        }
    }

    return (
        <div className="profile-page">
            <section className="container-wrapper">
                <div className="container" style={containerStyle}>
                    <ProfileSidebar />

                    <div className="update-account-form">
                        <Form layout="vertical" onFinish={onFinish} ref={formRef}>
                            <h3 className="form-heading">{t('account details')}</h3>

                            <Form.Item
                                name="firstName"
                                rules={[
                                    { required: true, message: t('required').toString() },
                                    { whitespace: true, message: t('required').toString() }
                                ]}
                            >
                                <Input size="large" spellCheck={false} placeholder={t('first name...').toString()} style={inputStyle} />
                            </Form.Item>

                            <Form.Item
                                name="lastName"
                                rules={[
                                    { required: true, message: t('required').toString() },
                                    { whitespace: true, message: t('required').toString() }
                                ]}
                            >
                                <Input size="large" spellCheck={false} placeholder={t('last name...').toString()} style={inputStyle} />
                            </Form.Item>

                            {
                                <Form.Item
                                    name="phoneNumber"
                                    rules={[
                                        { required: user.role === 'Admin', message: t('required').toString() },
                                        { whitespace: user.role === 'Admin', message: t('required').toString() },
                                        {
                                            pattern: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
                                            message: t('invalid phone number').toString()
                                        }
                                    ]}
                                >
                                    <Input size="large" placeholder={t('phone number...').toString()} style={inputStyle} />
                                </Form.Item>
                            }

                            <Form.Item name="email" rules={[{ type: 'email', message: t('invalid email address').toString() }]}>
                                <Input size="large" spellCheck={false} placeholder="Email..." style={inputStyle} disabled={user.role === 'Admin'} />
                            </Form.Item>

                            {user.role === 'Customer' && (
                                <Form.Item name="address">
                                    <Input size="large" spellCheck={false} placeholder={t('address...').toString()} style={inputStyle} />
                                </Form.Item>
                            )}

                            <Form.Item style={{ marginBottom: 0 }}>
                                <Button size="large" shape="round" block type="primary" htmlType="submit" className="update-account-btn">
                                    {t('update account')}
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ProfilePage
