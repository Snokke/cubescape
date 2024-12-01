import BaseScene from './Core2/BaseScene';
import './style.css';
import { inject } from '@vercel/analytics';

inject();

const baseScene = new BaseScene();

document.addEventListener('onLoad', () => {
  baseScene.createGameScene();

  setTimeout(() => baseScene.afterAssetsLoaded(), 300);
});

