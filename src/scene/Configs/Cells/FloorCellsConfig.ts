import * as THREE from 'three';
import { CellType } from "../../Enums/CellType";
import { ICellModelConfig, IGeometryRotationConfig } from '../../Interfaces/ICellConfig';

const FloorModelsConfig: ICellModelConfig = {
  probabilities: [0.9, 0.04, 0.03, 0.03],
  models: ['floor_01', 'floor_02', 'floor_03', 'floor_04'],
}

const FloorCellTypes: CellType[] = [
  CellType.Empty,
  CellType.Start,
  CellType.Finish,
]

const FloorCellsGeometryConfig: IGeometryRotationConfig = {
  rotation: new THREE.Euler(Math.PI * 0.5, Math.PI * 0.5, 0),
}


export { FloorModelsConfig, FloorCellTypes, FloorCellsGeometryConfig };