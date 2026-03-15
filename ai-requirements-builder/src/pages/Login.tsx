import { useState } from 'react'
import { Form, Input, Button, Card, Typography, message } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import './Login.css'

const { Title, Text } = Typography

const Login = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: any) => {
    setLoading(true)
    
    // TODO: 实际应该验证密码
    // 这里先简单演示
    setTimeout(() => {
      localStorage.setItem('isLoggedIn', 'true')
      message.success('登录成功！')
      navigate('/workbench')
      setLoading(false)
    }, 800)
  }

  return (
    <div className="login-container">
      <Card className="login-card" bodyStyle={{ padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div className="logo-placeholder">🦞</div>
          <Title level={2} style={{ marginTop: '20px' }}>
            AI Requirements Builder
          </Title>
          <Text type="secondary">AI 驱动的需求说明书生成工具</Text>
        </div>

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名！' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="管理员账号"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码！' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码（至少 6 位）"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
              style={{ height: '44px', fontSize: '16px' }}
            >
              进入系统
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login
