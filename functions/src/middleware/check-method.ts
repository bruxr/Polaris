import { Handler } from '../types';

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE';

const checkMethod: (...methods: Method[]) => Handler = (methods) => {
  return (req, res) => {
    const method = req.method.toUpperCase();
    if (!methods.includes(method)) {
      res
        .status(405)
        .json({
          errors: [{
            status: 405,
            title: 'Method Not Allowed',
          }],
        });
    }
  };
};

export default checkMethod;
