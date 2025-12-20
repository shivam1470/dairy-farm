import { CreateAnimalDto } from '@dairy-farm/types';
import { AnimalGender, AnimalType, LifeStage, AnimalStatus, AnimalAcquisitionType } from '@dairy-farm/types';

/**
 * Default values for creating a new animal
 */
export const defaultAnimalValues: CreateAnimalDto = {
  tagNumber: '',
  name: '',
  breed: '',
  dateOfBirth: new Date(),
  timeOfBirth: undefined,
  gender: AnimalGender.FEMALE,
  type: AnimalType.COW,
  lifeStage: LifeStage.CALF,
  status: AnimalStatus.ACTIVE,
  acquisitionType: AnimalAcquisitionType.BORN,
  farmId: '',
  purchaseDate: undefined,
  purchasePrice: undefined,
  purchaseFromName: '',
  purchaseFromMobile: '',
  purchaseFromEmail: '',
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
  typeFilter: 'ALL' as AnimalType | 'ALL',
  lifeStageFilter: 'ALL' as LifeStage | 'ALL',
};

/**
 * Dropdown options for animal gender
 */
export const genderOptions = [
  { value: AnimalGender.MALE, label: 'Male' },
  { value: AnimalGender.FEMALE, label: 'Female' },
];

/**
 * Dropdown options for animal type
 */
export const typeOptions = [
  { value: AnimalType.COW, label: 'Cow' },
  { value: AnimalType.BUFFALO, label: 'Buffalo' },
];

/**
 * Dropdown options for animal life stage
 */
export const lifeStageOptions = [
  { value: LifeStage.CALF, label: 'Calf' },
  { value: LifeStage.HEIFER, label: 'Heifer' },
  { value: LifeStage.ADULT, label: 'Adult' },
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
 * Filter options for type (includes "All" option)
 */
export const typeFilterOptions = [
  { value: 'ALL', label: 'All Types' },
  ...typeOptions,
];

/**
 * Filter options for life stage (includes "All" option)
 */
export const lifeStageFilterOptions = [
  { value: 'ALL', label: 'All Life Stages' },
  ...lifeStageOptions,
];

/**
 * Dropdown options for animal acquisition type
 */
export const acquisitionTypeOptions = [
  { value: AnimalAcquisitionType.BORN, label: 'Born on Farm' },
  { value: AnimalAcquisitionType.PURCHASED, label: 'Purchased' },
];