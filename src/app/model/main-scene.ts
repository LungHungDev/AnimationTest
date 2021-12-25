import { SpriteItem } from "./interface";
import { RoleModule } from "./role-module";
import 'phaser';
const MapKeys = Object.keys;

export class MainScene extends Phaser.Scene {
  constructor(private roleSprite: SpriteItem[],private isRoleDefaultRight:boolean) {
    super('MainScene');
  }

  preload() {
    // if(this.roleSprite.length < 1) {
    //   this.isRoleDefaultRight = false;
    //   let config = [];
    //   config[0] = new SpriteItem({
    //     key:'Idle',
    //     frame:5,
    //     frameRate:7,
    //     height:48,
    //     width:48,
    //     image_url:'assets/role_cow_old.png'
    //   });
    //   config[1] = new SpriteItem({
    //     key:'Slide',
    //     frame:3,
    //     frameRate:6,
    //     height:48,
    //     width:48,
    //     image_url:'assets/role_cow_jump.png'
    //   });
    //   config[2] = new SpriteItem({
    //     key:'Move',
    //     frame:3,
    //     frameRate:6,
    //     height:48,
    //     width:48,
    //     image_url:'assets/role_cow_jump.png'
    //   });
    //   this.roleSprite.push(config[0]);
    //   this.roleSprite.push(config[1]);
    //   this.roleSprite.push(config[2]);
    // }
    this.roleSprite.forEach(sprite => {
      this.load.spritesheet(sprite.key, sprite.image_url, { frameWidth:sprite.width, frameHeight:sprite.height })
    });
    // this.load.tilemapTiledJSON('platform','assets/animationtest.json');
    // this.load.image('tile','assets/Tile_set.png');

    this.load.tilemapTiledJSON('base-platform','assets/baseplatform.json');
    this.load.image('tile','assets/Tiles.png');
    this.load.image('back_0','assets/Background_0.png');
    this.load.image('back_1','assets/Background_1.png');
    this.load.image('back_2','assets/Background_2.png');
  }

  create() {
    let reapet = ['Idle','Move'];
    this.roleSprite.forEach(sprite => {
      console.log(sprite.key,reapet.includes(sprite.key));
      const config: Phaser.Types.Animations.Animation = {
        key:sprite.key,
        frames: this.anims.generateFrameNumbers(sprite.key, { start:0, end: (sprite.frame-1)}),
        frameRate: sprite.frameRate,
        repeat: reapet.includes(sprite.key) ? -1 : 0
      }
      this.anims.create(config);
    })

    // const platform = this.make.tilemap({key:'platform',tileWidth:8,tileHeight:8});
    // const tileset = platform.addTilesetImage('scene_03','tile');
    // const layer:any = platform.createLayer('Layer1',tileset,0,0);
    // platform.setCollisionBetween(145,167);
    // platform.setCollisionBetween(540,551);
    // this.physics.add.existing(layer,true)
    // layer.body.x = 0;
    // layer.body.y = 500;
    this.add.image(400,250,'back_0').setScale(2);
    this.add.image(400,250,'back_1').setScale(2);
    this.add.image(400,250,'back_2').setScale(2);

    const basePlatform = this.make.tilemap({key:'base-platform',tileWidth:16,tileHeight:16});
    const tileset = basePlatform.addTilesetImage('tile01','tile');
    const layer = basePlatform.createLayer('BaseLayer ',tileset,0,-40);
    basePlatform.setCollisionBetween(41,79);

    const role = this.add.existing(new RoleModule(this.roleSprite,this.isRoleDefaultRight,layer,this));
    this.physics.add.collider(layer,role)
  }
}