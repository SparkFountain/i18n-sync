export interface Stack {
  __data__: ListCache
}

export interface ListCache {
  __data__: ListCache[];
  size: number;
}