import {Component, OnInit} from '@angular/core';
import {AStarService} from '../algorithms/a-star.service';

export enum GridDimensions {
  ROWS = 17,
  COLS = 39
}

export class Node {

  side: string = '30px'
  color: string
  isCurrent: boolean = false

  row: number
  col: number
  isVisited: boolean = false
  isWall: boolean = false
  isStart: boolean = false
  isFinish: boolean = false
  isClosed: boolean = false
  isPath: boolean = false
  fScore: number = 0
  gScore: number = 0
  hScore: number = 0
  neighbors: Node[] = []
  previousNode: Node = undefined

  constructor(i: number, j: number) {
    this.row = i
    this.col = j

    // if (Math.random() < 0.2) this.isWall = true
  }

  addNeighbors(grid: Node[][]) {
    let i = this.row
    let j = this.col
    if (i < GridDimensions.ROWS - 1) this.neighbors.push(grid[i+1][j])
    if (i > 0) this.neighbors.push(grid[i-1][j])
    if (j < GridDimensions.COLS - 1) this.neighbors.push(grid[i][j+1])
    if (j > 0) this.neighbors.push(grid[i][j-1])
  }

}


@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {

  rows: number = GridDimensions.ROWS
  cols: number = GridDimensions.COLS
  grid: Node[][] = new Array(this.rows)
  startNode: Node
  endNode: Node
  isMousePressed: boolean = false
  isStartSelected: boolean = false
  isFinishSelected: boolean = false

  constructor(private aStarService: AStarService) {
    this.createGrid()
    this.startNode = this.grid[8][5]
    this.startNode.isStart = true
    this.startNode.isWall = false
    this.endNode = this.grid[8][33]
    this.endNode.isFinish = true
    this.endNode.isWall = false
  }

  ngOnInit(): void {}

  findPath() {
    this.aStarService.findPath(this.startNode, this.endNode)
    if (this.aStarService.noSolution) {
     alert('No solution')
     return
    }
    this.aStarService.showNodes()
    setTimeout(() => this.aStarService.showPath(), this.aStarService.waitTime)
  }

  createGrid() {
    for (let i = 0; i < this.rows; i++) {
      this.grid[i] = new Array(this.cols)
    }

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.grid[i][j] = new Node(i, j)
      }
    }

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.grid[i][j].addNeighbors(this.grid)
      }
    }
  }

  showInfo(node: Node) {
    console.log(node)
  }

  onMouseDown(node: Node) {
    if (node.isStart) this.isStartSelected = true
    else if (node.isFinish) this.isFinishSelected = true
    else node.isWall = true
    this.isMousePressed = true
  }

  onMouseEnter(node: Node) {
    if (!this.isMousePressed) return;
    if (node.isWall) node.isWall = false
    if (this.isStartSelected) {
      node.isStart = true
      this.startNode = node
    } else if (this.isFinishSelected) {
      node.isFinish = true
      this.endNode = node
    } else node.isWall = true
  }

  onMouseLeave(node: Node) {
    if (!this.isMousePressed) return;
    if (this.isStartSelected) {
      node.isStart = false
    } else if (this.isFinishSelected) {
      node.isFinish = false
    }

  }

  onMouseUp() {
    this.isMousePressed = false
    this.isStartSelected = false
    this.isFinishSelected = false
  }

}
