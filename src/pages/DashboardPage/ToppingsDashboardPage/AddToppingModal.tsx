import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { UploadRequestOption } from 'rc-upload/lib/interface'
import { Modal, Row, Col, Button, Form, Input, FormInstance, Select, Empty, Image, Upload } from 'antd'
import { DeleteFilled, MoneyCollectOutlined } from '@ant-design/icons'
import { ITopping } from '../../../types'
import { buttonStyle, inputStyle, secondaryButtonStyle } from '../../../assets/styles/globalStyle'
import useFiles from '../../../services/files'

interface AddProductModalProps {
    shouldOpen: boolean
    onCancel: () => void
    onSubmit: (values: Partial<ITopping>) => void
    isLoading: boolean
}

export default function AddProductModal({ shouldOpen, onCancel, onSubmit, isLoading }: AddProductModalProps) {
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
            title={<h3>{t('new product')}</h3>}
            width={1000}
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
                    <AddProductForm form={form} onSubmit={onSubmit} />
                </Col>
            </Row>
        </Modal>
    )
}

export const AddProductForm = ({ form, onSubmit }: { form: FormInstance; onSubmit: (values: Partial<ITopping>) => void }) => {
    const { t } = useTranslation()
    const { uploadMutation, deleteMutation } = useFiles()
    const [featuredImage, setFeaturedImage] = useState<string>('')

    const onFinish = (values: any) => {
        onSubmit({
            nameVi: values.nameVi,
            nameEn: values.nameEn,
            descriptionVi: values.descriptionVi,
            descriptionEn: values.descriptionEn,
            isAvailable: values.isAvailable,
            image: featuredImage,
            price: values.price
        })
    }

    const onDeleteFeaturedImage = (image: string) => {
        deleteMutation.mutate(image)
        setFeaturedImage('')
    }

    const handleUpload = ({ file }: UploadRequestOption<any>) => {
        if (featuredImage) return
        uploadMutation.mutateAsync({ file, folder: 'product' }).then(res => {
            setFeaturedImage(res.data.data?.imageUrl)
        })
    }

    return (
        <Row align="middle" gutter={24} className="add-product-modal">
            <Col span={11}>
                <Row align="middle" justify="space-between" style={{ padding: '8px 0', marginBottom: 40 }}>
                    <Col>
                        <div style={{ textAlign: 'left' }}>
                            <label>{t('featured images')}</label>
                        </div>
                    </Col>
                    <Col>
                        <Upload customRequest={handleUpload} accept="image/*" showUploadList={false}>
                            <Button
                                loading={uploadMutation.isLoading}
                                type="primary"
                                shape="round"
                                ghost
                                size="large"
                                disabled={featuredImage !== ''}
                            >
                                <small>
                                    <strong>+ {t('add')}</strong>
                                </small>
                            </Button>
                        </Upload>
                    </Col>
                </Row>

                {featuredImage ? (
                    <div style={{ position: 'relative' }}>
                        <Image preview={false} src={featuredImage} />
                        <Button
                            loading={deleteMutation.isLoading}
                            style={{ position: 'absolute', top: '10px', right: '10px', zIndex: '10' }}
                            danger
                            shape="circle"
                            type="primary"
                            icon={<DeleteFilled />}
                            onClick={() => onDeleteFeaturedImage(featuredImage)}
                        ></Button>
                    </div>
                ) : (
                    <Empty imageStyle={{ height: 200 }} description={t('no data')} />
                )}
            </Col>

            <Col span={13}>
                <Form requiredMark={false} layout="vertical" onFinish={onFinish} form={form}>
                    <Form.Item
                        label={t('name vi')}
                        name="nameVi"
                        rules={[
                            { required: true, message: t('required').toString() },
                            { whitespace: true, message: t('required').toString() }
                        ]}
                    >
                        <Input size="large" spellCheck={false} placeholder={t('name vi').toString()} style={inputStyle} />
                    </Form.Item>
                    <Form.Item
                        label={t('name en')}
                        name="nameEn"
                        rules={[
                            { required: true, message: t('required').toString() },
                            { whitespace: true, message: t('required').toString() }
                        ]}
                    >
                        <Input size="large" spellCheck={false} placeholder={t('name en').toString()} style={inputStyle} />
                    </Form.Item>
                    <Form.Item
                        label={t('description vi')}
                        name="descriptionVi"
                        rules={[
                            { required: true, message: t('required').toString() },
                            { whitespace: true, message: t('required').toString() }
                        ]}
                    >
                        <Input.TextArea
                            size="large"
                            spellCheck={false}
                            placeholder={t('description vi').toString()}
                            autoSize={{ minRows: 2, maxRows: 3 }}
                            style={inputStyle}
                        />
                    </Form.Item>
                    <Form.Item
                        label={t('description en')}
                        name="descriptionEn"
                        rules={[
                            { required: true, message: t('required').toString() },
                            { whitespace: true, message: t('required').toString() }
                        ]}
                    >
                        <Input.TextArea
                            size="large"
                            spellCheck={false}
                            placeholder={t('description en').toString()}
                            autoSize={{ minRows: 2, maxRows: 3 }}
                            style={inputStyle}
                        />
                    </Form.Item>
                    <Form.Item name="price" label={t('price')} rules={[{ required: true, message: t('required').toString() }]}>
                        <Input
                            prefix={<MoneyCollectOutlined />}
                            size="large"
                            type="number"
                            spellCheck={false}
                            placeholder={`${t('price')}`}
                            style={inputStyle}
                            min={0}
                        />
                    </Form.Item>
                    <Form.Item name="isAvailable" label={`${t('in stock')}?`} initialValue={true}>
                        <Select size="large">
                            <Select.Option value={true}>{t('yes')}</Select.Option>
                            <Select.Option value={false}>{t('no')}</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    )
}
