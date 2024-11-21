import { useEffect, useState } from 'react'
import { getI18n, useTranslation } from 'react-i18next'
import { Row, Col, Input, DatePicker, Button, Select, Popover, Space, Badge } from 'antd'
import { FilterOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons'
import { buttonStyle } from '../../../assets/styles/globalStyle'
import type { Dayjs } from 'dayjs'
import type { RangePickerProps } from 'antd/es/date-picker/generatePicker'
import localeUS from 'antd/es/date-picker/locale/en_US'
import localeVN from 'antd/es/date-picker/locale/vi_VN'

interface SortAndFilterProps {
    onChange: (params: SortAndFilterChangeParams) => void
    onSearch: () => void
    onReset: () => void
}

interface SortAndFilterChangeParams {
    isAvailable: boolean
    searchPriceQuery: string
    searchNameVi: string
    searchNameEn: string
    sort: string
    range: string[] | any[] | undefined
}

export default function SortAndFilter({ onChange, onSearch, onReset }: SortAndFilterProps) {
    const { t } = useTranslation()
    const [searchNameVi, setSearchNameVi] = useState<string>('')
    const [searchPriceQuery, setSearchPriceQuery] = useState<string>('')
    const [priceSort, setPriceSort] = useState<string>('$lte')
    const [searchPrice, setSearchPrice] = useState<string>('')
    const [searchNameEn, setSearchNameEn] = useState<string>('')
    const [isAvailable, setIsAvailable] = useState<boolean>(true)
    const [filterCount, setFilterCount] = useState<number>(0)
    const [sort, setSort] = useState<string>('-createdAt')
    const [rangePickerDate, setRangePickerDate] = useState<any[]>([])
    const [range, setRange] = useState<string[] | any[]>()
    const i18n = getI18n()

    const onCalendarChange: RangePickerProps<Dayjs>['onCalendarChange'] = values => {
        setRangePickerDate(values as any)
        setRange(values?.map(value => value?.toISOString()))
    }

    const onInternalReset = () => {
        setSearchPriceQuery('')
        setSearchNameVi('')
        setSearchNameEn('')
        setSort('-createdAt')
        setRangePickerDate([])
        setFilterCount(0)
        onReset()
    }

    const onInternalSearch = () => {
        onSearch()
        if (isAvailable && !searchPriceQuery && !searchNameVi && !searchNameEn && sort === '-createdAt' && !range?.length) return setFilterCount(0)
        setFilterCount(1)
    }

    useEffect(() => {
        onChange({ isAvailable, searchPriceQuery, searchNameVi, searchNameEn, sort, range })
    }, [isAvailable, searchPriceQuery, searchNameVi, searchNameEn, sort, range])

    useEffect(() => {
        if (searchPrice) {
            const query = { [priceSort]: searchPrice }
            setSearchPriceQuery(JSON.stringify(query))
        } else setSearchPriceQuery('')
    }, [searchPrice, priceSort])

    const content = () => {
        return (
            <Row style={{ minWidth: '250px' }}>
                <Col span={24}>
                    <Space direction="vertical">
                        <div>
                            <div>{t('search by price')}</div>
                            <Row gutter={8}>
                                <Col span={16}>
                                    <Input
                                        value={searchPrice}
                                        size="large"
                                        type="number"
                                        allowClear
                                        placeholder={t('price').toString()}
                                        onChange={e => setSearchPrice(e.target.value)}
                                        min={0}
                                    />
                                </Col>
                                <Col span={8}>
                                    <Select
                                        value={priceSort}
                                        size="large"
                                        defaultValue="$lte"
                                        style={{ width: '100%' }}
                                        onChange={value => setPriceSort(value)}
                                    >
                                        <Select.Option value="$gte">{t('greater than or equal')}</Select.Option>
                                        <Select.Option value="$lte">{t('less than or equal')}</Select.Option>
                                    </Select>
                                </Col>
                            </Row>
                        </div>
                        <div>
                            <div>{t('search by name vi')}</div>
                            <Input
                                value={searchNameVi}
                                size="large"
                                allowClear
                                placeholder={t('name').toString()}
                                onChange={e => setSearchNameVi(e.target.value)}
                            />
                        </div>
                        <div>
                            <div>{t('search by name en')}</div>
                            <Input
                                value={searchNameEn}
                                size="large"
                                allowClear
                                placeholder={t('name').toString()}
                                onChange={e => setSearchNameEn(e.target.value)}
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
                            <div>{t("filter by product's availability")}</div>
                            <Select size="large" value={isAvailable} onChange={value => setIsAvailable(value)} style={{ width: '100%' }}>
                                <Select.Option value={true}>{t('yes')}</Select.Option>
                                <Select.Option value={false}>{t('no')}</Select.Option>
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
