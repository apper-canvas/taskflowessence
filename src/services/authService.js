// src/services/authService.js

// Get user information from ApperUI
export const getCurrentUser = () => {
  const { ApperUI } = window.ApperSDK;
  return ApperUI.getCurrentUser();
};

// Logout user
export const logout = async () => {
  const { ApperUI } = window.ApperSDK;
  try {
    await ApperUI.logout();
    return { success: true };
  } catch (error) {
    console.error("Logout failed:", error);
    return { success: false, error: error.message || "Logout failed" };
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const { ApperUI } = window.ApperSDK;
  return !!ApperUI.getCurrentUser();
};