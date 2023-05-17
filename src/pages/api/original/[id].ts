import { getOriginalUrl } from "@/util/dynamodb";

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const { id } = req.query;
    console.log(id);

    try {
      const originalUrl = await getOriginalUrl(id as string);
      if (originalUrl === undefined) {
        res.status(404).json({ message: "Not Found" });
      } else {
        res.redirect(302, originalUrl);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
