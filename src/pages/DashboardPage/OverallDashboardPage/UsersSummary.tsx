import { useTranslation } from 'react-i18next'
import StatisticCard, { StatisticCardProps } from '../../../components/shared/StatisticCard'

export default function UsersSummary({ loading, value, previousValue }: Partial<StatisticCardProps>) {
    const { t } = useTranslation()

    return (
        <StatisticCard
            loading={loading}
            value={value as number}
            previousValue={previousValue as number}
            label={t('total users').toString()}
            to="/dashboard/customers"
        />
    )
}
