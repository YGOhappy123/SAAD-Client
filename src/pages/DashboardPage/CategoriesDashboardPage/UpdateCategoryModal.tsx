import { Modal, Row, Col, Button, Form, Input, FormInstance } from 'antd'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { buttonStyle, inputStyle, secondaryButtonStyle } from '../../../assets/styles/globalStyle'
import { ICategory } from '../../../types'

interface UpdateCategoryModalProps {
    shouldOpen: boolean
    onCancel: () => void
    onSubmit: (values: Partial<ICategory>) => void
    isLoading?: boolean
    category: ICategory | null
}

export default function UpdateCategoryModal({ category, shouldOpen, onCancel, onSubmit, isLoading }: UpdateCategoryModalProps) {
    const { t } = useTranslation()
    const [form] = Form.useForm()

    const onInternalCancel = () => {
        form.resetFields()
        onCancel()
    }

    useEffect(() => {
        if (category && shouldOpen)
            form.setFieldsValue({
                nameVi: category.nameVi,
                nameEn: category.nameEn
            })
    }, [shouldOpen])

    return (
        <Modal
            open={shouldOpen}
            destroyOnClose
            closable={false}
            title={<h3>{t('update category')}</h3>}
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
                    <UpdateCategoryForm category={category} form={form} onSubmit={onSubmit} />
                </Col>
            </Row>
        </Modal>
    )
}

export const UpdateCategoryForm = ({
    form,
    onSubmit,
    category
}: {
    form: FormInstance
    onSubmit: (values: Partial<ICategory>) => void
    category: ICategory | null
}) => {
    const { t } = useTranslation()

    const onFinish = (values: any) => {
        onSubmit({
            nameVi: values.nameVi,
            nameEn: values.nameEn
        })
    }

    return (
        <>
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
            </Form>
        </>
    )
}
