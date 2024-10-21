import * as THREE from 'three';
import Loader from '../../../core/loader';
import ThreeJSHelper from '../../Helpers/ThreeJSHelper';
import GameplayConfig from '../../Configs/Main/GameplayConfig';
import { ILevelConfig } from '../../Interfaces/ILevelConfig';
import CornerCellsConfig from '../../Configs/CornerCellsConfig';
import { EdgeAxisConfig, EdgeDistanceConfig } from '../../Configs/EdgeConfig';
import { ICubeSideAxisConfig, IEdgeAxisConfig } from '../../Interfaces/ICubeConfig';
import CubeHelper from '../../Helpers/CubeHelper';
import { CellType } from '../../Enums/CellType';
import InstancesHelper from '../../Helpers/InstancesHelper';
import { CellModelType } from '../../Enums/CellModelType';
import { CellModelConfig } from '../../Configs/CellModelConfig';
import { CubeSideAxisConfig, SideVectorConfig } from '../../Configs/SideConfig';
import { CubeSide } from '../../Enums/CubeSide';

export default class CubeViewBuilder extends THREE.Group {
  private mainMaterial: THREE.MeshStandardMaterial;
  private levelConfig: ILevelConfig;

  private corners: THREE.Mesh[] = [];
  private edgeCellsInstanced: THREE.InstancedMesh;
  private sideCellsInstanced: { [key in CellModelType]?: THREE.InstancedMesh } = {};

  constructor() {
    super();

    this.initMaterial();
  }

  public init(levelConfig: ILevelConfig): void {
    this.levelConfig = levelConfig;

    this.initCorners();
    this.initEdges();
    this.initSides();
  }

  public removeView(): void {
    ThreeJSHelper.killObjects(this.corners, this);
    ThreeJSHelper.killInstancedMesh(this.edgeCellsInstanced, this);
    
    for (let wallCellType in this.sideCellsInstanced) {
      ThreeJSHelper.killInstancedMesh(this.sideCellsInstanced[wallCellType], this);
    }

    this.corners = [];
    this.edgeCellsInstanced = null;
    this.sideCellsInstanced = {};
  }

  private initCorners(): void {
    const distance = new THREE.Vector3(
      (this.levelConfig.size.x + 1) * 0.5 * GameplayConfig.grid.size,
      (this.levelConfig.size.y + 1) * 0.5 * GameplayConfig.grid.size,
      (this.levelConfig.size.z + 1) * 0.5 * GameplayConfig.grid.size,
    );

    for (let i = 0; i < CornerCellsConfig.length; i++) {
      const cornerConfig = CornerCellsConfig[i];

      const geometry: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel(cornerConfig.model);

      const cornerCell = new THREE.Mesh(geometry, this.mainMaterial);
      this.add(cornerCell);

      cornerCell.position.x = cornerConfig.position.x * distance.x;
      cornerCell.position.y = cornerConfig.position.y * distance.y;
      cornerCell.position.z = cornerConfig.position.z * distance.z;

      cornerCell.rotation.x = cornerConfig.rotation.x;
      cornerCell.rotation.y = cornerConfig.rotation.y;
      cornerCell.rotation.z = cornerConfig.rotation.z;

      cornerCell.scale.set(GameplayConfig.grid.scale, GameplayConfig.grid.scale, GameplayConfig.grid.scale);

      this.corners.push(cornerCell);
    }
  }

