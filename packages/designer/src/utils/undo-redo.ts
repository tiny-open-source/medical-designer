import { cloneDeep } from 'lodash-es';

export class UndoRedo<T = any> {
  private stack: T[] = [];
  private stackCursor: number = 0;
  private stackMaxSize: number = 200;

  constructor(stackMaxSize: number = 200) {
    const minStackMaxSize = 2;
    this.stackMaxSize = Math.max(stackMaxSize, minStackMaxSize);
  }

  public pushElement(element: T): void {
    this.stack = this.stack.slice(0, this.stackCursor + 1);
    this.stack.push(cloneDeep(element));
    this.stackCursor = this.stack.length - 1;
    if (this.stack.length > this.stackMaxSize) {
      this.stack.shift();
    }
  }

  public canUndo(): boolean {
    return this.stackCursor > 0;
  }

  public undo(): T | null {
    if (!this.canUndo()) {
      return null;
    }
    this.stackCursor--;
    return this.getCurrent();
  }

  public canRedo(): boolean {
    return this.stackCursor < this.stack.length - 1;
  }

  public redo(): T | null {
    if (!this.canRedo()) {
      return null;
    }
    this.stackCursor++;
    return this.getCurrent();
  }

  public getCurrent(): T | null {
    if (this.stackCursor < 0) {
      return null;
    }
    return cloneDeep(this.stack[this.stackCursor]);
  }
}
