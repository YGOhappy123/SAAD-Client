import { useTranslation } from 'react-i18next'
import StatisticCard, { StatisticCardProps } from '../../../components/shared/StatisticCard'

export default function RevenuesSummary({ loading, value, previousValue }: Partial<StatisticCardProps>) {
    const { t } = useTranslation()
    return (
        <StatisticCard
            loading={loading}
            unit="Vnđ"
            value={value as number}
            previousValue={previousValue as number}
            label={t('revenues').toString()}
            to="/dashboard/statistics"
        />
    )
}
