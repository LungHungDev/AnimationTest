import { Component, OnInit, AfterViewInit } from '@angular/core';
import  { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
interface ImageActionUrl {
  [key:string]:any
}
interface FormValue {
  frame: 10
  frameRate: number,
  height: number,
  image_file: string,
  width: number
}

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnInit,AfterViewInit {
  MapKeys = Object.keys;

  // IdleForm = new FormGroup({
  //   image_file: new FormControl(null, Validators.required),
  //   frame: new FormControl('', Validators.required),
  //   frameRate: new FormControl('', Validators.required),
  //   width: new FormControl('', Validators.required),
  //   height: new FormControl('', Validators.required),
  // });

  actionType = {
    Idle:null,
    Move:null,
    Jump:null,
    Fall:null
  };

  imageUrlGroup:ImageActionUrl = {};
  actionGroup:ImageActionUrl = {};

  constructor() { }

  ngOnInit(): void {
    this.actionGroup[this.MapKeys(this.actionType)[0]] = this.createForm();
  }

  ngAfterViewInit() {
  }

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
    });
  }

  uploadSubmit(formValue:any) {
    if(!formValue.image_file) {
      Swal.fire('錯誤', '請先上傳圖片並點擊載入圖片', 'error');
      return;
    }
    console.log(formValue);
  }

  loadImage(inputImage:any,actionkey:string) {
    const file = inputImage.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event:any) => this.imageUrlGroup[actionkey] = event.target.result;
  }

  previwer(action_name:string,formValue:FormValue) {
    let scale = formValue.width == formValue.height ? this.getRemPixel() * 15 / formValue.width / 2 : 1;
    const style = document.createElement('style');
    let keyFrames = `\
    #${action_name+'Show'} { \
      width:${formValue.width}px;\
      height:${formValue.height}px;\
      background-image:url('${this.imageUrlGroup[action_name]}');\
      animation: ${action_name+'Show'} ${formValue.frame / formValue.frameRate}s steps(${formValue.frame}) infinite;\
      transform: scale(${scale});\
    }\
    @keyframes ${action_name+'Show'} {\
      0% { background-position:    0px 0; }\
      100% { background-position: ${formValue.width * formValue.frame}px 0; }\
    }`;
    style.innerHTML = keyFrames;
    document.getElementsByTagName('head')[0].appendChild(style);
  }

  getRemPixel() {
    const element = document.getElementsByClassName('previwer')[0];
    let rem = window.getComputedStyle(element)['fontSize'];
    return Number(rem.split('p')[0]);
  }

}
