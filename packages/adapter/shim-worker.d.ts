declare module '*?worker' {
  class WebWorker extends Worker {
    constructor();
  }
  export default WebWorker;
}
