import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { getIcon } from '../utils/iconUtils'

function MainFeature({ onTaskCreate, categories, onAddCategory }) {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    dueDate: '',
    category: '',
    priority: 'medium',
    status: 'pending',
    isCompleted: false
  })
  
  const [errors, setErrors] = useState({})
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: '', color: '#3b82f6' })
  
  const handleTaskChange = (e) => {
    const { name, value } = e.target
    setTaskData(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!taskData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    if (!taskData.category) {
      newErrors.category = 'Please select a category'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      onTaskCreate(taskData)
      // Reset form
      setTaskData({
        title: '',
        description: '',
        dueDate: '',
        category: '',
        priority: 'medium',
        status: 'pending',
        isCompleted: false
      })
    } else {
      toast.error('Please fill in all required fields')
    }
  }
  
  const handleCategorySubmit = (e) => {
    e.preventDefault()
    
    if (!newCategory.name.trim()) {
      toast.error('Category name is required')
      return
    }
    
    onAddCategory(newCategory)
    setNewCategory({ name: '', color: '#3b82f6' })
    setShowCategoryForm(false)
  }
  
  // Icon components
  const CalendarIcon = getIcon('calendar')
  const TagIcon = getIcon('tag')
  const PlusIcon = getIcon('plus')
  const XIcon = getIcon('x')
  const FlagIcon = getIcon('flag')
  const SaveIcon = getIcon('save')
  const PaletteIcon = getIcon('palette')
  
  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1 text-sm font-medium text-surface-700 dark:text-surface-300">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={taskData.title}
            onChange={handleTaskChange}
            placeholder="What needs to be done?"
            className={`${errors.title ? 'border-red-500 dark:border-red-500' : ''}`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="description" className="block mb-1 text-sm font-medium text-surface-700 dark:text-surface-300">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="3"
            value={taskData.description}
            onChange={handleTaskChange}
            placeholder="Add some details about this task..."
            className="resize-none"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dueDate" className="block mb-1 text-sm font-medium text-surface-700 dark:text-surface-300 flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1 text-primary" />
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={taskData.dueDate}
              onChange={handleTaskChange}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div>
            <label htmlFor="priority" className="block mb-1 text-sm font-medium text-surface-700 dark:text-surface-300 flex items-center">
              <FlagIcon className="h-4 w-4 mr-1 text-primary" />
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={taskData.priority}
              onChange={handleTaskChange}
              className="bg-white dark:bg-surface-800"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="category" className="block text-sm font-medium text-surface-700 dark:text-surface-300 flex items-center">
              <TagIcon className="h-4 w-4 mr-1 text-primary" />
              Category <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setShowCategoryForm(true)}
              className="text-xs text-primary hover:text-primary-dark dark:hover:text-primary-light"
            >
              + Add Category
            </button>
          </div>
          <select
            id="category"
            name="category"
            value={taskData.category}
            onChange={handleTaskChange}
            className={`${errors.category ? 'border-red-500 dark:border-red-500' : ''}`}
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-500">{errors.category}</p>
          )}
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full button-primary flex items-center justify-center"
        >
          <SaveIcon className="h-5 w-5 mr-2" />
          Create Task
        </motion.button>
      </form>
      
      {/* Add Category Modal */}
      <AnimatePresence>
        {showCategoryForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-xl p-5 w-full max-w-md shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-surface-800 dark:text-white">Add New Category</h3>
                <button
                  onClick={() => setShowCategoryForm(false)}
                  className="p-1 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-500"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div>
                  <label htmlFor="categoryName" className="block mb-1 text-sm font-medium text-surface-700 dark:text-surface-300">
                    Category Name
                  </label>
                  <input
                    type="text"
                    id="categoryName"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="e.g., Work, Home, Study"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="categoryColor" className="block mb-1 text-sm font-medium text-surface-700 dark:text-surface-300 flex items-center">
                    <PaletteIcon className="h-4 w-4 mr-1 text-primary" />
                    Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      id="categoryColor"
                      value={newCategory.color}
                      onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                      className="p-0 w-10 h-10 rounded cursor-pointer"
                    />
                    <div 
                      className="h-10 flex-1 rounded-lg border border-surface-300 dark:border-surface-600"
                      style={{ backgroundColor: newCategory.color }}
                    />
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCategoryForm(false)}
                    className="flex-1 button-secondary"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 button-primary flex items-center justify-center"
                  >
                    <PlusIcon className="h-5 w-5 mr-1" />
                    Add Category
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature