import { Component, OnInit } from '@angular/core';
import { DBGameResponse } from '../../_models/dbGamesResponse.model';
import { DbGameService } from '../../_services/dbgame.service';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-game-db',
  templateUrl: './game-db.component.html',
  styleUrl: './game-db.component.css',
  imports: [DatePipe, DecimalPipe]
})
export class GameDBComponent implements OnInit {
  public games: DBGameResponse[] = [];

    constructor(private readonly dbGameService: DbGameService) {}
  
    ngOnInit() {
      this.dbGameService.getPage(0).subscribe((data) => {
        this.games = data.content;
        console.log(this.games)
      })
    }
}
