export interface CreateTodo {
  createdAt: string;
  name: string;
  dueDate: string;
  done: boolean;
  attachmentUrl?: string;
  userId: string;
  todoId: string;
}