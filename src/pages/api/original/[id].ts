import type { NextApiRequest, NextApiResponse } from 'next'
import * as dotenv from 'dotenv';

export default function handler(req:any, res:any) {
    dotenv.config()

    if (req.method === 'POST') {
        // Your logic to shorten the URL goes here
        res.status(200).json({ shortUrl: 'Shortened URL' });


    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}