import { Component, OnInit } from '@angular/core';
import { ShowcaseService } from '../_services/showcase.service';
import { ShowcaseModel } from '../_models/showcase.model';
import { FallingSand1Component } from '../falling-sand-1/falling-sand-1.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-showcases',
    templateUrl: './showcases.component.html',
    styleUrl: './showcases.component.css',
    imports: [FallingSand1Component, FormsModule, CommonModule]
})
export class ShowcasesComponent implements OnInit {
  public showcases: ShowcaseModel[] = [];
  public selectedShowcase = -1;
  constructor(private readonly showcaseService: ShowcaseService) {}

  ngOnInit() {
    this.showcaseService.getAll().subscribe((data) => {
      this.showcases = data;
    })
  }

}
