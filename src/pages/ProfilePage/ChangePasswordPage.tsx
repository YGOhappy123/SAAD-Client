import { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Input, Button } from 'antd'
import useTitle from '../../hooks/useTitle'
import useAuth from '../../services/auth'
import ProfileSidebar from '../../components/ProfileSidebar'
import { containerStyle, inputStyle } from '../../assets/styles/globalStyle'
import '../../assets/styles/pages/ProfilePage.css'

const ChangePasswordPage: FC = () => {
    const { t } = useTranslation()
    const { updatePasswordMutation } = useAuth()
    const [form] = Form.useForm()

    useTitle(`${t('change password')} - PMT`)
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const onFinish = (values: any) => {
        updatePasswordMutation
            .mutateAsync({ currentPassword: values.currentPassword, newPassword: values.newPassword })
            .then(res => form.resetFields())
    }

    return (
        <div className="profile-page">
            <section className="container-wrapper">
                <div className="container" style={containerStyle}>
                    <ProfileSidebar />

                    <div className="update-account-form">
                        <Form form={form} layout="vertical" onFinish={onFinish}>
                            <h3 className="form-heading">{t('change password')}</h3>

                            <Form.Item
                                name="currentPassword"
                                rules={[{ required: true, message: t('please enter your current password').toString() }]}
                            >
                                <Input.Password size="large" placeholder={t('current password...').toString()} style={inputStyle} />
                            </Form.Item>

                            <Form.Item
                                name="newPassword"
                                rules={[
                                    { required: true, message: t('please enter your new password').toString() },
                                    { max: 25, min: 6, message: t('your password must be between 6 and 25 in length').toString() }
                                ]}
                            >
                                <Input.Password size="large" placeholder={t('new password...').toString()} style={inputStyle} />
                            </Form.Item>

                            <Form.Item
                                name="confirmPassword"
                                rules={[
                                    { required: true, message: t('please enter your new password').toString() },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('newPassword') === value) {
                                                return Promise.resolve()
                                            }
                                            return Promise.reject(t('password do not match').toString())
                                        }
                                    })
                                ]}
                            >
                                <Input.Password size="large" placeholder={t('confirm password...').toString()} style={inputStyle} />
                            </Form.Item>

                            <Form.Item style={{ marginBottom: 0 }}>
                                <Button size="large" shape="round" block type="primary" htmlType="submit" className="update-account-btn">
                                    {t('change password')}
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ChangePasswordPage
