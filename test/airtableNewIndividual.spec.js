/* eslint-env node, mocha */
const rlayClient = require('../src');
const sinon = require('sinon');
const assert = require('assert');

describe('RlayOntologyJigsaw', () => {
  describe('Record', () => {
    context('new individual', () => {
      let airEntity, AirtableRecordMock;
      let rlayCreateEntityStub, airtableCreateStub, airtableUpdateStub;
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
      before(() => {
        airtableCreateStub = sinon.stub(AirtableRecordMock.$airtableTableClient, 'create').resolves({
          _table: {
            _base: { _id: undefined },
            id: null,
            name: 'mock'
          },
          id: 'recMock'
        });
      });
      before(() => {
        airtableUpdateStub = sinon.stub(AirtableRecordMock.$airtableTableClient, 'update').
          resolves('')
      });
      before(async () => {
        const indi = await rlayClient.Individual.create({ airtableRecordClass: true });
        airEntity = AirtableRecordMock.from(indi.payload);
        await airEntity.resolve();
        await airEntity.create({ Name: airEntity.cid });
      });
      before(() => {
        rlayCreateEntityStub = sinon.stub(rlayClient, 'createEntity').resolves('0x0000')
      });
      beforeEach(() => rlayCreateEntityStub.resetHistory());
      beforeEach(() => airtableCreateStub.resetHistory());
      beforeEach(() => airtableUpdateStub.resetHistory());

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
