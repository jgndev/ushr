import type { NextApiRequest, NextApiResponse } from 'next'
import shortid from 'shortid';

export default function handler(req:any, res:any) {
    if (req.method === 'POST') {
        // Your logic to shorten the URL goes here
        // res.status(200).json({ shortUrl: 'Shortened URL' });

    try {
        const body = req.body;

        const id = generateId();
        const shortenedUrl = `https://ushr.dev/${id}`

        // Write the entry to the DynamoDB table

        // Reply to the client with the new URL
    } catch (error) {
        console.log(error);
    }

    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

function generateId(): string {
    return shortid.generate();
}