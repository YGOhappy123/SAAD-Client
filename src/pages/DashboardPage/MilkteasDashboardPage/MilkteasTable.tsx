import { useSelector } from 'react-redux'
import { getI18n, useTranslation } from 'react-i18next'
import { Button, Modal, Table, Tag, Image } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { IMilktea } from '../../../types'
import { RootState } from '../../../store'
import { buttonStyle } from '../../../assets/styles/globalStyle'
import dayjs from '../../../libs/dayjs'

interface ProductsTableProps {
    isLoading: boolean
    total: number
    products: IMilktea[]
    current: number
    itemPerPage: number
    setItemPerPage: (newItemPerPage: number) => void
    setCurrent: (value: number) => void
    onDelete: (productId: number) => void
    onSelectProduct: (product: IMilktea) => void
}

const ProductsTable: React.FC<ProductsTableProps> = ({
    current,
    setCurrent,
    isLoading,
    products,
    onDelete,
    onSelectProduct,
    total,
    itemPerPage,
    setItemPerPage
}) => {
    const { t } = useTranslation()
    const locale = getI18n().resolvedLanguage as 'vi' | 'en'
    const user = useSelector((state: RootState) => state.auth.user)

    const onDeleteBtnClick = (productId: number, isActive: boolean) => {
        if (user.role !== 'Admin') return
        const title = isActive
            ? `${t('are you sure that you want to show this product')}?`
            : `${t('are you sure that you want to hide this product')}? ${t("all customers' cart items related to this product would be deleted")}!`

        Modal.confirm({
            icon: <ExclamationCircleFilled />,
            title: title,
            okText: isActive ? t('show in menu') : t('hide from menu'),
            cancelText: t('cancel'),
            onOk: () => {
                onDelete(productId)
            },
            okButtonProps: {
                danger: true,
                shape: 'round',
                style: { ...buttonStyle, width: '130px', marginLeft: '12px' }
            },
            cancelButtonProps: {
                type: 'text',
                shape: 'round',
                style: { ...buttonStyle, width: '100px', border: '1px solid' }
            }
        })
    }

    const onUpdateBtnClick = (product: IMilktea) => onSelectProduct(product)
    const onChange = (values: any) => {
        const { current } = values
        setCurrent(current)
    }

    return (
        <>
            <Table
                className="product-table"
                style={{ width: '100%' }}
                rowKey={(record: IMilktea) => record.milkteaId as number}
                onChange={onChange}
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
                        title: t('created at'),
                        dataIndex: 'createdAt',
                        key: 'createdAt',
                        render: text => (
                            <span>
                                {dayjs(text).format('DD/MM/YYYY HH:mm:ss') || (
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
                                <div>
                                    VI:{' '}
                                    {record.nameVi || (
                                        <small>
                                            <em>{t('not updated yet')}</em>
                                        </small>
                                    )}
                                </div>
                                <div>
                                    EN:{' '}
                                    {record.nameEn || (
                                        <small>
                                            <em>{t('not updated yet')}</em>
                                        </small>
                                    )}
                                </div>
                            </div>
                        )
                    },
                    {
                        title: t('description') + ' ' + t('milktea').toLocaleLowerCase(),
                        key: 'description',
                        width: 360,
                        render: (_, record) => (
                            <div>
                                <div>
                                    VI:{' '}
                                    {record.descriptionVi || (
                                        <small>
                                            <em>{t('not updated yet')}</em>
                                        </small>
                                    )}
                                </div>
                                <div>
                                    EN:{' '}
                                    {record.descriptionEn || (
                                        <small>
                                            <em>{t('not updated yet')}</em>
                                        </small>
                                    )}
                                </div>
                            </div>
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
                        title: t('category'),
                        dataIndex: 'category',
                        key: 'category',
                        align: 'center',
                        render: category => {
                            const categoryName = locale === 'vi' ? category.nameVi : category.nameEn
                            return (
                                <div>
                                    {categoryName || (
                                        <small>
                                            <em>{t('not updated yet')}</em>
                                        </small>
                                    )}
                                </div>
                            )
                        }
                    },
                    {
                        title: t('price'),
                        dataIndex: 'price',
                        key: 'price',
                        align: 'center',
                        render: price => {
                            const priceEntries = Object.entries(price)
                            return (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                                    {priceEntries.length > 0 ? (
                                        <>
                                            {priceEntries.map((entry, index) => (
                                                <Tag color="green" key={index} style={{ marginRight: 0 }}>
                                                    {entry[0]} -{' '}
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                                        entry[1] as number
                                                    )}
                                                </Tag>
                                            ))}
                                        </>
                                    ) : (
                                        <Tag color="green" style={{ marginRight: 0 }}>
                                            <small>
                                                <em>{t('not updated yet')}</em>
                                            </small>
                                        </Tag>
                                    )}
                                </div>
                            )
                        }
                    },
                    {
                        title: t('action'),
                        key: 'action',
                        align: 'center',
                        render: (_, record: IMilktea) => {
                            return (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                                    <Button
                                        onClick={() => {
                                            if (record.isActive) return
                                            onUpdateBtnClick(record)
                                        }}
                                        shape="round"
                                        type="primary"
                                        disabled={record.isActive}
                                    >
                                        {t('update')}
                                    </Button>
                                    <Button
                                        onClick={() => onDeleteBtnClick(record.milkteaId as number, record.isActive)}
                                        type="text"
                                        shape="round"
                                        danger
                                        style={{ border: '1px solid' }}
                                        disabled={user.role !== 'Admin'}
                                    >
                                        {record.isActive ? t('show in menu') : t('hide from menu')}
                                    </Button>
                                </div>
                            )
                        }
                    }
                ]}
                dataSource={products}
                pagination={{
                    pageSize: itemPerPage,
                    total,
                    current,
                    onShowSizeChange: (_, size) => {
                        setItemPerPage(size)
                    }
                }}
            />
        </>
    )
}

export default ProductsTable
