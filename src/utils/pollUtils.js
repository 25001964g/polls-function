// Utility functions for poll codes
export const generatePollCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

export const formatPollCode = (code) => {
  // Format code as XXX-XXX for better readability
  return code.slice(0, 3) + '-' + code.slice(3);
};