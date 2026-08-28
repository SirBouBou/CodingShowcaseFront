import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameDBComponent } from './game-db.component';

describe('GameDBComponent', () => {
  let component: GameDBComponent;
  let fixture: ComponentFixture<GameDBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameDBComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameDBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
