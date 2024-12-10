import { getI18n, useTranslation } from 'react-i18next'
import { Card, Image, Table, Tag } from 'antd'
import { MilkteaSale } from '../../../types'

interface PopularProductsProps {
    data?: MilkteaSale[]
    title?: string
    isLoading?: boolean
}

export default function PopularProducts({ data, title, isLoading }: PopularProductsProps) {
    const { t } = useTranslation()
    const locale = getI18n().resolvedLanguage as 'vi' | 'en'

    return (
        <Card
            title={title}
            style={{
                borderRadius: '12px',
                boxShadow: '0px 0px 16px rgba(17,17,26,0.1)',
                minHeight: '485px'
            }}
        >
            <Table
                size="small"
                style={{ width: '100%' }}
                rowKey={(record: MilkteaSale) => record.id as number}
                loading={isLoading}
                columns={[
                    {
                        title: t('id') + ' ' + t('milktea').toLocaleLowerCase(),
                        dataIndex: 'milkteaId',
                        key: 'id',
                        render: text => (
                            <span>
                                {text || (
                                    <small>
                                        <em>{t('not updated yet')}</em>
                                    </small>
                                )}
                            </span>
                        )
                    },
                    {
                        title: t('featured images'),
                        dataIndex: 'image',
                        key: 'image',
                        align: 'center',
                        render: image => (
                            <>
                                {image ? (
                                    <Image width={70} src={image} />
                                ) : (
                                    <small>
                                        <em>{t('not updated yet')}</em>
                                    </small>
                                )}
                            </>
                        )
                    },
                    {
                        title: t('name') + ' ' + t('milktea').toLocaleLowerCase(),
                        key: 'name',
                        render: (_, record) => (
                            <div>
                                {locale === 'vi'
                                    ? record.nameVi
                                    : record.nameEn || (
                                          <small>
                                              <em>{t('not updated yet')}</em>
                                          </small>
                                      )}
                            </div>
                        )
                    },
                    {
                        title: t('description') + ' ' + t('milktea').toLocaleLowerCase(),
                        key: 'description',
                        width: 400,
                        render: (_, record) => (
                            <div>
                                {locale === 'vi'
                                    ? record.descriptionVi
                                    : record.descriptionEn || (
                                          <small>
                                              <em>{t('not updated yet')}</em>
                                          </small>
                                      )}
                            </div>
                        )
                    },
                    {
                        title: t('total units'),
                        dataIndex: 'quantity',
                        key: 'quantity',
                        align: 'center',
                        render: quantity => (
                            <span>
                                {quantity ? (
                                    <strong>{`${quantity}`.padStart(2, '0')}</strong>
                                ) : (
                                    <small>
                                        <em>{t('not updated yet')}</em>
                                    </small>
                                )}
                            </span>
                        )
                    },
                    {
                        title: t('total sales'),
                        dataIndex: 'amount',
                        key: 'amount',
                        align: 'center',
                        render: amount => (
                            <Tag color="green" style={{ marginRight: 0 }}>
                                {amount ? (
                                    <strong>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount as number)}</strong>
                                ) : (
                                    <small>
                                        <em>{t('not updated yet')}</em>
                                    </small>
                                )}
                            </Tag>
                        )
                    },
                    {
                        title: t('is available') + '?',
                        dataIndex: 'isAvailable',
                        align: 'center',
                        key: 'isAvailable',
                        render: isAvailable => <div>{isAvailable ? t('yes') : t('no')}</div>
                    },
                    {
                        title: t('is hidden from menu') + '?',
                        dataIndex: 'isActive',
                        align: 'center',
                        key: 'isActive',
                        render: isActive => <div>{isActive ? t('yes') : t('no')}</div>
                    }
                ]}
                dataSource={data}
                pagination={false}
            />
        </Card>
    )
}
