import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthorizationComponent } from './components/authorization/authorization.component';
import { ProfileComponent } from './components/profile/profile.component';
import { VacanciesComponent } from './components/vacancies/vacancies.component';
import { FinderNavigationComponent } from './components/navigation/finder-navigation/finder-navigation.component';
import { EmployerNavigationComponent } from './components/navigation/employer-navigation/employer-navigation.component';
import { VacancyDetailsComponent } from './components/vacancy-details/vacancy-details.component';
import { FilterVacanciesComponent } from './components/filter-vacancies/filter-vacancies.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { DurationPipe } from './pipes/duration.pipe';
import { ViewHistoryComponent } from './components/view-history/view-history.component';
import { AnnouncementsComponent } from './components/announcements/announcements.component';
import { NewAnnouncementComponent } from './components/new-announcement/new-announcement.component';
import { ResumeComponent } from './components/resume/resume.component';
import { EditingAnnouncementComponent } from './components/editing-announcement/editing-announcement.component';
import { EditingResumeComponent } from './components/editing-resume/editing-resume.component';
import { RewiewComponent } from './components/rewiew/rewiew.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { ModalComponent } from './components/modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthorizationComponent,
    ProfileComponent,
    VacanciesComponent,
    FinderNavigationComponent,
    EmployerNavigationComponent,
    VacancyDetailsComponent,
    FilterVacanciesComponent,
    FavoritesComponent,
    DurationPipe,
    ViewHistoryComponent,
    AnnouncementsComponent,
    NewAnnouncementComponent,
    ResumeComponent,
    EditingAnnouncementComponent,
    EditingResumeComponent,
    RewiewComponent,
    AdminPanelComponent,
    ModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }