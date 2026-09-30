import { Component, DestroyRef, ElementRef, OnInit, ViewChild } from '@angular/core';
import p5 from 'p5';
import { GameRoomService } from '../../_services/gameRoom.service';
import { GameRoomDto } from '../../_models/gameRoomDto.model';
import { WebSocketService } from '../../_services/websocket.service';
import { GameDto } from '../../_models/gameDto.model';
import { TicTacToeGameDto } from '../../_models/ticTacToeGameDto.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-tictactoe',
  templateUrl: './tictactoe.component.html',
  styleUrl: './tictactoe.component.css',
})
export class TictactoeComponent implements OnInit {
  @ViewChild('sketchContainer')
  set sketchContainer(container: ElementRef | undefined) {
    if (!container || this.p5) {
      return;
    }
  this.p5 = new p5(this.sketch, container.nativeElement);
  if (this.game) {
    this.p5.redraw();
  }
}
  private p5?: p5; 
  public rooms: GameRoomDto[] = [];
  public room: GameRoomDto | null = null;
  public game: TicTacToeGameDto | null = null;

  constructor(private readonly gameRoomService: GameRoomService, private readonly webSocketService: WebSocketService, private readonly destroyRef: DestroyRef) {}

  ngOnInit() {
    this.webSocketService.connect();
    this.webSocketService.roomEvent$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(event => {
      this.loadRooms();
      if (this.room?.id === event.room.id) {
        this.room = event.room;
        if (event.type === 'LEFT') {
          this.loadGame(event.room.id);
        }
      }
    });
    
    this.webSocketService.gameEvent$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(event => {
      if (
        event.type === 'MOVE_PLAYED' ||
        event.type === 'GAME_STARTED'
      ) {
        this.updateGame(event.game);
      }
    })

    this.loadCurrentRoom();
  }

  createRoom() {
    this.gameRoomService.createRoomForGame(2).subscribe({
      next: room => {
        this.room = room;
        this.webSocketService.setActiveGameRoom(room.id);
        this.loadGame(room.id);
      }
    })
  }

  joinRoom(uuid: string) {
    this.gameRoomService.joinRoom(uuid).subscribe({
      next: room => {
        this.room = room;
        this.webSocketService.setActiveGameRoom(room.id);
        this.loadGame(room.id);
      }
    })
  }

  leaveRoom() {
    if(!this.room) {
      return;
    }

    this.gameRoomService.leaveRoom(this.room.id).subscribe({
      next: () => {
        this.webSocketService.setActiveGameRoom(null);

        this.p5?.remove();
        this.p5 = undefined;
        this.room = null;
        this.game = null;

        this.loadRooms();
        
      },
    })
  }

  loadCurrentRoom() {
    this.gameRoomService.getCurrentRoom().subscribe({
      next: (room) => {
        this.room = room;
        this.webSocketService.setActiveGameRoom(room.id);
        this.loadGame(room.id);
      },
      error: () => {
        this.loadRooms();
      }
    })
  }

  loadRooms() {
    this.gameRoomService.getRoomsForGame(2).subscribe(
      (data) => {
        this.rooms = data;
      }
    );
  }

  loadGame(roomId: string) {
    this.gameRoomService.getGame(roomId).subscribe({
      next: game => {
        this.updateGame(game);
      }
    })
  }

  updateGame(game: GameDto) {
    this.game = game as TicTacToeGameDto;
    this.p5?.redraw();
  }

  ngOnDestroy() {
    this.webSocketService.setActiveGameRoom(null);
    this.p5?.remove();
  }

  reload() {
    this.p5?.remove();
    this.p5 = undefined;

    if (this.sketchContainer) {
      this.p5 = new p5(
        this.sketch,
        this.sketchContainer.nativeElement
      );
    }
  }

  play(pos: number) {
    if(!this.room) {
      return;
    }
    this.gameRoomService.play(
      this.room.id,
      'PLAY',
      pos
    ).subscribe({
      next: game => this.updateGame(game)
    })
  }

  sketch = (s:p5) => { 
    const width = 300;
    const height = 300;
    const cellSize = 100;

    s.setup = () => {
      s.createCanvas(width, height);
      s.background('red');
      s.colorMode(s.HSB, 360, 255, 255);
      s.noLoop();
    };

    function toDiag(x: number) {
      return s.sqrt(s.pow(x,2) + s.pow(x,2))
    }

    function drawCircle(x: number, y: number) {
      s.push()
      s.translate(x, y)
      s.fill('red');
      s.circle(cellSize*0.5,cellSize*0.5,cellSize*0.75)
      s.fill('white');
      s.circle(cellSize*0.5,cellSize*0.5,cellSize*0.50)
      s.pop()
    }

    /*function drawCross(x: number, y: number) {
      s.push()
      s.fill('blue');
      s.noStroke();
      s.translate(x, y)
      s.rotate(s.PI / 4);
      s.rect(toDiag(cellSize*0.25), -toDiag(cellSize*0.125)/2, toDiag(cellSize*0.5), toDiag(cellSize*0.125));
      s.fill('blue');
      s.rect(toDiag(cellSize*0.5)-(toDiag(cellSize*0.125))/2, -toDiag(cellSize*0.25), toDiag(cellSize*0.125), toDiag(cellSize*0.5));
      s.pop()
    }*/

  function drawCross(x: number, y: number) {
    s.push();
    s.fill('blue');
    s.noStroke();
    // Centre de la case
    s.translate(x + cellSize / 2, y + cellSize / 2);
    s.rotate(s.PI / 4);
    // Barre horizontale
    s.rect(
      -toDiag(cellSize * 0.25),
      -toDiag(cellSize * 0.125) / 2,
      toDiag(cellSize * 0.5),
      toDiag(cellSize * 0.125)
    );
    // Barre verticale
    s.rect(
      -toDiag(cellSize * 0.125) / 2,
      -toDiag(cellSize * 0.25),
      toDiag(cellSize * 0.125),
      toDiag(cellSize * 0.5)
    );
    s.pop();
  }

    s.mouseClicked = () => {
      if (!this.game || !this.room) {
        return;
      }
      let y = Math.trunc(s.mouseX/cellSize)
      let x = Math.trunc(s.mouseY/cellSize)

      if(x < 0 || x >= 3 || y < 0 || y > 3) {
        return;
      }

      const position = 3*x + y;
      this.play(position);
    }

    s.draw = () => {
      const board = this.game?.board;

      if (!board) {
        return;
      }
      for(let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {

          const position = i * 3 + j;
          const cell = board[position];

          s.fill('white');
          let x = j * cellSize;
          let y = i * cellSize;
          s.square(x, y, cellSize);
          if(cell === 'O') {
            drawCircle(x,y);
          } else if(cell === 'X') {
            drawCross(x,y);
          }
        }
      }
    };
  }
}
