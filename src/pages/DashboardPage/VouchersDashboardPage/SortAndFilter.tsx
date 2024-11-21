import { Row, Col, Input, DatePicker, Button, Select, Popover, Space, Badge } from 'antd'
import { useEffect, useState } from 'react'
import { getI18n, useTranslation } from 'react-i18next'
import { FilterOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons'
import type { Dayjs } from 'dayjs'
import type { RangePickerProps } from 'antd/es/date-picker/generatePicker'
import localeUS from 'antd/es/date-picker/locale/en_US'
import localeVN from 'antd/es/date-picker/locale/vi_VN'
import { buttonStyle } from '../../../assets/styles/globalStyle'
interface SortAndFilterProps {
    onChange: (params: SortAndFilterChangeParams) => void
    onSearch: () => void
    onReset: () => void
}

interface SortAndFilterChangeParams {
    searchString: string
    sort: string
    discountType: string
    range: string[] | any[] | undefined
}

export default function SortAndFilter({ onChange, onSearch, onReset }: SortAndFilterProps) {
    const { t } = useTranslation()
    const [searchString, setSearchString] = useState<string>('')
    const [filterCount, setFilterCount] = useState<number>(0)
    const [sort, setSort] = useState<string>('-createdAt')
    const [discountType, setDiscountType] = useState<string>('All')
    const [rangePickerDate, setRangePickerDate] = useState<any[]>([])
    const [range, setRange] = useState<string[] | any[]>()
    const i18n = getI18n()

    const onCalendarChange: RangePickerProps<Dayjs>['onCalendarChange'] = values => {
        setRangePickerDate(values as any)
        setRange(values?.map(value => value?.toISOString()))
    }

    const onInternalReset = () => {
        setSearchString('')
        setSort('-createdAt')
        setDiscountType('All')
        setRangePickerDate([])
        setFilterCount(0)
        onReset()
    }

    const onInternalSearch = () => {
        onSearch()
        if (!searchString && sort === '-createdAt' && discountType === 'All' && !range?.length) return setFilterCount(0)
        setFilterCount(1)
    }

    useEffect(() => {
        onChange({ searchString, sort, discountType, range })
    }, [searchString, sort, discountType, range])

    const content = () => {
        return (
            <Row style={{ minWidth: '250px' }}>
                <Col span={24}>
                    <Space direction="vertical">
                        <div>
                            <div>{t('search by code')}</div>
                            <Input
                                value={searchString}
                                size="large"
                                allowClear
                                placeholder={t('code').toString()}
                                onChange={e => setSearchString(e.target.value)}
                            />
                        </div>
                        <div>
                            <div>{t('search by creation date')}</div>
                            <DatePicker.RangePicker
                                locale={i18n.resolvedLanguage === 'vi' ? localeVN : localeUS}
                                value={rangePickerDate as any}
                                size="large"
                                style={{ width: '250px' }}
                                onCalendarChange={onCalendarChange}
                            />
                        </div>
                        <div>
                            <div>{t('search by discount type')}</div>
                            <Select
                                value={discountType}
                                size="large"
                                defaultValue="All"
                                style={{ width: '100%' }}
                                onChange={value => setDiscountType(value)}
                            >
                                <Select.Option value="All">{t('all')}</Select.Option>
                                <Select.Option value="Fixed Amount">{t('fixed amount')}</Select.Option>
                                <Select.Option value="Percent">{t('percent')}</Select.Option>
                            </Select>
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
