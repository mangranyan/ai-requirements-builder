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

// 完整的问答模板库（以选择题为主）
const ALL_QUESTIONS = [
  // ========== 基础信息 ==========
  {
    category: '基础信息',
    questions: [
      {
        id: 'q1',
        field: 'appName',
        label: '项目名称（简要填写）',
        type: 'text',
        placeholder: '例如：企业 CRM 客户管理系统',
        required: true,
        note: '50 字以内',
      },
      {
        id: 'q2',
        field: 'appType',
        label: '应用类型',
        type: 'select',
        options: ['Web 应用', '桌面应用 (Win/Mac/Linux)', '移动应用 (iOS/Android)', '小程序', '混合应用'],
        placeholder: '请选择',
        required: true,
      },
      {
        id: 'q3',
        field: 'industry',
        label: '所属行业领域',
        type: 'select',
        options: ['金融保险', '电商零售', '生产制造', '医疗健康', '教育学习', '物流交通', '政府政务', '互联网科技', '其他行业'],
        placeholder: '请选择',
        required: true,
      },
      {
        id: 'q4',
        field: 'companySize',
        label: '预计用户规模',
        type: 'select',
        options: ['个人使用 (<10 人)', '部门级应用 (10-50 人)', '公司级应用 (50-500 人)', '集团级应用 (500 人以上)'],
        placeholder: '请选择',
        required: true,
      },
      {
        id: 'q5',
        field: 'projectBudget',
        label: '项目预算范围',
        type: 'select',
        options: ['10 万以下', '10-50 万', '50-100 万', '100-300 万', '300 万以上', '待定'],
        placeholder: '请选择',
        required: true,
      },
    ],
  },
  // ========== 业务场景（全部选择题） ==========
  {
    category: '业务场景',
    triggerField: 'industry',
    triggerValue: ['all'], // 所有行业都显示
    questions: [
      {
        id: 'q6',
        field: 'businessMode',
        label: '核心业务流程模式',
        type: 'multiselect',
        options: [
          '销售管理（线索 - 商机 - 成交）',
          '客户服务（工单 - 处理 - 回访）',
          '项目管理（计划 - 执行 - 监控）',
          '供应链管理（采购 - 库存 - 配送）',
          '财务管理（预算 - 报销 - 核算）',
          '人力资源管理（招聘 - 绩效 - 薪酬）',
          '生产流程（排产 - 质检 - 交付）',
          '数据分析（报表 - 洞察 - 决策）',
        ],
        required: true,
      },
      {
        id: 'q7',
        field: 'keyStakeholders',
        label: '关键干系人（谁需要审批/查看？）',
        type: 'multiselect',
        options: [
          '一线操作人员',
          '部门经理',
          '分管领导',
          'IT 部门',
          '外部供应商',
          '客户/合作伙伴',
          '审计/合规人员',
        ],
        required: false,
      },
      {
        id: 'q8',
        field: 'usageFrequency',
        label: '主要使用频率',
        type: 'select',
        options: [
          '高频实时使用（每天多次）',
          '日常办公使用（每天 1-2 次）',
          '周期性使用（每周/每月）',
          '偶发触发式（偶尔需要时）',
        ],
        placeholder: '请选择',
        required: true,
      },
      {
        id: 'q9',
        field: 'integrationNeeds',
        label: '需要与哪些系统集成？',
        type: 'multiselect',
        options: [
          '无需集成（独立系统）',
          'OA 系统（如：钉钉/企业微信/飞书）',
          'ERP 系统（如：SAP/Oracle/金蝶/用友）',
          'CRM 系统（客户关系管理）',
          'HRM 系统（人力资源）',
          '财务系统（如：用友/金蝶财务模块）',
          'BI/数据平台',
          '第三方 API（支付/地图/短信等）',
          '自定义接口',
        ],
        required: true,
      },
    ],
  },
  // ========== 功能需求（全选择题） ==========
  {
    category: '功能需求',
    questions: [
      {
        id: 'q10',
        field: 'coreModules',
        label: '必须包含的核心功能模块（至少选 3 项）',
        type: 'multiselect',
        options: [
          // 通用模块
          '登录认证（账号密码/手机验证码/SSO 单点登录）',
          '用户管理（增删改查/禁用启用）',
          '权限管理（RBAC 角色访问控制）',
          '菜单导航（动态菜单/面包屑）',
          // 数据操作
          '数据列表（表格/树形/卡片视图）',
          '数据详情（字段展示/关联数据）',
          '新增编辑表单（验证/提交）',
          '批量操作（全选/导入导出）',
          '搜索过滤（多条件组合查询）',
          '数据统计（图表/仪表板）',
          // 高级功能
          '工作流审批（多级审批/会签/转办）',
          '消息通知（站内信/邮件/短信）',
          '日志审计（操作记录/变更追踪）',
          '文件管理（上传下载/版本控制）',
          '报表生成（定时发送/定制格式）',
          'API 接口（对外开放/文档）',
          '任务调度（定时任务/后台处理）',
          '在线帮助（FAQ/操作指引）',
        ],
        required: true,
      },
      {
        id: 'q11',
        field: 'advancedFeatures',
        label: '需要的高级特性',
        type: 'multiselect',
        options: [
          '数据可视化大屏',
          '智能推荐/AI 辅助',
          'OCR 识别（文档/图片）',
          '语音输入/输出',
          '移动端 H5 适配',
          '离线数据同步',
          '多语言支持',
          '主题切换（亮色/暗色）',
          '自定义报表',
          '自动化脚本',
          '机器人集成',
          '区块链存证',
        ],
        required: false,
      },
    ],
  },
  // ========== 角色权限（选择题为主） ==========
  {
    category: '角色权限',
    questions: [
      {
        id: 'q12',
        field: 'roleTypes',
        label: '需要的角色类型',
        type: 'multiselect',
        options: [
          '系统超级管理员',
          '部门管理员',
          '普通用户',
          '只读访客',
          '外部合作伙伴',
          '审计员',
          '操作员',
        ],
        required: true,
      },
      {
        id: 'q13',
        field: 'permissionGranularity',
        label: '权限控制粒度',
        type: 'multiselect',
        options: [
          '仅菜单级（谁能进哪个页面）',
          '增加按钮级权限（CRUD 操作）',
          '字段级权限（可见/可编辑）',
          '行级数据权限（看本部门/看自己）',
          '审批流程权限',
          '数据导出权限控制',
          '敏感操作二次确认',
        ],
        required: true,
      },
      {
        id: 'q14',
        field: 'authMethods',
        label: '登录认证方式',
        type: 'multiselect',
        options: [
          '账号密码登录',
          '手机号 + 验证码',
          '微信一键登录',
          '企业微信登录',
          '钉钉登录',
          'LDAP/AD 域登录',
          'OAuth 2.0/SAML 单点登录',
          '双因素认证（2FA）',
          '生物识别（指纹/人脸）',
        ],
        required: true,
      },
    ],
  },
  // ========== UI/UX设计（选择题） ==========
  {
    category: 'UI/UX 设计',
    questions: [
      {
        id: 'q15',
        field: 'uiStylePreference',
        label: '界面风格偏好',
        type: 'singleSelect',
        options: [
          '简洁现代风（类似 Notion/Figma）',
          '专业商务风（类似 SAP/AdminLTE）',
          '科技感强（深色主题/动画效果）',
          '温暖亲和风（圆角/渐变色）',
          '品牌色定制（按 VI 规范）',
        ],
        placeholder: '请选择',
        required: true,
      },
      {
        id: 'q16',
        field: 'pageLayouts',
        label: '主要页面布局类型',
        type: 'multiselect',
        options: [
          '左侧导航栏 + 内容区',
          '顶部标签页切换',
          '卡片式网格布局',
          '仪表盘形式（大中小组件混排）',
          '全屏数据表格',
          '分屏对比视图',
          '向导式步骤条',
          '模态框弹窗交互',
        ],
        required: true,
      },
      {
        id: 'q17',
        field: 'accessibility',
        label: '无障碍要求',
        type: 'multiselect',
        options: [
          '不需要特殊处理',
          '支持键盘导航',
          '高对比度模式',
          '屏幕阅读器友好',
          '字体大小可调',
          '符合 WCAG 标准',
        ],
        required: false,
      },
    ],
  },
  // ========== 非功能需求（选择题） ==========
  {
    category: '非功能需求',
    questions: [
      {
        id: 'q18',
        field: 'performanceLevel',
        label: '性能要求等级',
        type: 'select',
        options: [
          '一般级（<1000 DAU，响应 <2s）',
          '标准级（<10000 DAU，响应 <1s）',
          '高并发级（<10 万 DAU，响应 <500ms）',
          '企业级（百万级并发，严格 SLA）',
        ],
        placeholder: '请选择',
        required: true,
      },
      {
        id: 'q19',
        field: 'securityRequirements',
        label: '安全要求（必选）',
        type: 'multiselect',
        options: [
          '默认必选：传输加密（HTTPS/SSL）',
          '数据落盘加密（AES-256）',
          '密码强度策略（8 位 + 复杂度）',
          '防暴力破解（失败锁定）',
          'SQL 注入防护',
          'XSS 跨站脚本防护',
          'CSRF 令牌验证',
          '操作日志完整审计',
          'IP 白名单限制',
          '会话超时自动登出',
          '双因素认证（2FA）',
          '数据备份恢复机制',
        ],
        required: true,
      },
      {
        id: 'q20',
        field: 'browserCompatibility',
        label: '浏览器兼容性要求',
        type: 'multiselect',
        options: [
          'Chrome 最新版',
          'Edge Chromium',
          'Firefox 最新版',
          'Safari（Mac）',
          'IE11（仅特殊场景）',
          '国产浏览器（360/搜狗）',
          '移动端浏览器（iOS Safari/Android Chrome）',
        ],
        required: true,
      },
      {
        id: 'q21',
        field: 'deploymentPlatform',
        label: '部署平台选择',
        type: 'select',
        options: [
          '公有云（阿里云/腾讯云/AWS 等）',
          '私有云（OpenStack/K8s 集群）',
          '本地物理服务器',
          '虚拟主机（VPS）',
          '容器化部署（Docker+K8s）',
          'Serverless 架构',
        ],
        placeholder: '请选择',
        required: true,
      },
      {
        id: 'q22',
        field: 'dataRetention',
        label: '数据保留期限',
        type: 'select',
        options: [
          '永久保存',
          '3 年以上',
          '1-3 年',
          '6 个月 -1 年',
          '按需删除',
        ],
        placeholder: '请选择',
        required: true,
      },
    ],
  },
  // ========== 运维部署（选择题） ==========
  {
    category: '运维部署',
    questions: [
      {
        id: 'q23',
        field: 'monitoringNeeds',
        label: '监控告警需求',
        type: 'multiselect',
        options: [
          '不需要监控',
          '基础资源监控（CPU/内存/磁盘）',
          '应用性能监控（APM）',
          '接口响应时间监控',
          '错误率告警',
          '业务指标监控（订单量/转化率）',
          '邮件/短信告警',
          '钉钉/企业微信群机器人通知',
        ],
        required: true,
      },
      {
        id: 'q24',
        field: 'backupStrategy',
        label: '备份策略',
        type: 'select',
        options: [
          '每日自动备份',
          '每周自动备份',
          '每月自动备份',
          '手动备份即可',
          '增量 + 全量组合备份',
          '异地灾备',
        ],
        placeholder: '请选择',
        required: true,
      },
      {
        id: 'q25',
        field: 'supportLevel',
        label: '技术支持级别',
        type: 'select',
        options: [
          '仅提供文档',
          '线上远程支持',
          '现场实施服务',
          '7×24 小时 SLA',
          '专属技术顾问',
        ],
        placeholder: '请选择',
        required: true,
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
