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
  joinEnabled?: boolean;
  carouselImages?: string[];
  updatesList?: Array<{
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

export default function handler(req: NextApiRequest, res: NextApiResponse<AppData>) {
  try {
    const dataPath = path.join(process.cwd(), 'data.json');
    const fileContent = fs.readFileSync(dataPath, 'utf-8');
    const data: AppData = JSON.parse(fileContent);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error reading data.json:', error);
    res.status(200).json({
      pageContent: {
        generalInfo: 'Welcome to the Bishop Estates Cabana Club!',
        poolInfo: 'Our beautiful pool is open daily from 9 AM to 8 PM. Remember to follow all posted rules.',
        updates: 'Exciting news! We\'re starting renovations soon. Stay tuned for progress reports.',
        joiningInfo: {
          title: 'Become a Member',
          text: 'Join our vibrant community! Fill out the form below to get started.',
          formLink: '/join'
        }
      },
      budget: {
        total: 200000,
        raised: 20000
      },
      joinEnabled: false,
      carouselImages: [],
      updatesList: [],
      calendar: {
        enabled: true,
        googleCalendarId: 'bishopestatescabanaclub@gmail.com'
      }
    });
  }
}
