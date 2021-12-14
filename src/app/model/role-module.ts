import 'phaser';
import { SpriteItem } from "./interface";
import { MainScene } from "./main-scene";

export class RoleModule extends Phaser.Physics.Arcade.Sprite {
  constructor(private spritePackage: SpriteItem[], scene: MainScene) {
    super(scene,200,150,spritePackage[0].key);
    scene.physics.world.enableBody(this);
    this.setScale(1.5).anims.play('Idle',true);
  }
}