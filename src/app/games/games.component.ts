import { Component, OnInit } from '@angular/core';
import { GameModel } from '../_models/game.model';
import { GameService } from '../_services/game.service';
import { MyTetrisComponent } from '../my-tetris/my-tetris.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-games',
    templateUrl: './games.component.html',
    styleUrl: './games.component.css',
    imports: [MyTetrisComponent, FormsModule, CommonModule],
})
export class GamesComponent implements OnInit {
  public games: GameModel[] = [];
  public selectedGame = -1;
  constructor(private readonly gameService: GameService) {}

  ngOnInit() {
    this.gameService.getAll().subscribe((data) => {
      this.games = data;
    })
  }
}
