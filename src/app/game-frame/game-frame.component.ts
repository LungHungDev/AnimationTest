import { Component, OnInit } from '@angular/core';
import 'phaser';

@Component({
  selector: 'app-game-frame',
  templateUrl: './game-frame.component.html',
  styleUrls: ['./game-frame.component.scss']
})
export class GameFrameComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  init() {
    const config:Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: 'view',
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
      // scene:[mainScene]
    }
  }

}
