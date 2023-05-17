import { ShortUrlRequest, ShortUrlResponse } from "@/interfaces/shortUrl";
import { getOrCreateShortUrl } from "@/util/dynamodb";

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    try {
      const body = req.body as ShortUrlRequest;
      const { url } = body;

      try {
        const shortUrl = await getOrCreateShortUrl(url);
        if (shortUrl === undefined) {
          return res
            .status(500)
            .json("Internal Server Error, failed to read or write the URL.");
        } else {
          const response: ShortUrlResponse = {
            shortUrl: shortUrl,
          };
          // return res.status(200).json({ shortUrl: shortUrl });
          return res.status(200).json(response);
        }
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json("Internal Server error");
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
