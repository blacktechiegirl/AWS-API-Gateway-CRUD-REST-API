const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const dynamo = new DynamoDBClient({});

const getPost = async (event) => {
    const response = { statusCode: 200 };

    try {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            IndexName: "userId-postId-index",
            ConsistentRead: false,
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": event.pathParameters.userId
            }
        };
        const res = await dynamo.send(new QueryCommand(params));

        console.log(res);
        // response.body = JSON.stringify({
        //     message: "Successfull get request",
        //     data: (Item) ? unmarshall(Item) : {},
        //     rawData: Item,
        // });
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to get post.",
            errorMsg: e.message,
            errorStack: e.stack,
        });
    }

    return response;
};

module.exports = { getPost};