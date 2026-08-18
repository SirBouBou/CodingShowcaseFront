import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { StorageService } from '../_services/storage.service';
import { AuthService } from '../_services/auth.service';
import { EventBusService } from '../_shared/event-bus.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let storageService: jasmine.SpyObj<StorageService>;
  let authService: jasmine.SpyObj<AuthService>;
  let eventBusService: jasmine.SpyObj<EventBusService>;

  beforeEach(async () => {
    const storageSpy = jasmine.createSpyObj('StorageService', ['isLoggedIn', 'getUser', 'clean']);
    const authSpy = jasmine.createSpyObj('AuthService', ['logout']);
    const eventBusSpy = jasmine.createSpyObj('EventBusService', ['on']);

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterTestingModule],
      providers: [
        { provide: StorageService, useValue: storageSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: EventBusService, useValue: eventBusSpy }
      ]
    })
    .compileComponents();

    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    eventBusService = TestBed.inject(EventBusService) as jasmine.SpyObj<EventBusService>;
    
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
