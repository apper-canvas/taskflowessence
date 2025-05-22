// src/services/taskService.js

// Get all tasks with optional filtering
export const fetchTasks = async (categoryId = null) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Define the fields to fetch
    const params = {
      fields: [
        "Id", "Name", "title", "description", "dueDate", "priority", 
        "status", "isCompleted", "category", "createdAt", "updatedAt"
      ],
      orderBy: [{ fieldName: "createdAt", SortType: "DESC" }]
    };

    // Add category filter if specified
    if (categoryId && categoryId !== 'all') {
      params.where = [
        {
          fieldName: "category",
          operator: "ExactMatch",
          values: [categoryId]
        }
      ];
    }

    const response = await apperClient.fetchRecords("task", params);
    
    if (!response || !response.data) {
      return { success: false, error: "No data returned from server" };
    }
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return { 
      success: false, 
      error: error.message || "Failed to fetch tasks" 
    };
  }
};

// Get a single task by ID
export const getTaskById = async (taskId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        "Id", "Name", "title", "description", "dueDate", "priority", 
        "status", "isCompleted", "category", "createdAt", "updatedAt"
      ]
    };

    const response = await apperClient.getRecordById("task", taskId, params);
    
    if (!response || !response.data) {
      return { success: false, error: "Task not found" };
    }
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Error fetching task with ID ${taskId}:`, error);
    return { 
      success: false, 
      error: error.message || "Failed to fetch task" 
    };
  }
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Only include updateable fields
    const params = {
      records: [{
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate,
        priority: taskData.priority,
        status: taskData.status,
        isCompleted: taskData.isCompleted,
        category: taskData.category
      }]
    };

    const response = await apperClient.createRecord("task", params);
    
    if (!response || !response.success) {
      return { 
        success: false, 
        error: response?.message || "Failed to create task" 
      };
    }
    
    return { success: true, data: response.results[0].data };
  } catch (error) {
    console.error("Error creating task:", error);
    return { 
      success: false, 
      error: error.message || "Failed to create task" 
    };
  }
};

// Update a task
export const updateTask = async (taskId, taskData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Only include updateable fields plus ID
    const params = {
      records: [{
        Id: taskId,
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate,
        priority: taskData.priority,
        status: taskData.status,
        isCompleted: taskData.isCompleted,
        category: taskData.category
      }]
    };

    const response = await apperClient.updateRecord("task", params);
    
    if (!response || !response.success) {
      return { 
        success: false, 
        error: response?.message || "Failed to update task" 
      };
    }
    
    return { success: true, data: response.results[0].data };
  } catch (error) {
    console.error(`Error updating task with ID ${taskId}:`, error);
    return { 
      success: false, 
      error: error.message || "Failed to update task" 
    };
  }
};

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      RecordIds: [taskId]
    };

    const response = await apperClient.deleteRecord("task", params);
    
    if (!response || !response.success) {
      return { 
        success: false, 
        error: response?.message || "Failed to delete task" 
      };
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting task with ID ${taskId}:`, error);
    return { 
      success: false, 
      error: error.message || "Failed to delete task" 
    };
  }
};