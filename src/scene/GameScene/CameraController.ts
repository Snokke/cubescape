import * as THREE from 'three';
import PlayerCharacter from './PlayerCharacter/PlayerCharacter';
import Cube from './Cube/Cube';
import { CubeState } from '../Enums/CubeState';
import ThreeJSHelper from '../Helpers/ThreeJSHelper';
import CameraConfig from '../Configs/Main/CameraConfig';
import { CubeSide } from '../Enums/CubeSide';
import { AxisByRotationDirection, CubeSideAxisConfig } from '../Configs/SideConfig';
import { CubeRotationDirection } from '../Enums/CubeRotationDirection';

export class CameraController extends THREE.Group {
  private camera: THREE.PerspectiveCamera;
  private playerCharacter: PlayerCharacter;
  private cube: Cube;
  private playerCharacterWorldPosition: THREE.Vector3 = new THREE.Vector3();

  private lookAtPosition: THREE.Vector3 = new THREE.Vector3();
  private lookDirection: THREE.Vector3 = new THREE.Vector3();

  constructor(camera: THREE.PerspectiveCamera) {
    super();

    this.camera = camera;
  }

  public update(dt: number): void {
    if (CameraConfig.followPlayer.enabled) {
      this.followPlayerCharacter(dt);
    }

    if (CameraConfig.lookAtPlayer.enabled) {
      this.lookAtPlayerCharacter(dt);
    }

    if (CameraConfig.rotationByPlayerPosition.enabled) {
      this.rotateByPlayerPosition(dt);
    }
  }

  public setPlayerCharacter(playerCharacter: PlayerCharacter): void {
    this.playerCharacter = playerCharacter;

    this.lookAtPosition = this.playerCharacter.getWorldPosition(new THREE.Vector3());
  }

  public setCube(cube: Cube): void {
    this.cube = cube;
  }

  private followPlayerCharacter(dt: number): void {
    if (this.playerCharacter.isActivated()) {
      let lerpFactor = CameraConfig.followPlayer.lerpFactor * 60;

      if (this.cube.getState() === CubeState.Rotating) {
        lerpFactor = CameraConfig.followPlayer.lerpFactorCubeRotating * 60;
      }

      this.playerCharacter.getWorldPosition(this.playerCharacterWorldPosition);

      this.camera.position.x = ThreeJSHelper.lerp(this.camera.position.x, this.playerCharacterWorldPosition.x, lerpFactor * dt);
      this.camera.position.y = ThreeJSHelper.lerp(this.camera.position.y, this.playerCharacterWorldPosition.y, lerpFactor * dt);

      this.camera.lookAt(this.camera.position.x, this.camera.position.y, 0);
    }
  }

  private lookAtPlayerCharacter(dt: number): void {
    if (this.playerCharacter.isActivated()) {
      const targetPosition = this.playerCharacter.getWorldPosition(new THREE.Vector3());
      this.lookDirection.subVectors(targetPosition, this.camera.position).normalize();

      let lerpFactor = CameraConfig.lookAtPlayer.lerpFactor * 60;

      if (this.cube.getState() === CubeState.Rotating) {
        lerpFactor = CameraConfig.lookAtPlayer.lerpFactorCubeRotating * 60;
      }

      this.lookAtPosition.lerp(targetPosition, lerpFactor * dt);

      this.camera.lookAt(this.lookAtPosition);
    }
  }

  private rotateByPlayerPosition(dt: number): void {
    if (this.playerCharacter.isActivated()) {
      const cubeSide: CubeSide = this.cube.getCurrentSide();
      const cubeSideAxisConfig = CubeSideAxisConfig[cubeSide];
      const cubeRotationDirection: CubeRotationDirection = this.cube.getCurrentRotationDirection();

      const positionX: number = this.playerCharacter.position[cubeSideAxisConfig.xAxis] * cubeSideAxisConfig.xFactor;
      const positionY: number = this.playerCharacter.position[cubeSideAxisConfig.yAxis] * cubeSideAxisConfig.yFactor;

      const { x, y } = AxisByRotationDirection[cubeRotationDirection](positionX, positionY);
      let lerpFactor = CameraConfig.rotationByPlayerPosition.lerpFactor * 60 * dt;

      this.camera.position.x = ThreeJSHelper.lerp(this.camera.position.x, x * CameraConfig.rotationByPlayerPosition.distanceCoefficient, lerpFactor);
      this.camera.position.y = ThreeJSHelper.lerp(this.camera.position.y, -y * CameraConfig.rotationByPlayerPosition.distanceCoefficient, lerpFactor);

      this.camera.lookAt(0, 0, 0);
    }
  }
}
