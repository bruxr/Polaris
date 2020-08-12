import axios from 'axios';
import cheerio from 'cheerio';
import { DateTime } from 'luxon';

import { PackageTrackingInfo } from '../types/packages';

const cleanString = (str: string): string => str.trim().replace(/\s{2,}/g, ' ');

export const getLazadaPackage = async (code: string): Promise<PackageTrackingInfo> => {
  const res = await axios.get(`https://tracker.lel.asia/tracker?trackingNumber=${code}&lang=en-US`);
  const doc = cheerio.load(res.data);

  // Detect invalid packages
  const error = doc('.error-message');
  if (error.length > 0) {
    throw new Error('Unknown package.');
  }

  const details = doc('.details__line');
  
  // Extract start date
  // const start = details.eq(2).find('.details__value').text().trim().replace(/\s{2,}/g, ' ');
  // const startDate = DateTime.fromFormat(start, 'd MMM yyyy');

  // Extract end date
  const end = details.eq(3).find('.details__value').text().trim().replace(/\s{2,}/g, ' ').split('-')[1].trim();
  const endDate = DateTime.fromFormat(end, 'd MMM yyyy');
  if (!endDate.isValid) {
    throw new Error(`Invalid end date: ${end}.`);
  }

  // Process log items
  let logs: Array<{ timestamp: DateTime, description: string }> = [];
  const currYear = DateTime.utc().year;
  doc('.trace__date_row').each((index, el) => {
    const row = cheerio(el);
    const date = cleanString(row.find('.trace__date._done').text());

    const items = row.find('.trace__item');
    items.each((index, el) => {
      const item = cheerio(el);
      const time = item.children().eq(0).text();
      const timestamp = DateTime.fromFormat(`${date} ${currYear} ${time}`, 'd MMM yyyy HH:mm');
      const description = cleanString(item.children().eq(1).text());

      logs.push({ timestamp, description });
    });
  });

  // Reverse the logs
  logs = logs.reverse();

  // Update dates that were on the previous year
  const prevYear = DateTime.utc().minus({ year: 1 }).year;
  logs.forEach((item, index) => {
    if (index === 0) {
      return;
    }
    const prevMonth = logs[index - 1].timestamp.month;
    const currMonth = item.timestamp.month;
    if (prevMonth > currMonth) {
      for (let i = 0; i < index; i++) {
        logs[i].timestamp = logs[i].timestamp.set({ year: prevYear });
      }
    }
  });

  return {
    delivered: logs[logs.length - 1].description === 'Your parcel has been delivered!',
    eta: endDate,
    logs,
  };
};
