import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Input, Button, Typography, Space } from 'antd'
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'
import { inputStyle, buttonStyle } from '../../assets/styles/globalStyle'
import { FormType } from './AuthPage'
import '../../assets/styles/pages/AuthPage.css'

interface FormProps {
    isLoading?: boolean
    setFormType?: (type: FormType) => void
}

const SignInInputs: FC<FormProps> = ({ setFormType, isLoading }) => {
    const { t } = useTranslation()
    return (
        <>
            <Typography.Title level={3} className="text-center" style={{ marginBottom: '24px' }}>
                {t('sign in')}
            </Typography.Title>
            <Form.Item
                name="username"
                rules={[
                    { required: true, message: t('please enter your username').toString() },
                    { whitespace: true, message: t('please enter your username').toString() },
                    { max: 25, min: 8, message: t('your username must be between 8 and 25 in length').toString() }
                ]}
            >
                <Input
                    size="large"
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    spellCheck={false}
                    placeholder={t('username...').toString()}
                    style={inputStyle}
                />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[
                    { required: true, message: t('please enter your password').toString() },
                    { max: 25, min: 6, message: t('your password must be between 6 and 25 in length').toString() }
                ]}
            >
                <Input.Password
                    size="large"
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    placeholder={t('password...').toString()}
                    style={inputStyle}
                />
            </Form.Item>
            <span onClick={() => (setFormType as any)('forgot')} className="forgot-password">
                {t('forgot password?')}
            </span>
            <Form.Item>
                <Button
                    loading={isLoading}
                    size="large"
                    shape="round"
                    type="primary"
                    htmlType="submit"
                    block
                    className="submit-btn"
                    style={buttonStyle}
                >
                    {t('sign in')}
                </Button>
            </Form.Item>
        </>
    )
}

const SignUpInputs: FC<FormProps> = ({ isLoading }) => {
    const { t } = useTranslation()
    return (
        <>
            <Typography.Title level={3} className="text-center" style={{ marginBottom: '24px' }}>
                {t('sign up')}
            </Typography.Title>
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
            <Form.Item
                name="username"
                rules={[
                    { required: true, message: t('please enter your username').toString() },
                    { whitespace: true, message: t('please enter your username').toString() },
                    { max: 25, min: 8, message: t('your username must be between 8 and 25 in length').toString() }
                ]}
            >
                <Input
                    size="large"
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    spellCheck={false}
                    placeholder={t('username...').toString()}
                    style={inputStyle}
                />
            </Form.Item>
            <Space size="small">
                <Form.Item
                    name="password"
                    rules={[
                        { required: true, message: t('please enter your password').toString() },
                        { max: 25, min: 6, message: t('your password must be between 6 and 25 in length').toString() }
                    ]}
                >
                    <Input.Password
                        size="large"
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        placeholder={t('password...').toString()}
                        style={inputStyle}
                    />
                </Form.Item>
                <Form.Item
                    name="cf-password"
                    rules={[
                        { required: true, message: t('please enter your password').toString() },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve()
                                }
                                return Promise.reject(t('password do not match').toString())
                            }
                        })
                    ]}
                >
                    <Input.Password
                        size="large"
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        placeholder={t('confirm password...').toString()}
                        style={inputStyle}
                    />
                </Form.Item>
            </Space>
            <Form.Item>
                <Button
                    size="large"
                    shape="round"
                    type="primary"
                    htmlType="submit"
                    block
                    className="submit-btn"
                    style={buttonStyle}
                    loading={isLoading}
                >
                    {t('sign up')}
                </Button>
            </Form.Item>
        </>
    )
}

const ForgotInputs: FC<FormProps> = ({ isLoading }) => {
    const { t } = useTranslation()
    return (
        <>
            <Typography.Title level={3} className="text-center" style={{ marginBottom: '24px' }}>
                {t('forgot password')}
            </Typography.Title>
            <Form.Item
                name="email"
                rules={[
                    { required: true, message: t('please enter your email').toString() },
                    { whitespace: true, message: t('please enter your email').toString() },
                    { type: 'email', message: t('invalid email address').toString() }
                ]}
            >
                <Input
                    size="large"
                    prefix={<MailOutlined className="site-form-item-icon" />}
                    spellCheck={false}
                    placeholder="Email..."
                    style={inputStyle}
                />
            </Form.Item>
            <Form.Item>
                <Button
                    loading={isLoading}
                    size="large"
                    shape="round"
                    type="primary"
                    htmlType="submit"
                    block
                    className="submit-btn"
                    style={buttonStyle}
                >
                    {t('submit')}
                </Button>
            </Form.Item>
        </>
    )
}

const ResetInputs: FC<FormProps> = ({ isLoading }) => {
    const { t } = useTranslation()
    return (
        <>
            <Typography.Title level={3} className="text-center" style={{ marginBottom: '24px' }}>
                {t('reset password')}
            </Typography.Title>
            <Form.Item
                name="password"
                rules={[
                    { required: true, message: t('please enter your password').toString() },
                    { max: 25, min: 6, message: t('your password must be between 6 and 25 in length').toString() }
                ]}
            >
                <Input.Password
                    size="large"
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    placeholder={t('password...').toString()}
                    style={inputStyle}
                />
            </Form.Item>
            <Form.Item
                name="cf-password"
                rules={[
                    { required: true, message: t('please enter your password').toString() },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve()
                            }
                            return Promise.reject(t('password do not match').toString())
                        }
                    })
                ]}
            >
                <Input.Password
                    size="large"
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    placeholder={t('confirm password...').toString()}
                    style={inputStyle}
                />
            </Form.Item>
            <Form.Item>
                <Button
                    loading={isLoading}
                    size="large"
                    shape="round"
                    type="primary"
                    htmlType="submit"
                    block
                    className="submit-btn"
                    style={buttonStyle}
                >
                    {t('submit')}
                </Button>
            </Form.Item>
        </>
    )
}

export { SignInInputs, SignUpInputs, ForgotInputs, ResetInputs }
