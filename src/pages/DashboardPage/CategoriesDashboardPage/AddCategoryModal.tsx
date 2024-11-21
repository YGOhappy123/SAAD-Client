import { useTranslation } from 'react-i18next'
import { Modal, Row, Col, Button, Form, Input, FormInstance } from 'antd'
import { ICategory } from '../../../types'
import { buttonStyle, inputStyle, secondaryButtonStyle } from '../../../assets/styles/globalStyle'

interface AddCategoryModalProps {
    shouldOpen: boolean
    onCancel: () => void
    onSubmit: (values: Partial<ICategory>) => void
    isLoading: boolean
}

export default function AddCategoryModal({ shouldOpen, onCancel, onSubmit, isLoading }: AddCategoryModalProps) {
    const { t } = useTranslation()
    const [form] = Form.useForm()

    const onInternalCancel = () => {
        form.resetFields()
        onCancel()
    }

    return (
        <Modal
            open={shouldOpen}
            destroyOnClose
            afterClose={() => form.resetFields()}
            closable={false}
            title={<h3>{t('new category')}</h3>}
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
                    <AddCategoryForm form={form} onSubmit={onSubmit} />
                </Col>
            </Row>
        </Modal>
    )
}

export const AddCategoryForm = ({ form, onSubmit }: { form: FormInstance; onSubmit: (values: Partial<ICategory>) => void }) => {
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
