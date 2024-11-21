import { Space, Button } from 'antd'
import { useEffect, useState } from 'react'
import useDebounce from '../../hooks/useDebounce'

interface QuantityInputProps {
    loading: boolean
    initValue: number
    onChange: (newValue: number) => void
}
export default function QuantityInput({ loading, initValue, onChange }: QuantityInputProps) {
    const [initQuantity, setQuantity] = useState<number>(initValue)
    const debouncedQuantity = useDebounce(initQuantity)

    useEffect(() => {
        setQuantity(initValue)
    }, [initValue])

    useEffect(() => {
        onChange(debouncedQuantity as number)
    }, [debouncedQuantity])

    const onDecrease = () => {
        if (initValue === 0) return
        setQuantity(prev => (prev - 1 < 0 ? 0 : prev - 1))
    }

    const onIncrease = () => {
        if (initValue === 0) return
        setQuantity(prev => prev + 1)
    }

    return (
        <Space.Compact className="item-quantity">
            <Button disabled={loading || initValue === 0} type="text" onClick={onDecrease}>
                -
            </Button>
            <span>{initQuantity}</span>
            <Button disabled={loading || initValue === 0} type="text" onClick={onIncrease}>
                +
            </Button>
        </Space.Compact>
    )
}
