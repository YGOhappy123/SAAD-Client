import { Row, Col, Input, DatePicker, Button, Select, Popover, Space, Badge } from 'antd'
import { useEffect, useState } from 'react'
import { getI18n, useTranslation } from 'react-i18next'
import { FilterOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons'
import type { Dayjs } from 'dayjs'
import type { RangePickerProps } from 'antd/es/date-picker/generatePicker'
import localeUS from 'antd/es/date-picker/locale/en_US'
import localeVN from 'antd/es/date-picker/locale/vi_VN'
import { buttonStyle } from '../../../assets/styles/globalStyle'
import { IOrder, OrderStatus } from '../../../types'
interface SortAndFilterProps {
    onChange: (params: SortAndFilterChangeParams) => void
    onSearch: () => void
    onReset: () => void
}

interface SortAndFilterChangeParams {
    customerName: string
    searchTotalQuery: string
    status: OrderStatus | 'All'
    sort: string
    range: string[] | any[] | undefined
}

export default function SortAndFilter({ onChange, onSearch, onReset }: SortAndFilterProps) {
    const { t } = useTranslation()
    const [customerName, setCustomerName] = useState<string>('')
    const [filterCount, setFilterCount] = useState<number>(0)
    const [sort, setSort] = useState<string>('-createdAt')
    const [status, setStatus] = useState<OrderStatus | 'All'>('All')
    const [searchTotal, setSearchTotal] = useState<string>('')
    const [totalSort, setTotalSort] = useState<string>('$lte')
    const [searchTotalQuery, setSearchTotalQuery] = useState<string>('')
    const [rangePickerDate, setRangePickerDate] = useState<any[]>([])
    const [range, setRange] = useState<string[] | any[]>()
    const i18n = getI18n()

    const onCalendarChange: RangePickerProps<Dayjs>['onCalendarChange'] = values => {
        setRangePickerDate(values as any)
        setRange(values?.map(value => value?.toISOString()))
    }

    const onInternalReset = () => {
        setCustomerName('')
        setSort('-createdAt')
        setStatus('All')
        setRangePickerDate([])
        setSearchTotalQuery('')
        setFilterCount(0)
        onReset()
    }

    const onInternalSearch = () => {
        onSearch()
        if (!customerName && !searchTotalQuery && sort === '-createdAt' && status === 'All' && !range?.length) return setFilterCount(0)
        setFilterCount(1)
    }

    useEffect(() => {
        onChange({ customerName, sort, searchTotalQuery, status, range })
    }, [customerName, sort, status, searchTotalQuery, range])

    useEffect(() => {
        if (searchTotal) {
            const query = { [totalSort]: searchTotal }
            setSearchTotalQuery(JSON.stringify(query))
        } else setSearchTotalQuery('')
    }, [searchTotal, totalSort])

    const content = () => {
        return (
            <Row style={{ minWidth: '250px' }}>
                <Col span={24}>
                    <Space direction="vertical">
                        <div>
                            <div>{t('search by customer first or last name')}</div>
                            <Input
                                value={customerName}
                                size="large"
                                allowClear
                                placeholder={t('search').toString()}
                                onChange={e => setCustomerName(e.target.value)}
                            />
                        </div>
                        <div>
                            <div>{t('search by creation date')}</div>
                            <DatePicker.RangePicker
                                locale={i18n.resolvedLanguage === 'vi' ? localeVN : localeUS}
                                value={rangePickerDate as any}
                                size="large"
                                style={{ width: '100%' }}
                                onCalendarChange={onCalendarChange}
                            />
                        </div>
                        <div>
                            <div>{t('search by order status')}</div>
                            <Select
                                value={status}
                                size="large"
                                defaultValue="All"
                                style={{ width: '100%' }}
                                onChange={value => setStatus(value as OrderStatus | 'All')}
                            >
                                <Select.Option value="All">{t('all')}</Select.Option>
                                <Select.Option value="Pending">{t('pending')}</Select.Option>
                                <Select.Option value="Accepted">{t('accepted')}</Select.Option>
                                <Select.Option value="Done">{t('done')}</Select.Option>
                                <Select.Option value="Rejected">{t('rejected')}</Select.Option>
                            </Select>
                        </div>
                        <div>
                            <div>{t('search by total price')}</div>
                            <Row gutter={8} style={{ width: 326 }}>
                                <Col span={8}>
                                    <Select
                                        value={totalSort}
                                        size="large"
                                        defaultValue="$lte"
                                        style={{ width: '100%' }}
                                        onChange={value => setTotalSort(value)}
                                    >
                                        <Select.Option value="$gte">{t('greater than or equal')}</Select.Option>
                                        <Select.Option value="$lte">{t('less than or equal')}</Select.Option>
                                    </Select>
                                </Col>
                                <Col span={16}>
                                    <Input
                                        value={searchTotal}
                                        size="large"
                                        type="number"
                                        allowClear
                                        placeholder={t('total price').toString()}
                                        onChange={e => setSearchTotal(e.target.value)}
                                        min={0}
                                    />
                                </Col>
                            </Row>
                        </div>
                        <div>
                            <div>{t('sort by order')}</div>
                            <Select value={sort} size="large" defaultValue="createdAt" style={{ width: '100%' }} onChange={value => setSort(value)}>
                                <Select.Option value="-createdAt">
                                    <SortDescendingOutlined />
                                    {t('created at')}
                                </Select.Option>
                                <Select.Option value="+createdAt">
                                    <SortAscendingOutlined />
                                    {t('created at')}
                                </Select.Option>
                            </Select>
                        </div>
                    </Space>
                </Col>
            </Row>
        )
    }

    return (
        <Popover
            placement="bottom"
            content={content}
            title={
                <>
                    <Row align="middle" justify="space-between">
                        <Col>
                            <Button block shape="round" onClick={onInternalReset}>
                                {t('reset')}
                            </Button>
                        </Col>
                        <Col>
                            <strong>{t('filter')}</strong>
                        </Col>
                        <Col>
                            <Button block shape="round" type="primary" onClick={onInternalSearch}>
                                {t('finish')}
                            </Button>
                        </Col>
                    </Row>
                </>
            }
            trigger="click"
        >
            <Button block style={buttonStyle} shape="round" icon={<FilterOutlined />}>
                <Badge dot count={filterCount}>
                    <strong>{t('filter')}</strong>
                </Badge>
            </Button>
        </Popover>
    )
}
