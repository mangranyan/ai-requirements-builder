import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ConfigProvider, theme, Spin, message as antdMessage } from 'antd'
import { WarningOutlined } from '@ant-design/icons'
import Login from './pages/Login'
import Workbench from './pages/Workbench'
import Docs from './pages/Docs'
import Settings from './pages/Settings'

// 全局消息对象
antdMessage.config({
  duration: 2,
  maxCount: 1,
})

// 路由守卫组件
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  
  if (!isLoggedIn) {
    antdMessage.warning('请先登录后再使用')
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

// Loading 组件
const LoadingScreen = () => (
  <div style={{ 
    height: '100vh', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }}>
    <div style={{ textAlign: 'center' }}>
      <Spin size="large" tip="正在启动 AI Requirements Builder..." />
      <p style={{ marginTop: '20px', color: '#fff', fontSize: '14px' }}>请稍候...</p>
    </div>
  </div>
)

const App = () => {
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()

  // 首次检查登录状态
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
      
      // 自动跳转到工作区（如果已登录）
      if (localStorage.getItem('isLoggedIn') === 'true' && location.pathname === '/') {
        navigate('/workbench', { replace: true })
      }
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [location.pathname, navigate])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff', // 飞书蓝
          borderRadius: 6,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
        },
        components: {
          Button: {
            boxShadow: undefined,
          },
        },
      }}
    >
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/workbench" replace />} />
        <Route 
          path="/workbench" 
          element={
            <RequireAuth>
              <Workbench />
            </RequireAuth>
          } 
        />
        <Route 
          path="/docs" 
          element={
            <RequireAuth>
              <Docs />
            </RequireAuth>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <RequireAuth>
              <Settings />
            </RequireAuth>
          } 
        />
      </Routes>
    </ConfigProvider>
  )
}

export default App
