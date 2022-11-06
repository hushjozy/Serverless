// import { TodoAccess } from '../dataLayer/todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { APIGatewayProxyEvent } from 'aws-lambda';
import { TodoUpdate } from '../models/TodoUpdate'
import * as uuid from 'uuid'
import { getUserId } from '../lambda/utils';
import * as AWS from 'aws-sdk'
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { createTodo, deleteTodo, getAllTodosByUserId, getTodoById, updateTodo, uploadImg } from '../dataLayer/todosAcess';
const AWSXRay = require ('aws-xray-sdk');

const XAWS = AWSXRay.captureAWS(AWS)

export async function getTodos(event): Promise<TodoItem[]> {
  const userId: string = getUserId(event);
  return getAllTodosByUserId(userId);
}

export async function getTodo(todoId: string): Promise<TodoItem> {
  return getTodoById(todoId);
}

export async function todoBuilder(todoRequest:CreateTodoRequest,event: APIGatewayProxyEvent):Promise<TodoItem> {
    const todoId = uuid.v4()
    const todo =  {
        todoId : todoId,
        userId: getUserId(event),
      createdAt : new Date().toISOString(),
      done : false,
      attachmentUrl : "",
      ...todoRequest
     }
     return await createTodo(todo);
    //  return todo as TodoItem
}


export async function updateTheTodo(
  userId: string,
  todoId: string,
  todoUpdate: TodoUpdate
): Promise<TodoUpdate> {
  // const userId = getUserId(event);
  return updateTodo(userId, todoId, todoUpdate);
}

export async function deleteTheTodo(todoId: string): Promise<TodoItem> {
  const todo = await getTodoById(todoId)
  return deleteTodo(todo);
}

export async function getTheUploadUrl(event, todoId: string): Promise<TodoItem> {
  // const userId = getUserId(event);
  console.log(event);

  const bucketname =process.env.ATTACHMENT_S3_BUCKET
  const todo = await getTodo(todoId)
  todo.attachmentUrl = `https://${bucketname}.s3.amazonaws.com/${todoId}`

  await uploadImg(todo)
  const s3 = new XAWS.S3({
    signatureVersion: 'v4'
  })
    return s3.getSignedUrl('putObject', {
      Bucket: bucketname,
      Key: todoId,
      Expires: 300
    })
}