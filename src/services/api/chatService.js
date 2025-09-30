/**
 * Chat Service - Handles AI chatbot interactions via Edge function
 */

export const sendMessage = async (message, conversationHistory = []) => {
  try {
    const { ApperClient } = window.ApperSDK;
    
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const result = await apperClient.functions.invoke(
      import.meta.env.VITE_AI_CHATBOT,
      {
        body: JSON.stringify({
          message,
          conversationHistory
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Check for direct response errors
    if (!result.success) {
      console.info(`apper_info: An error was received in this function: ${import.meta.env.VITE_AI_CHATBOT}. The response body is: ${JSON.stringify(result)}.`);
      return { success: false, error: result.error || 'Failed to get AI response' };
    }

    return { success: true, data: result.data };

  } catch (error) {
    console.info(`apper_info: An error was received in this function: ${import.meta.env.VITE_AI_CHATBOT}. The error is: ${error.message}`);
    return { success: false, error: error.message || 'Failed to send message' };
  }
};