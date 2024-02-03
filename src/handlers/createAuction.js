import { v4 as uuid } from "uuid";
import commonMiddleware from "../../lib/commonMiddleware";
import createError from "http-errors";
import AWS from "aws-sdk";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  const { title } = JSON.parse(event.body);

  const auction = {
    id: uuid(),
    title,
    status: "OPEN",
    createdAt: new Date().toISOString(),
  };
  try {
    await dynamoDB
      .scan({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Item: auction,
      })
      .promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = commonMiddleware(createAuction);
