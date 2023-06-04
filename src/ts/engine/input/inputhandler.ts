import EngineEvent from "../event/engineevent.js";
import EngineEventHandler from "../event/engineventhandler.js";
import Vector2D from "../math/vector2d.js";

class InputHandler {
  private _htmlCanvasElement: HTMLCanvasElement;
  private _mouseLocation: Vector2D;
  private _keystates: Map<string, boolean>;
  private _whiteListedKeys: string[];

  private _engineMouseMoveEvent: EngineEventHandler<
    MouseEvent,
    EngineEvent<MouseEvent>
  >;

  private _engineMouseClickEvent: EngineEventHandler<
    MouseEvent,
    EngineEvent<MouseEvent>
  >;

  private _engineKeyDownEvent: EngineEventHandler<
    KeyboardEvent,
    EngineEvent<KeyboardEvent>
  >;

  private _engineKeyUpEvent: EngineEventHandler<
    KeyboardEvent,
    EngineEvent<KeyboardEvent>
  >;

  get mouseAbsolute(): Vector2D {
    return this._mouseLocation;
  }

  get mouseRelative(): Vector2D {
    return new Vector2D(
      Math.floor(
        this._mouseLocation.x -
          this._htmlCanvasElement.getBoundingClientRect().left
      ),
      Math.floor(
        this._mouseLocation.y -
          this._htmlCanvasElement.getBoundingClientRect().top
      )
    );
  }

  get keystates(): Map<string, boolean> {
    return this._keystates;
  }

  get whiteListedKeys(): string[] {
    return this._whiteListedKeys;
  }

  get mouseMoveEvent(): EngineEventHandler<
    MouseEvent,
    EngineEvent<MouseEvent>
  > {
    return this._engineMouseMoveEvent;
  }

  get mouseClickEvent(): EngineEventHandler<
    MouseEvent,
    EngineEvent<MouseEvent>
  > {
    return this._engineMouseClickEvent;
  }

  get keyDownEvent(): EngineEventHandler<
    KeyboardEvent,
    EngineEvent<KeyboardEvent>
  > {
    return this._engineKeyDownEvent;
  }

  get keyUpEvent(): EngineEventHandler<
    KeyboardEvent,
    EngineEvent<KeyboardEvent>
  > {
    return this._engineKeyUpEvent;
  }

  constructor(htmlCanvasElement: HTMLCanvasElement) {
    this._htmlCanvasElement = htmlCanvasElement;
    this._mouseLocation = new Vector2D(0, 0);
    this._keystates = new Map<string, boolean>();
    this._whiteListedKeys = [];

    this._engineMouseMoveEvent = new EngineEventHandler<
      MouseEvent,
      EngineEvent<MouseEvent>
    >();
    this._engineMouseClickEvent = new EngineEventHandler<
      MouseEvent,
      EngineEvent<MouseEvent>
    >();
    this._engineKeyDownEvent = new EngineEventHandler<
      KeyboardEvent,
      EngineEvent<KeyboardEvent>
    >();
    this._engineKeyUpEvent = new EngineEventHandler<
      KeyboardEvent,
      EngineEvent<KeyboardEvent>
    >();

    window.addEventListener("mousemove", this.onMouseMove.bind(this));
    window.addEventListener("click", this.onMouseClick.bind(this));
    window.addEventListener("keydown", this.onKeyDown.bind(this));
    window.addEventListener("keyup", this.onKeyUp.bind(this));
  }

  private onMouseMove(mouseEvent: MouseEvent): void {
    this._mouseLocation = new Vector2D(mouseEvent.clientX, mouseEvent.clientY);
    this._engineMouseMoveEvent.dispatch(new EngineEvent(mouseEvent));
  }

  private onMouseClick(mouseEvent: MouseEvent): void {
    mouseEvent.preventDefault();
    this._engineMouseClickEvent.dispatch(new EngineEvent(mouseEvent));
  }

  private onKeyDown(keyboardEvent: KeyboardEvent): void {
    if (!this._whiteListedKeys.includes(keyboardEvent.key)) {
      if (!this.isKeyDown(keyboardEvent.key)) {
        this._keystates.set(keyboardEvent.key, true);
      }

      keyboardEvent.preventDefault();
      this._engineKeyDownEvent.dispatch(new EngineEvent(keyboardEvent));
    }
  }

  private onKeyUp(keyboardEvent: KeyboardEvent): void {
    if (!this._whiteListedKeys.includes(keyboardEvent.key)) {
      if (this.isKeyDown(keyboardEvent.key)) {
        this._keystates.set(keyboardEvent.key, false);
      }

      keyboardEvent.preventDefault();
      this._engineKeyUpEvent.dispatch(new EngineEvent(keyboardEvent));
    }
  }

  public isKeyDown(key: string): boolean {
    return (this._keystates.has(key) && this._keystates.get(key)) ?? false;
  }

  public addWhiteListedKey(key: string): void {
    if (!this._whiteListedKeys.includes(key)) {
      this._whiteListedKeys.push(key);
    }
  }

  public addWhiteListedKeys(keys: string[]): void {
    keys.forEach((key) => {
      this.addWhiteListedKey(key);
    });
  }

  public removeWhiteListedKey(key: string): void {
    let index = this._whiteListedKeys.indexOf(key);
    if (index >= 0) {
      this._whiteListedKeys.splice(index, 1);
    }
  }

  public removeWhiteListedKeys(keys: string[]): void {
    keys.forEach((key) => {
      this.removeWhiteListedKey(key);
    });
  }
}

export default InputHandler;
