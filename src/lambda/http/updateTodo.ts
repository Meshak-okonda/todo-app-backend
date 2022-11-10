import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodo } from '../../helpers/todosAcess'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId: string = event.pathParameters.todoId;
    const updatedTodo: UpdateTodoRequest = JSON.parse(event?.body);

    const data = await updateTodo(todoId, updatedTodo);
    if (data) {
      return {
        statusCode: 200,
        body: JSON.stringify({ item: data })
      };
    } else {
      return {
        statusCode: 500,
        body: 'Internal problem'
      };
    }
  }
);

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
