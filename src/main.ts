import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from "@angular/common/http";
import { routes } from "./app/app-routing.module";
import { provideRouter } from "@angular/router";
import { authInterceptor } from "./app/_helpers/http.interceptor";

try {
  bootstrapApplication(AppComponent, {providers: [provideHttpClient(withInterceptors([authInterceptor])), provideRouter(routes)]})
} catch(e) {
  console.error(e)
};
