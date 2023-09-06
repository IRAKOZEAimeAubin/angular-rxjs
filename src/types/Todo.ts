import { User } from './User';

export interface Todo {
  todoId?: string;
  title: string;
  description: string;
  tags: string[];
  status: string;
  published?: boolean;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  privacy?: string;
  searchKey?: string[];
  creator?: string;
}
