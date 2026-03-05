export interface Category {
  id: string;
  name: string;
  position?: number;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  _count?: {
    children: number;
  };
  createdAt: string;
  updatedAt: string;
}
