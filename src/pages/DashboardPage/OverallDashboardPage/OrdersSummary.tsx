import { useTranslation } from 'react-i18next'
import StatisticCard, { StatisticCardProps } from '../../../components/shared/StatisticCard'

export default function OrdersSummary({ value, previousValue, loading }: Partial<StatisticCardProps>) {
    const { t } = useTranslation()
    return (
        <StatisticCard
            loading={loading}
            value={value as number}
            previousValue={previousValue as number}
            label={t('total orders').toString()}
            to="/dashboard/orders"
        />
    )
}
