import { provideAppInitializer, provideZoneChangeDetection, inject } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { HttpClient, provideHttpClient, withInterceptors, withXsrfConfiguration } from "@angular/common/http";
import { routes } from "./app/app-routing.module";
import { provideRouter } from "@angular/router";
import { authInterceptor } from "./app/_helpers/http.interceptor";
import { environment } from "./environments/environment";
import { firstValueFrom } from "rxjs";

if (environment.production) {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
  console.info = () => {};
}

try {
  void bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN'
      }),
      withInterceptors([authInterceptor])), 
    provideAppInitializer(() => {
      const http = inject(HttpClient);
      return firstValueFrom(
        http.get<void>(`${environment.apiUrl}/auth/csrf`)
      );
    }),
    provideRouter(routes)]})
} catch(e) {
  
  console.error(e)
};
