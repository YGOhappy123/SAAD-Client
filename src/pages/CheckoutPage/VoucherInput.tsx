import { Dispatch, SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Form, Input, Col, Row } from 'antd'
import { IVoucher } from '../../types'
import { inputStyle } from '../../assets/styles/globalStyle'
import useVouchers from '../../services/vouchers'

interface IProps {
    voucher: IVoucher | null
    setVoucher: Dispatch<SetStateAction<IVoucher | null>>
}

const VoucherInput = ({ voucher, setVoucher }: IProps) => {
    const { t } = useTranslation()

    const [form] = Form.useForm()
    const [voucherInput, setVoucherInput] = useState<string>('')
    const { verifyVoucherMutation } = useVouchers({ enabledFetchVouchers: false })

    const onApplyVoucher = async ({ voucher }: { voucher: string }) => {
        if (!voucher) return
        try {
            const { data } = await verifyVoucherMutation.mutateAsync(voucher.toUpperCase())
            setVoucher(data.data)
        } catch (error) {
            setVoucherInput('')
            form.setFieldsValue({ voucher: '' })
        }
    }

    return (
        <Form form={form} onFinish={onApplyVoucher} requiredMark={false} name="basic" autoComplete="off">
            <Row gutter={12} align="middle">
                <Col span={18}>
                    <Form.Item name="voucher">
                        <Input
                            readOnly={voucher?.voucherId as any}
                            placeholder={t('gift or discount code...').toString()}
                            style={inputStyle}
                            value={voucherInput}
                            onChange={e => setVoucherInput(e.target.value)}
                            spellCheck="false"
                        />
                    </Form.Item>
                </Col>

                <Col span={6}>
                    <Form.Item>
                        {!voucher?.voucherId && (
                            <Button
                                loading={verifyVoucherMutation.isLoading}
                                block
                                type="primary"
                                className="submit-coupon-btn"
                                htmlType="submit"
                                disabled={!voucherInput}
                            >
                                {t('apply')}
                            </Button>
                        )}
                        {voucher?.voucherId && (
                            <Button
                                onClick={e => {
                                    e.preventDefault()
                                    setVoucher(null)
                                }}
                                loading={verifyVoucherMutation.isLoading}
                                block
                                type="primary"
                                danger
                                className="submit-coupon-btn cancel-coupon"
                            >
                                {t('cancel')}
                            </Button>
                        )}
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
}

export default VoucherInput
