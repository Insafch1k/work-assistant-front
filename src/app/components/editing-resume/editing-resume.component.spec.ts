import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditingResumeComponent } from './editing-resume.component';

describe('EditingResumeComponent', () => {
  let component: EditingResumeComponent;
  let fixture: ComponentFixture<EditingResumeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditingResumeComponent]
    });
    fixture = TestBed.createComponent(EditingResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
