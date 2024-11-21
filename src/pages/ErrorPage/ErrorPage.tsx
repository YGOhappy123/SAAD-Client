import { FC } from 'react'
import { useRouteError, useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import { layoutStyle } from '../../assets/styles/globalStyle'
import '../../assets/styles/pages/ErrorPage.css'

const ErrorPage: FC = () => {
    const error: any = useRouteError()
    const navigate = useNavigate()

    return (
        <div id="error-page" style={layoutStyle} className="error-page">
            <span className="oops-title">Oops!</span>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>
                    {error.status} - {error.statusText || error.message}
                </i>
            </p>

            <Button onClick={() => navigate('/')} className="back-btn" size="large">
                Back to home
            </Button>
        </div>
    )
}

export default ErrorPage
