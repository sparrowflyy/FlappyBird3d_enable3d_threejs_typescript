import {Bird} from './Bird'
import * as THREE from 'three'
import { Keyboard } from './GameBase/Keyboard'
import { AmmoPhysics, ExtendedMesh, PhysicsLoader} from '@enable3d/ammo-physics'
import {GameEvent, MoveEvent, EventTypes} from './GameBase/Event'
import * as Utils from './GameBase/Utils'
import {Tubes} from './Tubes'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TextTexture, TextSprite } from '@enable3d/three-graphics/jsm/flat'
import Ammo from 'ammojs-typed'
namespace Events {
  export const FlyEvent: MoveEvent = new MoveEvent(new THREE.Vector3(0.0, 0.0, 25));
}

export class FlappyBird {
  //game components
  private started: boolean = false;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private scene2d: THREE.Scene;
  private camera2d: THREE.OrthographicCamera;
  private keyboard: Keyboard;
  private physics: AmmoPhysics;
  private clock : THREE.Clock;
  readonly tubeHeight: number = 50;
  private score: number = 0;
  //game objects
  private bird!: Bird
  private tubes!: Array<Tubes>;
  //utils
  private defaultBirdPos: THREE.Vector3 = new THREE.Vector3(0.0, 0.0, 5.0);
  constructor() {
    this.keyboard = new Keyboard();
    this.scene = new THREE.Scene();
    let Width = window.innerWidth;
    let Height = window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(50, (Width) / (Height), 40, 2000);
    this.camera.position.set(this.defaultBirdPos.x, this.defaultBirdPos.y - 54, this.defaultBirdPos.z);
    this.camera.lookAt(this.defaultBirdPos);

      // 2d camera/2d scene
    this.scene2d = new THREE.Scene()
    this.camera2d = new THREE.OrthographicCamera(0, Width, Height, 0, 1, 1000)
    this.camera2d.position.setZ(10)

    // add 2d text
    this.updateScoreText();
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setClearColor(0x000000, 0); // the default
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  
    //new OrbitControls(this.camera, this.renderer.domElement)
    var light = new THREE.HemisphereLight(0xffffff, 1, 1);
    light.position.set(this.defaultBirdPos.x , this.defaultBirdPos.y - 45, this.defaultBirdPos.z);
    light.lookAt(this.defaultBirdPos);
    this.scene.add(light);

    document.body.appendChild(this.renderer.domElement);
    window.addEventListener("resize", this.onWindowResize.bind(this), false);
    // physics
    this.physics = new AmmoPhysics(this.scene as any);
    //this.physics.debug!.enable();
    this.physics.setGravity(0.0, 0.0, -100);
    //init objects
    this.initGameObjects();
    //clock
    this.clock = new THREE.Clock()
  }
  private updateScoreText() {
    const text = new TextTexture(`Score: ${this.score}`, { fontWeight: 'bold', fontSize: 48 })
    const sprite = new TextSprite(text)
    const scale = 0.5
    sprite.setScale(scale)
    sprite.setPosition(0 + (text.width * scale) / 2 + 12, window.innerHeight - (text.height * scale) / 2 - 12)
    this.scene2d.clear();
    this.scene2d.add(sprite);
  }
  private updateScore() {
    for (let tube of this.tubes) {
      if (tube.position.x < this.defaultBirdPos.x - tube.radius && !tube.passed) {
        this.score++;
        tube.passed = true;
      }
    }
    this.updateScoreText();
  }
  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera2d.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  private render(): void {
    this.renderer.autoClear = true;
    this.renderer.render(this.scene, this.camera);
    this.renderer.autoClear = false;
    this.renderer.render(this.scene2d, this.camera2d)
  }
  private pollKeyboard() {
    let events = this.keyboard.getEvents();
    for (let e of events) {
      //bird jumps
      if ((e.key == ' ' || e.code == 'Space' || e.key == 'w' || e.key == 'ц') && e.type == 'keypress') {
        this.bird.onEvent(Events.FlyEvent);
        if (!this.started)
          this.started = true;
      }
    }
  }
  private initGameObjects() {
    //bird
    this.bird = new Bird(this.defaultBirdPos, this.physics);
    this.bird.addToScene(this.scene);

    //tubes
    this.tubes = [];
    this.tubes.push(new Tubes(this.tubeHeight, new THREE.Vector3(this.defaultBirdPos.x + 30, this.defaultBirdPos.y, this.defaultBirdPos.z - this.tubeHeight/2), this.physics));
    this.tubes[0].addToScene(this.scene);
    for (let i = 1; i < 30; i++) {
      this.tubes.push(new Tubes(this.tubeHeight, new THREE.Vector3(this.tubes[i-1].position.clone().x + Utils.genRandFloat(15, 40), this.defaultBirdPos.y, this.defaultBirdPos.z - this.tubeHeight/2), this.physics));
      this.tubes[i].addToScene(this.scene);
    }
    this.bird.meshes[0].body.on.collision((otherObject, event) => {
      this.restart();
    })
  }

  private checkAddTube() {
    if (this.tubes[0].position.x < this.defaultBirdPos.x - 150) {
      let tube = this.tubes.shift();
      tube!.removeFromScene(this.scene);
      tube!.destroyPhysics(this.physics);
    }
    if (this.tubes.length <= 15) {
      for (let i = 0; i < 15; i++) {
        this.tubes.push(new Tubes(this.tubeHeight, new THREE.Vector3(this.tubes[this.tubes.length - 1].position.clone().x + Utils.genRandFloat(15, 40), 
          this.defaultBirdPos.y, this.defaultBirdPos.z - this.tubeHeight/2), this.physics));
        this.tubes[this.tubes.length - 1].addToScene(this.scene);
      }
    }
  }
  private checkBird() {
    if (this.bird.meshes[0].position.z > this.tubeHeight/2 + this.defaultBirdPos.z + 5 || this.bird.meshes[0].position.z < - this.tubeHeight/2 - 5)
      this.restart();
  }
  private clearScene() {
    this.bird.removeFromScene(this.scene);
    this.bird.destroyPhysics(this.physics);
    for (let tube of this.tubes) {
      tube.removeFromScene(this.scene);
      tube.destroyPhysics(this.physics);
    }
  }
  private restart() {
    this.clearScene();
    this.started = false;
    this.score = 0;
    this.updateScoreText();
    this.initGameObjects();
  }
  //todo: add more accurate physics
  public loop() : void {
    let dt: number = this.clock.getDelta() * 1000;
    this.pollKeyboard();
    if (this.started) {
      this.bird.update(dt);
      for (let tube of this.tubes)
        tube.update(dt);
      this.checkBird();
      this.checkAddTube();
      this.updateScore();
      this.physics.update(dt)
      this.physics.updateDebugger()
    }
    this.render();
    requestAnimationFrame(() => this.loop());
  }
}

Ammo().then(() => {
  let game = new FlappyBird();
  game.loop();});
