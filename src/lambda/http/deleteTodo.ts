import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { deleteTodo } from '../../helpers/todosAcess'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event?.pathParameters?.todoId;

    if (await deleteTodo(todoId)) {
      return {
        statusCode: 200,
        body: JSON.stringify({ idTodo: todoId })
      }
    } else {
      return {
        statusCode: 500,
        body: 'Internal problem'
      }
    }
  }
);

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  );
