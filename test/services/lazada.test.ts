import nock from 'nock';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { getFixture } from '../helpers';
import { getLazadaPackage } from '../../services/lazada';

chai.use(chaiAsPromised);

describe('getLazadaPackage()', () => {
  describe('with in-transit package', () => {
    beforeEach(async () => {
      const fixture = await getFixture('lazada-in-transit');
      nock('https://tracker.lel.asia')
        .get('/tracker?lang=en-US&trackingNumber=SO0087903829')
        .reply(200, fixture);
    });

    it('should not be delivered', async () => {
      const result = await getLazadaPackage('SO0087903829');
      expect(result.delivered).to.be.false;
    });

    it('should have the correct ETA', async () => {
      const result = await getLazadaPackage('SO0087903829');
      expect(result.eta.toFormat('yyyy-MM-dd')).to.eq('2020-04-09');
    });

    it('should have the correct first log item', async () => {
      const result = await getLazadaPackage('SO0087903829');
      if (!result.logs[0]) {
        throw new Error('Cannot find first log item.');
      }

      expect(result.logs[0].description).to.eq(
        'Your order has been packed and will be handed over to our logistics partner.'
      );
      expect(result.logs[0].timestamp.toFormat('yyyy-MM-dd HH:mm')).to.eq('2020-03-17 21:33');
    });

    it('should have the correct recent log item', async () => {
      const result = await getLazadaPackage('SO0087903829');
      const latest = result.logs[result.logs.length - 1];
      if (!latest) {
        throw new Error('Cannot find latest log item.');
      }

      expect(latest.description).to.eq(
        'Your parcel has been inbounded at the logistics facility. [San Pedro Sortation Center]'
      );
      expect(latest.timestamp.toFormat('yyyy-MM-dd HH:mm')).to.eq('2020-04-21 12:25');
    });
  });

  describe('with delivered package', () => {
    beforeEach(async () => {
      const fixture = await getFixture('lazada-delivered');
      nock('https://tracker.lel.asia')
        .get('/tracker?lang=en-US&trackingNumber=SO0114417614')
        .reply(200, fixture);
    });

    it('should be delivered', async () => {
      const result = await getLazadaPackage('SO0114417614');
      expect(result.delivered).to.be.true;
    });
  });

  describe('with invalid package', () => {
    beforeEach(async () => {
      const fixture = await getFixture('lazada-invalid');
      nock('https://tracker.lel.asia')
        .get('/tracker?lang=en-US&trackingNumber=INVALID')
        .reply(200, fixture);
    });

    it('should throw an error', async () => {
      await expect(getLazadaPackage('INVALID')).to.be.rejectedWith('Unknown package');
    });
  });
});
