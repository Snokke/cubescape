import * as THREE from 'three';
import ThreeJSHelper from '../../Helpers/ThreeJSHelper';
import GameplayConfig from '../../Configs/Main/GameplayConfig';
import { ILevelConfig, IMapConfig } from '../../Interfaces/ILevelConfig';
import CornerCellsConfig from '../../Configs/Cells/CornerCellsConfig';
import { EdgeRotationConfig, EdgeDistanceConfig, EdgeModelsConfig } from '../../Configs/Cells/EdgeCellsConfig';
import { ICubeSideAxisConfig, IEdgeConfig } from '../../Interfaces/ICubeConfig';
import CubeHelper from '../../Helpers/CubeHelper';
import { CellType } from '../../Enums/CellType';
import InstancesHelper from '../../Helpers/InstancesHelper';
import { CubeSideAxisConfig, SideVectorConfig } from '../../Configs/SideConfig';
import { CubeSide } from '../../Enums/CubeSide';
import { FloorCellsGeometryConfig, FloorModelsConfig } from '../../Configs/Cells/FloorCellsConfig';
import { RoofCellsGeometryConfig, RoofModelsConfig } from '../../Configs/Cells/RoofCellsConfig';
import { Direction } from '../../Enums/Direction';
import MapHelper from '../../Helpers/MapHelper';
import Materials from '../../../core/Materials';
import { MaterialType } from '../../Enums/MaterialType';
import { WallCellGeometryConfig, WallModelsConfig } from '../../Configs/Cells/WallCellsConfig';

export default class CubeViewBuilder extends THREE.Group {
  private levelMap: ILevelConfig;
  private fullMap: IMapConfig = {};

  private corners: THREE.Mesh[] = [];
  private edgeCellsInstanced: THREE.InstancedMesh[] = [];

  constructor() {
    super();

  }

  public init(levelConfig: ILevelConfig): void {
    this.createLevelMap(levelConfig);
    this.createFullLevelMap(this.levelMap);

    this.initCorners();
    this.initEdges();
    this.initFloor();
    this.initRoof();
    this.initWalls();
  }

  public removeView(): void {
    ThreeJSHelper.killObjects(this.corners, this);

    for (let i = 0; i < this.edgeCellsInstanced.length; i++) {
      ThreeJSHelper.killInstancedMesh(this.edgeCellsInstanced[i], this);
    }

    this.corners = [];
    this.edgeCellsInstanced = [];
  }

  private createLevelMap(levelConfig: ILevelConfig): void {
    const { sides, edges } = MapHelper.copyMapSidesAndEdges(levelConfig);

    this.levelMap = {
      size: new THREE.Vector3(levelConfig.size.x, levelConfig.size.y, levelConfig.size.z),
      map: { sides, edges },
    };

    MapHelper.replaceExtraSymbolsInMap(this.levelMap);
  }

  private createFullLevelMap(levelMap: ILevelConfig): void {
    for (const cubeSide in CubeSide) {
      const side: CubeSide = CubeSide[cubeSide] as CubeSide;
      this.fullMap[side] = MapHelper.createFullSideMap(levelMap, side);
    }
  }

  private initCorners(): void {
    const distance = new THREE.Vector3(
      (this.levelMap.size.x + 1) * 0.5 * GameplayConfig.grid.size,
      (this.levelMap.size.y + 1) * 0.5 * GameplayConfig.grid.size,
      (this.levelMap.size.z + 1) * 0.5 * GameplayConfig.grid.size,
    );

    const material: THREE.Material = Materials.getInstance().materials[MaterialType.Main];

    for (let i = 0; i < CornerCellsConfig.length; i++) {
      const cornerConfig = CornerCellsConfig[i];

      const geometry: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel(cornerConfig.model);

      const cornerCell = new THREE.Mesh(geometry, material);
      this.add(cornerCell);

      cornerCell.position.x = cornerConfig.position.x * distance.x;
      cornerCell.position.y = cornerConfig.position.y * distance.y;
      cornerCell.position.z = cornerConfig.position.z * distance.z;

      cornerCell.rotation.set(cornerConfig.rotation.x, cornerConfig.rotation.y, cornerConfig.rotation.z);
      cornerCell.scale.set(GameplayConfig.grid.scale, GameplayConfig.grid.scale, GameplayConfig.grid.scale);

      this.corners.push(cornerCell);
    }
  }

