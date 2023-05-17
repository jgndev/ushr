import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  PutCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import shortid from "shortid";
import AWS from "aws-sdk";

// const credentials = new AWS.Credentials(
//   process.env.AWS_ACCESS_KEY_ID || "",
//   process.env.AWS_SECRET_ACCESS_KEY || ""
// );
const credentials = new AWS.Credentials(
  process.env.ACCESS_KEY_ID || "",
  process.env.SECRET_ACCESS_KEY || ""
);

AWS.config.update({
  region: process.env.AWS_REGION,
  credentials,
});

const client = new DynamoDBClient({ region: "us-east-1" });
const ddbDocClient = DynamoDBDocumentClient.from(client);

export async function getOrCreateShortUrl(
  originalUrl: string
): Promise<string | undefined> {
  const params = {
    TableName: "ushr",
    IndexName: "originalUrl-index",
    KeyConditionExpression: "originalUrl = :o",
    ExpressionAttributeValues: { ":o": originalUrl },
  };

  try {
    const data = await ddbDocClient.send(new QueryCommand(params));
    if (data.Items && data.Items.length > 0) {
      // URL already exists, return the existing shortUrl
      return data.Items[0].shortUrl as string;
    } else {
      // URL does not exist, create a new shortUrl
      const shortUrl = generateShortUrl(); // your short URL generation function
      const putParams = {
        TableName: "ushr",
        Item: { id: shortUrl, originalUrl, shortUrl },
      };
      await ddbDocClient.send(new PutCommand(putParams));
      return shortUrl;
    }
  } catch (err) {
    console.log("Error: ", err);
  }
}

export async function getOriginalUrl(id: string): Promise<string | undefined> {
  const params = {
    TableName: "ushr",
    Key: { id },
  };

  try {
    const data = await ddbDocClient.send(new GetCommand(params));
    if (data.Item) {
      // The item was found, return the originalUrl
      return data.Item.originalUrl as string;
    } else {
      // The item was not found
      return undefined;
    }
  } catch (err) {
    console.log("Error: ", err);
  }
}

function generateShortUrl(): string {
  return `https://ushr.dev/${shortid.generate()}`;
}
