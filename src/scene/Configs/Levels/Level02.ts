import * as THREE from 'three';
import { CubeEdge } from "../../Enums/CubeEdge";
import { CubeSide } from "../../Enums/CubeSide";
import { ILevelConfig } from "../../Interfaces/ILevelConfig";
import { EnemyType } from '../../Enums/EnemyType';

// Empty = ' ',
// Wall = 'W',
// Start = 'S',
// Finish = 'F',

const Level02: ILevelConfig = {
  size: new THREE.Vector3(5, 6, 7),
  map: {
    sides: {
      [CubeSide.Front]: [
        // sizeX x sizeY
        [' ', 'I1', ' ', ' ', 'I6'],
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', 'F', 'S', 'C'],
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', 'I2', ' '],
        ['C', ' ', ' ', ' ', 'C'],
      ],
      [CubeSide.Left]: [
        // sizeZ x sizeY
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', 'I3', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ],
      [CubeSide.Right]: [
        // sizeZ x sizeY
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', 'I5', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ],
      [CubeSide.Top]: [
        // sizeX x sizeZ
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', 'I4', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
      ],
      [CubeSide.Bottom]: [
        // sizeX x sizeZ
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
      ],
      [CubeSide.Back]: [
        // sizeX x sizeY
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
      ],
    },
    edges: {
      [CubeEdge.FrontTop]: ['W', 'W', ' ', 'W', ' '], // sizeX
      [CubeEdge.FrontDown]: [' ', 'W', 'W', 'W', 'W'], // sizeX
      [CubeEdge.FrontLeft]: ['W', 'W', 'W', 'W', 'W', ' '], // sizeY
      [CubeEdge.FrontRight]: [' ', 'W', 'W', 'W', 'W', 'W'], // sizeY
      [CubeEdge.TopLeft]: ['W', 'W', 'W', 'W', 'W', 'W', ' '], // sizeZ
      [CubeEdge.TopRight]: ['W', 'W', 'W', 'W', 'W', 'W', ' '], // sizeZ
      [CubeEdge.DownLeft]: ['W', 'W', ' ', 'W', 'W', 'W', 'W'], // sizeZ
      [CubeEdge.DownRight]: ['W', 'W', 'W', ' ', 'W', 'W', 'W'], // sizeZ
      [CubeEdge.BackTop]: [' ', 'W', 'W', 'W', 'W'], // sizeX
      [CubeEdge.BackDown]: ['W', 'W', 'W', 'W', ' '], // sizeX
      [CubeEdge.BackLeft]: [' ', 'W', 'W', ' ', 'W', 'W'], // sizeY
      [CubeEdge.BackRight]: ['W', 'W', 'W', 'W', 'W', ' '], // sizeY
    },
  },
  enemies: {
    [EnemyType.FloorSpike]: [
      { id: 1, inactiveTime: 1, activeTime: 2 },
      { id: 2, inactiveTime: 2, activeTime: 1 },
      { id: 3, inactiveTime: 1, activeTime: 2 },
      { id: 4, inactiveTime: 1, activeTime: 2 },
      { id: 5, inactiveTime: 1, activeTime: 2 },
      { id: 6, inactiveTime: 1, activeTime: 2 },
    ],
  }
};

export default Level02;