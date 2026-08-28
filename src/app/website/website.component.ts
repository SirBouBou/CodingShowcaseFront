import { Component } from '@angular/core';
import { WebsiteModel } from '../_models/website.model';
import { WebsiteService } from '../_services/website.service';
import { FormsModule } from '@angular/forms';
import { GameDBComponent } from '../websiteList/game-db/game-db.component';


@Component({
  selector: 'app-website',
  templateUrl: './website.component.html',
  styleUrl: './website.component.css',
  imports: [GameDBComponent, FormsModule]
})
export class WebsiteComponent {
  public websites: WebsiteModel[] = [];
    public selectedWebsite = -1;
    constructor(private readonly websiteService: WebsiteService) {}
  
    ngOnInit() {
      this.websiteService.getAll().subscribe((data) => {
        this.websites = data;
      })
    }
}
