async function createAuction(event, context) {
  const { title } = JSON.parse(event.body);

  return {
    statusCode: 200,
    body: JSON.stringify({ title }),
  };
}

export const handler = createAuction;
