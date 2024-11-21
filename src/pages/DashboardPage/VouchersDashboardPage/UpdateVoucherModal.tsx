import { PayCircleOutlined, TagOutlined } from '@ant-design/icons'
import { Modal, Row, Col, Button, Form, Input, FormInstance, Select, DatePicker } from 'antd'
import { useEffect } from 'react'
import { getI18n, useTranslation } from 'react-i18next'
import { buttonStyle, inputStyle, secondaryButtonStyle } from '../../../assets/styles/globalStyle'
import { IVoucher } from '../../../types'
import localeUS from 'antd/es/date-picker/locale/en_US'
import localeVN from 'antd/es/date-picker/locale/vi_VN'
import dayjs from '../../../libs/dayjs'

interface UpdateVoucherModalProps {
    shouldOpen: boolean
    onCancel: () => void
    onSubmit: (values: IVoucher) => void
    isLoading?: boolean
    voucher: IVoucher | null
}

export default function UpdateVoucherModal({ voucher, shouldOpen, onCancel, onSubmit, isLoading }: UpdateVoucherModalProps) {
    const { t } = useTranslation()
    const [form] = Form.useForm()

    const onInternalCancel = () => {
        form.resetFields()
        onCancel()
    }

    useEffect(() => {
        if (voucher && shouldOpen) form.setFieldsValue({ ...voucher, expiredDate: voucher.expiredDate ? dayjs(voucher.expiredDate) : null })
    }, [shouldOpen])

    return (
        <Modal
            open={shouldOpen}
            destroyOnClose
            closable={false}
            title={<h3>{t('update voucher')}</h3>}
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
                    <UpdateVoucherForm voucher={voucher} form={form} onSubmit={onSubmit} />
                </Col>
            </Row>
        </Modal>
    )
}

export const UpdateVoucherForm = ({
    form,
    onSubmit,
    voucher
}: {
    form: FormInstance
    onSubmit: (values: IVoucher) => void
    voucher: IVoucher | null
}) => {
    const { t } = useTranslation()
    const locale = getI18n().resolvedLanguage as 'vi' | 'en'

    const onFinish = (values: any) => {
        onSubmit({
            ...values,
            expiredDate: values.expiredDate?.endOf('day') ? dayjs(values.expiredDate?.endOf('day')).format('YYYY-MM-DD HH:mm:ss') : null
        })
    }

    return (
        <>
            <Form layout="vertical" onFinish={onFinish} form={form}>
                <Form.Item
                    name="code"
                    rules={[
                        { required: true, message: t('required').toString() },
                        { whitespace: true, message: t('required').toString() }
                    ]}
                >
                    <Input prefix={<TagOutlined />} size="large" spellCheck={false} placeholder={t('code').toString()} style={inputStyle} />
                </Form.Item>
                <Form.Item name="discountAmount" rules={[{ required: true, message: t('required').toString() }]}>
                    <Input
                        size="large"
                        prefix={<PayCircleOutlined />}
                        type="number"
                        spellCheck={false}
                        placeholder={t('discount amount').toString()}
                        style={inputStyle}
                        min={0}
                    />
                </Form.Item>
                <Form.Item name="totalUsageLimit" rules={[{ required: true, message: t('required').toString() }]}>
                    <Input size="large" type="number" spellCheck={false} placeholder={t('total usage limit').toString()} style={inputStyle} min={1} />
                </Form.Item>
                <Form.Item name="expiredDate" label={t('expired date')}>
                    <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} size="large" locale={locale === 'vi' ? localeVN : localeUS} />
                </Form.Item>
                <Form.Item name="discountType" label={t('discount type')} initialValue={'Fixed Amount'}>
                    <Select defaultValue={'Fixed Amount'} size="large">
                        <Select.Option value="Fixed Amount">{t('fixed amount')}</Select.Option>
                        <Select.Option value="Percent">{t('percent')}</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </>
    )
}
