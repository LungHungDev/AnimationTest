import 'phaser';
import { SpriteItem } from "./interface";
import { MainScene } from "./main-scene";

export class RoleModule extends Phaser.Physics.Arcade.Sprite {

  hasMove:boolean = false;
  hasJump:boolean = false;
  hasFall:boolean = false;
  hasSlide:boolean = false;
  hasCustom1:boolean = false;
  hasCustom2:boolean = false;
  hasCustom3:boolean = false;

  /**預設面向左邊 */
  isDefaultRight!:boolean;
  isPlayerAction:boolean = false;
  isJump:boolean = false;
  isSlide:boolean = false;
  isPlayerView:boolean = true;

  keys:any = this.scene.input.keyboard.addKeys('RIGHT,LEFT,Z,X,C,SPACE,SHIFT',false,true);

  constructor(private spritePackage: SpriteItem[],private isRoleDefaultRight:boolean,private layer:Phaser.Tilemaps.TilemapLayer,public scene: MainScene) {
    super(scene,400,400,spritePackage[0].key);
    this.isDefaultRight = isRoleDefaultRight
    scene.physics.world.enableBody(this);
    this.setCollideWorldBounds(true);

    scene.physics.add.collider(layer,this,()=> {
      if(this.isJump&&!this.isPlayerAction) {
        this.isJump = false;
        this.play('Idle',true);
      }});

    this.setScale(1.5).anims.play('Idle',true);
    if(spritePackage.filter(action => action.key == 'Move').length > 0) this.hasMove = true;
    if(spritePackage.filter(action => action.key == 'Jump').length > 0) this.hasJump = true;
    if(spritePackage.filter(action => action.key == 'Fall').length > 0) this.hasFall = true;
    if(spritePackage.filter(action => action.key == 'Slide').length > 0) this.hasSlide = true;
    if(spritePackage.filter(action => action.key == 'Custom1').length > 0) this.hasCustom1 = true;
    if(spritePackage.filter(action => action.key == 'Custom2').length > 0) this.hasCustom2 = true;
    if(spritePackage.filter(action => action.key == 'Custom3').length > 0) this.hasCustom3 = true;

    if(this.hasCustom1) this.keys.Z.on('down',()=> this.custimAction('Custom1'));
    if(this.hasCustom2) this.keys.X.on('down',()=> this.custimAction('Custom2'));
    if(this.hasCustom3) this.keys.C.on('down',()=> this.custimAction('Custom3'));
    if(this.hasSlide) this.keys.SHIFT.on('down',() => this.slideAction());
    
    scene.events.on('update',() => {
      this.moveAction();
      this.jumpAction();
    });

    //動作狀態清空 Idle
    this.on('animationcomplete',() => {
      this.isPlayerAction = false;
      this.anims.play('Idle',true);
    });
  }

  moveAction() {
    if(!this.hasMove) return;
    //向左跑 Run
    if(this.keys.LEFT.isDown) {
      if(this.isPlayerAction) return;
      this.flipX = this.isDefaultRight ? true : false;
      this.isPlayerView = false;
      this.setVelocityX(-150);
      if(!this.isJump) this.anims.play('Move',true);
      this.isPlayerAction = false;
  
      this.keys.LEFT.on('up',()=>{
        if(this.keys.RIGHT.isDown)  return;
        this.setVelocityX(0);
        if(this.isPlayerAction) return;
        if(!this.isJump) this.anims.play('Idle',true);
      });
    }
    
    //向右跑 Run
    if(this.keys.RIGHT.isDown) {
      if(this.isPlayerAction) return;
      this.flipX = this.isDefaultRight ? false : true;
      this.isPlayerView = true;
      this.setVelocityX(150);
      if(!this.isJump) this.anims.play('Move',true);
      this.isPlayerAction = false;
  
      this.keys.RIGHT.on('up',()=>{
        if(this.keys.LEFT.isDown) return;
        this.setVelocityX(0);
        if(this.isPlayerAction) return;
        if(!this.isJump) this.anims.play('Idle',true);
      })
    }
  }

  jumpAction() {
    if(!this.hasJump) return;
    //跳躍 Jump
    if(this.keys.SPACE.isDown) {
      if(this.isPlayerAction || this.isJump) return;
      this.isJump = true;
      this.anims.play('Jump',true).once('animationcomplete-' + 'Jump',()=> {
        if(this.hasFall) this.anims.play('Fall',true).once('animationcomplete-' + 'Fall',()=> {
          this.anims.play('Idle',true);
          this.isJump  = false;
        });
      });
      this.setVelocityY(-450);
    }
  }

  custimAction(customType:string) {
    if(this.isPlayerAction) return;
    this.isPlayerAction = true;
    if(!this.isJump) this.setVelocityX(0);
    
    const attack1 = this.anims.play(customType,true)
      .once('animationcomplete-' + customType,() => attack1.removeListener('animationupdate'))
  }

  slideAction() {
    if(this.isSlide) return;
    if(this.isPlayerAction) return;
    this.isPlayerAction = true;
    this.isSlide = true;
    setTimeout(() => this.x += this.isPlayerView ? 180: -180, 20);
    
    setTimeout(() => {
      this.isPlayerAction = false;
      setTimeout(() => this.isSlide = false, 1000);
    }, 300)
  }
}