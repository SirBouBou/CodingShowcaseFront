import { Component, ElementRef, ViewChild } from '@angular/core';
import p5 from 'p5';

@Component({
  selector: 'app-my-tetris',
  templateUrl: './my-tetris.component.html',
  styleUrl: './my-tetris.component.css'
})
export class MyTetrisComponent {
  @ViewChild('sketchContainer', { static: true }) sketchContainer!: ElementRef;
  private p5!: p5; 
  private canvas: HTMLElement | null | undefined;

  pixelSize:number = 5;

  ngOnInit() {
    this.canvas = document.getElementById("canvas");
    if(this.canvas != null) {
      this.p5 = new p5(this.sketch, this.canvas);      
    }
  }

  ngOnDestroy() {
    this.p5?.remove();
  }

  reload() {
    this.p5?.remove();
    if(this.canvas != null) {
      this.p5 = new p5(this.sketch, this.canvas);
    }
  }

  sketch(s:p5) { 
    const pieces:number[][][] = [[[0,0], [0,1], [1,0], [1,1]]];
    const width = 400;
    const height = 400;
    const pixelSize = 20;
    let grid: any[] = [];
    let nextGrid: any[] = [];
    let rows: number;
    let cols: number;
    let color = 0;
    let fallingPiece: number[][] = []
    let fps = 0;
    s.frameRate(15)

    function stillInCols(i:number) {
      return i >= 0 && i < cols;
    }

    function stillInRows(j:number) {
      return j >= 0 && j < rows;
    }

    function isMouseIsInGrid() {
      return (s.mouseX < width && s.mouseX >= 0 && s.mouseY >= 0 && s.mouseY < height);
    }

    function make2DArray(rows:number, cols:number) {
      let arr = new Array(cols);
      for(let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
        for (let j = 0; j < rows; j++) {
          arr[i][j] = 0;
        }
      }
      return arr;
    }

    function isRowFull(i: number) {
      for(let j = 0; j < cols; j++) {
        if (grid[i][j] === 0) {
          return false;
        }
      }
      return true;
    }

    function randomNumber(min: number, max: number) {
      return Math.floor(Math.random() * (max - min)) + min;
    }

    function createPiece() {
      console.log("new piece")
      if(fallingPiece.length == 0) {
        let i = cols/2-1;
        let j = 0
        let piece = 0//randomNumber(0, pieces.length);
        let coords = pieces[piece];
        fallingPiece = []
        for(let size of coords) {
          grid[i+size[0]][j+size[1]] = piece+1;
          fallingPiece.push([i+size[0], j+size[1]]);
        }
      }
    }

    function leftParts(piece: number[][]) {
      let val = cols
      let res = []
      for(let coord of piece) {
        if(coord[0] < val) {
          val = coord[0]
        }
      }
      for(let coord of piece) {
        if(coord[0] === val) {
          res.push(coord)
        }
      }
      return res
    }

    function lowestParts(piece: number[][]) {
      let val = 0
      let res = []
      for(let coord of piece) {
        if(coord[1] > val) {
          val = coord[1]
        }
      }
      for(let coord of piece) {
        if(coord[1] === val) {
          res.push(coord)
        }
      }
      return res
    }

    function deepCopy () {
      nextGrid = []
      for (let row of grid) {
        nextGrid.push(Object.assign([], row));
      }
    }

    function moveDown() {
      deepCopy();
      let coords = lowestParts(fallingPiece)
      for(let coord of coords) {
        if(!stillInRows(coord[1]+1) || nextGrid[coord[0]][coord[1]+1] !== 0) {
          console.log("end piece")
          fallingPiece = []
          createPiece();
          break
        }
      }

      if(fallingPiece.length != 0) {
        for (let coord of fallingPiece) {
          nextGrid[coord[0]][coord[1]] = 0;
        }
        for (let coord of fallingPiece) {
          nextGrid[coord[0]][coord[1]+1] = grid[coord[0]][coord[1]];
          coord[1] += 1;
        }
        grid = nextGrid;
      }     
    }

    function moveLeft() {
      if(fallingPiece.length !== 0) {
        deepCopy();
        for (let coord of fallingPiece) {
          nextGrid[coord[0]][coord[1]] = 0;
        }
        for (let coord of fallingPiece) {
          if(coord[0]-1 >= 0 && nextGrid[coord[0]-1][coord[1]] === 0) {
            nextGrid[coord[0]-1][coord[1]] = grid[coord[0]][coord[1]];
            coord[0] -= 1;
          } else {
            deepCopy()
            break;
          }
        }
        grid = nextGrid;
      }
    }

    function moveRight() {
      if(fallingPiece.length !== 0) {
        deepCopy();
        console.log(cols)
        for (let coord of fallingPiece) {
          nextGrid[coord[0]][coord[1]] = 0;
        }
        for (let coord of fallingPiece) {
          if(coord[0]+1 < cols && nextGrid[coord[0]+1][coord[1]] === 0) {
            nextGrid[coord[0]+1][coord[1]] = grid[coord[0]][coord[1]];
            coord[0] += 1;
          } else {
            deepCopy()
            break;
          }
        }
        grid = nextGrid;
      }
    }

    s.setup = () => {
      s.createCanvas(width, height);
      cols = Math.floor(width / pixelSize);
      rows = Math.floor(height / pixelSize);
      grid = make2DArray(rows, cols);
      s.background(0);
      s.colorMode(s.HSB, 360, 255, 255);

      createPiece()
    };
  
    s.draw = () => {
      //s.noStroke();
      for(let i = 0; i < cols; i++) {
        for(let j = 0; j < rows; j++) {
          if(grid[i][j] > 0) {
            s.fill(grid[i][j], 255, 255);
            let x = i * pixelSize;
            let y = j * pixelSize;
            s.square(x, y, pixelSize);
          } else {
            s.fill('white');
            let x = i * pixelSize;
            let y = j * pixelSize;
            s.square(x, y, pixelSize);
          }      
        }
      }
      if(s.keyIsDown(s.LEFT_ARROW)) {
        moveLeft();
      } else if(s.keyIsDown(s.RIGHT_ARROW)) {
        moveRight();
      } else if(s.keyIsDown(s.DOWN_ARROW)) {
        moveDown();
      }
      if(fps > 60) {
        fps = 0;
        moveDown();
      }
      fps += 20;
    };

    /*s.keyIsDown = (s.LEFT_ARROW) => {
      if(s.key == 'ArrowLeft') {
      } else if (s.key == 'ArrowRight') {
        moveRight();
      } else if (s.key == 'ArrowDown') {
        moveDown();
      }
    };*/
  }
}
