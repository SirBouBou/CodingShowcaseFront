import { Component } from '@angular/core';
import { GameModel } from '../_models/game.model';
import { GameService } from '../_services/game.service';

@Component({
    selector: 'app-games',
    templateUrl: './games.component.html',
    styleUrl: './games.component.css',
    standalone: false
})
export class GamesComponent {
  public games: GameModel[] = [];
  public selectedGame = -1;
  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.gameService.getAll().subscribe((data) => {
      this.games = data;
    })
  }
}
