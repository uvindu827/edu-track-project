
export interface Teacher {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  subjectSpecialization: string;
  extraSubjects: string[]; // Up to 3 extra subjects
  gradeLevels: number[];   // Multiple grade levels
  section: string;         // New section field (e.g., "Primary", "A", "Morning")
  schoolName: string;      // Name of the school
  schoolArea: string;      // Area/Location of the school
  hireDate: string;
  address: string;
  notes: string;
  photoUrl?: string;
  createdAt: number;
}

export type GradeLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export const SUBJECTS = [
  "N/A",
  "Mathematics",
  "Science",
  "English Literature",
  "History",
  "Geography",
  "Physical Education",
  "Arts",
  "Computer Science",
  "Music",
  "Physics",
  "Chemistry",
  "Biology",
  "Foreign Languages"
];

export const GRADES: GradeLevel[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
