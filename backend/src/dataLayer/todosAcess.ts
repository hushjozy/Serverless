import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
// import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

// const logger = createLogger('TodosAccess')
// export class TodoAccess {
//   constructor (
//     private readonly docClient: DocumentClient = createDynamoDBClient(),
//     private readonly todosTable = process.env.TODOS_TABLE,
//     private readonly index = process.env.TODOS_CREATED_AT_INDEX,
//     // private readonly s3Client: Types = new XAWS.S3({ signatureVersion: 'v4' }),
//     // private readonly s3BucketName = process.env.BUCKET_NAME
//     ) {}
  
//     async createTodo(todo: TodoItem): Promise<TodoItem> {
//     await this.docClient.put({
//       TableName: this.todosTable,
//       Item: todo
//     }).promise()

//     return todo
//   }

//     async getAllTodosByUserId (userId: string): Promise<TodoItem[]> {
//     const result = await this.docClient.query({
//         TableName : this.todosTable,
//         KeyConditionExpression: '#userId = :userId',
//         ExpressionAttributeNames: {
//             '#userId': 'userId'
//         },
//         ExpressionAttributeValues: {
//             ':userId': userId
//         }
//     }).promise()
//     const items = result.Items
//     return items as TodoItem[]
//   }

//     async getTodoById (todoId: string): Promise<TodoItem> {
//     const result = await this.docClient.query({
//         TableName : this.todosTable,
//         IndexName : this.index,
//         KeyConditionExpression: 'todoId = :todoId',
//         ExpressionAttributeValues: {
//             ':todoId': todoId
//         }
//     }).promise()
//     const items = result.Items
//     if (items.length !== 0) return result.Items[0] as TodoItem
//     return null
//   }

// //   To update

//     async updateTodo (todo: TodoItem,todoUpdate: TodoUpdate): Promise<TodoUpdate> {
//     const result = await this.docClient.update({
//         TableName : this.todosTable,
//         Key: {
//             userId: todo.userId,
//             todoId: todo.todoId
//         },
//         UpdateExpression: 'set attachmentUrl = :attachmentUrl,#a = :a, #b = :b, #c = :c',
//       ExpressionAttributeNames: {
//         '#a': 'name',
//         '#b': 'dueDate',
//         '#c': 'done'
//       },
//         ExpressionAttributeValues: {
//             ':attachmentUrl': todo.attachmentUrl,
//             ':a': todoUpdate['name'],
//             ':b': todoUpdate['dueDate'],
//             ':c': todoUpdate['done']
//         },
//         ReturnValues: 'ALL_NEW'
//     }).promise()
//     return result.Attributes as TodoUpdate
//   }

//     async deleteTodo(todo: TodoItem): Promise<TodoItem> {
//     const result = await this.docClient
//       .delete({
//         TableName: this.todosTable,
//         Key: {
//           userId: todo.userId,
//           todoId: todo.todoId
//       },
//       })
//       .promise()
      
//       return result.Attributes as TodoItem
//   }

// }
// function createDynamoDBClient() {
//   if (process.env.IS_OFFLINE) {
//     console.log('Creating a local DynamoDB instance')
//     return new XAWS.DynamoDB.DocumentClient({
//       region: 'localhost',
//       endpoint: 'http://localhost:8000'
//     })
//   }

//   return new XAWS.DynamoDB.DocumentClient()

// }




const todosTable = process.env.TODOS_TABLE
const index = process.env.TODOS_CREATED_AT_INDEX
const docClient: DocumentClient = createDynamoDBClient()
// // TODO: Implement the dataLayer logic
export async function createTodo(todo: TodoItem): Promise<TodoItem> {
    await docClient.put({
      TableName: todosTable,
      Item: todo
    }).promise()

    return todo
  }

  export async function getAllTodosByUserId (userId: string): Promise<TodoItem[]> {
    const result = await docClient.query({
        TableName : todosTable,
        KeyConditionExpression: '#userId = :userId',
        ExpressionAttributeNames: {
            '#userId': 'userId'
        },
        ExpressionAttributeValues: {
            ':userId': userId
        }
    }).promise()
    const items = result.Items
    return items as TodoItem[]
  }

  export async function getTodoById (todoId: string): Promise<TodoItem> {
    const result = await docClient.query({
        TableName : todosTable,
        IndexName : index,
        KeyConditionExpression: 'todoId = :todoId',
        ExpressionAttributeValues: {
            ':todoId': todoId
        }
    }).promise()
    const items = result.Items
    if (items.length !== 0) return result.Items[0] as TodoItem
    return null
  }

//   To update

  export async function updateTodo (todo: TodoItem): Promise<TodoItem> {
    const result = await docClient.update({
        TableName : todosTable,
        Key: {
            userId: todo.userId,
            todoId: todo.todoId
        },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
            ':attachmentUrl': todo.attachmentUrl
        }
    }).promise()
    return result.Attributes as TodoItem
  }

  export async function deleteTodo(todo: TodoItem): Promise<TodoItem> {
    const result = await docClient
      .delete({
        TableName: todosTable,
        Key: {
          userId: todo.userId,
          todoId: todo.todoId
      },
      })
      .promise()
      return result.Attributes as TodoItem
  }

  function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
  }
   
