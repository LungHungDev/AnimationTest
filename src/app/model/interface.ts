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

export interface SpriteItem {
	key: string,
  frame: number
  frameRate: number,
  height: number,
  width: number,
  image_url:string
}