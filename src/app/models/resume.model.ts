export interface Resume {
    // поля, которые отправляем на бэкенд
    job_title: string;
    education: string;
    work_xp: string;
    skills: string;
    
    // поля, которые получаем с бэкенда
    resume_id?: number;
    user_id?: number;
    is_active?: boolean;
  }