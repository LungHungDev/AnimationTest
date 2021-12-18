import { Component, OnInit, OnDestroy } from '@angular/core';
import { MainScene } from '../model/main-scene';
import { PackageService } from '../service/package.service';
import 'phaser';
import { SpriteItem } from '../model/interface';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-game-frame',
  templateUrl: './game-frame.component.html',
  styleUrls: ['./game-frame.component.scss']
})
export class GameFrameComponent implements OnInit,OnDestroy {

  constructor(
    private packageService: PackageService,
    public dialogRef: MatDialogRef<GameFrameComponent>
  ) { }
  importPackage: SpriteItem[] = [];
  game?: Phaser.Game;

  ngOnInit(): void {
    this.importPackage = this.packageService.sendPackage();
    this.init();
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
    if(this.game) this.game.destroy(true);
  }

  closeGameFrame() {
    this.dialogRef.close();
  }

  init() {
    if(this.importPackage.length < 1) return;

    const mainScene = new MainScene(this.importPackage)
    const config:Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: 'game-view',
      backgroundColor: '#000000',
      antialias:false,
      roundPixels:true,
      autoFocus:true,
      disableContextMenu:true,
      transparent:false,
      preserveDrawingBuffer:false,
      failIfMajorPerformanceCaveat:true,
      banner:false,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x:0, y:1000 },
          // debug: true
        }
      },
      scene:[mainScene]
    }
    this.game = new Phaser.Game(config);
  }

}
