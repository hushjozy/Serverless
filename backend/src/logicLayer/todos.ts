// import { TodoAccess } from '../dataLayer/todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { APIGatewayProxyEvent } from 'aws-lambda';
// import { TodoUpdate } from '../models/TodoUpdate'
import * as uuid from 'uuid'
import { getUserId } from '../lambda/utils';
// import * as createError from 'http-errors'

import { CreateTodoRequest } from "../requests/CreateTodoRequest";
// const todoAccess = new TodoAccess()

// // TODO: Implement businessLogic

export function todoBuilder(todoRequest:CreateTodoRequest,event: APIGatewayProxyEvent):TodoItem {
    const todoId = uuid.v4()
    const todo =  {
        todoId : todoId,
        userId: getUserId(event),
      createdAt : new Date().toISOString(),
      done : false,
      attachmentUrl : "",
      ...todoRequest
     }
     return todo as TodoItem
}
// export function updateTodo(updateTodoRequest:UpdateTodoRequest,todoId: string, event: APIGatewayProxyEvent):TodoUpdate{
//   const userId = getUserId(event)
//   // const todoId = event.pathParameters.todoId
//   return todoAccess.updateTodo(updateTodoRequest, todoId, userId)
// }

// export async function deleteTodo(userId: string, todoId: string) {
//   logger.info(`Deleting todo ${todoId} for user ${userId}`, { userId, todoId })

//   const item = await todosAccess.getTodoItem(todoId)

//   if (!item)
//     throw new Error('Item not found')  // FIXME: 404?

//   if (item.userId !== userId) {
//     logger.error(`User ${userId} does not have permission to delete todo ${todoId}`)
//     throw new Error('User is not authorized to delete item')  // FIXME: 403?
//   }

//   todosAccess.deleteTodoItem(todoId)
// }