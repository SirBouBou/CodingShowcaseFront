import { Component, OnInit } from '@angular/core';
import { DBGameResponse } from '../../_models/dbGamesResponse.model';
import { DbGameService } from '../../_services/dbgame.service';
import { DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-game-db',
  templateUrl: './game-db.component.html',
  styleUrl: './game-db.component.css',
  imports: [DatePipe, DecimalPipe, NgClass, FormsModule]
})
export class GameDBComponent implements OnInit {
  public games: DBGameResponse[] = [];
  public maxPages: number = 0;
  public maxGames: number = 0;
  public currentPage: number = 0;
  public currentNumber: number = 50;
  public size: number = 25;

    constructor(private readonly dbGameService: DbGameService) {}
  
    ngOnInit() {
      this.getNewPage(0);
    }

    pageSizeChange() {
      this.currentPage = 0;
      this.getNewPage(0);
    }

    validatePageNumber() {
      let page = Number(window.prompt('Numéro de page'));
      if(!page || Number.isNaN(page)) {
        return;
      }
      
      if(page >= 0 && page < this.maxPages) {
        return this.getNewPage(page-1);
      }
    }

    getNewPage(page: number) {
      this.dbGameService.getPage(page, this.size).subscribe((data) => {
        console.log(data)
        this.games = data.content;
        this.maxPages = data.totalPages;
        this.maxGames = data.totalElements;
        this.currentPage = data.number;
        this.currentNumber = data.size * data.number + this.games.length;
      })
    }
}
