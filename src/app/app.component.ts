import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { StorageService } from './_services/storage.service';
import { AuthService } from './_services/auth.service';
import { EventBusService } from './_shared/event-bus.service';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [HeaderComponent, FooterComponent, RouterOutlet],
})

export class AppComponent implements OnInit {
  title = "CodingShowcase"
  private roles: string[] = [];
  isLoggedIn = false;
  username?: string;

  ICON_FOLDER = "../assets/AccountLogo/Icon"
  iconPath: string = this.ICON_FOLDER + "0.png";

  eventBusSub?: Subscription;

  constructor(
    private readonly storageService: StorageService,
    private readonly authService: AuthService,
    private readonly eventBusService: EventBusService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();

    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      this.roles = user.roles;
      this.username = user.username;
      this.iconPath = this.ICON_FOLDER + user.profile.iconId + ".png";
    }

    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: res => {
        console.log(res);
        this.storageService.clean();
        globalThis.location.reload();
      },
      error: err => {
        console.log(err);
      }
    });
  }
}