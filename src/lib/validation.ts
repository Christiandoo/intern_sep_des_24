export interface ValidationResult {
    isValid: boolean;
    error?: string;
  }
  export const validateAuthForm = (
    //sesuaiin value nanti
    email: string,
    password: string,
    confirmPassword?: string,
    username?: string
  ): ValidationResult => {
    
    email = email.trim();
    password = password.trim();
    
    console.log("Before Validation:", { email, password, confirmPassword, username });
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: "Please enter a valid email address." };
    }
  
    if (password.length < 6) {
      return { isValid: false, error: "Password must be at least 6 characters long." };
    }
  
    if (confirmPassword && password !== confirmPassword) {
      return { isValid: false, error: "Passwords do not match." };
    }
  
    if (username !== undefined && (!username || username.trim().length === 0)) {
      return { isValid: false, error: "Username cannot be empty." };
    }
  
    return { isValid: true };
  };
  