import { useState, useEffect } from 'react'
import { Layout, Button, Typography, Card, Space, Divider, message, Tabs } from 'antd'
import { 
  DownloadOutlined, 
  EditOutlined, 
  CheckCircleOutlined,
  ArrowLeftOutlined,
  SettingOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import * as docx from 'docx'
import { saveAs } from 'file-saver'
import './Docs.css'

const { Header, Content } = Layout
const { Title, Text, Paragraph } = Typography

const Docs = () => {
  const navigate = useNavigate()
  const [docContent, setDocContent] = useState('# 待生成')
  const [markdownView, setMarkdownView] = useState('')

  // 加载历史数据
  useEffect(() => {
    const saved = localStorage.getItem('requirementsSession')
    if (saved) {
      const session = JSON.parse(saved)
      const answers = session.answers || {}
      
      // 生成完整的需求文档
      let content = generateFullDocument(answers)
      setDocContent(content)
      setMarkdownView(convertMarkdownToHtml(content))
    }
  }, [])

  // 生成完整文档
  const generateFullDocument = (answers: any) => {
    return `# ${answers.appName || '未命名项目'} - 需求规格说明书

## 📋 文档信息
- **生成时间**: ${new Date().toLocaleString('zh-CN')}
- **版本**: v1.0

---

## 1. 项目概述

### 1.1 基本信息
- **项目名称**: ${answers.appName || '待定'}
- **应用类型**: ${answers.appType || '待定'}
- **产品描述**: ${answers.description || '暂无描述'}

### 1.2 背景与目标
${answers.targetUsers ? `**目标用户**: ${answers.targetUsers}` : ''}

---

## 2. 功能需求

### 2.1 核心功能列表
${answers.coreFeatures ? answers.coreFeatures.map((f: string) => `- ✅ ${f}`).join('\n') : '- 待补充'}

### 2.2 详细功能说明
*(此处应根据具体功能进行详细描述)*

---

## 3. 非功能需求

### 3.1 性能要求
${answers.performance || '待补充'}

### 3.2 安全要求
- 用户身份认证：✅ 必需
- 数据加密存储：✅ 必需
- 操作日志记录：✅ 必需

### 3.3 兼容性要求
- Web 端：Chrome 90+, Safari 14+, Firefox 88+
- 移动端：iOS 14+, Android 10+

---

## 4. 技术架构建议

*(此部分将由 AI 根据已有信息推荐)*

### 4.1 推荐技术栈
*(待分析后填充)*

---

## 5. 项目里程碑

### 5.1 开发阶段规划
1. **Phase 1**: MVP 版本（核心功能）
2. **Phase 2**: 功能增强
3. **Phase 3**: 优化完善

---

*本需求文档由 AI Requirements Builder 自动生成*
`
  }

  // 简单的 Markdown 转 HTML（仅用于预览）
  const convertMarkdownToHtml = (md: string) => {
    return md
      .replace(/^# (.*)/gm, '<h1>$1</h1>')
      .replace(/^## (.*)/gm, '<h2>$1</h2>')
      .replace(/^### (.*)/gm, '<h3>$1</h3>')
      .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
      .replace(/-(.*)/gm, '<li>$1</li>')
      .replace(/\n/g, '<br/>')
  }

  // 导出为 Markdown
  const handleExportMarkdown = () => {
    const blob = new Blob([docContent], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${new Date().getTime()}_需求说明书.md`
    a.click()
    URL.revokeObjectURL(url)
    message.success('导出成功！')
  }

  // 导出为 TXT
  const handleExportTxt = () => {
    const blob = new Blob([docContent.replace(/<[^>]*>/g, '')], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${new Date().getTime()}_需求说明书.txt`
    a.click()
    URL.revokeObjectURL(url)
    message.success('导出成功！')
  }

  // 导出为 Word (DOCX) - 带排版的美化版本
  const handleExportWord = async () => {
    try {
      // 清理 HTML 标签，获取纯文本
      const cleanText = docContent.replace(/<[^>]*>/g, '').replace(/\n{3,}/g, '\n\n')
      const lines = cleanText.split('\n').filter(line => line.trim())
      
      const children: any[] = []
      
      // 解析标题和内容
      let currentSection = ''
      let sectionLevel = 0
      
      lines.forEach((line, index) => {
        if (line.startsWith('#')) {
          // 标题行
          const level = (line.match(/^#+/g) || []).length
          const text = line.replace(/^#+\s*/, '')
          
          if (level === 1) {
            children.push(new docx.Paragraph({
              text: text,
              heading: docx.HeadingLevel.HEADING_1,
              spacing: { after: 200 },
              alignment: docx.AlignmentType.CENTER,
              bold: true,
            }))
            sectionLevel = 1
          } else if (level === 2) {
            children.push(new docx.Paragraph({
              text: text,
              heading: docx.HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 },
              bold: true,
            }))
            sectionLevel = 2
          } else if (level === 3) {
            children.push(new docx.Paragraph({
              text: text,
              heading: docx.HeadingLevel.HEADING_3,
              spacing: { before: 100 },
              bold: true,
            }))
            sectionLevel = 3
          }
        } else if (line.includes('- **') && line.includes(':')) {
          // 属性行
          children.push(new docx.Paragraph({
            text: line,
            spacing: { before: 50, after: 50 },
            bullet: { level: 0 },
          }))
        } else if (line.match(/^\d+\./)) {
          // 列表项
          children.push(new docx.Paragraph({
            text: line,
            numbering: {
              reference: 'default-list',
              level: 0,
            },
            spacing: { before: 50, after: 50 },
          }))
        } else if (line.trim()) {
          // 普通段落
          children.push(new docx.Paragraph({
            text: line,
            spacing: { after: 100 },
          }))
        }
      })
      
      // 从 docContent 提取应用名称（第一个 # 后面的内容）
      const appNameMatch = docContent.match(/^# (.*) - /)
      const appName = appNameMatch ? appNameMatch[1] : '项目'
      
      // 创建文档
      const doc = new docx.Document({
        sections: [{
          properties: {},
          children: [
            // 标题
            new docx.Paragraph({
              text: `${appName} - 需求规格说明书`,
              heading: docx.HeadingLevel.TITLE,
              alignment: docx.AlignmentType.CENTER,
              spacing: { after: 400 },
              runs: [new docx.Run({
                text: `${appName} - 需求规格说明书`,
                bold: true,
                size: 36,
              })],
            }),
            
            // 元信息
            new docx.Paragraph({
              text: `生成时间：${new Date().toLocaleString('zh-CN')} | 版本号：v1.0`,
              alignment: docx.AlignmentType.CENTER,
              spacing: { before: 200, after: 400 },
              italic: true,
            }),
            
            // 分隔线（用空白行代替）
            new docx.Paragraph({ text: '', spacing: { after: 600 } }),
            
            // 内容
            ...children,
            
            // 底部脚注
            new docx.Paragraph({
              text: '',
              spacing: { before: 800 },
            }),
            new docx.Paragraph({
              text: '本需求文档由 AI Requirements Builder v1.0 自动生成',
              alignment: docx.AlignmentType.CENTER,
              spacing: { after: 200 },
              italics: true,
              textColor: '666666',
            }),
          ],
        }],
      })
      
      // 生成文件
      const blob = await docx.Packer.toBlob(doc)
      saveAs(blob, `${appName}_需求说明书_${new Date().toISOString().split('T')[0]}.docx`)
      message.success('Word 文档导出成功！(已美化排版)')
    } catch (error) {
      console.error('Word 导出失败:', error)
      message.error('导出失败，请重试')
    }
  }

  return (
    <Layout className="docs-layout">
      <Header style={{ background: '#fff', padding: '12px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Space>
          <Button onClick={() => navigate('/workbench')} icon={<ArrowLeftOutlined />}>返回收集</Button>
          <Title level={5} style={{ margin: 0 }}>需求规格说明书</Title>
        </Space>
        <Space>
          <Button onClick={() => navigate('/settings')} icon={<SettingOutlined />}>设置</Button>
          <Divider type="vertical" />
          <Button type="primary" onClick={handleExportWord} icon={<DownloadOutlined />} title="带排版的 Word 文档">.docx</Button>
          <Button type="default" onClick={handleExportMarkdown} icon={<DownloadOutlined />}>.md</Button>
          <Button type="default" onClick={handleExportTxt} icon={<DownloadOutlined />}>.txt</Button>
        </Space>
      </Header>

      <Content style={{ padding: '24px', background: '#fafafa' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Card bordered={false}>
            <Space style={{ marginBottom: '16px' }} size="small">
              <CheckCircleOutlined style={{ color: '#52c41a' }} />
              <Text type="secondary">文档已生成，可下载或继续编辑</Text>
            </Space>
            <Divider />
            
            <div 
              className="markdown-preview"
              dangerouslySetInnerHTML={{ __html: markdownView }}
            />
          </Card>
        </div>
      </Content>
    </Layout>
  )
}

export default Docs
