import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeliculaFormPage } from './pelicula-form.page';

describe('PeliculaFormPage', () => {
  let component: PeliculaFormPage;
  let fixture: ComponentFixture<PeliculaFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PeliculaFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
