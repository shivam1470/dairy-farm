import { AnimalStatus, AnimalCategory } from '@dairy-farm/types';

/**
 * Get the appropriate color for animal status chips
 */
export const getStatusColor = (status: AnimalStatus) => {
  switch (status) {
    case AnimalStatus.ACTIVE:
      return 'success';
    case AnimalStatus.PREGNANT:
      return 'info';
    case AnimalStatus.SICK:
      return 'error';
    case AnimalStatus.SOLD:
      return 'warning';
    case AnimalStatus.DECEASED:
      return 'default';
    default:
      return 'default';
  }
};

/**
 * Get the appropriate color for animal category chips
 */
export const getCategoryColor = (category: AnimalCategory) => {
  switch (category) {
    case AnimalCategory.CALF:
      return 'primary';
    case AnimalCategory.HEIFER:
      return 'secondary';
    case AnimalCategory.COW:
      return 'success';
    case AnimalCategory.BULL:
      return 'warning';
    default:
      return 'default';
  }
};