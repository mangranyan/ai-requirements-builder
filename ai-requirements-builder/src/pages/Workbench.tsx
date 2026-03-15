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

// 完整的问答模板库
const ALL_QUESTIONS = [
  // ========== 基础信息 ==========
  {
    category: '基础信息',
    questions: [
      {
        id: 'q1',
        field: 'appName',
        label: '项目名称',
        type: 'text',
        placeholder: '例如：企业客户管理系统 CRM',
        required: true,
      },
      {
        id: 'q2',
        field: 'appType',
        label: '应用类型',
        type: 'select',
        options: ['Web 应用', '桌面应用 (Win/Mac/Linux)', '移动应用 (iOS/Android)', '小程序', '混合应用'],
        placeholder: '请选择应用类型',
        required: true,
      },
      {
        id: 'q3',
        field: 'description',
        label: '产品描述',
        type: 'textarea',
        placeholder: '请用 100-500 字简要描述这个应用是做什么的，解决什么痛点，目标用户是谁...',
        maxLength: 2000,
        required: true,
      },
    ],
  },
  // ========== 业务场景 ==========
  {
    category: '业务场景',
    triggerField: 'description',
    triggerKeyword: ['管理', '系统', '平台', '工具', '服务'],
    questions: [
      {
        id: 'q4',
        field: 'targetUsers',
        label: '目标用户群体（请详细描述）',
        type: 'textarea',
        placeholder: '谁会使用这个应用？他们的角色、特征、使用频率等...',
        maxLength: 800,
        required: true,
      },
      {
        id: 'q5',
        field: 'businessGoals',
        label: '核心业务目标',
        type: 'textarea',
        placeholder: '这个项目要达成什么商业价值？提升效率？降低成本？增加收入？...',
        maxLength: 1000,
        required: true,
      },
      {
        id: 'q6',
        field: 'painPoints',
        label: '当前痛点/问题',
        type: 'textarea',
        placeholder: '目前存在什么问题需要解决？现有解决方案的缺陷是什么？...',
        maxLength: 1000,
        required: false,
      },
    ],
  },
  // ========== 功能需求 ==========
  {
    category: '功能需求',
    triggerField: 'appType',
    triggerValue: ['Web 应用', '混合应用'],
    questions: [
      {
        id: 'q7',
        field: 'coreFeatures',
        label: '核心功能模块（可多选）',
        type: 'multiselect',
        options: [
          '用户认证（登录/注册/找回密码）',
          '数据 CRUD（增删改查）',
          '权限管理（RBAC）',
          '数据分析/报表/统计',
          '消息通知（站内信/邮件/短信）',
          '第三方集成（支付/地图/OA 等）',
          '工作流审批',
          '文件上传下载',
          '搜索与过滤',
          '批量操作',
          '数据导入导出',
          'API 接口管理',
        ],
        required: true,
      },
      {
        id: 'q8',
        field: 'featureDetails',
        label: '详细功能说明',
        type: 'textarea',
        placeholder: '对每个核心功能的详细说明，业务流程如何？输入输出是什么？异常处理规则？...',
        maxLength: 3000,
        required: false,
      },
    ],
  },
  // ========== 角色权限 ==========
  {
    category: '角色权限',
    questions: [
      {
        id: 'q9',
        field: 'userRoles',
        label: '系统角色划分',
        type: 'textarea',
        placeholder: '例如：管理员、普通用户、VIP 用户、访客... 每个角色的职责范围？',
        maxLength: 1000,
        required: true,
      },
      {
        id: 'q10',
        field: 'permissions',
        label: '权限控制粒度',
        type: 'multiselect',
        options: [
          '菜单级权限',
          '按钮级权限',
          '字段级权限（可见/可编辑）',
          '数据范围权限（本部门/全公司）',
          '操作日志审计',
        ],
        required: false,
      },
    ],
  },
  // ========== UI/UX设计 ==========
  {
    category: 'UI/UX 设计',
    questions: [
      {
        id: 'q11',
        field: 'uiStyle',
        label: '界面风格偏好',
        type: 'select',
        options: [
          '简洁现代风',
          '专业商务风',
          '科技未来感',
          '温暖亲和风',
          '品牌定制色',
        ],
        placeholder: '请选择',
        required: false,
      },
      {
        id: 'q12',
        field: 'keyPages',
        label: '关键页面列表',
        type: 'textarea',
        placeholder: '必须包含哪些主要页面？例如：登录页、首页、数据看板、XX 管理页、设置页等...',
        maxLength: 1500,
        required: true,
      },
    ],
  },
  // ========== 非功能需求 ==========
  {
    category: '非功能需求',
    questions: [
      {
        id: 'q13',
        field: 'performance',
        label: '性能要求',
        type: 'select',
        options: [
          '一般（支持 100 并发用户）',
          '较高（支持 1000 并发用户）',
          '极高（支持 10000+ 并发用户）',
          '特大型（企业级大规模部署）',
        ],
        placeholder: '请选择',
        required: true,
      },
      {
        id: 'q14',
        field: 'securityRequirements',
        label: '安全等级要求',
        type: 'multiselect',
        options: [
          '数据传输 SSL/TLS 加密',
          '敏感数据 AES 加密存储',
          '密码强度策略（复杂度/定期更换）',
          '操作日志完整记录',
          '防 SQL 注入/XSS/CSRF攻击',
          'DDoS 防护',
          '双因素认证（2FA）',
          '数据备份恢复机制',
        ],
        required: true,
      },
      {
        id: 'q15',
        field: 'compatibility',
        label: '兼容性要求',
        type: 'textarea',
        placeholder: '需要支持哪些浏览器/操作系统/分辨率？例如：Chrome/Safari/Firefox 最新版，Windows 10+/macOS 11+ 等...',
        maxLength: 800,
        required: true,
      },
      {
        id: 'q16',
        field: 'integrationRequirements',
        label: '系统集成要求',
        type: 'textarea',
        placeholder: '需要与哪些现有系统集成？ERP/OA/CRM/HR/财务系统等... 集成方式（API/数据库/中间件）？',
        maxLength: 1000,
        required: false,
      },
    ],
  },
  // ========== 运维部署 ==========
  {
    category: '运维部署',
    questions: [
      {
        id: 'q17',
        field: 'deploymentEnvironment',
        label: '部署环境',
        type: 'select',
        options: [
          '公有云（阿里云/AWS/腾讯云等）',
          '私有云（OpenStack/K8s 等）',
          '本地服务器（自建机房）',
          '混合云部署',
        ],
        placeholder: '请选择',
        required: true,
      },
      {
        id: 'q18',
        field: 'maintenance',
        label: '运维维护要求',
        type: 'textarea',
        placeholder: '是否需要监控告警？日志管理？自动化部署？数据归档？技术支持级别？...',
        maxLength: 800,
        required: false,
      },
    ],
  },
]

