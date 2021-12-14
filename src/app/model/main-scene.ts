import { SpriteItem } from "./interface";
import { RoleModule } from "./role-module";
import 'phaser';
const MapKeys = Object.keys;

export class MainScene extends Phaser.Scene {
  constructor(private roleSprite: SpriteItem[]) {
    super('MainScene');
  }

  preload() {
    this.roleSprite.forEach(sprite => {
      this.load.spritesheet(sprite.key, sprite.image_url, { frameWidth:sprite.width, frameHeight:sprite.height })
    })
  }

  create() {
    this.roleSprite.forEach(sprite => {
      const config: Phaser.Types.Animations.Animation = {
        key:sprite.key,
        frames: this.anims.generateFrameNumbers(sprite.key, { start:0, end: (sprite.frame-1)}),
        frameRate: sprite.frameRate,
        repeat: -1
      }
      this.anims.create(config);
    })

    const role = this.add.existing(new RoleModule(this.roleSprite,this));
  }
}