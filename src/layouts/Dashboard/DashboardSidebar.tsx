import { FC, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Layout, Menu } from 'antd'
import {
    HomeOutlined,
    UserOutlined,
    LineChartOutlined,
    TagsOutlined,
    ClusterOutlined,
    AuditOutlined,
    DeploymentUnitOutlined,
    CustomerServiceOutlined,
    TeamOutlined,
    ReconciliationOutlined,
    RestOutlined,
    SmileOutlined,
    CrownOutlined
} from '@ant-design/icons'
import { RootState } from '../../store'
import type { MenuProps } from 'antd'

const DashboardSidebar: FC = () => {
    const { t } = useTranslation()
    const location = useLocation()
    const navigate = useNavigate()

    const [selectedKeys, setSelectedKeys] = useState<string[]>()
    const [openKeys, setOpenKeys] = useState<string[]>([])
    const [collapsed, setCollapsed] = useState<boolean>(false)
    const user = useSelector((state: RootState) => state.auth.user)

    const onOpenChange: MenuProps['onOpenChange'] = keys => {
        const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1)
        setOpenKeys(latestOpenKey ? [latestOpenKey] : [])
    }

    const menuItems = [
        {
            label: t('dashboard'),
            key: '',
            icon: <HomeOutlined />
        },
        {
            label: t('client facing'),
            key: '/client_facing',
            icon: <CustomerServiceOutlined />,
            children: [
                {
                    label: t('customers'),
                    key: '/customers',
                    icon: <UserOutlined />
                },
                {
                    label: t('orders'),
                    key: '/orders',
                    icon: <ReconciliationOutlined />
                }
            ]
        },
        {
            label: t('products management'),
            key: '/management',
            icon: <AuditOutlined />,
            children: [
                {
                    label: t('categories'),
                    key: '/categories',
                    icon: <ClusterOutlined />
                },
                {
                    label: t('milkteas'),
                    key: '/milkteas',
                    icon: <RestOutlined />
                },
                {
                    label: t('toppings'),
                    key: '/toppings',
                    icon: <DeploymentUnitOutlined />
                },
                {
                    label: t('vouchers'),
                    key: '/vouchers',
                    icon: <TagsOutlined />
                }
            ]
        },
        {
            label: t('human resources'),
            key: '/hr-management',
            icon: <TeamOutlined />,
            children: [
                {
                    label: t('admins'),
                    key: '/admins',
                    icon: <CrownOutlined />
                }
            ]
        },
        {
            label: t('statistics'),
            key: '/statistics',
            icon: <LineChartOutlined />
        }
    ]

    useEffect(() => {
        const remainingPath = location.pathname.slice('/dashboard'.length)
        const foundItem = menuItems.find(item => item.children?.length && item.children?.find(child => child.key === remainingPath))
        setSelectedKeys([remainingPath])
        setOpenKeys(foundItem?.key ? [foundItem.key] : [])
    }, [location])

    return (
        <Layout.Sider
            theme="dark"
            width={250}
            collapsible
            collapsed={collapsed}
            onCollapse={value => setCollapsed(value)}
            style={{ boxShadow: '1px 0px 1px rgba(0, 0, 0, 0.12)', position: 'sticky', top: 80, height: 'calc(100vh - 80px)' }}
        >
            <Menu
                mode="inline"
                theme="dark"
                selectedKeys={selectedKeys}
                openKeys={openKeys}
                onOpenChange={onOpenChange}
                onClick={e => navigate(`/dashboard${e.key}`)}
                items={menuItems}
            />
        </Layout.Sider>
    )
}

export default DashboardSidebar
