// import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// import {
//   DynamoDBDocumentClient,
//   QueryCommand,
//   PutCommand,
//   GetCommand,
// } from "@aws-sdk/lib-dynamodb";
// import shortid, { generate } from "shortid";
// import AWS from "aws-sdk";
//
// const credentials = new AWS.Credentials(
//   process.env.ACCESS_KEY_ID || "",
//   process.env.SECRET_ACCESS_KEY || ""
// );
//
// AWS.config.update({
//   region: process.env.REGION,
//   credentials,
// });
//
// const client = new DynamoDBClient({ region: "us-east-1" });
// const ddbDocClient = DynamoDBDocumentClient.from(client);
//
// export async function getOrCreateShortUrl(
//   originalUrl: string
// ): Promise<string | undefined> {
//   console.log("getOrCreateShortUrl()");
//   console.log(originalUrl);
//
//   const params = {
//     TableName: "ushr",
//     IndexName: "originalUrl-index",
//     KeyConditionExpression: "originalUrl = :o",
//     ExpressionAttributeValues: { ":o": originalUrl },
//   };
//
//   try {
//     const data = await ddbDocClient.send(new QueryCommand(params));
//     console.log(data);
//     if (data === undefined || data === null) {
//       console.log("QueryCommand didn't work");
//     }
//     if (data.Items && data.Items.length > 0) {
//       // URL already exists, return the existing shortUrl
//       console.log("URL already exists");
//       return data.Items[0].shortUrl as string;
//     } else {
//       // URL does not exist, create a new shortUrl
//       // const shortUrl = generateShortUrl(); // your short URL generation function
//       const id = shortid.generate();
//       const shortUrl = `https://ushr.dev/${id}`;
//       const putParams = {
//         TableName: "ushr",
//         Item: { id: id, originalUrl, shortUrl },
//       };
//       const result = await ddbDocClient.send(new PutCommand(putParams));
//       console.log(result);
//       console.log("PutCommand didn't work");
//       return shortUrl;
//     }
//   } catch (err) {
//     console.log("Error: ", err);
//     throw err;
//   }
// }
//
// export async function getOriginalUrl(id: string): Promise<string | undefined> {
//   console.log("getOriginalUrl()");
//   console.log(`received id: ${id}`);
//
//   const params = {
//     TableName: "ushr",
//     Key: { id },
//   };
//
//   try {
//     console.log("trying to get the URL");
//     const data = await ddbDocClient.send(new GetCommand(params));
//     console.log(`data: ${JSON.stringify(data)}`);
//     if (data.Item) {
//       console.log(data.Item);
//       return data.Item.originalUrl as string;
//     } else {
//       // The item was not found
//       console.log("Nothing found");
//       return undefined;
//     }
//   } catch (err) {
//     console.log("Error: ", err);
//     throw err;
//   }
// }
import { Pool } from "pg";
import shortid from "shortid";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL + "?sslmode=require",
});

export async function getOrCreateShortUrl(originalUrl: string) {
  try {
    // Check if the originalUrl already exists in the database
    const res = await pool.query("SELECT * FROM urls WHERE original_url = $1", [
      originalUrl,
    ]);
    if (res.rowCount > 0) {
      // If it exists, return the existing shortUrl
      return res.rows[0].short_url;
    } else {
      // If it doesn't exist, create a new shortUrl
      const id = shortid.generate();
      const shortUrl = `https://ushr.dev/api/${id}`;
      await pool.query(
        "INSERT INTO urls (id, original_url, short_url) VALUES ($1, $2, $3)",
        [id, originalUrl, shortUrl]
      );
      return shortUrl;
    }
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
}

export async function getOriginalUrl(id: string) {
  try {
    // Get the originalUrl associated with
    const res = await pool.query("SELECT * FROM urls WHERE id = $1", [id]);
    if (res.rowCount > 0) {
      // If the id exists, return the originalUrl
      return res.rows[0].original_url;
    } else {
      // If the id doesn't exist, return undefined
      return undefined;
    }
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
}
