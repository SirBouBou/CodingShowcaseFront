import { catchError, forkJoin, Observable } from "rxjs";
import { TestService } from "../test.service"
import { ResolveFn } from "@angular/router";
import { inject } from "@angular/core";

export const statusResolver : ResolveFn<any[]> = (
    route,
    state
): Observable<any[]> => {
    const testService = inject(TestService);
    return forkJoin([
        testService.getEveryone(),
        testService.getUserRole(),
        testService.getModRole(),
        testService.getAdminRole()
    ])
}