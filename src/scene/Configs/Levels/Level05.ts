import * as THREE from 'three';
import { CubeEdge } from "../../Enums/CubeEdge";
import { CubeSide } from "../../Enums/CubeSide";
import { ILevelConfig } from "../../Interfaces/ILevelConfig";
import { EnemyType } from '../../Enums/EnemyType';
import { Direction } from '../../Enums/Direction';

// Empty = ' ',
// Wall = 'W',
// Start = 'S',
// Finish = 'F',

const Level05: ILevelConfig = {
  size: new THREE.Vector3(7, 7, 7),
  map: {
    sides: {
      [CubeSide.Front]: [
        ['S',  ' ',  ' ',  ' ',  ' ', ' ',  ' '],
        [' ',  'X1', ' ',  'X2', ' ', 'X3', ' '],
        [' ',  ' ',  ' ',  ' ',  ' ', ' ',  ' '],
        [' ',  'X4', ' ',  'X5', ' ', ' ',  ' '],
        [' ',  ' ',  ' ',  ' ',  ' ', ' ',  ' '],
        [' ',  ' ',  ' ',  ' ',  ' ', ' ',  ' '],
        [' ',  ' ',  ' ',  ' ',  ' ', ' ',  ' '],
      ],
      [CubeSide.Left]: [
        [' ', ' ', ' ', 'X6', ' ', 'W', 'W'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', 'W', ' ', ' ', ' '],
        ['W', 'W', ' ', 'W', 'W', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        ['W', 'W', ' ', ' ', ' ', ' ', 'W'],
        ['W', 'W', ' ', ' ', ' ', ' ', ' '],
      ],
      [CubeSide.Right]: [
        [' ', 'W', 'W', 'W', ' ', 'W', ' '],
        [' ', 'W', 'W', 'W', ' ', 'W', ' '],
        [' ', 'W', 'W', 'W', ' ', 'W', ' '],
        [' ', 'W', ' ', ' ', ' ', ' ', ' '],
        [' ', 'W', ' ', 'W', ' ', 'W', 'W'],
        [' ', 'W', ' ', 'W', ' ', 'W', 'W'],
        [' ', 'W', ' ', ' ', ' ', 'W', 'W'],
      ],
      [CubeSide.Top]: [
        [' ', 'W', 'W', ' ', ' ', ' ', ' '],
        [' ', 'W', 'W', ' ', ' ', 'W', 'W'],
        [' ', ' ', ' ', ' ', ' ', 'W', ' '],
        ['W', 'W', 'W', 'W', 'W', 'W', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', 'W', 'W', 'W', 'W', 'W', 'W'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ],
      [CubeSide.Bottom]: [
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', 'W', 'W', ' ', 'W', 'W', 'W'],
        [' ', ' ', 'W', ' ', 'W', ' ', ' '],
        [' ', ' ', 'W', ' ', 'W', ' ', ' '],
        ['W', ' ', 'W', ' ', 'W', ' ', ' '],
        [' ', ' ', 'W', ' ', 'W', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ],
      [CubeSide.Back]: [
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', 'W', 'W', ' ', 'W', 'W', ' '],
        [' ', 'W', ' ', ' ', ' ', 'W', ' '],
        [' ', 'W', ' ', 'F', ' ', 'W', ' '],
        [' ', 'W', 'W', ' ', ' ', 'W', ' '],
        [' ', 'W', 'W', ' ', ' ', 'W', ' '],
        [' ', ' ', ' ', ' ', ' ', 'W', ' '],
      ],
    },
    edges: {
      [CubeEdge.FrontTop]: ['W', 'W', 'W', 'W', 'W', 'W', 'W'],
      [CubeEdge.FrontDown]: ['W', 'W', 'W', ' ', 'W', 'W', 'W'],
      [CubeEdge.FrontLeft]: ['W', 'W', 'W', 'W', 'W', 'W', 'W'],
      [CubeEdge.FrontRight]: ['W', 'W', 'W', 'W', 'W', 'W', 'W'],
      [CubeEdge.TopLeft]: [' ', 'W', 'W', 'W', 'W', 'W', 'W'],
      [CubeEdge.TopRight]: [' ', 'W', ' ', 'W', 'W', 'W', ' '],
      [CubeEdge.DownLeft]: ['W', 'W', 'W', 'W', 'W', 'W', 'W'],
      [CubeEdge.DownRight]: ['W', 'W', 'W', 'W', 'W', 'W', ' '],
      [CubeEdge.BackTop]: ['W', 'W', 'W', 'W', 'W', 'W', 'W'],
      [CubeEdge.BackDown]: ['W', 'W', 'W', 'W', 'W', 'W', 'W'],
      [CubeEdge.BackLeft]: ['W', 'W', ' ', 'W', 'W', 'W', 'W'],
      [CubeEdge.BackRight]: ['W', 'W', 'W', 'W', 'W', 'W', 'W'],
    },
  },
  enemies: {
    [EnemyType.Spike]: [
      { id: 1, directions: [Direction.Down] },
      { id: 2, directions: [Direction.Left, Direction.Down] },
      { id: 3, directions: [Direction.Left, Direction.Right] },
      { id: 4, directions: [Direction.Right, Direction.Left, Direction.Down] },
      { id: 5, directions: [Direction.Up, Direction.Right, Direction.Down, Direction.Left] },
      { id: 6, directions: [Direction.Down, Direction. Left] },
    ],
  }
};

export default Level05;