  private initEdges(): void {
    const distance = new THREE.Vector3(
      (this.levelMap.size.x + 1) * 0.5 * GameplayConfig.grid.size,
      (this.levelMap.size.y + 1) * 0.5 * GameplayConfig.grid.size,
      (this.levelMap.size.z + 1) * 0.5 * GameplayConfig.grid.size,
    );

    const edgeCells: THREE.Object3D[] = [];

    for (let i = 0; i < EdgeRotationConfig.length; i++) {
      const edgeConfig: IEdgeConfig = EdgeRotationConfig[i];
      const edgeSize: number = this.levelMap.size[edgeConfig.axis];

      for (let j = 0; j < edgeSize; j++) {
        if (CubeHelper.getCellTypeBySymbol(this.levelMap.map.edges[edgeConfig.edge][j]) === CellType.Wall) {
          const edgeCell = new THREE.Object3D();

          edgeCell.position.x = EdgeDistanceConfig[i].x * distance.x;
          edgeCell.position.y = EdgeDistanceConfig[i].y * distance.y;
          edgeCell.position.z = EdgeDistanceConfig[i].z * distance.z;

          edgeCell.position[edgeConfig.axis] += j * GameplayConfig.grid.size + GameplayConfig.grid.size * 0.5 - edgeSize * 0.5 * GameplayConfig.grid.size;

          edgeCell.rotation.set(edgeConfig.rotation.x, edgeConfig.rotation.y, edgeConfig.rotation.z);
          edgeCell.scale.set(GameplayConfig.grid.scale, GameplayConfig.grid.scale, GameplayConfig.grid.scale);

          edgeCells.push(edgeCell);
        }
      }
    }

    const edgeCellsByProbability: THREE.Object3D[][] = ThreeJSHelper.splitObjectsByProbability(edgeCells, EdgeModelsConfig.probabilities);
    const material: THREE.Material = Materials.getInstance().materials[MaterialType.Main];

    for (let i = 0; i < EdgeModelsConfig.models.length; i++) {
      const modelName: string = EdgeModelsConfig.models[i];
      const geometry: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel(modelName);
      const edgeCells: THREE.Object3D[] = edgeCellsByProbability[i];

      const edgeCellsInstanced = InstancesHelper.createStaticInstancedMesh(edgeCells, material, geometry);
      this.add(edgeCellsInstanced);

      this.edgeCellsInstanced.push(edgeCellsInstanced);

      edgeCellsInstanced.receiveShadow = true;
      edgeCellsInstanced.castShadow = true;
    }
  }

  private initFloor(): void {
    const floorCells = [];

    for (const side in CubeSide) {
      const cubeSide: CubeSide = CubeSide[side];
      const cubeSideAxisConfig: ICubeSideAxisConfig = CubeSideAxisConfig[cubeSide];
      const sizeX: number = this.levelMap.size[cubeSideAxisConfig.xAxis];
      const sizeY: number = this.levelMap.size[cubeSideAxisConfig.yAxis];

      for (let row = 0; row < sizeY; row++) {
        for (let column = 0; column < sizeX; column++) {
          const cellType: CellType = CubeHelper.getCellTypeBySymbol(this.levelMap.map.sides[cubeSide][row][column]);

          if (cellType === CellType.Empty) {
            const floor = new THREE.Object3D();

            this.setCellPosition(floor, cubeSide, row, column);
            CubeHelper.setSideRotation(floor, cubeSide);
            floor.scale.set(GameplayConfig.grid.scale, GameplayConfig.grid.scale, GameplayConfig.grid.scale);

            floorCells.push(floor);
          }
        }
      }
    }

    const floorCellsByProbability: THREE.Object3D[][] = ThreeJSHelper.splitObjectsByProbability(floorCells, FloorModelsConfig.probabilities);
    const material: THREE.Material = Materials.getInstance().materials[MaterialType.Main];

    for (let i = 0; i < FloorModelsConfig.models.length; i++) {
      const modelName: string = FloorModelsConfig.models[i];
      const geometry: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel(modelName);
      ThreeJSHelper.setGeometryRotation(geometry, FloorCellsGeometryConfig.rotation);
      const floorCells: THREE.Object3D[] = floorCellsByProbability[i];

      const floorCellsInstanced = InstancesHelper.createStaticInstancedMesh(floorCells, material, geometry);
      this.add(floorCellsInstanced);

      floorCellsInstanced.receiveShadow = true;
    }
  }

