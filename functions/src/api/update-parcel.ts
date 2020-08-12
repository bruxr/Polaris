import * as Yup from 'yup';
import { last } from 'lodash';
import { getUnixTime } from 'date-fns';

import { handle } from '../core';
import { Parcel } from '../types/parcels';
import { db } from '../services/firebase';
import { getJinioPackage } from '../services/jinio';
import { getLazadaPackage } from '../services/lazada';
import { checkMethod, validate } from '../middleware';
import { PackageTrackingInfo } from '../types/packages';

const updateParcel = handle(
  checkMethod('POST'),
  validate(Yup.object({
    id: Yup.string()
      .label('Parcel ID')
      .required(),
  })),
  async (req, res) => {
    const { id } = req.body;

    const doc = db.collection('parcels').doc(id);
    const parcel = await doc.get();
    if (!parcel.exists) {
      res
        .status(400)
        .json({
          errors: [{
            status: 400,
            title: `Unknown parcel ID "${id}".`,
          }],
        });
      return;
    }
    const data = { ...parcel.data() } as Parcel;

    // Retrieve updated parcel info
    let info: PackageTrackingInfo;
    try {
      if (data.courier === 'lazada') {
        info = await getLazadaPackage(data.code);
      } else if (data.courier === 'jinio') {
        info = await getJinioPackage(data.code);
      } else {
        throw new Error(`No service for courier "${data.code}".`);
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

    // Update fields if they were changed.
    let changed = false;

    if (info.delivered !== data.delivered) {
      data.delivered = info.delivered;
      changed = true;
    }

    if (info.eta.toSeconds() !== getUnixTime(data.eta)) {
      data.eta = info.eta.toJSDate();
      changed = true;
    }

    const lastLog = last(data.logs);
    const lastTs = lastLog ? getUnixTime(lastLog.ts) : 0;
    const newLogs = info.logs.filter((log) => log.timestamp.toMillis() > lastTs);
    if (newLogs.length > 0) {
      newLogs.forEach((log) => {
        data.logs.push({
          desc: log.description,
          ts: log.timestamp.toJSDate(),
        });
      });
      changed = true;
    }

    // If we have changed fields, save to DB.
    if (changed) {
      await doc.update(data);
    }

    res.json({ success: true });
  },
);

export default updateParcel;
