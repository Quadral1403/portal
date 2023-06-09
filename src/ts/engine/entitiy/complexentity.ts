import Texture from "../assets/texture/texture.js";
import Vector2D from "../math/vector2d.js";
import ComplexEntityBuilder from "./complexentitybuilder.js";
import Entity from "./entity.js";

class ComplexEntity extends Entity {
  private _parts: Map<Vector2D, Entity>;

  public get parts(): Map<Vector2D, Entity> {
    return this._parts;
  }

  constructor(complexEntityBuilder: ComplexEntityBuilder) {
    super(
      complexEntityBuilder.x,
      complexEntityBuilder.y,
      complexEntityBuilder.rotation,
      complexEntityBuilder.centerOfMassX,
      complexEntityBuilder.centerOfMassY,
      complexEntityBuilder.scalingX,
      complexEntityBuilder.scalingY,
      complexEntityBuilder.static,
      complexEntityBuilder.expansionX,
      complexEntityBuilder.expansionY,
      complexEntityBuilder.passThrough,
      complexEntityBuilder.texture
    );
    this._parts = complexEntityBuilder.parts;
  }

  public update(tickDelta: number) {
    super.update(tickDelta);
    for (let part of this._parts) {
      part[1].update(tickDelta);
      part[1].teleport(this._location.add(part[0]));
    }
  }
}

export default ComplexEntity;
