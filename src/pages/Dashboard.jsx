import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getIcon } from '../utils/iconUtils'
import Home from './Home'

function Dashboard() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSelector((state) => state.user)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4 text-4xl">⏳</div>
          <p className="text-lg text-surface-600 dark:text-surface-300">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If authenticated, render the Home component which has the task management UI
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Home />
    </motion.div>
  )
}

export default Dashboard