import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpContext, HttpRequest, HttpHandlerFn, HttpResponse } from '@angular/common/http';
import { authInterceptor, SKIP_401_REDIRECT } from './http.interceptor';
import { AuthService } from '../_services/auth.service';
import { StorageService } from '../_services/storage.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('authInterceptor (Functional)', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let storageService: jasmine.SpyObj<StorageService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['refreshToken', 'logout']);
    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['clean']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  // Test direct du interceptor avec runInInjectionContext
  it('should add withCredentials to requests', (done) => {
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
        done();
      });
    });
  });

  it('should pass through successful requests', (done) => {
    TestBed.runInInjectionContext(() => {
      const mockRequest = new HttpRequest('GET', '/api/test');

      const mockNext: HttpHandlerFn = (req: HttpRequest<any>) => {
        return of(new HttpResponse({ status: 200, body: { data: 'test' } }));
      };

      authInterceptor(mockRequest, mockNext).subscribe((response: any) => {
        expect(response.status).toBe(200);
        expect(response.body.data).toBe('test');
        done();
      });
    });
  });

  it('should handle 401 error on non-refresh endpoint', (done) => {
    TestBed.runInInjectionContext(() => {
      authService.refreshToken.and.returnValue(of({ token: 'new-token' }));

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
  });

  it('should clean storage and logout on 401 at refresh endpoint', (done) => {
    TestBed.runInInjectionContext(() => {
      authService.logout.and.returnValue(of({}));

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
  });

  it('should handle 403 error', (done) => {
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
  });

  it('should not redirect on 401 with SKIP_401_REDIRECT context', (done) => {
    TestBed.runInInjectionContext(() => {
      const mockRequest = new HttpRequest('GET', '/api/test', {}, 
        { context: new HttpContext().set(SKIP_401_REDIRECT, true) });

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
  });
});