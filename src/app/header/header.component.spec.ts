import { beforeEach, describe, expect, it } from "vitest";
import { vi, type MockedObject } from "vitest";
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { StorageService } from '../_services/storage.service';
import { AuthService } from '../_services/auth.service';
import { EventBusService } from '../_shared/event-bus.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    let storageService: MockedObject<StorageService>;
    let authService: MockedObject<AuthService>;
    let eventBusService: MockedObject<EventBusService>;

    beforeEach(async () => {
        const storageSpy = {
            isLoggedIn: vi.fn().mockName("StorageService.isLoggedIn"),
            getUser: vi.fn().mockName("StorageService.getUser"),
            clean: vi.fn().mockName("StorageService.clean")
        };
        const authSpy = {
            logout: vi.fn().mockName("AuthService.logout")
        };
        const eventBusSpy = {
            on: vi.fn().mockName("EventBusService.on")
        };

        await TestBed.configureTestingModule({
            imports: [HeaderComponent, RouterTestingModule],
            providers: [
                { provide: StorageService, useValue: storageSpy },
                { provide: AuthService, useValue: authSpy },
                { provide: EventBusService, useValue: eventBusSpy }
            ]
        })
            .compileComponents();

        storageService = TestBed.inject(StorageService) as MockedObject<StorageService>;
        authService = TestBed.inject(AuthService) as MockedObject<AuthService>;
        eventBusService = TestBed.inject(EventBusService) as MockedObject<EventBusService>;

        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
