import type { AllDepartments } from '../type/all.deparments.ts';

export const DEPARTMENTS = {
    AUTOMOBILES_MOTORCYCLES: 'Automobiles & Motorcycles' as AllDepartments,
    CAR_ELECTRONICS: 'Car Electronics' as AllDepartments,
    MOBILE_PHONE_ACCESSORIES: 'Mobile Phone Accessories' as AllDepartments,
    COMPUTER_OFFICE: 'Computer & Office' as AllDepartments,
    TABLET_ACCESSORIES: 'Tablet Accessories' as AllDepartments,
    CONSUMER_ELECTRONICS: 'Consumer Electronics' as AllDepartments,
    ELECTRONIC_COMPONENTS_SUPPLIES: 'Electronic Components & Supplies' as AllDepartments,
    PHONES_TELECOMMUNICATIONS: 'Phones & Telecommunications' as AllDepartments,
    WATCHES: 'Watches' as AllDepartments,
} as const;

export const DEFAULT_TEST_DEPARTMENT = DEPARTMENTS.ELECTRONIC_COMPONENTS_SUPPLIES;