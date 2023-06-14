import AssetManager from "../../engine/assets/assetmanager.js";
import Services from "../../engine/dependencyinjection/services.js";
import MouseClickEvent from "../../engine/event/events/mouseclickevent/mouseclickevent.js";
import Game from "../../engine/game.js";
import LevelManager from "../../engine/level/levelmanager.js";
import Button from "../../engine/scene/elements/button.js";
import Text from "../../engine/scene/elements/text.js";
import Scene from "../../engine/scene/scene.js";
import SceneManager from "../../engine/scene/scenemanager.js";

class GameOver extends Scene {
  private _buttonLevelOverview: any;
  private _backToMainMenu: Button;
  private _runAgain: Button;

  public constructor() {
    super(
      Services.resolve<AssetManager>("AssetManager").getTexture(
        "level1-background"
      )
    );

    let title = new Text(
      400,
      100,
      "yellow",
      "bolder 50px Arial",
      "center",
      "middle",
      "Game Finished!",
      true
    );
    this._runAgain = new Button(
      250,
      200,
      300,
      50,
      "rgba(0, 0, 0, 0.5)",
      "white",
      "white",
      "black",
      "white",
      "green",
      1,
      "bold 20px Arial",
      "center",
      "middle",
      "Run Again",
      true
    );

    this._runAgain.onClick = (mouseClickEvent: MouseClickEvent) => {
      Services.resolve<SceneManager>("SceneManager").switchScene("ingame");
      Services.resolve<LevelManager>("LevelManager").start("level1");
    };

    this._backToMainMenu = new Button(
      250,
      300,
      300,
      50,
      "rgba(0, 0, 0, 0.5)",
      "white",
      "white",
      "black",
      "white",
      "green",
      1,
      "bold 20px Arial",
      "center",
      "middle",
      "Back to Main Menu",
      true
    );

    this._backToMainMenu.onClick = (mouseClickEvent: MouseClickEvent) => {
      Services.resolve<SceneManager>("SceneManager").switchScene("mainmenu");
    };

    this._buttonLevelOverview = new Button(
      250,
      400,
      300,
      50,
      "rgba(0, 0, 0, 0.5)",
      "white",
      "white",
      "black",
      "white",
      "green",
      1,
      "bold 20px Arial",
      "center",
      "middle",
      "Level Overview",
      true
    );

    this._buttonLevelOverview.onClick = (mouseClickEvent: MouseClickEvent) => {
      Services.resolve<SceneManager>("SceneManager").switchScene(
        "leveloverview"
      );
    };

    this.addElement(title);
    this.addElement(this._runAgain);
    this.addElement(this._backToMainMenu);
    this.addElement(this._buttonLevelOverview);
  }
}

export default GameOver;
