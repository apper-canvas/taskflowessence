// src/services/categoryService.js

// Fetch all categories
export const fetchCategories = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: ["Id", "Name", "color"]
    };

    const response = await apperClient.fetchRecords("category", params);
    
    if (!response || !response.data) {
      return { 
        success: false, 
        error: "No data returned from server"
      };
    }
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { 
      success: false, 
      error: error.message || "Failed to fetch categories"
    };
  }
};

// Get a single category by ID
export const getCategoryById = async (categoryId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: ["Id", "Name", "color"]
    };

    const response = await apperClient.getRecordById("category", categoryId, params);
    
    if (!response || !response.data) {
      return { 
        success: false, 
        error: "Category not found"
      };
    }
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Error fetching category with ID ${categoryId}:`, error);
    return { 
      success: false, 
      error: error.message || "Failed to fetch category"
    };
  }
};

// Create a new category
export const createCategory = async (categoryData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Only include updateable fields
    const params = {
      records: [{
        Name: categoryData.name,
        color: categoryData.color
      }]
    };

    const response = await apperClient.createRecord("category", params);
    
    if (!response || !response.success) {
      return { 
        success: false, 
        error: response?.message || "Failed to create category"
      };
    }
    
    return { 
      success: true, 
      data: response.results[0].data
    };
  } catch (error) {
    console.error("Error creating category:", error);
    return { 
      success: false, 
      error: error.message || "Failed to create category"
    };
  }
};

// Delete a category
export const deleteCategory = async (categoryId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      RecordIds: [categoryId]
    };

    const response = await apperClient.deleteRecord("category", params);
    
    if (!response || !response.success) {
      return { 
        success: false, 
        error: response?.message || "Failed to delete category"
      };
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting category with ID ${categoryId}:`, error);
    return { 
      success: false, 
      error: error.message || "Failed to delete category"
    };
  }
};