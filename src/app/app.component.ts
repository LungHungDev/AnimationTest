import { Component, OnInit, ComponentFactoryResolver, Renderer2, ViewContainerRef } from '@angular/core';
import { GameFrameComponent } from './game-frame/game-frame.component';
import { PackageService } from './service/package.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  gameElement?:HTMLElement;
  constructor(
    private renderer: Renderer2,
    private vCR: ViewContainerRef,
    private cFR: ComponentFactoryResolver
    // private packageService: PackageService
  ) {}

  ngOnInit() {
    // const aa: any = document.createElement('script');
    // aa.innerHTML = `
    // const myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
    // myModal.show();`;
    // document.body.appendChild(aa);
  }

  triggerEvent() {
    const frame = document.getElementById('renderer-frame')!;
    console.log(frame);
    this.removeChild(frame);
    this.createChild(frame)
  }

  createChild(frame:HTMLElement) {
    const cF = this.cFR.resolveComponentFactory(GameFrameComponent);
    const component = this.vCR.createComponent(cF);
    // component.instance.imgUrl = this.tempImage;
    this.gameElement = component.location.nativeElement;
    if(this.gameElement) frame.appendChild(this.gameElement);
  }

  removeChild(frame:HTMLElement) {
    if(!this.gameElement) return;
    frame.removeChild(this.gameElement);
  }
}

