/* eslint-env node, mocha */
const rlayClient = require('../src');
const simple = require('simple-mock');
const assert = require('assert');

describe('RlayOntologyJigsaw', () => {
  describe('Record', () => {
    context('new individual', () => {
      let airEntity, AirtableRecordMock;
      before(() => {
        AirtableRecordMock = class extends rlayClient.AirtableRecordMixin('mockKey')(
          rlayClient.Individual) { }
        AirtableRecordMock.client = rlayClient;
        AirtableRecordMock.type = rlayClient.Rlay_Individual.type;
        AirtableRecordMock.fields = rlayClient.Rlay_Individual.fields;
        AirtableRecordMock.fieldsDefault = rlayClient.Rlay_Individual.fieldsDefault;
        AirtableRecordMock.$airtableBaseClient = AirtableRecordMock.$airtableClient.Base.createFunctor();
        AirtableRecordMock.$airtableTableClient = AirtableRecordMock.$airtableBaseClient('mock');
      });
      before(() => simple.mock(AirtableRecordMock.$airtableTableClient, 'create').resolveWith({
        _table: {
          _base: { _id: undefined },
          id: null,
          name: 'mock'
        },
        id: 'recMock'
      }));
      before(() => simple.mock(AirtableRecordMock.$airtableTableClient, 'update').resolveWith(''));
      before(async () => {
        const indi = await rlayClient.Individual.create({
          airtableRecordClass: true
        });
        airEntity = AirtableRecordMock.from(indi.payload);
        await airEntity.resolve();
        await airEntity.create({ Name: airEntity.cid });
      });
      beforeEach(() => simple.mock(rlayClient, 'createEntity').resolveWith('0x0000'));
      beforeEach(() => simple.mock(AirtableRecordMock.$airtableTableClient, 'create').reset());
      beforeEach(() => simple.mock(AirtableRecordMock.$airtableTableClient, 'update').reset());

      it('calls airtable.create never', async () => {
        await airEntity.create({ Name: airEntity.cid });
        assert.equal(AirtableRecordMock.$airtableTableClient.create.callCount, 0);
      });

      it('calls airtable.update once', async () => {
        await airEntity.create({ Name: airEntity.cid });
        assert.equal(AirtableRecordMock.$airtableTableClient.update.callCount, 1);
      });

      it('calls airtable.update with the correct body', async () => {
        await airEntity.create({ Name: airEntity.cid });
        assert.deepEqual(AirtableRecordMock.$airtableTableClient.update.lastCall.args[0],
          'recMock');
        assert.deepEqual(AirtableRecordMock.$airtableTableClient.update.lastCall.args[1],
          { Name: airEntity.cid });
      });

      it('does not create a AirtableRecord individual', async () => {
        await airEntity.create({ Name: airEntity.cid });
        assert.equal(rlayClient.createEntity.callCount, 0);
      });
    });
  });
});