  private initRoof(): void {
    const roofCells = [];

    for (const side in CubeSide) {
      const cubeSide: CubeSide = CubeSide[side];
      const cubeSideAxisConfig: ICubeSideAxisConfig = CubeSideAxisConfig[cubeSide];
      const sizeX: number = this.levelMap.size[cubeSideAxisConfig.xAxis];
      const sizeY: number = this.levelMap.size[cubeSideAxisConfig.yAxis];

      for (let row = 0; row < sizeY; row++) {
        for (let column = 0; column < sizeX; column++) {
          const cellType: CellType = CubeHelper.getCellTypeBySymbol(this.levelMap.map.sides[cubeSide][row][column]);

          if (cellType === CellType.Wall) {
            const roof = new THREE.Object3D();

            this.setCellPosition(roof, cubeSide, row, column);
            CubeHelper.setSideRotation(roof, cubeSide);
            roof.scale.set(GameplayConfig.grid.scale, GameplayConfig.grid.scale, GameplayConfig.grid.scale);

            roofCells.push(roof);
          }
        }
      }
    }

    const roofCellsByProbability: THREE.Object3D[][] = ThreeJSHelper.splitObjectsByProbability(roofCells, RoofModelsConfig.probabilities);
    const material: THREE.Material = Materials.getInstance().materials[MaterialType.Main];

    for (let i = 0; i < RoofModelsConfig.models.length; i++) {
      const modelName: string = RoofModelsConfig.models[i];
      const geometry: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel(modelName);
      ThreeJSHelper.setGeometryRotation(geometry, RoofCellsGeometryConfig.rotation);
      const roofCells: THREE.Object3D[] = roofCellsByProbability[i];

      const roofCellsInstanced = InstancesHelper.createStaticInstancedMesh(roofCells, material, geometry);
      this.add(roofCellsInstanced);

      roofCellsInstanced.receiveShadow = true;
      roofCellsInstanced.castShadow = true;
    }
  }

  private initWalls(): void {
    const wallCells = [];

    for (const side in CubeSide) {
      const cubeSide: CubeSide = CubeSide[side];
      const cubeSideAxisConfig: ICubeSideAxisConfig = CubeSideAxisConfig[cubeSide];
      const sizeX: number = this.levelMap.size[cubeSideAxisConfig.xAxis];
      const sizeY: number = this.levelMap.size[cubeSideAxisConfig.yAxis];

      for (let row = 0; row < sizeY; row++) {
        for (let column = 0; column < sizeX; column++) {
          const cellType: CellType = CubeHelper.getCellTypeBySymbol(this.levelMap.map.sides[cubeSide][row][column]);

          if (cellType === CellType.Wall) {
            const wallDirections: Direction[] = this.getWallDirections(this.levelMap.map.sides[cubeSide], row, column);

            for (let i = 0; i < wallDirections.length; i++) {
              const wallDirection: Direction = wallDirections[i];

              const wall = new THREE.Object3D();

              this.setCellPosition(wall, cubeSide, row, column);
              CubeHelper.setSideRotation(wall, cubeSide);
              CubeHelper.setRotationByDirection(wall, cubeSide, wallDirection);
              wall.scale.set(GameplayConfig.grid.scale, GameplayConfig.grid.scale, GameplayConfig.grid.scale);

              wallCells.push(wall);
            }
          }
        }
      }

      const fullMap: string[][] = this.fullMap[cubeSide];

      for (let row = 0; row < fullMap.length; row++) {
        for (let column = 0; column < fullMap[row].length; column++) {
          const cellType: CellType = CubeHelper.getCellTypeBySymbol(fullMap[row][column]);

          if (row === 0 && column !== 0 && column !== fullMap[row].length - 1 && cellType === CellType.Wall) {
            const bottomCellType: CellType = CubeHelper.getCellTypeBySymbol(fullMap[row + 1][column]);
            const wall = this.checkCellForWallInFullMap(bottomCellType, cubeSide, row, column, Direction.Down);
            
            if (wall) {
              wallCells.push(wall);
            }
          }

          if (row === fullMap.length - 1 && column !== 0 && column !== fullMap[row].length - 1 && cellType === CellType.Wall) {
            const topCellType: CellType = CubeHelper.getCellTypeBySymbol(fullMap[row - 1][column]);
            const wall = this.checkCellForWallInFullMap(topCellType, cubeSide, row, column, Direction.Up);
            
            if (wall) {
              wallCells.push(wall);
            }
          }

          if (column === 0 && row !== 0 && row !== fullMap.length - 1 && cellType === CellType.Wall) {
            const rightCellType: CellType = CubeHelper.getCellTypeBySymbol(fullMap[row][column + 1]);
            const wall = this.checkCellForWallInFullMap(rightCellType, cubeSide, row, column, Direction.Right);
            
            if (wall) {
              wallCells.push(wall);
            }
          }

          if (column === fullMap[row].length - 1 && row !== 0 && row !== fullMap.length - 1 && cellType === CellType.Wall) {
            const leftCellType: CellType = CubeHelper.getCellTypeBySymbol(fullMap[row][column - 1]);
            const wall = this.checkCellForWallInFullMap(leftCellType, cubeSide, row, column, Direction.Left);

            if (wall) {
              wallCells.push(wall);
            }
          }
        }
      }
    }

    const wallCellsByProbability: THREE.Object3D[][] = ThreeJSHelper.splitObjectsByProbability(wallCells, WallModelsConfig.probabilities);
    const material: THREE.Material = Materials.getInstance().materials[MaterialType.Main];

    for (let i = 0; i < WallModelsConfig.models.length; i++) {
      const modelName: string = WallModelsConfig.models[i];
      const geometry: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel(modelName);
      ThreeJSHelper.setGeometryRotation(geometry, WallCellGeometryConfig.rotation);
      const wallCells: THREE.Object3D[] = wallCellsByProbability[i];

      const wallCellsInstanced = InstancesHelper.createStaticInstancedMesh(wallCells, material, geometry);
      this.add(wallCellsInstanced);

      wallCellsInstanced.receiveShadow = true;
      wallCellsInstanced.castShadow = true;
    }
  }

