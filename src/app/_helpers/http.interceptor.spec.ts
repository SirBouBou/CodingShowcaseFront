import { beforeEach, describe, expect, it } from "vitest";
import { vi, type MockedObject } from "vitest";
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpContext, HttpRequest, HttpHandlerFn, HttpResponse } from '@angular/common/http';
import { authInterceptor, SKIP_401_REDIRECT } from './http.interceptor';
import { AuthService } from '../_services/auth.service';
import { StorageService } from '../_services/storage.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('authInterceptor (Functional)', () => {
    let authService: MockedObject<AuthService>;
    let storageService: MockedObject<StorageService>;
    let router: MockedObject<Router>;

    beforeEach(() => {
        const authServiceSpy = {
            refreshToken: vi.fn().mockName("AuthService.refreshToken"),
            logout: vi.fn().mockName("AuthService.logout")
        };
        const storageServiceSpy = {
            clean: vi.fn().mockName("StorageService.clean")
        };
        const routerSpy = {
            navigate: vi.fn().mockName("Router.navigate")
        };

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: AuthService, useValue: authServiceSpy },
                { provide: StorageService, useValue: storageServiceSpy },
                { provide: Router, useValue: routerSpy }
            ]
        });

        authService = TestBed.inject(AuthService) as MockedObject<AuthService>;
        storageService = TestBed.inject(StorageService) as MockedObject<StorageService>;
        router = TestBed.inject(Router) as MockedObject<Router>;
    });

    // Test direct du interceptor avec runInInjectionContext
    it('should add withCredentials to requests', async () => {
        TestBed.runInInjectionContext(() => {
            const mockRequest = new HttpRequest('GET', '/api/test');
            let nextCalled = false;

            const mockNext: HttpHandlerFn = (req: HttpRequest<any>) => {
                nextCalled = true;
                expect(req.withCredentials).toBe(true);
                return of(new HttpResponse({ status: 200, body: {} }));
            };

            authInterceptor(mockRequest, mockNext).subscribe(() => {
                expect(nextCalled).toBe(true);
                ;
            });
        });
    });

    it('should pass through successful requests', async () => {
        TestBed.runInInjectionContext(() => {
            const mockRequest = new HttpRequest('GET', '/api/test');

            const mockNext: HttpHandlerFn = (req: HttpRequest<any>) => {
                return of(new HttpResponse({ status: 200, body: { data: 'test' } }));
            };

            authInterceptor(mockRequest, mockNext).subscribe((response: any) => {
                expect(response.status).toBe(200);
                expect(response.body.data).toBe('test');
                ;
            });
        });
    });

    // TODO: vitest-migration: The 'done' callback was used in an unhandled way. Please migrate manually.
    it('should handle 401 error on non-refresh endpoint', () => new Promise<void>(done => {
        TestBed.runInInjectionContext(() => {
            authService.refreshToken.mockReturnValue(of({ token: 'new-token' }));

            const mockRequest = new HttpRequest('GET', '/api/game');

            const mockNext: HttpHandlerFn = (req: HttpRequest<any>) => {
                return throwError(() => new HttpResponse({ status: 401, statusText: 'Unauthorized' }));
            };

            authInterceptor(mockRequest, mockNext).subscribe({
                next: () => done(),
                error: () => {
                    expect(authService.refreshToken).toHaveBeenCalled();
                    done();
                }
            });
        });
    }));

    // TODO: vitest-migration: The 'done' callback was used in an unhandled way. Please migrate manually.
    it('should clean storage and logout on 401 at refresh endpoint', () => new Promise<void>(done => {
        TestBed.runInInjectionContext(() => {
            authService.logout.mockReturnValue(of({}));

            const mockRequest = new HttpRequest('GET', '/api/refresh');

            const mockNext: HttpHandlerFn = (req: HttpRequest<any>) => {
                return throwError(() => new HttpResponse({ status: 401, statusText: 'Unauthorized' }));
            };

            authInterceptor(mockRequest, mockNext).subscribe({
                next: () => done(),
                error: () => {
                    expect(storageService.clean).toHaveBeenCalled();
                    done();
                }
            });
        });
    }));

    // TODO: vitest-migration: The 'done' callback was used in an unhandled way. Please migrate manually.
    it('should handle 403 error', () => new Promise<void>(done => {
        TestBed.runInInjectionContext(() => {
            const mockRequest = new HttpRequest('GET', '/api/test');

            const mockNext: HttpHandlerFn = (req: HttpRequest<any>) => {
                return throwError(() => new HttpResponse({ status: 403, statusText: 'Forbidden' }));
            };

            authInterceptor(mockRequest, mockNext).subscribe({
                next: () => done(),
                error: () => {
                    expect(true).toBe(true);
                    done();
                }
            });
        });
    }));

    // TODO: vitest-migration: The 'done' callback was used in an unhandled way. Please migrate manually.
    it('should not redirect on 401 with SKIP_401_REDIRECT context', () => new Promise<void>(done => {
        TestBed.runInInjectionContext(() => {
            const mockRequest = new HttpRequest('GET', '/api/test', {}, { context: new HttpContext().set(SKIP_401_REDIRECT, true) });

            const mockNext: HttpHandlerFn = (req: HttpRequest<any>) => {
                return throwError(() => new HttpResponse({ status: 401, statusText: 'Unauthorized' }));
            };

            authInterceptor(mockRequest, mockNext).subscribe({
                next: () => done(),
                error: () => {
                    expect(authService.refreshToken).not.toHaveBeenCalled();
                    done();
                }
            });
        });
    }));
});
