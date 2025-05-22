import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { getIcon } from '../utils/iconUtils'
import MainFeature from '../components/MainFeature'
import { fetchTasks, updateTask, deleteTask } from '../services/taskService'
import { fetchCategories } from '../services/categoryService'
import { setTasksLoading, setTasksSuccess, setTasksError, updateTask as updateTaskAction, deleteTask as deleteTaskAction } from '../store/taskSlice'
import { setCategoriesLoading, setCategoriesSuccess, setCategoriesError, setSelectedCategory } from '../store/categorySlice'
import { useContext } from 'react'
import { AuthContext } from '../App'

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { logout } = useContext(AuthContext);
  
  // Get state from Redux
  const { tasks, loading: tasksLoading, error: tasksError } = useSelector((state) => state.tasks);
  const { categories, loading: categoriesLoading, error: categoriesError, selectedCategory } = useSelector((state) => state.categories);
  const { user } = useSelector((state) => state.user);
  
  // Local state for operations
  const [isTaskUpdating, setIsTaskUpdating] = useState(false);
  const [isTaskDeleting, setIsTaskDeleting] = useState(null);
  
  // Fetch tasks and categories on component mount
  useEffect(() => {
    const loadData = async () => {
      // Fetch categories first
      dispatch(setCategoriesLoading());
      const categoriesResult = await fetchCategories();
      
      if (categoriesResult.success) {
        dispatch(setCategoriesSuccess(categoriesResult.data));
      } else {
        dispatch(setCategoriesError(categoriesResult.error));
        toast.error(categoriesResult.error || 'Failed to load categories');
      }
      
      // Then fetch tasks
      dispatch(setTasksLoading());
      const tasksResult = await fetchTasks(selectedCategory !== 'all' ? selectedCategory : null);
      
      if (tasksResult.success) {
        dispatch(setTasksSuccess(tasksResult.data));
      } else {
        dispatch(setTasksError(tasksResult.error));
        toast.error(tasksResult.error || 'Failed to load tasks');
      }
    };
    
    loadData();
  }, [dispatch]);
  
  // Fetch tasks when selected category changes
  useEffect(() => {
    const loadTasks = async () => {
      dispatch(setTasksLoading());
      const result = await fetchTasks(selectedCategory !== 'all' ? selectedCategory : null);
      
      if (result.success) {
        dispatch(setTasksSuccess(result.data));
      } else {
        dispatch(setTasksError(result.error));
        toast.error(result.error || 'Failed to load tasks');
      }
    };
    
    // Only fetch if we've already loaded categories (to avoid double loading on initial mount)
    if (categories.length > 0) {
      loadTasks();
    }
  }, [selectedCategory, dispatch]);
  
  const handleTaskCreate = (newTask) => {
    // Already handled in MainFeature component
  }
  
  const handleTaskUpdate = async (updatedTask) => {
    setIsTaskUpdating(true);
    
    try {
      const result = await updateTask(updatedTask.Id, updatedTask);
      
      if (result.success) {
        dispatch(updateTaskAction(result.data));
        toast.success('Task updated successfully!');
      } else {
        toast.error(result.error || 'Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsTaskUpdating(false);
    }
  }
  
  const handleTaskDelete = async (taskId) => {
    setIsTaskDeleting(taskId);
    
    try {
      const result = await deleteTask(taskId);
      
      if (result.success) {
        dispatch(deleteTaskAction(taskId));
        toast.success('Task deleted successfully!');
      } else {
        toast.error(result.error || 'Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsTaskDeleting(null);
    }
  }
  
  const handleTaskToggle = async (taskId) => {
    // Find the task
    const taskToToggle = tasks.find(task => task.Id === taskId);
    
    if (!taskToToggle) return;
    
    // Create updated task with toggled status
    const updatedTask = { 
      ...taskToToggle, 
      status: taskToToggle.status === 'completed' ? 'pending' : 'completed',
      isCompleted: taskToToggle.status !== 'completed'
    };
    
    // Call the update function
    await handleTaskUpdate(updatedTask);
  }
  
  const addCategory = (newCategory) => {
    // Already handled in MainFeature component
  }

  const handleCategorySelect = (categoryId) => {
    dispatch(setSelectedCategory(categoryId));
  }

  const filteredTasks = selectedCategory === 'all' 
    ? tasks 
    : tasks.filter(task => task.category === selectedCategory);
  
  // Icon components
  const ClipboardListIcon = getIcon('clipboard-list')
  const PlusIcon = getIcon('plus')
  const LogoIcon = getIcon('list-checks')
  const LogoutIcon = getIcon('log-out')
  
  // If data is loading, show loading state
  if ((categoriesLoading && categories.length === 0) || (tasksLoading && tasks.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4 text-4xl">⏳</div>
          <p className="text-lg text-surface-600 dark:text-surface-300">Loading TaskFlow...</p>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen px-4 py-8 md:py-12 bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800"
          <div className="flex items-center mb-4 sm:mb-0 text-center sm:text-left">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <motion.header 
            </h1>
            
            {user && (
              <div className="ml-4 flex items-center">
                <span className="hidden sm:inline text-sm text-surface-600 dark:text-surface-400 mr-2">
                  {user.emailAddress}
                </span>
                <button onClick={logout} className="text-surface-500 hover:text-red-500 p-1" title="Logout">
                  <LogoutIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-10 flex flex-col items-center sm:flex-row sm:justify-between"
              onClick={() => handleCategorySelect('all')}
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
                key={category.Id}
                onClick={() => handleCategorySelect(category.Id)}
            >
                  selectedCategory === category.Id 
            </button>
            
            {categories.map(category => (
              <button
                  borderLeft: selectedCategory === category.Id ? 'none' : `3px solid ${category.color}`
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                {category.Name}
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
                  categories.find(c => c.Id === selectedCategory)?.Name + ' Tasks'}
                <span className="ml-2 text-sm font-normal text-surface-500">
                  ({filteredTasks.length})
                </span>
                {tasksLoading && (
                <span className="ml-2 inline-block animate-spin text-sm">
                  ⏳
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
                    const CheckIcon = getIcon('check-circle')
                    const UndoIcon = getIcon('rotate-ccw')
                    
                    // Get category color
                    const categoryObj = categories.find(c => c.Id === task.category)
                    const categoryColor = categoryObj?.color || '#64748b'
                    
                    // Priority classes
                    const priorityClasses = {
                      high: 'task-item-high',
                      medium: 'task-item-medium',
                      low: 'task-item-low'
                    }
                    
                    return (
                      <motion.div
                        key={task.Id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.3 }}
                        className={`task-item ${priorityClasses[task.priority] || ''} ${task.status === 'completed' ? 'task-item-completed' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => handleTaskToggle(task.Id)}
                            disabled={isTaskUpdating}
                            className={`mt-1 rounded-full flex-shrink-0 p-1 transition-colors ${
                              task.status === 'completed' 
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                : 'bg-surface-200 dark:bg-surface-700 text-surface-500 dark:text-surface-400 hover:bg-primary/20 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary-light'
                            } ${isTaskUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                            aria-label={task.status === 'completed' ? 'Mark as incomplete' : 'Mark as complete'}
                          >
                            {isTaskUpdating ? (
                              <span className="inline-block animate-spin">⏳</span>
                            ) : task.status === 'completed' ? (
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
                                  onClick={() => handleTaskDelete(task.Id)}
                                  disabled={isTaskDeleting === task.Id}
                                  className={`p-1.5 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors ${
                                    isTaskDeleting === task.Id ? 'opacity-50 cursor-not-allowed' : ''
                                  }`}
                                  aria-label="Delete task"
                                >
                                  {isTaskDeleting === task.Id ? (
                                    <span className="inline-block animate-spin">⏳</span>
                                  ) : (
                                    <DeleteIcon className="h-4 w-4" />
                                  )}
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
                                  {categoryObj.Name}
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
                  
                  {tasksLoading && filteredTasks.length > 0 && (
                    <div className="py-4 text-center">
                      <div className="inline-block animate-spin mr-2">⏳</div>
                      <span className="text-surface-500 dark:text-surface-400">Loading tasks...</span>
                    </div>
                  )}
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