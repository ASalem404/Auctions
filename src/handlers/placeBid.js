import commonMiddleware from "../../lib/commonMiddleware";

import createError from "http-errors";
import AWS from "aws-sdk";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
  const { amount } = event.body;
  const { id } = event.pathParameters;
  try {
    const params = {
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Key: { id },
      UpdateExpression: "set highestBid.amount =:amount",
      ExpressionAttributeValues: { ":amount": amount },
    };

    let updatedAuction;
    const result = await dynamoDB.update(params).promise();
    updatedAuction = result.Attributes;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}

export const handler = commonMiddleware(placeBid);
