class Notifier {
  public callback?: (shape: any) => void;

  public notify(shape: any) {
    if (this.callback) {
      this.callback(shape);
    }
  }
}

export default new Notifier();
