import { createLogger } from '../utils/logger';
import { TodoUpdate } from '../models/TodoUpdate';
import * as AWS from 'aws-sdk';
import { TodoItem } from '../models/TodoItem';
import * as AWSXray from "aws-xray-sdk";
const logger = createLogger('TodosAccess');

const XAWS = AWSXray.captureAWS(AWS);
const docClient = new XAWS.DynamoDB.DocumentClient({});


const TODO_TABLE = process.env.TODOS_TABLE;
const TODO_INDEX = process.env.TODOS_CREATED_AT_INDEX;

export const createTodo = async (todoItem: TodoItem) => {
  await docClient
    .put({
      TableName: TODO_TABLE,
      Item: todoItem
    })
    .promise();

  logger.log('User create :', todoItem.todoId);
  return todoItem;
}

export const getTodos = async (userId: string): Promise<any> => {

  const Items = await docClient.query({
    TableName: TODO_TABLE,
    IndexName: TODO_INDEX,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId
    },
  },).promise();

  return Items
}

export const updateTodo = async (idTodo: string, todo: TodoUpdate): Promise<TodoItem | any> => {
  try {
    console.log(idTodo, todo)
    const Update = await docClient
      .update({
        TableName: TODO_TABLE,
        Key: {
          todoId: idTodo
        },
        UpdateExpression: "set #name = :x, done = :y, dueDate = :z",
        ExpressionAttributeNames: {
          "#name": "name"
        },
        ExpressionAttributeValues: {
          ":x": todo.name,
          ":y": todo.done,
          ":z": todo.dueDate
        },
        ReturnValues: "UPDATED_NEW"
      })
      .promise();
    logger.log('User create :', idTodo);
    return Update;
  } catch (error) {
    console.log(error);
    return false
  }
}

export const deleteTodo = async (
  idTodo: string,
): Promise<Boolean> => {
  try {
    await docClient.delete({
      TableName: TODO_TABLE,
      Key: {
        todoId: idTodo
      }
    }).promise();
    logger.log('User create todoDelete :', idTodo)
    return true
  } catch (error) {
    return false
  }
}