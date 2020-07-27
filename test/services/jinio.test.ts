import nock from 'nock';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { beforeEach, describe, it } from 'mocha';

import { getJinioPackage } from '../../services/jinio';
import invalidFixture from '../fixtures/jinio-invalid.json';
import deliveredFixture from '../fixtures/jinio-delivered.json';
import inTransitFixture from '../fixtures/jinio-in-transit.json';

chai.use(chaiAsPromised);

describe('getJinioPackage()', () => {
  describe('with in-transit package', () => {
    beforeEach(() => {
      nock('https://jinio.com.ph')
        .post('/tracker?tracking_no=15937131373BC')
        .reply(200, inTransitFixture.body);
    });

    it('should not be delivered', async () => {
      const result = await getJinioPackage('15937131373BC');
      expect(result.delivered).to.be.false;
    });

    it('should have the correct ETA', async () => {
      const result = await getJinioPackage('15937131373BC');
      expect(result.eta.toFormat('yyyy-MM-dd')).to.eq('2020-07-24');
    });

    it('should have the correct first log item', async () => {
      const result = await getJinioPackage('15937131373BC');
      if (!result.logs[0]) {
        throw new Error('Cannot find first log item.');
      }

      expect(result.logs[0].description).to.eq('Arrival at Jinio');
      expect(result.logs[0].timestamp.toFormat('yyyy-MM-dd')).to.eq('2020-05-15');
    });

    it('should have the correct recent log item', async () => {
      const result = await getJinioPackage('15937131373BC');
      const latest = result.logs[result.logs.length - 1];
      if (!latest) {
        throw new Error('Cannot find latest log item.');
      }

      expect(latest.description).to.eq('In-transit to Philippines');
      expect(latest.timestamp.toFormat('yyyy-MM-dd')).to.eq('2020-07-20');
    });
  });

  describe('with delivered package', () => {
    beforeEach(() => {
      nock('https://jinio.com.ph')
        .post('/tracker?tracking_no=15844472183BC')
        .reply(200, deliveredFixture.body);
    });

    it('should be delivered', async () => {
      const result = await getJinioPackage('15844472183BC');
      expect(result.delivered).to.be.true;
    });
  });

  describe('with invalid package', () => {
    beforeEach(() => {
      nock('https://jinio.com.ph')
        .post('/tracker?tracking_no=NOTEXISTING')
        .reply(200, invalidFixture.body);
    });

    it('should be null', async () => {
      await expect(getJinioPackage('NOTEXISTING')).to.be.rejectedWith('Unknown package');
    });
  });
});
