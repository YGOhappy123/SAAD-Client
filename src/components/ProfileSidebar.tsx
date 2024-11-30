import { FC } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Divider, Modal } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { RootState } from '../store'
import { signOut } from '../slices/auth.slice'
import useAuth from '../services/auth'
import { buttonStyle } from '../assets/styles/globalStyle'
import '../assets/styles/components/ProfileSidebar.css'

const TABS = [
    { label: 'account details', to: '/profile/edit' },
    { label: 'my orders', to: '/profile/orders', role: ['Customer'] },
    { label: 'change avatar', to: '/profile/change-avatar' },
    { label: 'change password', to: '/profile/change-password' }
]

const ProfileSidebar: FC = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { deactivateAccountMutation } = useAuth()
    const location = useLocation()
    const user = useSelector((state: RootState) => state.auth.user)

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

    const onDeleteAccountBtnClick = () => {
        Modal.confirm({
            icon: <ExclamationCircleFilled />,
            title: t('are you sure you want to lock this account? This operation cannot be undone'),
            content: (
                <div>
                    <Divider style={{ margin: '10px 0', borderWidth: 2, borderColor: 'rgba(26, 26, 26, 0.12)' }} />
                </div>
            ),
            okText: t('lock my account'),
            cancelText: t('cancel'),
            onOk: () => {
                return deactivateAccountMutation.mutateAsync({ targetUserId: user.id, targetUserRole: user.role })
            },
            okButtonProps: {
                danger: true,
                shape: 'round',
                style: { ...buttonStyle, width: '140px', marginLeft: '12px' }
            },
            cancelButtonProps: {
                type: 'text',
                shape: 'round',
                style: { ...buttonStyle, width: '100px', border: '1px solid' }
            }
        })
    }

    return (
        <div className="profile-sidebar">
            <img src="/logo_invert.png" className="app-logo" onClick={() => navigate('/')} />
            <h2 className="welcome-user">{t('welcome')} !</h2>
            <h3 className="welcome-user">
                {user.lastName} {user.firstName}
            </h3>
            <span className="sign-out-btn" onClick={onSignOutBtnClick}>
                {t('sign out')}
            </span>
            <div className="profile-tabs">
                {TABS.map(({ label, to, role }) => {
                    if (Array.isArray(role) && !role.includes(user.role)) return null

                    return (
                        <div className={`profile-tab-item ${location.pathname === to ? 'active' : ''}`} key={label} onClick={() => navigate(to)}>
                            {t(label)}
                        </div>
                    )
                })}

                {
                    <>
                        <Divider style={{ margin: '18px 0 9px', borderColor: 'rgba(255, 255, 255, 0.5)' }} />
                        <div className="profile-tab-item danger" onClick={onDeleteAccountBtnClick}>
                            {t('lock my account')}
                        </div>
                    </>
                }
            </div>
        </div>
    )
}

export default ProfileSidebar