  private initEdges(): void {
    const geometry = new THREE.BoxGeometry(GameplayConfig.grid.size, GameplayConfig.grid.size, GameplayConfig.grid.size);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ffff });

    const distance = new THREE.Vector3(
      (this.levelConfig.size.x + 1) * 0.5 * GameplayConfig.grid.size,
      (this.levelConfig.size.y + 1) * 0.5 * GameplayConfig.grid.size,
      (this.levelConfig.size.z + 1) * 0.5 * GameplayConfig.grid.size,
    );

    const edgeCells: THREE.Object3D[] = [];

    for (let i = 0; i < EdgeAxisConfig.length; i++) {
      const edgeAxisConfig: IEdgeAxisConfig = EdgeAxisConfig[i];
      const edgeSize: number = this.levelConfig.size[edgeAxisConfig.axis];
      
      for (let j = 0; j < edgeSize; j++) {
        if (CubeHelper.getCellTypeBySymbol(this.levelConfig.map.edges[edgeAxisConfig.edge][j]) === CellType.Wall) {
          const edgeCell = new THREE.Object3D();

          edgeCell.position.x = EdgeDistanceConfig[i].x * distance.x;
          edgeCell.position.y = EdgeDistanceConfig[i].y * distance.y;
          edgeCell.position.z = EdgeDistanceConfig[i].z * distance.z;

          edgeCell.position[edgeAxisConfig.axis] += j * GameplayConfig.grid.size + GameplayConfig.grid.size * 0.5 - edgeSize * 0.5 * GameplayConfig.grid.size;

          edgeCell.scale.set(GameplayConfig.grid.scale, GameplayConfig.grid.scale, GameplayConfig.grid.scale);

          edgeCells.push(edgeCell);
        }
      }
    }

    const edgeCellsInstanced = this.edgeCellsInstanced = InstancesHelper.createStaticInstancedMesh(edgeCells, material, geometry);
    this.add(edgeCellsInstanced);

    edgeCellsInstanced.receiveShadow = true;
    edgeCellsInstanced.castShadow = true;
  }

  private initSides(): void {
    const dungeonTexture = Loader.assets['dungeon_texture'];
    dungeonTexture.flipY = false;
    const dungeonMaterial = new THREE.MeshStandardMaterial({
      map: dungeonTexture,
    });

    const cellsObjectsByType: { [key in CellModelType]?: THREE.Object3D[]} = {};

    for (const side in CubeSide) {
      const cubeSide: CubeSide = CubeSide[side];
      const cubeSideAxisConfig: ICubeSideAxisConfig = CubeSideAxisConfig[cubeSide];
      const sizeX: number = this.levelConfig.size[cubeSideAxisConfig.xAxis];
      const sizeY: number = this.levelConfig.size[cubeSideAxisConfig.yAxis];

      for (let i = 0; i < sizeY; i++) {
        for (let j = 0; j < sizeX; j++) {
          const cellType: CellType = CubeHelper.getCellTypeBySymbol(this.levelConfig.map.sides[cubeSide][i][j]);

          if (cellType === CellType.Empty || cellType === CellType.Wall) {
            const sideCell = new THREE.Object3D();

            const distance: number = (this.levelConfig.size[cubeSideAxisConfig.zAxis] + 1) * 0.5 * GameplayConfig.grid.size;
            const offsetX: number = (this.levelConfig.size[cubeSideAxisConfig.xAxis] - 1) * 0.5 * GameplayConfig.grid.size;
            const offsetY: number = (this.levelConfig.size[cubeSideAxisConfig.yAxis] - 1) * 0.5 * GameplayConfig.grid.size;

            sideCell.position.x = SideVectorConfig[cubeSide].x * distance;
            sideCell.position.y = SideVectorConfig[cubeSide].y * distance;
            sideCell.position.z = SideVectorConfig[cubeSide].z * distance;

            sideCell.position[cubeSideAxisConfig.xAxis] += j * GameplayConfig.grid.size * cubeSideAxisConfig.xFactor - offsetX * cubeSideAxisConfig.xFactor;
            sideCell.position[cubeSideAxisConfig.yAxis] += i * GameplayConfig.grid.size * cubeSideAxisConfig.yFactor - offsetY * cubeSideAxisConfig.yFactor;

            CubeHelper.setSideRotation(sideCell, cubeSide);

            sideCell.scale.set(GameplayConfig.grid.scale, GameplayConfig.grid.scale, GameplayConfig.grid.scale);

            const wallCellType: CellModelType = this.getWallCellType(cellType);

            if (!cellsObjectsByType[wallCellType]) {
              cellsObjectsByType[wallCellType] = [];
            }

            cellsObjectsByType[wallCellType].push(sideCell);
          }
        }
      }
    }

    for (let wallCellType in cellsObjectsByType) {
      const modelName: string = CellModelConfig[wallCellType].model;
      const geometry: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel(modelName);
    //   const material: THREE.Material = new THREE.MeshStandardMaterial({ color: CellModelConfig[wallCellType].color });
      ThreeJSHelper.setGeometryRotation(geometry, new THREE.Euler(Math.PI * 0.5, Math.PI * 0.5, 0));

      const sideCellsInstanced = InstancesHelper.createStaticInstancedMesh(cellsObjectsByType[wallCellType], dungeonMaterial, geometry);
      this.add(sideCellsInstanced);

      sideCellsInstanced.receiveShadow = true;
    //   sideCellsInstanced.castShadow = true;

      this.sideCellsInstanced[wallCellType] = sideCellsInstanced;
    }
  }

  private getWallCellType(cellType: CellType): CellModelType {
    switch (cellType) {
      case CellType.Empty:
        return CellModelType.Road;
      case CellType.Wall:
        return CellModelType.Roof;
      default:
        return null;
    }
  }

  private initMaterial(): void {
    const texture = Loader.assets['dungeon_texture'];
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;

    this.mainMaterial = new THREE.MeshStandardMaterial({
      map: texture,
    });
  }
}