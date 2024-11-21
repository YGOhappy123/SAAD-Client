import { FC, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation, getI18n } from 'react-i18next'
import { Layout, Button, Badge, Dropdown, Tooltip, Avatar, Modal } from 'antd'
import { DashboardOutlined, ExclamationCircleFilled, ShoppingCartOutlined } from '@ant-design/icons'
import { RootState } from '../../store'
import { signOut } from '../../slices/auth.slice'
import { buttonStyle, containerStyle } from '../../assets/styles/globalStyle'
import type { MenuProps } from 'antd'
import CartDrawer from './CartDrawer'
import SearchBox from './SearchBox'
import useCart from '../../hooks/useCart'
import '../../assets/styles/components/AppBar.css'

interface IProps {
    isDashboard?: boolean
}

const TABS = [
    { label: 'home', to: '/' },
    { label: 'menu', to: '/menu' },
    { label: 'about us', to: '/about' }
]

const AppBar: FC<IProps> = ({ isDashboard }) => {
    const { t } = useTranslation()
    const i18n = getI18n()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const user = useSelector((state: RootState) => state.auth.user)
    const { detailedItems } = useCart()

    const [isCartOpen, setIsCartOpen] = useState(false)
    const location = useLocation()

    const adminItems: MenuProps['items'] = [
        {
            label: t('profile'),
            key: 'profile',
            onClick: () => navigate('/profile/edit')
        },
        {
            type: 'divider'
        },
        {
            label: t('sign out'),
            key: 'signOut',
            danger: true,
            onClick: () => onSignOutBtnClick(),
            style: { minWidth: 140 }
        }
    ]

    const customerItems: MenuProps['items'] = [
        {
            label: t('profile'),
            key: 'profile',
            onClick: () => navigate('/profile/edit')
        },
        {
            label: t('my orders'),
            key: 'orders',
            onClick: () => navigate('/profile/orders')
        },
        {
            type: 'divider'
        },
        {
            label: t('sign out'),
            key: 'signOut',
            danger: true,
            onClick: () => onSignOutBtnClick(),
            style: { minWidth: 140 }
        }
    ]

    const onSignOutBtnClick = () => {
        Modal.confirm({
            icon: <ExclamationCircleFilled />,
            title: t('are you sure you want to sign out ?'),
            okText: t('sign out'),
            cancelText: t('cancel'),
            onOk: () => {
                dispatch(signOut())
            },
            okButtonProps: {
                danger: true,
                shape: 'round',
                style: { ...buttonStyle, width: '100px', marginLeft: '12px' }
            },
            cancelButtonProps: {
                type: 'text',
                shape: 'round',
                style: { ...buttonStyle, width: '100px', border: '1px solid' }
            }
        })
    }

    return (
        <Layout.Header className="app-bar">
            <div style={containerStyle} className="container">
                <div className="logo-search">
                    <div className="logo" onClick={() => navigate('/')}>
                        <img src="/logo.png" className="logo-img" />
                    </div>
                    <SearchBox />
                </div>

                <ul className="tabs">
                    {TABS.map(({ label, to }) => (
                        <li className={`tab-item ${location.pathname === to ? 'active' : ''}`} key={label} onClick={() => navigate(to)}>
                            {t(label)}
                        </li>
                    ))}
                </ul>

                <div className="nav-btns">
                    <Tooltip title={t('change language')}>
                        {i18n.resolvedLanguage === 'en' && (
                            <Avatar onClick={() => i18n.changeLanguage('vi')} src="/en.jpg" style={{ cursor: 'pointer' }}></Avatar>
                        )}
                        {i18n.resolvedLanguage === 'vi' && (
                            <Avatar onClick={() => i18n.changeLanguage('en')} src="/vn.jpg" style={{ cursor: 'pointer' }}></Avatar>
                        )}
                    </Tooltip>

                    {!user && (
                        <Button size="large" type="primary" shape="round" className="nav-btn" onClick={() => navigate('/auth')}>
                            {t('sign in')}
                        </Button>
                    )}

                    {!isDashboard && user?.role === 'Admin' && (
                        <Tooltip title={t('go to dashboard')}>
                            <DashboardOutlined onClick={() => navigate('/dashboard')} className="nav-icon" style={{ color: 'white' }} />
                        </Tooltip>
                    )}

                    {user && user.role === 'User' && (
                        <>
                            <Tooltip title={t('cart')}>
                                <Badge count={detailedItems.length}>
                                    <ShoppingCartOutlined onClick={() => setIsCartOpen(true)} className="nav-icon" style={{ color: 'white' }} />
                                </Badge>
                            </Tooltip>
                            <CartDrawer isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
                        </>
                    )}

                    {user && (
                        <Dropdown menu={{ items: user.role === 'User' ? customerItems : adminItems }} placement="bottom" arrow>
                            <img src={user.avatar} className="user-avatar" onClick={() => navigate('/profile/edit')} />
                        </Dropdown>
                    )}
                </div>
            </div>
        </Layout.Header>
    )
}

export default AppBar
