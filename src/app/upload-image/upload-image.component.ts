import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import  { FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateAnyObject, FormValue, SpriteItem, ImageObject } from '../model/interface';
import Swal from 'sweetalert2';
import { PackageService } from '../service/package.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GameFrameComponent } from '../game-frame/game-frame.component';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnInit,AfterViewInit {
  @Output() createEvent = new EventEmitter<boolean>();
  MapKeys = Object.keys;

  /**
   * 可增加的動畫清單
   */
  // actionList = ['Idle','Move','Jump','Fall','custom1','custom2','custom3'];
  actionList = [
    { key:'Idle',button:null,name:'待機' },
    { key:'Move',button:'方向鍵左、右',name:'移動' },
    { key:'Jump',button:'空白鍵',name:'跳躍' },
    { key:'Fall',button:null,name:'落下' },
    { key:'Slide',button:'SHIFT',name:'迴避/翻滾'},
    { key:'Custom1',button:'Z',name:'自訂動作1' },
    { key:'Custom2',button:'X',name:'自訂動作2' },
    { key:'Custom3',button:'C',name:'自訂動作3' },
  ]

  /**
   * 存放動畫圖檔路徑和css動畫標籤
   */
  imageUrlGroup:{[key:string]:ImageObject} = {};

  /**
   * 存放創建動畫的表單
   */
  actionGroup:CreateAnyObject = {};

  /**
   * 存放要匯入phaser的精靈物件相關設定
   */
  spriteList:SpriteItem[] = [];

  constructor(
    private packageService: PackageService,
    public matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.actionGroup[this.actionList[0].key] = this.createForm();
    // this.importSubmit();
  }

  ngAfterViewInit() {
  }

  /**
   * 新增上傳表單 勾選後再次取消將會刪除以創建的相關物件
   * @param action change事件 
   * @param actionkey 勾選的動畫名稱
   */
  addType(action:any,actionkey:string) {
    if(action.target.checked) this.actionGroup[actionkey] = this.createForm();
    else {
      this.actionGroup[actionkey] = null;
      this.removeStyleChild(actionkey);
      delete this.actionGroup[actionkey];
      delete this.imageUrlGroup[actionkey];
      this.removeSprite(actionkey);
    }
  }

  /**
   * 回傳一個新建的創建動畫表單
   */
  createForm() {
    return new FormGroup({
      image_file: new FormControl(null, Validators.required),
      frame: new FormControl('', Validators.required),
      frameRate: new FormControl('', Validators.required),
      width: new FormControl('', Validators.required),
      height: new FormControl('', Validators.required),
      isSend: new FormControl(false)
    });
  }

  /**
   * 重整表單的同時刪除已經創建的相關物件
   * @param actionkey 動畫名稱
   */
  resetForm(actionkey:string) {
    this.actionGroup[actionkey].reset();
    this.removeStyleChild(actionkey);
    delete this.imageUrlGroup[actionkey];
    this.removeSprite(actionkey);
  }

  /**
   * 將上傳的圖片進行預覽
   * @param inputImage change事件
   * @param actionkey 動畫名稱
   */
  loadImage(inputImage:any,actionkey:string) {
    const file = inputImage.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event:any) => {
      this.imageUrlGroup[actionkey] = new ImageObject();
      this.imageUrlGroup[actionkey]['url'] = event.target.result;
    };
  }

  /**
   * 將設定的動畫進行預覽
   * @param formValue 該動畫設定的表單內容
   * @param actionkey 動畫名稱
   */
  previwerAndImport(formValue:FormValue,actionkey:string) {
    this.removeStyleChild(actionkey);

    //若動畫是正方形就做等比放大 大小為外框的1/2
    let scale = formValue.width == formValue.height ? this.getRemPixel() * 11 / formValue.width / 2 : 1;
    let keyFrames = `
    #${actionkey+'Show'} {
      width:${formValue.width}px;
      height:${formValue.height}px;
      background-image:url('${this.imageUrlGroup[actionkey].url}');
      animation: ${actionkey+'Show'} ${formValue.frame / formValue.frameRate}s steps(${formValue.frame}) infinite;
      transform: scale(${scale});
    }
    @keyframes ${actionkey+'Show'} {
      0% { background-position:    0px 0; }
      100% { background-position: ${formValue.width * formValue.frame}px 0; }
    }`;
    const style = document.createElement('style');
    style.innerHTML = keyFrames;
    this.imageUrlGroup[actionkey].styleElement = style;
    document.getElementsByTagName('head')[0].appendChild(style);
  }
  
  /**
   * 匯入生成遊戲的精靈圖列表
   * @param event 創建動畫表單
   * @param actionkey 動畫名稱
   */
  importSprite(form:any,actionkey:string) {
    const formValue:FormValue = form.value;
    this.spriteList.push(new SpriteItem({
      key:actionkey,
      frame:formValue.frame,
      frameRate:formValue.frameRate,
      height: formValue.height,
      width: formValue.width,
      image_url: this.imageUrlGroup[actionkey].url
    }))
    form.errors = { commit:true };
  }

  /**
   * 確定生成遊戲畫面
   */
  importSubmit() {
    const isRoleDefaultRight:any = document.getElementById('isRoleDefaultRight')!;
    this.packageService.isRoleDefaultRight = isRoleDefaultRight.checked;
    // if(this.spriteList.length < 1) {
    //   Swal.fire('錯誤', '請先上傳圖片並點擊確定匯入', 'error');
    //   return;
    // }
    const config:MatDialogConfig = {
      width: '850px',
      height: '648px',
      disableClose:true
    }
    this.packageService.getPackage(this.spriteList);
    // this.createEvent.emit(true);
    this.matDialog.open(GameFrameComponent,config)
  }

  checkSprite(actionkey:string) {
    return this.spriteList.filter(item => item.key == actionkey).length > 0;
  }

  removeSprite(actionkey:string) {
    this.spriteList = this.spriteList.filter(item => item.key !== actionkey);
  }

  /**
   * 如果已經創建過STYLE TAG了就先刪除
   * @param actionkey 動畫名稱
   */
  removeStyleChild(actionkey:string) {
    if(!this.imageUrlGroup[actionkey]) return;
    if(this.imageUrlGroup[actionkey].styleElement){
      document.getElementsByTagName('head')[0].removeChild(this.imageUrlGroup[actionkey].styleElement);
    };
  }

  /**
   * 取得1rem的px
   */
  getRemPixel() {
    const element = document.getElementsByClassName('previwer')[0];
    let rem = window.getComputedStyle(element)['fontSize'];
    return Number(rem.split('p')[0]);
  }

}
