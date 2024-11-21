import { Spin } from 'antd'

export default function Loading() {
    return (
        <div
            style={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'fixed',
                top: '0',
                left: '0',
                background: 'rgba(0,0,0,0.1)'
            }}
        >
            <Spin size="large" />
        </div>
    )
}
