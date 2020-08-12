import * as Yup from 'yup';

import { Handler } from '../types';

const validate: (schema: Yup.ObjectSchema) => Handler = (schema) => {
  return async (req, res) => {
    try {
      await schema.validate(req.body, {
        strict: true,
        abortEarly: true,
      });
    } catch (error) {
      const err = { ...error };

      // Handle single field validations
      if (err.inner.length === 0) {
        err.inner = [err];
      }

      res
        .status(422)
        .json({
          errors: err.inner.map((error: Yup.ValidationError) => ({
            status: 422,
            source: { pointer: `/data/attributes/${error.path}` },
            title: error.message,
          })),
        });
    }
  };
};

export default validate;
