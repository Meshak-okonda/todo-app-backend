import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares';
import { getTodos } from '../../helpers/todosAcess';

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = event.requestContext.authorizer.claims.sid;
    const todos = await getTodos(userId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        Items: todos
      })
    }
  });

    handler.use(
      cors({
        credentials: true
      })
    );
