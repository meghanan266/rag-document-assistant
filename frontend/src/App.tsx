import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { PublicRoute } from '@/components/PublicRoute'
import { Login } from '@/pages/Login'
import { SignUp } from '@/pages/SignUp'

function ChatPlaceholder() {
  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
      Chat UI coming soon…
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />
        <Route path="/" element={<Navigate to="/chats" replace />} />
        <Route
          path="/chats/*"
          element={
            <ProtectedRoute>
              <ChatPlaceholder />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/chats" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
