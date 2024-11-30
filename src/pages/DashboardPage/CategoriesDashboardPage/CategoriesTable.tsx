import { FC } from 'react'
import { useSelector } from 'react-redux'
import { Button, Modal, Space, Table } from 'antd'
import { ICategory } from '../../../types'
import { useTranslation } from 'react-i18next'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { buttonStyle } from '../../../assets/styles/globalStyle'
import { RootState } from '../../../store'
import dayjs from '../../../libs/dayjs'

interface CategoriesTableProps {
    isLoading: boolean
    total: number
    categories: ICategory[]
    current: number
    itemPerPage: number
    setItemPerPage: (newItemPerPage: number) => void
    setCurrent: (value: number) => void
    onDelete: (categoryId: number) => void
    onSelectCategory: (category: ICategory) => void
}

const CategoriesTable: FC<CategoriesTableProps> = ({
    current,
    setCurrent,
    isLoading,
    categories,
    onDelete,
    onSelectCategory,
    total,
    itemPerPage,
    setItemPerPage
}) => {
    const { t } = useTranslation()
    const user = useSelector((state: RootState) => state.auth.user)

    const onDeleteBtnClick = (categoryId: number, isActive: number | boolean) => {
        if (user.role !== 'Admin') return

        const title = isActive
            ? `${t('are you sure that you want to show this category')}?`
            : `${t('are you sure that you want to hide this category')}? ${t(
                  "all milkteas and customers' cart items related to this category would be hidden as well"
              )}!`

        Modal.confirm({
            icon: <ExclamationCircleFilled />,
            title: title,
            okText: isActive ? t('show in menu') : t('hide from menu'),
            cancelText: t('cancel'),
            onOk: () => {
                onDelete(categoryId)
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

    const onUpdateBtnClick = (category: ICategory) => onSelectCategory(category)

    const onChange = (values: any) => {
        const { current } = values
        setCurrent(current)
    }

    return (
        <>
            <Table
                style={{ width: '100%' }}
                rowKey={(record: ICategory) => record.categoryId as number}
                onChange={onChange}
                loading={isLoading}
                columns={[
                    {
                        title: t('id') + ' ' + t('category').toLocaleLowerCase(),
                        width: 200,
                        dataIndex: 'categoryId',
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
                        title: t('name') + ' ' + t('category').toLocaleLowerCase(),
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
                        title: t('action'),
                        width: 350,
                        key: 'action',
                        align: 'center',
                        render: (_, record: ICategory) => {
                            return (
                                <>
                                    <Space size="middle">
                                        <Button
                                            onClick={() => {
                                                if (record.isActive) return
                                                onUpdateBtnClick(record)
                                            }}
                                            shape="round"
                                            type="primary"
                                            disabled={user.role !== 'Admin' || record.isActive}
                                        >
                                            {t('edit')}
                                        </Button>
                                        <Button
                                            onClick={() => onDeleteBtnClick(record?.categoryId as number, record.isActive)}
                                            type="text"
                                            shape="round"
                                            danger
                                            disabled={user.role !== 'Admin'}
                                            style={{ border: '1px solid' }}
                                        >
                                            {record.isActive ? t('show in menu') : t('hide from menu')}
                                        </Button>
                                    </Space>
                                </>
                            )
                        }
                    }
                ]}
                dataSource={categories}
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

export default CategoriesTable
