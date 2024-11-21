import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { UploadRequestOption } from 'rc-upload/lib/interface'
import { Modal, Row, Col, Button, Form, Input, Upload, FormInstance, Avatar, Select } from 'antd'
import { LoadingOutlined, MailOutlined, PlusOutlined } from '@ant-design/icons'
import { IAdmin } from '../../../types'
import { buttonStyle, inputStyle, secondaryButtonStyle } from '../../../assets/styles/globalStyle'
import useFiles from '../../../services/files'

interface AddAdminModalProps {
    shouldOpen: boolean
    onCancel: () => void
    onSubmit: (values: IAdmin) => void
    isLoading: boolean
}

export default function AddAdminModal({ shouldOpen, onCancel, onSubmit, isLoading }: AddAdminModalProps) {
    const { t } = useTranslation()
    const [form] = Form.useForm()

    const onInternalCancel = () => {
        form.resetFields()
        onCancel()
    }

    return (
        <Modal
            open={shouldOpen}
            afterClose={() => form.resetFields()}
            destroyOnClose
            closable={false}
            title={<h3>{t('new admin')}</h3>}
            onCancel={onInternalCancel}
            footer={
                <Row align="middle" justify="end" gutter={12}>
                    <Col span={6}>
                        <Button
                            loading={isLoading}
                            block
                            type="text"
                            shape="round"
                            style={{ ...buttonStyle, border: '1px solid' }}
                            onClick={() => onInternalCancel()}
                        >
                            <strong>{t('cancel')}</strong>
                        </Button>
                    </Col>
                    <Col span={6}>
                        <Button loading={isLoading} onClick={() => form.submit()} block shape="round" style={secondaryButtonStyle}>
                            <strong>{t('confirm')}</strong>
                        </Button>
                    </Col>
                </Row>
            }
        >
            <Row>
                <Col span={24} style={{ textAlign: 'center' }}>
                    <AddUserForm form={form} onSubmit={onSubmit} />
                </Col>
            </Row>
        </Modal>
    )
}

export const AddUserForm = ({ form, onSubmit }: { form: FormInstance; onSubmit: (values: IAdmin) => void }) => {
    const { t } = useTranslation()
    const { uploadMutation } = useFiles()
    const [avatar, setAvatar] = useState('')

    const handleUpload = ({ file }: UploadRequestOption<any>) => {
        uploadMutation.mutateAsync({ file, folder: 'avatar' }).then(res => {
            const newUrl = res.data.data?.url
            setAvatar(newUrl)
        })
    }

    const onFinish = (values: any) => {
        onSubmit({ ...values, avatar })
    }

    return (
        <>
            <Upload
                name="avatar"
                listType="picture-circle"
                className="avatar-uploader"
                accept="image/*"
                showUploadList={false}
                customRequest={handleUpload}
            >
                {avatar && !uploadMutation.isLoading ? (
                    <Avatar src={avatar} size={100} />
                ) : (
                    <div>
                        {uploadMutation.isLoading ? <LoadingOutlined /> : <PlusOutlined />}
                        <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                )}
            </Upload>
            <Form layout="vertical" onFinish={onFinish} form={form} style={{ marginTop: 20 }}>
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
                    name="firstName"
                    rules={[
                        { required: true, message: t('required').toString() },
                        { whitespace: true, message: t('required').toString() }
                    ]}
                >
                    <Input size="large" spellCheck={false} placeholder={t('first name...').toString()} style={inputStyle} />
                </Form.Item>
                <Form.Item
                    name="email"
                    rules={[
                        { required: true, message: t('required').toString() },
                        { whitespace: true, message: t('required').toString() },
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
                <Form.Item name="gender" label={t('gender')} initialValue={'Male'}>
                    <Select size="large">
                        <Select.Option value="Male">{t('male')}</Select.Option>
                        <Select.Option value="Female">{t('female')}</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </>
    )
}
