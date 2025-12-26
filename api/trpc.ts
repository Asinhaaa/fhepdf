import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Parse the tRPC request
  const path = req.query.path as string[];
  const procedure = path ? path.join('.') : '';

  // Handle auth.me query - return null user (not authenticated)
  if (procedure === 'auth.me') {
    return res.status(200).json([{
      result: {
        data: null
      }
    }]);
  }

  // Handle auth.logout mutation
  if (procedure === 'auth.logout') {
    return res.status(200).json([{
      result: {
        data: {
          success: true
        }
      }
    }]);
  }

  // Default response for unknown procedures
  return res.status(200).json([{
    result: {
      data: null
    }
  }]);
}
