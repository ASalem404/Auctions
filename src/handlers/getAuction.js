import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";
import createError from "http-errors";
import AWS from "aws-sdk";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  let auction;
  const { id } = event.pathParameters;
  try {
    const result = await dynamoDB
      .get({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
      })
      .promise();

    auction = result.Item;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  if (!auction) throw new createError.NotFound("No Auction with id " + id);

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export const handler = middy(getAuctions)
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
