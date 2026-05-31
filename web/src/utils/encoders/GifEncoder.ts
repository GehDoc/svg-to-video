import GIF from 'gif.js.optimized';

export class GifEncoder {
  private gif: GIF;

  constructor(width: number, height: number, transparentColor?: string) {
    // gif.js expects transparent as a hex string or number
    this.gif = new GIF({
      workers: 2,
      quality: 10,
      width,
      height,
      workerScript: '/assets/3rd-party/gif.worker.js',
      transparent: transparentColor,
      dither: false, // Disabling dither often looks better for SVGs
    });
  }

  addFrame(
    element: ImageData | CanvasRenderingContext2D | HTMLCanvasElement,
    delayMs: number
  ) {
    this.gif.addFrame(element, { delay: delayMs, copy: true });
  }

  async finalize(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.gif as any).on('finished', (blob: Blob) => {
        resolve(blob);
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.gif as any).on('error', (err: any) => {
        reject(err);
      });
      this.gif.render();
    });
  }
}
