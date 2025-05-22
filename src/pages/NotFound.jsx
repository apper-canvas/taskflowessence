import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getIcon } from '../utils/iconUtils'

function NotFound() {
  const AlertTriangleIcon = getIcon('alert-triangle')
  const HomeIcon = getIcon('home')
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800"
    >
      <div className="text-center max-w-xl">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-auto w-24 h-24 mb-6 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center"
        >
          <AlertTriangleIcon className="h-12 w-12 text-orange-500" />
        </motion.div>
        
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold mb-2 text-surface-800 dark:text-white"
        >
          404
        </motion.h1>
        
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-semibold mb-4 text-surface-700 dark:text-surface-200"
        >
          Page Not Found
        </motion.h2>
        
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8 text-surface-600 dark:text-surface-300"
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link 
            to="/"
            className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default NotFound