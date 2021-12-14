import { Component, OnInit } from '@angular/core';
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
export class GameFrameComponent implements OnInit {

  constructor(
    private packageService: PackageService,
    public dialogRef: MatDialogRef<GameFrameComponent>
  ) { }
  importPackage: SpriteItem[] = []

  ngOnInit(): void {
    this.importPackage = this.packageService.sendPackage();
    this.init();
  }

  closeGameFrame() {
    this.dialogRef.close();
  }

  init() {
    console.log(this.importPackage);
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
          gravity: { x:0, y:0 },
          // debug: true
        }
      },
      scene:[mainScene]
    }
    const game = new Phaser.Game(config);
  }

}
