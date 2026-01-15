import { Component } from '@angular/core';
import { ShowcaseService } from '../_services/showcase.service';
import { ShowcaseModel } from '../_models/showcase.model';

@Component({
    selector: 'app-showcases',
    templateUrl: './showcases.component.html',
    styleUrl: './showcases.component.css',
    standalone: false
})
export class ShowcasesComponent {
  public showcases: ShowcaseModel[] = [];
  public selectedShowcase = -1;
  constructor(private showcaseService: ShowcaseService) {}

  ngOnInit() {
    this.showcaseService.getAll().subscribe((data) => {
      this.showcases = data;
    })
  }

}
