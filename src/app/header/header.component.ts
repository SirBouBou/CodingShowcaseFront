import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { EventBusService } from '../_shared/event-bus.service';
import { Subscription } from 'rxjs';
import { SessionService } from '../_services/session.service';
import { AsyncPipe } from '@angular/common';
import { LoggerService } from '../_services/logger.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
    imports: [RouterLink, AsyncPipe],
})
export class HeaderComponent implements OnInit {
    readonly title = "CodingShowcase"
    readonly player$ = this.sessionService.player$;
    readonly ICON_FOLDER = "../assets/AccountLogo/Icon"

    private readonly router = inject(Router);
    private readonly logger = inject(LoggerService);

    iconPath: string = this.ICON_FOLDER + "0.png";

    private eventBusSub?: Subscription;

    constructor(
        private readonly eventBusService: EventBusService,
        private readonly sessionService: SessionService
    ) 
    {}
    
    ngOnInit(): void {
      this.eventBusSub = this.eventBusService.on('logout', () => {
        this.logout();
      });
  }
    

    logout(): void {
    this.sessionService.logout().subscribe({
      next: res => {
        this.router.navigate(['/login'], { replaceUrl: true });
      },
      error: err => {
        this.logger.error('Logout failed', err);
      }
    });
  }
    
}
