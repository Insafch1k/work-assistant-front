import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizationComponent } from './components/authorization/authorization.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ResumeComponent } from './components/resume/resume.component';
import { VacanciesComponent } from './components/vacancies/vacancies.component';
import { VacancyDetailsComponent } from './components/vacancy-details/vacancy-details.component';
import { FilterVacanciesComponent } from './components/filter-vacancies/filter-vacancies.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { ViewHistoryComponent } from './components/view-history/view-history.component';
import { AnnouncementsComponent } from './components/announcements/announcements.component';
import { NewAnnouncementComponent } from './components/new-announcement/new-announcement.component';
import { EditingAnnouncementComponent } from './components/editing-announcement/editing-announcement.component';
import { EditingResumeComponent } from './components/editing-resume/editing-resume.component';

const routes: Routes = [
  { path: '', redirectTo: '/authorization', pathMatch: 'full' },
  { path: 'authorization', component: AuthorizationComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'resume', component: ResumeComponent },
  { path: 'vacancies', component: VacanciesComponent },
  { path: 'jobs/:id/seeall', component: VacancyDetailsComponent },
  { path: 'filter-vacancies', component: FilterVacanciesComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'view-history', component: ViewHistoryComponent },
  { path: 'announcements', component: AnnouncementsComponent },
  { path: 'new-announcement', component: NewAnnouncementComponent },
  { path: 'resume', component: ResumeComponent },
  { path: 'editing-resume', component: EditingResumeComponent },
  { path: 'editing-announcement', component: EditingAnnouncementComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
