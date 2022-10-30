import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTodo } from '../../dataLayer/todosAcess'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
// import { todoUpdater } from '../../logicLayer/todos'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId  = event.pathParameters.todoId
    const userId = getUserId(event)
  // const updateData: TodoUpdate = JSON.parse(event.body);
    const todoUpdate: UpdateTodoRequest = JSON.parse(event.body)

    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object

// console.log(event);

    await updateTodo(userId,todoId,todoUpdate)
    return {
      statusCode: 200,
      body: JSON.stringify({
        todo: "updated"
      })
    }
  // return undefined

  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
