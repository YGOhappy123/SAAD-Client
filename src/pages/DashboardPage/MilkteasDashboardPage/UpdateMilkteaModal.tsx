import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { getI18n, useTranslation } from 'react-i18next'
import { UploadRequestOption } from 'rc-upload/lib/interface'
import { Modal, Row, Col, Button, Form, Input, FormInstance, Select, Empty, SelectProps, Spin, Image, Upload, Space } from 'antd'
import { DeleteFilled, MoneyCollectOutlined } from '@ant-design/icons'
import { ICategory, IMilktea } from '../../../types'
import { RootState } from '../../../store'
import { buttonStyle, inputStyle, secondaryButtonStyle } from '../../../assets/styles/globalStyle'
import useFiles from '../../../services/files'

interface UpdateProductModalProps {
    shouldOpen: boolean
    onCancel: () => void
    onSubmit: (values: Partial<IMilktea>) => Promise<void>
    isLoading?: boolean
    product: IMilktea | null
    onSearchCategory: (value: string) => void
    onCategoryChange: (value: string) => void
    categories: ICategory[] | undefined
    isLoadingCategory: boolean
    closeModal: () => void
}

export default function UpdateProductModal({
    onCategoryChange,
    onSearchCategory,
    product,
    shouldOpen,
    onCancel,
    onSubmit,
    isLoading,
    categories,
    isLoadingCategory,
    closeModal
}: UpdateProductModalProps) {
    const { t } = useTranslation()
    const [form] = Form.useForm()

    const [imagesToBeDeleted, setImagesToBeDeleted] = useState<string[]>([])
    const onInternalCancel = () => {
        form.resetFields()
        onCancel()
    }

    useEffect(() => {
        if (product && shouldOpen) {
            form.setFieldsValue({
                nameVi: product.nameVi,
                nameEn: product.nameEn,
                descriptionVi: product.descriptionVi,
                descriptionEn: product.descriptionEn,
                category: { value: product.category?.id },
                isAvailable: product.isAvailable ? true : false,
                priceS: product.price?.s,
                priceM: product.price?.m,
                priceL: product.price?.l
            })
        }
    }, [shouldOpen])

    return (
        <Modal
            open={shouldOpen}
            destroyOnClose
            closable={false}
            title={<h3>{t('update product')}</h3>}
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
                    <UpdateProductForm
                        product={product}
                        form={form}
                        onSubmit={onSubmit}
                        categories={categories}
                        isLoadingCategory={isLoadingCategory}
                        onCategoryChange={onCategoryChange}
                        onSearchCategory={onSearchCategory}
                        imagesToBeDeleted={imagesToBeDeleted}
                        setImagesToBeDeleted={setImagesToBeDeleted}
                        closeModal={closeModal}
                    />
                </Col>
            </Row>
        </Modal>
    )
}

