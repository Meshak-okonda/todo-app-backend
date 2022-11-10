import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import * as uuid from "uuid";
import { createTodo } from '../../helpers/todosAcess';
import { TodoItem } from '../../models/TodoItem'

const bucketName = process.env.ATTACHMENT_S3_BUCKET;

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    const todoId = uuid.v4();
    const userId = event.requestContext.authorizer.claims.sid;
    const createdAt: string = new Date().toISOString();
    const done: boolean = false;

    const newItem: TodoItem = {
      ...newTodo,
      todoId,
      userId,
      createdAt,
      done,
      attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`
    };

    const value = await createTodo(newItem);

    if (value) {
      return {
        statusCode: 200,
        body: JSON.stringify({ item: newItem })
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal problem' })
      };
    }
  }
);

handler.use(
  cors({
    credentials: true
  })
);
