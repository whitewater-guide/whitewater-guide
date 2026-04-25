type ShapeCallback = (
  shape: [CodegenCoordinates | undefined, CodegenCoordinates | undefined],
) => void;

class Notifier {
  public callback?: ShapeCallback;

  public notify(
    shape: [CodegenCoordinates | undefined, CodegenCoordinates | undefined],
  ) {
    this.callback?.(shape);
  }
}

export default new Notifier();