  private checkCellForWallInFullMap(checkCellType: CellType, cubeSide: CubeSide, row: number, column: number, direction: Direction): THREE.Object3D | null {
    if (checkCellType === CellType.Empty) {
      const wall = new THREE.Object3D();

      this.setCellPosition(wall, cubeSide, row - 1, column - 1);
      CubeHelper.setSideRotation(wall, cubeSide);
      CubeHelper.setRotationByDirection(wall, cubeSide, direction);
      wall.scale.set(GameplayConfig.grid.scale, GameplayConfig.grid.scale, GameplayConfig.grid.scale);

      return wall;
    }

    return null;
  }

  private setCellPosition(cell: THREE.Object3D, cubeSide: CubeSide, x: number, y: number): void {
    const cubeSideAxisConfig: ICubeSideAxisConfig = CubeSideAxisConfig[cubeSide];

    const distance: number = (this.levelMap.size[cubeSideAxisConfig.zAxis] + 1) * 0.5 * GameplayConfig.grid.size;
    const offsetX: number = (this.levelMap.size[cubeSideAxisConfig.xAxis] - 1) * 0.5 * GameplayConfig.grid.size;
    const offsetY: number = (this.levelMap.size[cubeSideAxisConfig.yAxis] - 1) * 0.5 * GameplayConfig.grid.size;

    cell.position.x = SideVectorConfig[cubeSide].x * distance;
    cell.position.y = SideVectorConfig[cubeSide].y * distance;
    cell.position.z = SideVectorConfig[cubeSide].z * distance;

    cell.position[cubeSideAxisConfig.xAxis] += y * GameplayConfig.grid.size * cubeSideAxisConfig.xFactor - offsetX * cubeSideAxisConfig.xFactor;
    cell.position[cubeSideAxisConfig.yAxis] += x * GameplayConfig.grid.size * cubeSideAxisConfig.yFactor - offsetY * cubeSideAxisConfig.yFactor;
  }

  private getWallDirections(map: string[][], row: number, column: number): Direction[] {
    const neighboursCells: Direction[] = [];
    const cellTypeToCheck: CellType = CellType.Empty;
    const cellTypeToCheckSymbol: string = CubeHelper.getCellSymbolByType(cellTypeToCheck);

    if (row > 0 && map[row - 1][column] === cellTypeToCheckSymbol) {
      neighboursCells.push(Direction.Up);
    }

    if (row < map.length - 1 && map[row + 1][column] === cellTypeToCheckSymbol) {
      neighboursCells.push(Direction.Down);
    }

    if (column > 0 && map[row][column - 1] === cellTypeToCheckSymbol) {
      neighboursCells.push(Direction.Left);
    }

    if (column < map[0].length - 1 && map[row][column + 1] === cellTypeToCheckSymbol) {
      neighboursCells.push(Direction.Right);
    }

    return neighboursCells;
  }
}
