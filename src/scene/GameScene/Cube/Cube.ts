import * as THREE from 'three';
import { ILevelConfig } from '../../Interfaces/ILevelConfig';
import GameplayConfig from '../../Configs/GameplayConfig';
import VertexConfig from '../../Configs/VertexConfig';
import { EdgeAxisConfig, EdgeDistanceConfig } from '../../Configs/EdgeConfig';
import { CubeSurfaceAxisConfig, SurfaceVectorConfig } from '../../Configs/SurfaceConfig';
import { IEdgeAxisConfig, ICubeSurfaceAxisConfig } from '../../Interfaces/ICubeConfig';
import { RotateDirection, TurnDirection } from '../../Enums/RotateDirection';
import CubeRotationController from './CubeRotationController';
import { CubeSide } from '../../Enums/CubeSide';
import { CubeRotationDirection } from '../../Enums/CubeRotationDirection';
import { CubeState } from '../../Enums/CubeState';
import CubeDebug from './CubeDebug';

export default class Cube extends THREE.Group {
  private levelConfig: ILevelConfig;
  private cubeRotationController: CubeRotationController;
  private cubeDebug: CubeDebug;
  private state: CubeState = CubeState.Idle;

  constructor() {
    super();

    this.initCubeRotationController();
    this.initCubeDebug();
  }

  public update(dt: number): void {
    this.cubeRotationController.update(dt);
  }

  public rotateToDirection(rotateDirection: RotateDirection): void {
    this.cubeRotationController.rotateToDirection(rotateDirection);
    this.state = CubeState.Rotating;
  }

  public turn(turnDirection: TurnDirection): void {
    this.cubeRotationController.turn(turnDirection);
    this.state = CubeState.Rotating;
  }

  public getCurrentSide(): CubeSide {
    return this.cubeRotationController.getCurrentSide();
  }

  public getCurrentRotationDirection(): CubeRotationDirection {
    return this.cubeRotationController.getCurrentRotationDirection();
  }

  public getState(): CubeState {
    return this.state;
  }

  private initCubeRotationController(): void {
    this.cubeRotationController = new CubeRotationController(this);

    this.cubeRotationController.emitter.on('endRotating', () => {
      this.state = CubeState.Idle;
    });
  }

  private initCubeDebug(): void {
    const cubeDebug = this.cubeDebug = new CubeDebug();
    this.add(cubeDebug);
  }

  public init(levelConfig: ILevelConfig): void {
    this.levelConfig = levelConfig;

    this.removeCube();

    this.initInnerCube();
    this.initEdges();
    this.initSurfaces();

    this.cubeDebug.setLevelConfig(levelConfig);
  }

  private removeCube(): void {

  }

  private initInnerCube(): void {
    const innerCubeSize: number = this.levelConfig.size * GameplayConfig.gridSize;

    const geometry = new THREE.BoxGeometry(innerCubeSize, innerCubeSize, innerCubeSize);
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const innerCube = new THREE.Mesh(geometry, material);
    this.add(innerCube);
  }

  private initEdges(): void {
    this.initVertexCells();
    this.initEdgeCells();
  }

  private initVertexCells(): void {
    const geometry = new THREE.BoxGeometry(GameplayConfig.gridSize, GameplayConfig.gridSize, GameplayConfig.gridSize);
    const material = new THREE.MeshStandardMaterial({ color: 0xff00ff });

    const distance: number = (this.levelConfig.size + 1) * 0.5 * GameplayConfig.gridSize;

    for (let i = 0; i < VertexConfig.length; i++) {
      const vertexCell = new THREE.Mesh(geometry, material);
      this.add(vertexCell);

      vertexCell.position.x = VertexConfig[i].x * distance;
      vertexCell.position.y = VertexConfig[i].y * distance;
      vertexCell.position.z = VertexConfig[i].z * distance;

      vertexCell.scale.set(GameplayConfig.gridScale, GameplayConfig.gridScale, GameplayConfig.gridScale);
    }
  }

  private initEdgeCells(): void {
    const geometry = new THREE.BoxGeometry(GameplayConfig.gridSize, GameplayConfig.gridSize, GameplayConfig.gridSize);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ffff });

    const distance: number = (this.levelConfig.size + 1) * 0.5 * GameplayConfig.gridSize;

    for (let i = 0; i < EdgeAxisConfig.length; i++) {
      const edgeAxisConfig: IEdgeAxisConfig = EdgeAxisConfig[i];

      for (let j = 0; j < this.levelConfig.size; j++) {
        if (this.levelConfig.map.edges[edgeAxisConfig.edge][j] === 1) {
          const edgeCell = new THREE.Mesh(geometry, material);
          this.add(edgeCell);

          edgeCell.position.x = EdgeDistanceConfig[i].x * distance;
          edgeCell.position.y = EdgeDistanceConfig[i].y * distance;
          edgeCell.position.z = EdgeDistanceConfig[i].z * distance;

          edgeCell.position[edgeAxisConfig.axis] += j * GameplayConfig.gridSize + GameplayConfig.gridSize * 0.5 - this.levelConfig.size * 0.5 * GameplayConfig.gridSize;

          edgeCell.scale.set(GameplayConfig.gridScale, GameplayConfig.gridScale, GameplayConfig.gridScale);
        }
      }
    }
  }

  private initSurfaces(): void {
    const geometry = new THREE.BoxGeometry(GameplayConfig.gridSize, GameplayConfig.gridSize, GameplayConfig.gridSize);
    const material = new THREE.MeshStandardMaterial({ color: 0xffff00 });

    const distance: number = (this.levelConfig.size + 1) * 0.5 * GameplayConfig.gridSize;
    const offset: number = ((this.levelConfig.size - 1) * GameplayConfig.gridSize) * 0.5;

    for (let k = 0; k < CubeSurfaceAxisConfig.length; k++) {
      const cubeSurfaceAxisConfig: ICubeSurfaceAxisConfig = CubeSurfaceAxisConfig[k];

      for (let i = 0; i < this.levelConfig.size; i++) {
        for (let j = 0; j < this.levelConfig.size; j++) {
          if (this.levelConfig.map.surfaces[cubeSurfaceAxisConfig.side][i][j] === 1) {
            const surfaceCell = new THREE.Mesh(geometry, material);
            this.add(surfaceCell);

            surfaceCell.position.x = SurfaceVectorConfig[cubeSurfaceAxisConfig.side].x * distance;
            surfaceCell.position.y = SurfaceVectorConfig[cubeSurfaceAxisConfig.side].y * distance;
            surfaceCell.position.z = SurfaceVectorConfig[cubeSurfaceAxisConfig.side].z * distance;

            surfaceCell.position[cubeSurfaceAxisConfig.xAxis] += j * GameplayConfig.gridSize * cubeSurfaceAxisConfig.xFactor - offset * cubeSurfaceAxisConfig.xFactor;
            surfaceCell.position[cubeSurfaceAxisConfig.yAxis] += i * GameplayConfig.gridSize * cubeSurfaceAxisConfig.yFactor - offset * cubeSurfaceAxisConfig.yFactor;

            surfaceCell.scale.set(GameplayConfig.gridScale, GameplayConfig.gridScale, GameplayConfig.gridScale);
          }
        }
      }
    }
  }
}
