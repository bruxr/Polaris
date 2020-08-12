import * as Yup from 'yup';
import { CloudTasksClient } from '@google-cloud/tasks';

import { handle } from '../core';
import { db } from '../services/firebase';
import { getJinioPackage } from '../services/jinio';
import { getLazadaPackage } from '../services/lazada';
import { checkAuth, checkMethod, validate } from '../middleware';
import { PackageTrackingInfo } from '../types/packages';

const tasks = new CloudTasksClient();

const trackParcel = handle(
  checkMethod('POST'),
  checkAuth,
  validate(Yup.object({
    code: Yup.string().label('Tracking Code').required(),
    courier: Yup.string().label('Courier').oneOf(['jinio', 'lazada']).required(),
  })),
  async (req, res) => {
    const { code, courier } = req.body;

    let parcel: PackageTrackingInfo;
    try {
      if (courier === 'lazada') {
        parcel = await getLazadaPackage(code);
      } else if (courier === 'jinio') {
        parcel = await getJinioPackage(code);
      } else {
        throw new Error(`No service for courier "${code}".`);
      }
    } catch (err) {
      res
        .status(400)
        .json({
          errors: [{
            status: 400,
            title: err.message,
          }],
        });
      return;
    }

    try {
      await db.runTransaction(async (t) => {
        const parcelRef = db.collection('parcels').doc();
        t.create(parcelRef, {
          code,
          courier,
          delivered: parcel.delivered,
          eta: parcel.eta.toJSDate(),
          logs: parcel.logs.map((log) => ({
            desc: log.description,
            ts: log.timestamp.toJSDate(),
          })),
        });

        if (!parcel.delivered) { 
          await tasks.createTask({
            task: {
              httpRequest: {
                httpMethod: 'POST',
                
              },
            },
          });
        }
      });
    } catch (err) {
      res
        .status(502)
        .json({
          errors: [{
            status: 502,
            title: 'Failed to access database.',
          }],
        });
      return;
    }

    res.json(parcel);
  },
);

export default trackParcel;
