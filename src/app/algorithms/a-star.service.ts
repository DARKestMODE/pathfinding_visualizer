import { Injectable } from '@angular/core';
import { Node } from '../grid/grid.component'

@Injectable({
  providedIn: 'root'
})
export class AStarService {

  openSet: Node[] = []
  closedSet: Node[] = []
  optimalPath: Node[] = []
  waitTime: number = 0
  noSolution: boolean = false
  isFinished: boolean = false

  constructor() { }

  findPath(startNode: Node, endNode: Node): Array<Node> {
    this.openSet.push(startNode)
    while (true) {
      if (this.openSet.length > 0) {
        let currentNodeIndex: number = 0
        for (let i = 0; i < this.openSet.length; i++) {
          if (this.openSet[i].fScore < this.openSet[currentNodeIndex].fScore) currentNodeIndex = i
        }

        let currentNode = this.openSet[currentNodeIndex]
        if (currentNode == endNode) {
          let tempNode = currentNode
          this.optimalPath.push(tempNode)
          while (tempNode.previousNode) {
            this.optimalPath.push(tempNode.previousNode)
            tempNode = tempNode.previousNode
          }
          console.log('Done')
          return this.optimalPath
        }

        currentNode.isVisited = true
        this.openSet = this.openSet.filter(node => node !== currentNode) //remove current node from open set
        this.closedSet.push(currentNode)

        let neighbors = currentNode.neighbors
        for (let i = 0; i < neighbors.length; i++) {
          let neighborNode = neighbors[i]
          if (!this.closedSet.includes(neighborNode) && !neighborNode.isWall) {
            let tempG = currentNode.gScore + 1
            let newPath = false
            if (this.openSet.includes(neighborNode)) {
              if (tempG < neighborNode.gScore) {
                neighborNode.gScore = tempG
                newPath = true
              }
            } else {
              neighborNode.gScore = tempG
              this.openSet.push(neighborNode)
              newPath = true
            }
            if (newPath) {
              neighborNode.hScore = this.calcHeuristic(neighborNode, endNode)
              neighborNode.fScore = neighborNode.gScore + neighborNode.hScore
              neighborNode.previousNode = currentNode
            }
          }
        }
      } else {
        console.log('No solution')
        this.noSolution = true
        break
      }
    }
    return []
  }

  showNodes() {
    let cSet = this.closedSet
    let ms = 10
    for (let i = 0; i < cSet.length; i++) {
      this.waitTime = i*ms
      setTimeout(function(i) {
        if (!cSet[i].isStart && !cSet[i].isFinish) cSet[i].isClosed = true
      }, i * ms, i);
    }
  }

  showPath() {
    let pSet = this.optimalPath.reverse()
    for (let i = 0; i < pSet.length; i++) {
      let currentNode = pSet[i]
      setTimeout(() => {
        if (!currentNode.isStart) {
          currentNode.isPath = true
          currentNode.isCurrent = true
          setTimeout(() => {
            if (currentNode !== pSet[pSet.length-1]) {
              currentNode.isCurrent = false
            }
          }, 50)
        }
      }, i * 50, i);
    }
    this.isFinished = true
  }

  calcHeuristic(from: Node, to: Node): number {
    return Math.abs(from.row - to.row) + Math.abs(from.col - to.col)
  }
}
