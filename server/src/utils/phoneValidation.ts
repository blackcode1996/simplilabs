export const validatePhoneNumber = (phone: string): boolean => {
    const phonePattern = /^\+?\d{6,12}$/;
  
    return phonePattern.test(phone);
  };
  