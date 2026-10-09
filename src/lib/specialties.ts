export const SPECIALTIES = [
  'Cardiology',
  'Dermatology',
  'Pediatrics',
  'Orthopedics',
  'Neurology',
  'Psychiatry',
  'Gynecology',
  'Dentistry',
  'ENT',
  'Ophthalmology',
  'Urology',
  'General Medicine',
];

export function canonicalSpecialty(input: string): string {
  const trimmed = input.trim();
  const match = SPECIALTIES.find(
    item => item.toLowerCase() === trimmed.toLowerCase(),
  );
  return match ?? trimmed;
}
