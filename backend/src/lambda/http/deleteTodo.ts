

import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { deleteTodo, getTodoById } from '../../dataLayer/todosAcess'
// import { deleteTodo } from '../../logicLayer/todos'
const logger = createLogger('Todo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.warn("Processing delete event on todo", event )
  const todoId = event.pathParameters.todoId

  const todo = await getTodoById(todoId)
  // TODO: Remove a TODO item by id
await deleteTodo(todo)
  return {
    statusCode: 201,
    // headers: {
    //   'Access-Control-Allow-Origin': '*',
    //   'Access-Control-Allow-Credentials': true
    // },
    body: " "
  }
}
