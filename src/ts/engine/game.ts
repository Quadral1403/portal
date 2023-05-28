import AssetLoader from "./assets/assetloader.js";
import AssetManager from "./assets/assetmanager.js";
import Services from "./dependencyinjection/services.js";
import EngineSetup from "./enginesetup.js";
import EntityManager from "./entitiy/entitymanager.js";
import InputHandler from "./input/inputhandler.js";
import LevelManager from "./level/levelmanager.js";
import Compositor from "./renderer/compositor.js";

class Game {
  private _assetLoader: AssetLoader;
  private _assetManager: AssetManager;
  private _inputHandler: InputHandler;
  private _entityManager: EntityManager;
  private _levelManager: LevelManager;
  private _compositor: Compositor;

  private _running: boolean;
  private _lastTick: number;
  private _lastRender: number;

  private _tpsGoal: number;

  private _currentTps: number;
  private _currentFps: number;

  get running(): boolean {
    return this._running;
  }

  get tps(): number {
    return this._currentTps;
  }

  get fps(): number {
    return this._currentFps;
  }

  constructor(htmlCanvasElement: HTMLCanvasElement, engineSetup: EngineSetup) {
    this._assetLoader = new AssetLoader();
    this._assetManager = new AssetManager();
    this._inputHandler = new InputHandler(htmlCanvasElement);
    this._entityManager = new EntityManager();
    this._levelManager = new LevelManager(
      this._assetManager,
      this._entityManager
    );
    this._compositor = new Compositor(htmlCanvasElement, this._entityManager);

    this._running = false;
    this._lastTick = Date.now();
    this._lastRender = Date.now();

    this._tpsGoal = 100;

    this._currentTps = 0;
    this._currentFps = 0;

    Services.register(this._assetLoader);
    Services.register(this._assetManager);
    Services.register(this._inputHandler);
    Services.register(this._entityManager);
    Services.register(this._levelManager);
    Services.register(this._compositor);
    Services.register(this);

    engineSetup.loadAssets(
      this._assetLoader,
      this._assetManager,
      this._entityManager,
      this._levelManager
    );

    while (!this._assetLoader.areAssetsReady()) {
      console.log("Loading assets...");
    }

    engineSetup.registerTextures(
      this._assetLoader,
      this._assetManager,
      this._entityManager,
      this._levelManager
    );

    engineSetup.registerLevels(
      this._assetLoader,
      this._assetManager,
      this._entityManager,
      this._levelManager
    );
  }

  public startUpdateLoop(): void {
    let updateLoopId: number = setInterval(() => {
      let now = Date.now();
      let tickDelta = now - this._lastTick;
      this._lastTick = now;
      this._currentTps = Math.round(1 / (tickDelta / 1000));

      this._entityManager.update(tickDelta);

      if (!this._running) {
        clearInterval(updateLoopId);
        console.log("Update loop stopped");
      }
    }, 1000 / this._tpsGoal);
  }

  public renderLoop(): void {
    let now = Date.now();
    let renderDelta = now - this._lastRender;
    this._lastRender = now;
    this._currentFps = Math.round(1 / (renderDelta / 1000));

    if (!document.hidden) {
      this._compositor.render(renderDelta);
    }

    if (this._running) {
      window.requestAnimationFrame(this.renderLoop.bind(this));
    } else {
      console.log("Render loop stopped");
      return;
    }
  }

  public startGame(): void {
    this._running = true;
    this.startUpdateLoop();
    this.renderLoop();
  }

  public stopGame(): void {
    this._running = false;
  }
}

export default Game;
