export interface Category {
  id: string;
  name: string;
  position?: number;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}
