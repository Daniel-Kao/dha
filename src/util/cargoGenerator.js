
import {  WebGLRenderer, OrthographicCamera, AmbientLight, Scene, BoxGeometry, MeshBasicMaterial, Mesh, BoxHelper, } from "three";
import config from "./config";

export default class CargoGenerator {
  constructor(cargo) {
    this.length = cargo.length;
    this.width = cargo.width; 
    this.height = cargo.height;
    this.canvasWidth = 200;
    this.canvasHeight = 200;

    this.init();
  }
  init(){
     // let pixelRatio = window.devicePixelRatio < 1.5 ? 1.5 : window.devicePixelRatio;
     let pixelRatio = window.devicePixelRatio;
     this.renderer = new WebGLRenderer(
       {
         //将渲染保存到缓冲区，否则获取的图片会是空的
         preserveDrawingBuffer: true,//是否保留缓冲区直到手动清除或覆盖。默认值为false
         //增加下面两个属性，可以抗锯齿
         antialias: true,
         alpha: true
       }
     );
     this.renderer.setPixelRatio(pixelRatio);
     this.renderer.setSize(this.canvasWidth, this.canvasHeight);
 
     this.scene = new Scene();
 
     //创建相机
     /**
      * 正投影相机设置
      */
     let k = this.canvasWidth / this.canvasHeight; //窗口宽高比
     let s = 400; //三维场景显示范围控制系数，系数越大，显示的范围越大
     //创建相机对象
     this.camera = new OrthographicCamera(-s * k, s * k, s, -s, 1, 10000);
     this.camera.position.set(200, 300, 200); //设置相机位置
     this.camera.lookAt(this.scene.position); //设置相机方向(指向的场景对象)
     // this.camera.lookAt(new Vector3(0, 0, 0)); //设置相机方向(指向的场景对象)
 
     //创建灯光
     // this.light = new THREE.DirectionalLight(0xffffff, 2);
     this.light = new AmbientLight(0xffffff);
     this.scene.add(this.light);
     return this;
  }

  createCargo() {
    let geometry = new BoxGeometry(this.width, this.height, this.length);
    let material = new MeshBasicMaterial({
      color: config.DEFAULT_GOODS_COLOR,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1
    });

    this.__clearScene();
    let mesh = new Mesh(geometry, material);
    this.scene.add(mesh); //网格模型添加到场景中


    //获取包围球，重置相机位置
    mesh.geometry.computeBoundingSphere();
    let radius = mesh.geometry.boundingSphere.radius;
    this.camera.left = -radius;
    this.camera.right = radius;
    this.camera.top = -radius;
    this.camera.bottom = radius;
    let zoom = 300 / radius;
    mesh.scale.set(zoom, zoom, zoom);
    let box = new BoxHelper(mesh, config.DEFAULT_BOX_COLOR);
    this.scene.add(box);

    this.renderer.render(this.scene, this.camera);
    this.cargoImg = this.renderer.domElement.toDataURL("image/png");
  }

  __clearScene() {
    for (let i = this.scene.children.length - 1; i >= 0; i--) {
      if (this.scene.children[i].type === "Mesh")
        this.__doDispose(this.scene.children[i]);
      this.scene.remove(this.scene.children[i]);
    }
  }

  __doDispose(obj) {
    if (obj !== null) {
      for (var i = 0; i < obj.children.length; i++) {
        this.__doDispose(obj.children[i]);
      }
      if (obj.geometry) {
        obj.geometry.dispose();
        obj.geometry = undefined;
      }
      if (obj.material) {
        if (obj.material.map) {
          obj.material.map.dispose();
          obj.material.map = undefined;
        }
        obj.material.dispose();
        obj.material = undefined;
      }
    }
    obj = undefined;
  }
  dispose(){
    this.__clearScene();
    this.scene = undefined
  }
}