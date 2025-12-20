/**
 * Format a date to a localized string
 */
export const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Calculate the age of an animal in a human-readable format
 */
export const calculateAge = (dateOfBirth: Date) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  const ageInMonths = (today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44);

  if (ageInMonths < 12) {
    return `${Math.floor(ageInMonths)} months old`;
  } else {
    const years = Math.floor(ageInMonths / 12);
    const months = Math.floor(ageInMonths % 12);
    return `${years} years, ${months} months old`;
  }
};

/**
 * Calculate the age of an animal in years and months format (for table display)
 */
export const calculateAgeShort = (dateOfBirth: Date) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  const ageInMonths = (today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44);

  if (ageInMonths < 12) {
    return `${Math.floor(ageInMonths)} months`;
  } else {
    const years = Math.floor(ageInMonths / 12);
    const months = Math.floor(ageInMonths % 12);
    return `${years}y ${months}m`;
  }
};