import { Component, OnInit, AfterViewInit } from '@angular/core';
import  { FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateAnyObject, FormValue, SpriteItem } from '../model/interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnInit,AfterViewInit {
  MapKeys = Object.keys;
  anyboolean:boolean = true;

  actionType = {
    Idle:null,
    Move:null,
    Jump:null,
    Fall:null
  };

  imageUrlGroup:CreateAnyObject = {};
  actionGroup:CreateAnyObject = {};
  spriteList:SpriteItem[] = [];

  constructor() { }

  ngOnInit(): void {
    this.actionGroup[this.MapKeys(this.actionType)[0]] = this.createForm();
  }

  ngAfterViewInit() {
  }

  /**
   * 新增上傳表單
   * @param action change事件 
   * @param actionkey 勾選的動畫名稱
   */
  addType(action:any,actionkey:string) {
    if(action.target.checked) this.actionGroup[actionkey] = this.createForm();
    else {
      this.actionGroup[actionkey] = null;
      delete this.actionGroup[actionkey];
    }
  }

  createForm() {
    return new FormGroup({
      image_file: new FormControl(null, Validators.required),
      frame: new FormControl('', Validators.required),
      frameRate: new FormControl('', Validators.required),
      width: new FormControl('', Validators.required),
      height: new FormControl('', Validators.required),
      isSend: new FormControl('false')
    });
  }

  resetForm(actionkey:string) {
    this.actionGroup[actionkey].reset();
    delete this.imageUrlGroup[actionkey];

    //覆蓋previwer id的style tag
    const style = document.createElement('style');
    style.innerHTML = `\
    #${actionkey+'Show'} { \
      width:0px;\
      height:0px;\
      background-image:url('');\
      animation: ${actionkey+'Show'} 0s steps(0) infinite;\
      transform: scale(0);\
    }\
    @keyframes ${actionkey+'Show'} {\
      0% { background-position:    0px 0; }\
      100% { background-position: 0px 0; }\
    }`;
    document.getElementsByTagName('head')[0].appendChild(style);
  }

  uploadSubmit(formValue:any) {
    if(!formValue.image_file) {
      Swal.fire('錯誤', '請先上傳圖片並點擊載入圖片', 'error');
      return;
    }
    console.log(formValue);
  }

  /**
   * 將上傳的圖片進行預覽
   * @param inputImage change事件
   * @param actionkey 動畫名稱
   */
  loadImage(inputImage:any,actionkey:string) {
    const file = inputImage.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event:any) => this.imageUrlGroup[actionkey] = event.target.result;
  }

  /**
   * 將設定的動畫進行預覽 同時匯入建置陣列
   * @param actionkey 動畫名稱
   * @param formValue 該動畫設定的表單內容
   */
  previwerAndImport(actionkey:string,formValue:FormValue) {
    console.log(this.actionGroup[actionkey].valid, this.anyboolean);
    let scale = formValue.width == formValue.height ? this.getRemPixel() * 11 / formValue.width / 2 : 1;
    const style = document.createElement('style');
    let keyFrames = `\
    #${actionkey+'Show'} { \
      width:${formValue.width}px;\
      height:${formValue.height}px;\
      background-image:url('${this.imageUrlGroup[actionkey]}');\
      animation: ${actionkey+'Show'} ${formValue.frame / formValue.frameRate}s steps(${formValue.frame}) infinite;\
      transform: scale(${scale});\
    }\
    @keyframes ${actionkey+'Show'} {\
      0% { background-position:    0px 0; }\
      100% { background-position: ${formValue.width * formValue.frame}px 0; }\
    }`;
    style.innerHTML = keyFrames;
    document.getElementsByTagName('head')[0].appendChild(style);
    this.anyboolean = false;
    console.log(this.actionGroup[actionkey].valid, this.anyboolean);
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