// 初始加载的问题（只显示基础信息部分）
const INITIAL_QUESTIONS = ALL_QUESTIONS[0].questions

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

  // 生成需求文档预览（增强版）
  const generateDocPreview = (answers: any) => {
    let preview = ''
    
    // 标题
    preview += `# ${answers.appName || '未命名项目'} - 需求规格说明书\n\n`
    preview += `**版本号**: v1.0 | **生成日期**: ${new Date().toLocaleString('zh-CN')}\n\n`
    
    preview += `---\n\n`
    
    // 项目概述
    preview += `## 一、项目概述\n\n`
    if (answers.appName) preview += `### 1.1 基本信息\n`
    if (answers.appName) preview += `- **项目名称**: ${answers.appName}\n`
    if (answers.appType) preview += `- **应用类型**: ${answers.appType}\n`
    if (answers.description) preview += `\n### 1.2 产品描述\n${answers.description}\n`
    
    // 业务场景
    if (answers.targetUsers || answers.businessGoals) {
      preview += `\n---\n\n`
      preview += `## 二、业务场景\n\n`
      if (answers.targetUsers) preview += `### 2.1 目标用户\n${answers.targetUsers}\n`
      if (answers.businessGoals) preview += `### 2.2 核心目标\n${answers.businessGoals}\n`
      if (answers.painPoints) preview += `### 2.3 痛点分析\n${answers.painPoints}\n`
    }
    
    // 功能需求
    if (answers.coreFeatures || answers.featureDetails) {
      preview += `\n---\n\n`
      preview += `## 三、功能需求\n\n`
      if (answers.coreFeatures && Array.isArray(answers.coreFeatures)) {
        preview += `### 3.1 核心功能模块\n`
        answers.coreFeatures.forEach((feature: string, idx: number) => {
          preview += `${idx + 1}. ${feature}\n`
        })
        preview += `\n`
      }
      if (answers.featureDetails) preview += `### 3.2 详细说明\n${answers.featureDetails}\n`
    }
    
    // 角色权限
    if (answers.userRoles || answers.permissions) {
      preview += `\n---\n\n`
      preview += `## 四、角色与权限\n\n`
      if (answers.userRoles) preview += `### 4.1 系统角色\n${answers.userRoles}\n`
      if (answers.permissions) {
        preview += `### 4.2 权限控制\n`
        if (Array.isArray(answers.permissions)) {
          answers.permissions.forEach((perm: string, idx: number) => {
            preview += `${idx + 1}. ${perm}\n`
          })
        }
        preview += `\n`
      }
    }
    
    // UI/UX
    if (answers.uiStyle || answers.keyPages) {
      preview += `\n---\n\n`
      preview += `## 五、UI/UX设计\n\n`
      if (answers.uiStyle) preview += `### 5.1 界面风格：${answers.uiStyle}\n`
      if (answers.keyPages) preview += `### 5.2 关键页面\n${answers.keyPages}\n`
    }
    
    // 非功能需求
    if (answers.performance || answers.securityRequirements || answers.compatibility) {
      preview += `\n---\n\n`
      preview += `## 六、非功能需求\n\n`
      if (answers.performance) preview += `### 6.1 性能要求：${answers.performance}\n`
      if (answers.securityRequirements) {
        preview += `### 6.2 安全要求\n`
        if (Array.isArray(answers.securityRequirements)) {
          answers.securityRequirements.forEach((sec: string, idx: number) => {
            preview += `${idx + 1}. ${sec}\n`
          })
        }
        preview += `\n`
      }
      if (answers.compatibility) preview += `### 6.3 兼容性：${answers.compatibility}\n`
    }
    
    // 运维部署
    if (answers.deploymentEnvironment || answers.maintenance) {
      preview += `\n---\n\n`
      preview += `## 七、运维部署\n\n`
      if (answers.deploymentEnvironment) preview += `### 7.1 部署环境：${answers.deploymentEnvironment}\n`
      if (answers.maintenance) preview += `### 7.2 运维要求：${answers.maintenance}\n`
    }
    
    preview += `\n---\n\n`
    preview += `*本需求文档由 AI Requirements Builder v1.0 自动生成*\n`
    
    setDocPreview(preview)
  }

  // AI 智能生成下一批问题（基于已填写内容智能推荐）
  const handleGenerateNextQuestions = async () => {
    setLoading(true)
    
    try {
      // 模拟 AI 分析过程（实际应该调用 LLM API）
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      let nextQuestions = []
      const currentAnswers = formValues
      
      // ========== 第一步：根据基础信息判断是否需要业务场景问题 ==========
      if (currentAnswers.description && currentAnswers.appType === 'Web 应用') {
        nextQuestions.push(...ALL_QUESTIONS[1].questions) // 业务场景
      }
      
      // ========== 第二步：添加功能需求问题 ==========
      if (currentAnswers.appType === 'Web 应用' || currentAnswers.appType === '混合应用') {
        nextQuestions.push(...ALL_QUESTIONS[2].questions) // 功能需求
      }
      
      // ========== 第三步：添加角色权限问题（几乎所有项目都需要） ==========
      nextQuestions.push(...ALL_QUESTIONS[3].questions) // 角色权限
      
      // ========== 第四步：UI/UX设计问题 ==========
      nextQuestions.push(...ALL_QUESTIONS[4].questions) // UI/UX
      
      // ========== 第五步：非功能需求问题 ==========
      nextQuestions.push(...ALL_QUESTIONS[5].questions) // 非功能需求
      
      // ========== 第六步：运维部署问题 ==========
      nextQuestions.push(...ALL_QUESTIONS[6].questions) // 运维部署
      
      setQuestions(prev => [...prev, ...nextQuestions])
      generateDocPreview({ ...currentAnswers })
      
      // 自动滚动到第一个新问题位置
      setTimeout(() => {
        window.scrollTo({ top: document.documentElement.scrollHeight / 2, behavior: 'smooth' })
      }, 500)
      
      setCurrentStep(prev => prev + 1)
      message.success(`AI 已根据已填内容，智能生成了 ${nextQuestions.length} 个相关问题！`)
      setLoading(false)
    } catch (error) {
      console.error('生成问题失败:', error)
      message.error('生成问题失败，请稍后重试')
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
            {question.label && (
              <Text type="secondary" style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                {question.placeholder}
              </Text>
            )}
            <div style={{ marginTop: '8px' }}>
              <textarea
                rows={question.maxLength ? Math.max(4, Math.ceil(value?.length / 50) + 2) : 4}
                value={value || ''}
                onChange={(e) => handleFieldChange(question.field, e.target.value)}
                placeholder={question.placeholder}
                style={{ 
                  width: '100%', 
                  padding: '8px 12px', 
                  borderRadius: '4px', 
                  border: '1px solid #d9d9d9', 
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  minHeight: '80px',
                  lineHeight: '1.5',
                  overflow: 'auto'
                }}
                maxLength={question.maxLength}
              />
              {question.maxLength && (
                <div style={{ textAlign: 'right', fontSize: '12px', color: '#999', marginTop: '4px' }}>
                  {value?.length || 0}/{question.maxLength}
                </div>
              )}
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
