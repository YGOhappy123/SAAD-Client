import { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Avatar, Button, Space, Upload } from 'antd'
import { EditOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { UploadRequestOption } from 'rc-upload/lib/interface'
import { RootState } from '../../store'
import { setUser } from '../../slices/auth.slice'
import { containerStyle } from '../../assets/styles/globalStyle'
import ProfileSidebar from '../../components/ProfileSidebar'
import useTitle from '../../hooks/useTitle'
import useFiles from '../../services/files'
import useUsers from '../../services/users'
import useAdmins from '../../services/admins'
import '../../assets/styles/pages/ProfilePage.css'

const ChangeAvatarPage: FC = () => {
    const { t } = useTranslation()
    const { uploadMutation, deleteMutation } = useFiles()
    const { updateProfileMutation } = useUsers({ enabledFetchUsers: false })
    const { updateAdminMutation } = useAdmins({ enabledFetchAdmins: false })
    const dispatch = useDispatch()

    const user = useSelector((state: RootState) => state.auth.user)
    const [avatar, setAvatar] = useState(user?.avatar)

    useTitle(`${t('change avatar')} - PMT`)
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const handleUpload = ({ file }: UploadRequestOption<any>) => {
        uploadMutation.mutateAsync({ file, folder: 'avatar' }).then(res => {
            setAvatar(res.data.data?.url)
        })
    }

    const updateAvatar = () => {
        if (user.role === 'User') {
            updateProfileMutation.mutateAsync({ data: { avatar } }).then(() => {
                dispatch(setUser({ ...user, avatar }))
            })
        } else {
            updateAdminMutation.mutateAsync({ adminId: user.userId, data: { avatar } }).then(() => {
                dispatch(setUser({ ...user, avatar }))
            })
        }
    }

    const cancelAvatarChange = () => {
        deleteMutation.mutate(avatar)
        setAvatar(user?.avatar)
    }

    return (
        <div className="profile-page">
            <section className="container-wrapper">
                <div className="container" style={containerStyle}>
                    <ProfileSidebar />

                    <div className="update-avatar-wrapper">
                        <h3 className="heading">{t('change avatar')}</h3>

                        <Upload
                            name="avatar"
                            listType="picture-circle"
                            className="avatar-uploader"
                            accept="image/*"
                            showUploadList={false}
                            customRequest={handleUpload}
                        >
                            <Button type="primary" shape="circle" size="large" icon={<EditOutlined />} className="upload-icon" />
                            {avatar && !uploadMutation.isLoading ? (
                                <Avatar src={avatar} size={100} />
                            ) : (
                                <div>
                                    {uploadMutation.isLoading ? <LoadingOutlined /> : <PlusOutlined />}
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            )}
                        </Upload>

                        <Space style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }} size={24}>
                            <Button
                                type="primary"
                                shape="round"
                                size="large"
                                block
                                disabled={!avatar || avatar === user?.avatar}
                                onClick={updateAvatar}
                                className="change-avatar-btn"
                            >
                                {t('update')}
                            </Button>
                            <Button
                                type="default"
                                shape="round"
                                size="large"
                                block
                                disabled={!avatar || avatar === user?.avatar}
                                onClick={cancelAvatarChange}
                                className="change-avatar-btn"
                            >
                                {t('cancel')}
                            </Button>
                        </Space>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ChangeAvatarPage
