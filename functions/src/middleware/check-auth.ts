import axios from 'axios';
import * as functions from 'firebase-functions';

import { Handler } from '../types';
import CONSTANTS from '../constants';

const sendError = (res: functions.Response) => {
  res
    .status(401)
    .json({
      errors: [{
        status: 401,
        title: 'Unauthorized',
      }],
    });
};

const checkAuth: Handler = async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    sendError(res);
    return;
  }

  try {
    await axios.get(`${CONSTANTS.auth0.domain}userinfo`, {
      headers: {
        Authorization: token,
      },
    });
  } catch {
    sendError(res);
  }
};

export default checkAuth;
