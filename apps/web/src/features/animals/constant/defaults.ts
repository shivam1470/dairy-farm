import { CreateAnimalDto } from '@dairy-farm/types';
import { AnimalGender, AnimalCategory, AnimalStatus } from '@dairy-farm/types';

/**
 * Default values for creating a new animal
 */
export const defaultAnimalValues: CreateAnimalDto = {
  tagNumber: '',
  name: '',
  breed: '',
  dateOfBirth: new Date(),
  gender: AnimalGender.FEMALE,
  category: AnimalCategory.CALF,
  status: AnimalStatus.ACTIVE,
  farmId: '',
  purchaseDate: undefined,
  purchasePrice: undefined,
};

/**
 * Default pagination settings for animals list
 */
export const defaultPagination = {
  page: 0,
  rowsPerPage: 10,
};

/**
 * Default filter values for animals list
 */
export const defaultFilters = {
  searchTerm: '',
  statusFilter: 'ALL' as AnimalStatus | 'ALL',
  categoryFilter: 'ALL' as AnimalCategory | 'ALL',
};

/**
 * Dropdown options for animal gender
 */
export const genderOptions = [
  { value: AnimalGender.MALE, label: 'Male' },
  { value: AnimalGender.FEMALE, label: 'Female' },
];

/**
 * Dropdown options for animal category
 */
export const categoryOptions = [
  { value: AnimalCategory.CALF, label: 'Calf' },
  { value: AnimalCategory.HEIFER, label: 'Heifer' },
  { value: AnimalCategory.COW, label: 'Cow' },
  { value: AnimalCategory.BULL, label: 'Bull' },
];

/**
 * Dropdown options for animal status
 */
export const statusOptions = [
  { value: AnimalStatus.ACTIVE, label: 'Active' },
  { value: AnimalStatus.PREGNANT, label: 'Pregnant' },
  { value: AnimalStatus.SICK, label: 'Sick' },
  { value: AnimalStatus.SOLD, label: 'Sold' },
  { value: AnimalStatus.DECEASED, label: 'Deceased' },
];

/**
 * Filter options for status (includes "All" option)
 */
export const statusFilterOptions = [
  { value: 'ALL', label: 'All Status' },
  ...statusOptions,
];

/**
 * Filter options for category (includes "All" option)
 */
export const categoryFilterOptions = [
  { value: 'ALL', label: 'All Categories' },
  ...categoryOptions,
];