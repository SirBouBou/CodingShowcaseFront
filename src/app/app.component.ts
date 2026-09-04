import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { SessionService } from './_services/session.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [HeaderComponent, FooterComponent, RouterOutlet],
})

export class AppComponent implements OnInit{

  constructor(private sessionService: SessionService
  ) {}
  
  ngOnInit():void {
    this.sessionService.initialize().subscribe();
  }
}