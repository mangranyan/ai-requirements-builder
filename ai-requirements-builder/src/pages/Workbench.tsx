import { useState, useEffect } from 'react'
import { Layout, Menu, Typography, Card, Steps, Button, message, Space, Divider } from 'antd'
import { 
  ArrowRightOutlined, 
  ReloadOutlined, 
  FileTextOutlined,
  SettingOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import './Workbench.css'

const { Header, Sider, Content } = Layout
const { Title, Text } = Typography
const { Step } = Steps

// 初始问题模板
const INITIAL_QUESTIONS = [
  {
    id: 'q1',
    field: 'appName',
    label: '项目名称',
    type: 'text',
    placeholder: '请输入应用名称',
    required: true,
  },
  {
    id: 'q2',
    field: 'appType',
    label: '应用类型',
    type: 'select',
    options: ['Web 应用', '桌面应用 (Win/Mac)', '移动应用 (iOS/Android)', '小程序'],
    placeholder: '请选择应用类型',
    required: true,
  },
  {
    id: 'q3',
    field: 'description',
    label: '产品描述',
    type: 'textarea',
    placeholder: '请用 100-500 字简要描述这个应用是做什么的，解决什么痛点...',
    maxLength: 1000,
    required: true,
  },
]

const Workbench = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [formValues, setFormValues] = useState({})
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS)
  const [loading, setLoading] = useState(false)
  const [docPreview, setDocPreview] = useState('')

  // 加载历史数据
  useEffect(() => {
    const saved = localStorage.getItem('requirementsSession')
    if (saved) {
      const session = JSON.parse(saved)
      setFormValues(session.answers || {})
      
      // 生成文档预览
      generateDocPreview(session.answers)
    }
  }, [])

  // 生成需求文档预览
  const generateDocPreview = (answers: any) => {
    let preview = `# ${answers.appName || '未命名项目'} - 需求说明书\n\n`
    preview += `## 1. 项目概述\n\n`
    preview += `- **项目名称**: ${answers.appName}\n`
    preview += `- **应用类型**: ${answers.appType}\n`
    preview += `- **产品描述**: ${answers.description}\n\n`
    preview += `---\n\n`
    preview += `*文档正在生成中...*`
    
    setDocPreview(preview)
  }

  // AI 生成下一批问题（模拟）
  const handleGenerateNextQuestions = async () => {
    setLoading(true)
    
    try {
      // TODO: 实际应该调用 LLM API
      // 这里先硬编码演示
      setTimeout(() => {
        const nextQuestions = [
          {
            id: 'q4',
            field: 'targetUsers',
            label: '目标用户群体',
            type: 'textarea',
            placeholder: '谁会使用这个应用？他们的特征是什么？...',
            maxLength: 800,
            required: true,
          },
          {
            id: 'q5',
            field: 'coreFeatures',
            label: '核心功能需求（多选）',
            type: 'multiselect',
            options: [
              '用户登录/注册',
              '数据 CRUD（增删改查）',
              '权限管理',
              '数据分析/报表',
              '第三方集成',
              '消息通知',
            ],
            required: true,
          },
          {
            id: 'q6',
            field: 'performance',
            label: '性能要求',
            type: 'select',
            options: ['一般（支持 100 并发）', '较高（支持 1000 并发）', '极高（支持 10000+ 并发）'],
            placeholder: '请选择',
            required: false,
          },
        ]

        setQuestions(prev => [...prev, ...nextQuestions])
        
        // 更新文档预览
        generateDocPreview({ ...formValues })
        
        setCurrentStep(1)
        message.success('已生成后续问题！')
        setLoading(false)
      }, 1000)
    } catch (error) {
      message.error('生成问题失败，请重试')
      setLoading(false)
    }
  }

  // 处理表单变化
  const handleFieldChange = (field: string, value: any) => {
    const newValues = { ...formValues, [field]: value }
    setFormValues(newValues)
    localStorage.setItem('requirementsSession', JSON.stringify({ answers: newValues }))
    generateDocPreview(newValues)
  }

  // 渲染表单字段
  const renderFormField = (question: any) => {
    const value = formValues[question.field]

    switch (question.type) {
      case 'textarea':
        return (
          <div style={{ marginBottom: '8px' }}>
            <Text type="secondary">{question.placeholder}</Text>
            <div style={{ marginTop: '8px' }}>
              <input
                type="textarea"
                rows={question.maxLength ? 4 : 2}
                value={value || ''}
                onChange={(e) => handleFieldChange(question.field, e.target.value)}
                placeholder={question.placeholder}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d9d9d9', fontFamily: 'inherit' }}
                maxLength={question.maxLength}
              />
            </div>
          </div>
        )

      case 'select':
        return (
          <div style={{ marginBottom: '8px' }}>
            <select
              value={value || ''}
              onChange={(e) => handleFieldChange(question.field, e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #d9d9d9', fontSize: '14px' }}
            >
              <option value="">请选择 {question.label}</option>
              {question.options?.map((opt: string) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        )

      case 'multiselect':
        return (
          <div style={{ marginBottom: '8px' }}>
            <div style={{ marginBottom: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {question.options?.map((opt: string) => {
                const isChecked = value?.includes(opt)
                return (
                  <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const newValue = e.target.checked
                          ? [...(value || []), opt]
                          : (value || []).filter((v: string) => v !== opt)
                        handleFieldChange(question.field, newValue)
                      }}
                      style={{ cursor: 'pointer' }}
                    />
                    <span>{opt}</span>
                  </label>
                )
              })}
            </div>
          </div>
        )

      default: // text input
        return (
          <div style={{ marginBottom: '8px' }}>
            <input
              type="text"
              value={value || ''}
              onChange={(e) => handleFieldChange(question.field, e.target.value)}
              placeholder={question.placeholder}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #d9d9d9', fontSize: '14px' }}
            />
          </div>
        )
    }
  }

  return (
    <Layout className="workbench-layout">
      {/* 左侧导航 */}
      <Sider width={200} theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #f0f0f0' }}>
          <Title level={4} style={{ margin: 0 }}>AI Requirements Builder</Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[window.location.pathname]}
          items={[
            { key: '/workbench', icon: <ArrowRightOutlined />, label: '需求收集' },
            { key: '/docs', icon: <FileTextOutlined />, label: '需求文档' },
            { key: '/settings', icon: <SettingOutlined />, label: '系统设置' },
          ]}
        />
      </Sider>

      {/* 主体内容 */}
      <Layout>
        <Header style={{ background: '#fff', padding: '12px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Space>
            <Title level={5} style={{ margin: 0 }}>需求收集向导</Title>
            <Steps current={currentStep} size="small" style={{ maxWidth: 400 }}>
              <Step title="基础信息" />
              <Step title="功能细节" />
              <Step title="非功能需求" />
              <Step title="完成" />
            </Steps>
          </Space>
          <Button onClick={() => navigate('/login')} type="default">退出</Button>
        </Header>

        <Content style={{ padding: '24px', background: '#fafafa', minHeight: 'calc(100vh - 100px)' }}>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <Card title="当前问题" bordered={false}>
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                {questions.map((q, idx) => {
                  if (idx > currentStep * 3 + 2) return null // 只显示当前批次的问题
                  return (
                    <div key={q.id} style={{ paddingBottom: idx < questions.length - 1 ? '16px' : 0, borderBottom: idx < questions.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                      <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                        {idx + 1}. {q.label} {q.required && <span style={{ color: '#ff4d4f' }}>*</span>}
                      </Text>
                      {renderFormField(q)}
                    </div>
                  )
                })}
              </Space>

              <Divider />

              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                {currentStep === 0 && (
                  <Button 
                    type="primary" 
                    onClick={handleGenerateNextQuestions} 
                    loading={loading}
                    icon={<ReloadOutlined />}
                  >
                    AI 生成后续问题
                  </Button>
                )}
                
                {currentStep < questions.length - 3 && (
                  <Button
                    type="primary"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    icon={<ArrowRightOutlined />}
                  >
                    下一步
                  </Button>
                )}

                {currentStep >= questions.length - 3 && (
                  <Button
                    type="primary"
                    onClick={() => navigate('/docs')}
                    icon={<FileTextOutlined />}
                  >
                    生成需求文档
                  </Button>
                )}
              </Space>
            </Card>
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default Workbench
