export interface TableData {
  active: string;
  origin_id: string;
  ticketing_id: string;
  airline: string;
  active_from: string;
  active_to: string;
  booking_from: string;
  booking_to: string;
  entry_1: string;
  entry_2: string;
  entry_3: string;
  entry_4: string;
  entry_5: string;
  entry_6: string;
}

export interface TableColumn<T = any> {
  field: string;
  headerName: string;
  valueGetter?: (params: T) => any;
  valueSetter?: (params: T, column: string, value: any) => T;
  renderCell?: (value: any, row: T, rowId: string, updateCell: (value: any) => void, isEdited: boolean) => React.ReactNode;
}

export interface TableCellEditInfo {
  rowId: string;
  columnId: string;
  value: any;
}

export type TableRowIdGetter<T> = (row: T) => string;