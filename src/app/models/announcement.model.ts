export interface Announcement {
    // поля, которые отправляем на бэкенд
    title: string,
    description: string,
    salary: number,
    date: string,
    time_start: string,
    time_end: string,
    city: string,
    address: string,
    is_urgent: boolean,
    car: boolean,
    xp: string,
    age: string,
    wanted_job: string,

    time_hours?: number,
    job_id: number,
  }