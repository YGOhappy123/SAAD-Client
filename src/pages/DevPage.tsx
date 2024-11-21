import { UploadOutlined } from '@ant-design/icons'
import { Row, Col, Button, Upload } from 'antd'
import { secondaryButtonStyle } from '../assets/styles/globalStyle'

export default function DevPage() {
    const productEndpoint = ''
    const devEndpoint = 'http://localhost:5000/files/upload/image/single?folder=dev'

    return (
        <Row style={{ padding: '28px' }}>
            <Col span={24}>
                <h3>Examples Component</h3>
            </Col>
            <Col span={24}>
                <h4>Upload images</h4>
                <Upload multiple accept="image/*" listType="picture" action={devEndpoint}>
                    <div style={{ width: '200px' }}>
                        <Button block shape="round" style={secondaryButtonStyle} icon={<UploadOutlined style={{ marginRight: '4px' }} />}>
                            <strong>Upload</strong>
                        </Button>
                    </div>
                </Upload>
            </Col>
        </Row>
    )
}
