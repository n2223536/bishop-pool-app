import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

interface AppData {
  pageContent: {
    generalInfo: string;
    poolInfo: string;
    updates: string;
    joiningInfo: {
      title: string;
      text: string;
      formLink: string;
    };
  };
  budget: {
    total: number;
    raised: number;
  };
  updatesList: Array<{
    id: string;
    date: string;
    title: string;
    content: string;
  }>;
  calendar: {
    enabled: boolean;
    googleCalendarId: string;
  };
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const dataPath = path.join(process.cwd(), 'data.json');
    const data: AppData = req.body;
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
}
