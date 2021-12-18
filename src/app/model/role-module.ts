import 'phaser';
import { SpriteItem } from "./interface";
import { MainScene } from "./main-scene";

export class RoleModule extends Phaser.Physics.Arcade.Sprite {

  hasMove:boolean = false;
  hasJump:boolean = false;
  hasFall:boolean = false;
  isPlayerAction:boolean = false;
  isJump:boolean = false;
  isSlide:boolean = false;
  isPlayerView:boolean = true;

  keys:any = this.scene.input.keyboard.addKeys('RIGHT,LEFT,Z,X,SPACE,SHIFT',false,true);

  constructor(private spritePackage: SpriteItem[],private layer:Phaser.Tilemaps.TilemapLayer,public scene: MainScene) {
    super(scene,400,400,spritePackage[0].key);
    scene.physics.world.enableBody(this);
    this.setCollideWorldBounds(true);
    scene.physics.add.collider(layer,this);
    this.setScale(1.5).anims.play('Idle',true);
    if(spritePackage.filter(action => action.key == 'Move').length > 0) this.hasMove = true;
    if(spritePackage.filter(action => action.key == 'Jump').length > 0) this.hasJump = true;
    if(spritePackage.filter(action => action.key == 'Fall').length > 0) this.hasFall = true;

    scene.events.on('update',() => {
      this.moveAction();
      this.jumpAction();
    });
  }

  moveAction() {
    if(!this.hasMove) return;
    //向左跑 Run
    if(this.keys.LEFT.isDown) {
      if(this.isPlayerAction) return;
      this.flipX = true;
      this.isPlayerView = false;
      this.setVelocityX(-150);
      if(!this.isJump) this.anims.play('Move',true);
      this.isPlayerAction = false;
  
      this.keys.LEFT.on('up',()=>{
        if(this.keys.RIGHT.isDown)  return;
        this.setVelocityX(0);
        if(this.isPlayerAction) return;
        this.anims.play('Idle',true);
      });
    }
    
    //向右跑 Run
    if(this.keys.RIGHT.isDown) {
      if(this.isPlayerAction) return;
      this.flipX = false;
      this.isPlayerView = true;
      this.setVelocityX(150);
      if(!this.isJump) this.anims.play('Move',true);
      this.isPlayerAction = false;
  
      this.keys.RIGHT.on('up',()=>{
        if(this.keys.LEFT.isDown) return;
        this.setVelocityX(0);
        if(this.isPlayerAction) return;
        this.anims.play('Idle',true);
      })
    }
  }

  jumpAction() {
    if(this.hasJump) return;
    //跳躍 Jump
    if(this.keys.SPACE.isDown) {
      if(this.isPlayerAction || this.isJump) return;
      this.isJump = true;
      this.anims.play('Jump',true).once('animationcomplete-' + 'Jump',()=> { 
        if(this.hasFall) this.anims.play('Fall',true);
        this.isJump  = false;
      });
      this.setVelocityY(-450);
    }
  }
}