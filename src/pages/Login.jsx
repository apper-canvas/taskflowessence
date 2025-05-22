import { useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useContext } from 'react'
import { AuthContext } from '../App'
import { motion } from 'framer-motion'
import { getIcon } from '../utils/iconUtils'

function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectPath = searchParams.get('redirect')
  const { isInitialized } = useContext(AuthContext)
  const { isAuthenticated } = useSelector((state) => state.user)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath || '/dashboard')
    }
  }, [isAuthenticated, navigate, redirectPath])

  useEffect(() => {
    if (isInitialized) {
      // Show login UI in this component
      const { ApperUI } = window.ApperSDK
      ApperUI.showLogin("#authentication")
    }
  }, [isInitialized])

  const LogoIcon = getIcon('list-checks')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-screen items-center justify-center bg-surface-50 dark:bg-surface-900"
    >
      <div className="w-full max-w-md space-y-8 p-6 bg-white dark:bg-surface-800 rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex items-center justify-center">
            <LogoIcon className="h-8 w-8 mr-3 text-primary" />
            <h1 className="text-3xl font-bold text-surface-800 dark:text-white">
              Task<span className="text-primary">Flow</span>
            </h1>
          </div>
          <p className="mt-2 text-surface-600 dark:text-surface-400">Sign in to your account</p>
        </div>
        <div id="authentication" className="min-h-[400px]" />
        <div className="text-center mt-4">
          <p className="text-sm text-surface-600 dark:text-surface-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-primary hover:text-primary-dark">Sign up</Link>
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default Login