export const UpdateProductForm = ({
    form,
    onSubmit,
    product,
    categories,
    isLoadingCategory,
    onSearchCategory,
    onCategoryChange,
    imagesToBeDeleted,
    setImagesToBeDeleted,
    closeModal
}: {
    form: FormInstance
    onSubmit: (values: Partial<IMilktea>) => Promise<void>
    product: IMilktea | null
    categories: ICategory[] | undefined
    isLoadingCategory: boolean
    onSearchCategory: (value: string) => void
    onCategoryChange: (value: string) => void
    imagesToBeDeleted: string[]
    setImagesToBeDeleted: Dispatch<SetStateAction<string[]>>
    closeModal: () => void
}) => {
    const { t } = useTranslation()
    const locale = getI18n().resolvedLanguage as 'vi' | 'en'
    const { uploadMutation, deleteMutation } = useFiles()
    const [featuredImage, setFeaturedImage] = useState<string>(product?.image ?? '')
    const user = useSelector((state: RootState) => state.auth.user)

    const onFinish = async (values: any) => {
        await onSubmit({
            nameVi: values.nameVi,
            nameEn: values.nameEn,
            descriptionVi: values.descriptionVi,
            descriptionEn: values.descriptionEn,
            isAvailable: values.isAvailable,
            categoryId: values.category.value,
            image: featuredImage,
            priceS: values.priceS,
            priceM: values.priceM,
            priceL: values.priceL
        })

        await Promise.all(
            imagesToBeDeleted.map(async (image: string) => {
                await deleteMutation.mutateAsync(image)
            })
        )

        closeModal()
    }

    const onDeleteFeaturedImage = (image: string) => {
        setImagesToBeDeleted(prev => [...prev, featuredImage])
        setFeaturedImage('')
    }

    const handleUpload = ({ file }: UploadRequestOption<any>) => {
        if (user.role !== 'Admin') return
        if (featuredImage) return
        uploadMutation.mutateAsync({ file, folder: 'product' }).then(res => {
            setFeaturedImage(res.data.data?.imageUrl)
        })
    }

    const categoryOptions: SelectProps['options'] = useMemo(() => {
        if (isLoadingCategory) return [{ key: 'loading', label: <Spin />, disabled: true }]
        else if (!categories?.length) return [{ key: 'empty', label: <Empty />, disabled: true }]
        return categories.map(category => ({
            key: category.id,
            label: locale === 'vi' ? category.nameVi : category.nameEn,
            value: category.id
        }))
    }, [categories, isLoadingCategory])

    const validatePrices = (_: any, values: any) => {
        const priceS = form.getFieldValue('priceS')
        const priceM = form.getFieldValue('priceM')
        const priceL = form.getFieldValue('priceL')

        if (!priceS && !priceM && !priceL) {
            return Promise.reject(new Error(t('at least one price should be filled') as string))
        } else {
            return Promise.resolve()
        }
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
                        {user.role === 'Admin' && (
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
                        )}
                    </Col>
                </Row>

                {featuredImage ? (
                    <div style={{ position: 'relative' }}>
                        <Image preview={false} src={featuredImage} />
                        {user.role === 'Admin' && (
                            <Button
                                loading={deleteMutation.isLoading}
                                style={{ position: 'absolute', top: '10px', right: '10px', zIndex: '10' }}
                                danger
                                shape="circle"
                                type="primary"
                                icon={<DeleteFilled />}
                                onClick={() => onDeleteFeaturedImage(featuredImage)}
                            ></Button>
                        )}
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
                    <label className="product-form-label">{t('price')}</label>
                    <Space size={16}>
                        <Form.Item name="priceS" rules={[{ validator: validatePrices }]}>
                            <Input
                                prefix={<MoneyCollectOutlined />}
                                size="large"
                                type="number"
                                spellCheck={false}
                                placeholder={`${t('price')} size S`}
                                style={inputStyle}
                                min={0}
                            />
                        </Form.Item>
                        <Form.Item name="priceM" rules={[{ validator: validatePrices }]}>
                            <Input
                                prefix={<MoneyCollectOutlined />}
                                size="large"
                                type="number"
                                spellCheck={false}
                                placeholder={`${t('price')} size M`}
                                style={inputStyle}
                                min={0}
                            />
                        </Form.Item>
                        <Form.Item name="priceL" rules={[{ validator: validatePrices }]}>
                            <Input
                                prefix={<MoneyCollectOutlined />}
                                size="large"
                                type="number"
                                spellCheck={false}
                                placeholder={`${t('price')} size L`}
                                style={inputStyle}
                                min={0}
                            />
                        </Form.Item>
                    </Space>
                    <Form.Item name="category" label={t('category')} rules={[{ required: true, message: t('required').toString() }]}>
                        <Select
                            placeholder={t('select category')}
                            labelInValue
                            filterOption={false}
                            showSearch
                            onSearch={onSearchCategory}
                            size="large"
                            onChange={onCategoryChange}
                            options={categoryOptions}
                        ></Select>
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
