import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { getIcon } from '../utils/iconUtils'
import MainFeature from '../components/MainFeature'

function Home() {
  const [categories, setCategories] = useState(() => {
    const savedCategories = localStorage.getItem('taskflow-categories')
    return savedCategories ? JSON.parse(savedCategories) : [
      { id: '1', name: 'Work', color: '#3b82f6' },
      { id: '2', name: 'Personal', color: '#8b5cf6' },
      { id: '3', name: 'Shopping', color: '#f97316' },
      { id: '4', name: 'Health', color: '#10b981' }
    ]
  })
  
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('taskflow-tasks')
    return savedTasks ? JSON.parse(savedTasks) : []
  })
  
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  // Save tasks and categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('taskflow-tasks', JSON.stringify(tasks))
  }, [tasks])
  
  useEffect(() => {
    localStorage.setItem('taskflow-categories', JSON.stringify(categories))
  }, [categories])
  
  const handleTaskCreate = (newTask) => {
    const taskWithId = {
      ...newTask,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    setTasks(prevTasks => [taskWithId, ...prevTasks])
    toast.success('Task created successfully!')
  }
  
  const handleTaskUpdate = (updatedTask) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === updatedTask.id ? 
          { ...updatedTask, updatedAt: new Date().toISOString() } : 
          task
      )
    )
    toast.success('Task updated successfully!')
  }
  
  const handleTaskDelete = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
    toast.success('Task deleted successfully!')
  }
  
  const handleTaskToggle = (taskId) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? 
          { 
            ...task, 
            status: task.status === 'completed' ? 'pending' : 'completed',
            isCompleted: task.status !== 'completed',
            updatedAt: new Date().toISOString() 
          } : 
          task
      )
    )
  }
  
  const addCategory = (newCategory) => {
    const categoryWithId = {
      ...newCategory,
      id: crypto.randomUUID()
    }
    setCategories(prev => [...prev, categoryWithId])
    toast.success('Category added!')
  }

  const filteredTasks = selectedCategory === 'all' 
    ? tasks 
    : tasks.filter(task => task.category === selectedCategory)
  
  // Icon components
  const ClipboardListIcon = getIcon('clipboard-list')
  const PlusIcon = getIcon('plus')
  const LogoIcon = getIcon('list-checks')
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen px-4 py-8 md:py-12 bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800"
    >
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-10 flex flex-col items-center sm:flex-row sm:justify-between"
        >
          <div className="flex items-center mb-4 sm:mb-0">
            <LogoIcon className="h-8 w-8 mr-3 text-primary" />
            <h1 className="text-3xl font-bold text-surface-800 dark:text-white">
              Task<span className="text-primary">Flow</span>
            </h1>
          </div>
          
          <div className="flex flex-wrap justify-center sm:justify-end gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === 'all' 
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
              }`}
            >
              All Tasks
            </button>
            
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category.id 
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
                }`}
                style={{
                  borderLeft: selectedCategory === category.id ? 'none' : `3px solid ${category.color}`
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </motion.header>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Task Input Section */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="card mb-6 bg-white dark:bg-surface-800 overflow-hidden">
              <h2 className="text-xl font-semibold mb-4 text-surface-800 dark:text-white flex items-center">
                <PlusIcon className="h-5 w-5 mr-2 text-primary" />
                Add New Task
              </h2>
              
              <MainFeature 
                onTaskCreate={handleTaskCreate} 
                categories={categories}
                onAddCategory={addCategory}
              />
            </div>
          </motion.div>
          
          {/* Task List Section */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="card bg-white dark:bg-surface-800">
              <h2 className="text-xl font-semibold mb-4 text-surface-800 dark:text-white flex items-center">
                <ClipboardListIcon className="h-5 w-5 mr-2 text-primary" />
                {selectedCategory === 'all' ? 'All Tasks' : 
                  categories.find(c => c.id === selectedCategory)?.name + ' Tasks'}
                <span className="ml-2 text-sm font-normal text-surface-500">
                  ({filteredTasks.length})
                </span>
              </h2>
              
              {filteredTasks.length === 0 ? (
                <div className="py-10 flex flex-col items-center justify-center text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-20 h-20 mb-4 flex items-center justify-center rounded-full bg-surface-100 dark:bg-surface-700"
                  >
                    <ClipboardListIcon className="h-10 w-10 text-surface-400" />
                  </motion.div>
                  <p className="text-surface-600 dark:text-surface-400">
                    No tasks found. Create a new task to get started!
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
                  {filteredTasks.map((task, index) => {
                    // Get appropriate icons
                    const DeleteIcon = getIcon('trash-2')
                    const EditIcon = getIcon('edit-3')
                    const CheckIcon = getIcon('check-circle')
                    const UndoIcon = getIcon('rotate-ccw')
                    
                    // Get category color
                    const categoryObj = categories.find(c => c.id === task.category)
                    const categoryColor = categoryObj?.color || '#64748b'
                    
                    // Priority classes
                    const priorityClasses = {
                      high: 'task-item-high',
                      medium: 'task-item-medium',
                      low: 'task-item-low'
                    }
                    
                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.3 }}
                        className={`task-item ${priorityClasses[task.priority] || ''} ${task.status === 'completed' ? 'task-item-completed' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => handleTaskToggle(task.id)}
                            className={`mt-1 rounded-full flex-shrink-0 p-1 transition-colors ${
                              task.status === 'completed' 
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                : 'bg-surface-200 dark:bg-surface-700 text-surface-500 dark:text-surface-400 hover:bg-primary/20 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary-light'
                            }`}
                            aria-label={task.status === 'completed' ? 'Mark as incomplete' : 'Mark as complete'}
                          >
                            {task.status === 'completed' ? (
                              <CheckIcon className="h-5 w-5" />
                            ) : (
                              <UndoIcon className="h-5 w-5" />
                            )}
                          </button>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <h3 className={`font-medium text-lg ${
                                task.status === 'completed' 
                                  ? 'text-surface-500 dark:text-surface-400 line-through' 
                                  : 'text-surface-800 dark:text-white'
                              }`}>
                                {task.title}
                              </h3>
                              
                              <div className="flex space-x-2 ml-2">
                                <button
                                  onClick={() => handleTaskDelete(task.id)}
                                  className="p-1.5 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                  aria-label="Delete task"
                                >
                                  <DeleteIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            
                            <p className={`mt-1 text-sm ${
                              task.status === 'completed' 
                                ? 'text-surface-500 dark:text-surface-500' 
                                : 'text-surface-600 dark:text-surface-300'
                            }`}>
                              {task.description}
                            </p>
                            
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              {task.dueDate && (
                                <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full ${
                                  task.status === 'completed'
                                    ? 'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400'
                                    : 'bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300'
                                }`}>
                                  {new Date(task.dueDate).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </span>
                              )}
                              
                              {categoryObj && (
                                <span 
                                  className="inline-flex items-center text-xs px-2.5 py-1 rounded-full"
                                  style={{ 
                                    backgroundColor: task.status === 'completed' 
                                      ? '#e2e8f0' 
                                      : `${categoryColor}20`,
                                    color: task.status === 'completed'
                                      ? '#64748b'
                                      : categoryColor,
                                    borderLeft: `2px solid ${categoryColor}`
                                  }}
                                >
                                  {categoryObj.name}
                                </span>
                              )}
                              
                              <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full ${
                                task.status === 'completed'
                                  ? 'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400'
                                  : `bg-${task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'yellow' : 'green'}-100 
                                     dark:bg-${task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'yellow' : 'green'}-900/30 
                                     text-${task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'yellow' : 'green'}-600 
                                     dark:text-${task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'yellow' : 'green'}-400`
                              }`}>
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default Home