import { Injectable } from "@angular/core";
import { catchError, Observable, tap, throwError } from "rxjs";
import { PlayerIdentity } from "../_models/player.model";
import { GuestService } from "./guest.service";
import { AuthService } from "./auth.service";
import { SessionService } from "./session.service";

@Injectable({
  providedIn: 'root',
})
export class IdentityService {

    constructor(private readonly guestService: GuestService, private readonly authService: AuthService, private readonly sessionService: SessionService) {}


    ensureIdentity(): Observable<PlayerIdentity> {
        return this.authService.getCurrentUser().pipe(
            tap(player => this.sessionService.setPlayer(player)),

            catchError(() => this.guestService.getCurrentGuest().pipe(
                tap(player => this.sessionService.setPlayer(player))
            )),
            
            catchError(() => {
                const name = window.prompt('Choisis ton pseudo');

                if (!name) {
                    return throwError(() => new Error('Guest creation cancelled'));
                }

                return this.guestService.createSession(name).pipe(
                    tap(player => this.sessionService.setPlayer(player))
                );
            })
        )
    }
}