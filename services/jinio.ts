import axios from 'axios';
import cheerio from 'cheerio';
import { DateTime } from 'luxon';

import { PackageTrackingInfo } from '../types/packages';

interface JinioDataItem {
  m: string;
  i: string;
  c: string;
}

export const getJinioPackage = async (code: string): Promise<PackageTrackingInfo> => {
  const today = DateTime.utc();
  const res = await axios.post(`https://jinio.com.ph/tracker?tracking_no=${encodeURIComponent(code)}`);
  const data = res.data.c_js as JinioDataItem[];

  // Make sure this is a valid package
  if (!data.find((item) => item.i === 'estimatedToDate')) {
    throw new Error('Unknown package');
  }

  // Determine start date
  const start = data.find((item) => item.i === 'estimatedFromDate');
  if (!start) {
    throw new Error('Failed to find start date.');
  }
  let startDate = DateTime.fromFormat(`${start.c} ${today.year}`, 'dd MMM yyyy');  

  // Determine end date
  const end = data.find((item) => item.i === 'estimatedToDate');
  if (!end) {
    throw new Error('Failed to find end date.');
  }
  const endDate = DateTime.fromFormat(`${end.c} ${today.year}`, 'dd MMM yyyy');  

  // If start date is greater than the end date then it is on the previous year.
  if (startDate > endDate) {
    startDate = DateTime.fromFormat(`${start.c} ${today.year - 1}`, 'dd MMM yyyy');  
  }

  // Process log items
  const prevYear = DateTime.utc().minus({ year: 1 }).year;
  const logItems = data.find((item) => item.i === 'tracker_log_list');
  if (!logItems) {
    throw new Error('Failed to find tracker logs.');
  }
  const logsDOM = cheerio.load(logItems.c);
  const logs: Array<{ timestamp: DateTime, description: string }> = [];

  // Remove separator decorations
  const filteredLogs: Cheerio[] = [];
  logsDOM('li.columns').each((i, el) => {
    const li = cheerio(el);
    if (li.children('.separator').length === 0) {
      filteredLogs.push(li);
    }
  });

  filteredLogs.reverse().forEach((li, index) => {
    const date = li.find('.node').text();
    const timestamp = DateTime.fromFormat(`${date} ${today.year}`, 'dd MMM yyyy');

    // If the previous item timestamp is greater than the current timestamp then we have moved to the next year.
    // Subtract 1 from the previous dates' years
    if (index > 0) {
      const prevTimestamp = logs[index - 1].timestamp;
      if (prevTimestamp.month > timestamp.month) {
        for (let i = 0; i < index; i++) {
          const ts = logs[i].timestamp;
          logs[i].timestamp = ts.set({ year: prevYear });
        }
      }
    }

    li.find('.node').remove();
    const description = li.html()?.replace(/<br>/g, ' ').trim();

    logs.push({
      timestamp,
      description: description || '',
    });
  });

  return {
    delivered: logs[logs.length - 1].description === 'Delivered',
    eta: endDate,
    logs,
  };
};
