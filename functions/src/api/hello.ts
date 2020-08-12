import { handle } from '../core';
import { checkAuth, checkMethod } from '../middleware';

const handler = handle(
  checkMethod('GET'),
  checkAuth,
  (req, res) => {
    res.json({ success: true });
  },
);

export default handler;
