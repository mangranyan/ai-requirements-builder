import { useState } from 'react'
import { Layout, Button, Typography, Card, Form, Input, Select, message, Divider, Space, Switch } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import './Settings.css'

const { Header, Content } = Layout
const { Title, Text } = Typography

// 支持的模型列表
const MODEL_PROVIDERS = [
  { label: 'OpenAI', value: 'openai', models: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'] },
  { label: 'Azure OpenAI', value: 'azure', models: ['gpt-4o', 'gpt-4-turbo'] },
  { label: '通义千问 (阿里云)', value: 'aliyun', models: ['qwen-plus', 'qwen-max'] },
  { label: '智谱 AI', value: 'zhipu', models: ['glm-4', 'glm-3-turbo'] },
  { label: 'LocalOllama', value: 'local', models: ['llama3', 'mistral'] },
]

const Settings = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // 加载已保存的配置
  useEffect(() => {
    const savedConfig = localStorage.getItem('aiConfig')
    if (savedConfig) {
      form.setFieldsValue(JSON.parse(savedConfig))
    } else {
      // 默认设置
      form.setFieldsValue({
        provider: 'openai',
        apiKey: '',
        baseUrl: '',
        model: 'gpt-4o',
        temperature: 0.7,
        autoSave: true,
      })
    }
  }, [form])

  // 保存配置
  const handleSave = async (values: any) => {
    setLoading(true)
    
    try {
      // TODO: 实际应该加密存储 API Key
      localStorage.setItem('aiConfig', JSON.stringify(values))
      
      // 测试连接
      if (values.apiKey && values.provider !== 'local') {
        await testConnection(values)
      }
      
      message.success('配置已保存！')
      setLoading(false)
    } catch (error) {
      message.error('保存失败，请重试')
      setLoading(false)
    }
  }

  // 测试 API 连接（模拟）
  const testConnection = async (config: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Testing connection with config:', config)
        resolve(true)
      }, 1000)
    })
  }

  return (
    <Layout className="settings-layout">
      <Header style={{ background: '#fff', padding: '12px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
        <Button onClick={() => navigate('/workbench')} icon={<ArrowLeftOutlined />}>返回</Button>
        <Title level={5} style={{ margin: '0 0 0 16px' }}>系统设置</Title>
      </Header>

      <Content style={{ padding: '24px', background: '#fafafa' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <Card title="API 配置" bordered={false}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
              autoComplete="off"
            >
              <Form.Item
                label="AI 服务商"
                name="provider"
                rules={[{ required: true, message: '请选择服务商！' }]}
              >
                <Select
                  onChange={(value) => {
                    const provider = MODEL_PROVIDERS.find(p => p.value === value)
                    form.setFieldValue('model', provider?.models[0] || '')
                  }}
                >
                  {MODEL_PROVIDERS.map(provider => (
                    <Select.Option key={provider.value} value={provider.value}>
                      {provider.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Model 名称"
                name="model"
                rules={[{ required: true, message: '请选择模型！' }]}
              >
                <Select 
                  disabled={!form.getFieldValue('provider')}
                  options={(() => {
                    const provider = form.getFieldValue('provider')
                    const selectedProvider = MODEL_PROVIDERS.find(p => p.value === provider)
                    return selectedProvider?.models.map(m => ({ value: m, label: m })) || []
                  })()}
                />
              </Form.Item>

              <Form.Item
                label="API Key"
                name="apiKey"
                rules={[{ required: true, message: '请输入 API Key！' }]}
              >
                <Input.Password
                  placeholder="sk-..."
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Base URL (可选)"
                name="baseUrl"
                extra="本地模型或非官方代理需配置，否则留空"
              >
                <Input placeholder="https://api.openai.com/v1" />
              </Form.Item>

              <Form.Item
                label="Temperature (创意度)"
                name="temperature"
                rules={[{ required: true }]}
                extra="值越大越有创意，推荐 0.7-1.0"
              >
                <Input type="number" min={0} max={2} step={0.1} />
              </Form.Item>

              <Divider />

              <Form.Item label="自动保存会话数据" name="autoSave" valuePropName="checked">
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" loading={loading} size="large">
                    保存配置
                  </Button>
                  <Button 
                    type="dashed" 
                    onClick={() => {
                      if (confirm('确定重置所有配置吗？')) {
                        localStorage.clear()
                        form.resetFields()
                        message.info('配置已重置')
                      }
                    }}
                  >
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>

          <Card style={{ marginTop: '24px' }} title="关于" bordered={false}>
            <Text type="secondary">
              AI Requirements Builder v1.0.0<br/>
              由 OpenClaw Agent 开发<br/>
              © 2026 All Rights Reserved
            </Text>
          </Card>
        </div>
      </Content>
    </Layout>
  )
}

export default Settings
