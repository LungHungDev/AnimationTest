export interface CreateAnyObject {
  [key:string]:any
}

export interface FormValue {
  frame: number,
  frameRate: number,
  height: number,
  image_file: string,
  width: number
}

export class SpriteItem {
  key!: string;
  frame!: number;
  frameRate!: number;
  height!: number;
  width!: number;
  image_url!:string;
  constructor(sprite:any) {
    Object.assign(this,sprite);
  }
}

export class ImageObject {
  url:string = '';
  styleElement!:HTMLStyleElement
}