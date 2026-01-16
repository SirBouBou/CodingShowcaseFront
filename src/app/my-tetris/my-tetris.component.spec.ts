import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTetrisComponent } from './my-tetris.component';

describe('MyTetrisComponent', () => {
  let component: MyTetrisComponent;
  let fixture: ComponentFixture<MyTetrisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MyTetrisComponent]
})
    .compileComponents();
    
    fixture = TestBed.createComponent(MyTetrisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
