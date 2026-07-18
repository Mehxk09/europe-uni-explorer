export interface DeadlineEntry {
  intake: string;
  deadline: string;
  note?: string;
}

export interface CountryStudentInfo {
  admissionRequirements: string;
  visaWorkRights: string;
  housingNotes: string;
  housingPortalUrl?: string;
  deadlines: DeadlineEntry[];
}
