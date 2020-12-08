import { Component } from './component';
import { IEditCellNode, CellValue } from './interface';
import { addCssClass, getInputValue, removeCssClass, setInputValue } from './utils';

const SELECTED_CLASS = 'sheetsjs-edit-cell-selected';
const EDIT_CELL_INPUT_REF = 'edit-cell-input';

export class EditCell extends Component implements IEditCellNode {
  static getTemplate() {
    return `<div class="sheetsjs-edit-cell"><input xs-ref="${EDIT_CELL_INPUT_REF}" class="sheetsjs-edit-cell-input" /></div>`;
  }

  public isDisplay = false;
  private data: CellValue | null = null;
  private inputRef!: HTMLInputElement;

  constructor() {
    super(null, EditCell.getTemplate());
    this.inputRef = this.getRef(EDIT_CELL_INPUT_REF) as HTMLInputElement;
  }

  public getValue() {
    return this.data;
  }

  public setValue(data: CellValue | null) {
    this.data = data;
  }

  public show(top: number, left: number) {
    console.log(top, left);
    this.isDisplay = true;

    const value = this.data?.value === null ? '' : this.data?.value;
    this.containerRef.setAttribute('style', `top: ${top - 1}px; left: ${left - 1}px`);
    addCssClass(this.containerRef, SELECTED_CLASS);
    setInputValue(this.inputRef, String(value));
    // TODO: wrap
    this.inputRef.focus();
  }

  public hide() {
    if (!this.isDisplay) {
      return;
    }
    this.isDisplay = false;

    if (this.data) {
      this.data.value = getInputValue(this.inputRef);
    }
    removeCssClass(this.containerRef, SELECTED_CLASS);
  }
}
