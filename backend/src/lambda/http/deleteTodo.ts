

import 'source-map-support/register'
// import { cors, httpErrorHandler } from 'middy/middlewares'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
// import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
// import { deleteTodo, getTodoById } from '../../dataLayer/todosAcess'
import { deleteTheTodo } from '../../businessLogic/todos'
// import { deleteTodo } from '../../logicLayer/todos'
const logger = createLogger('Todo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.warn("Processing delete event on todo", event )
  const todoId = event.pathParameters.todoId

  // TODO: Remove a TODO item by id
await deleteTheTodo(todoId)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: " "
  }
}


