export interface Vacancy {
  job_id: number;
  employer_id: number;
  title: string;
  salary: number;
  address: string;
  rating: string; 
  is_urgent: boolean;
  isFavorite: boolean;
  created_at: string;
  time_hours: number;
  photo: string | null;
  phone: string;
  tg_username: string;
  car?: boolean | string | null;
}
