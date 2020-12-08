import { InjectionToken, interfaces } from './di';
import { Component } from './component';

export type IndexValue = { value: number };
export type CellValue = { value: string | number | null };

export const ROW_NODE_TOKEN = InjectionToken<interfaces.Newable<IRowNode>>('row node');
export const ROW_NODE_FACTORY_TOKEN = InjectionToken<IRowNodeFactory>('row node factory');
export interface IRowNode extends Component {
  index: IndexValue;

  insert(index: number, cell: ICellNode): void;
}
export interface IRowNodeFactory {
  (parent: Component, index: IndexValue): IRowNode;
}

export const COLUMN_TOKEN = InjectionToken<IColumn>('column node');
export const COLUMN_FACTORY_TOKEN = InjectionToken<IColumnFactory>('column node factory');
export interface IColumn {
  index: IndexValue;

  indexOf(index: number): ICellNode;
  push(cell: ICellNode): void;
  insert(index: number, cell: ICellNode): void;
  remove(): void;
}
export interface IColumnFactory {
  (index: IndexValue): IColumn;
}

export const CELL_NODE_TOKEN = InjectionToken<ICellNode>('cell node token');
export interface ICellNode extends Component {
  options: ICellOptions;

  getValue(): CellValue;
  setValue(data: CellValue): void;
}
export interface ICellOptions {
  rowIndex: IndexValue;
  colIndex: IndexValue;
}

export interface IEditCellNode extends Component {
  isDisplay: boolean;

  getValue(): CellValue | null;
  setValue(data: CellValue): void;

  show(top: number, left: number): void;
  hide(): void;
}
