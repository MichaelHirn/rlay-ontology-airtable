/* eslint-env node, mocha */
const simple = require('simple-mock');
const assert = require('assert');

const airtableFactories = (client, startWith = 'Airtable') => {
  return Object.keys(client).filter(key => key.startsWith(startWith))
}

describe('RlayOntologyJigsaw', () => {
  describe('module', () => {
    it('returns a proper rlay-client', () => {
      /* eslint-disable global-require */
      const rlayClient = require('../src');
      const schemaCids = require('../src/generated/cids.json');
      /* eslint-enable global-require */
      Object.keys(schemaCids).forEach(schemaCidKey => {
        assert.equal(rlayClient.schema[schemaCidKey] instanceof Object, true);
      });
    });

    it('has the special entityFactories attached', () => {
      const rlayClient = require('../src');
      const expectedEntityFactories = [
        'AirtableRecordMixin',
      ];
      assert.deepEqual(airtableFactories(rlayClient).sort(), expectedEntityFactories.sort());
    });

    it('all Jigsaw Factories inherit from Rlay_Individual', () => {
      const rlayClient = require('../src');
      airtableFactories(rlayClient, 'Jigsaw').forEach(factoryKey => {
        if (!factoryKey.endsWith('Mixin')) {
          assert.equal(
            rlayClient[factoryKey].prototype instanceof rlayClient.Rlay_Individual,
            true, `${factoryKey} does not inherit from Rlay_Individual`);
        }
      });
    });

    it('all Jigsaw Factories are Rlay_Individual Factories', () => {
      const rlayClient = require('../src');
      airtableFactories(rlayClient, 'Jigsaw').forEach(factoryKey => {
        if (!factoryKey.endsWith('Mixin')) {
          assert.equal(
            rlayClient[factoryKey].type, 'Individual',
            `${factoryKey} type: ${rlayClient[factoryKey].type} !== 'Individual'`);
        }
      });
    });

    it('all JigsawLinkedin inherit from JigsawIndividual', () => {
      const rlayClient = require('../src');
      airtableFactories(rlayClient, 'JigsawLinkedin').forEach(factoryKey => {
        assert.equal(rlayClient[factoryKey].prototype instanceof rlayClient.JigsawIndividual,
          true, `${factoryKey} does not inherit from JigsawIndividual`);
      });
    });

    it('all JigsawLinkedin* inherit from JigsawLinkedin', () => {
      const rlayClient = require('../src');
      airtableFactories(rlayClient, 'JigsawLinkedin').forEach(factoryKey => {
        if (factoryKey !== 'JigsawLinkedin') {
          assert.equal(rlayClient[factoryKey].prototype instanceof rlayClient.JigsawLinkedin,
            true, `${factoryKey} does not inherit from JigsawLinkedin`);
        }
      });
    });

    it('all JigsawLinkedin*Datum inherit from JigsawDatum', () => {
      const rlayClient = require('../src');
      airtableFactories(rlayClient, 'JigsawLinkedin').forEach(factoryKey => {
        if (factoryKey.endsWith('Datum')) {
          assert.equal(rlayClient[factoryKey].prototype instanceof rlayClient.JigsawDatumMixin,
            true, `${factoryKey} does not inherit from JigsawDatum`);
        }
      });
    });

    it('all JigsawLinkedin*DatumAggregate inherit from JigsawDatumAggregate', () => {
      const rlayClient = require('../src');
      airtableFactories(rlayClient, 'JigsawLinkedin').forEach(factoryKey => {
        if (factoryKey.endsWith('DatumAggregate')) {
          assert.equal(
            rlayClient[factoryKey].prototype instanceof rlayClient.JigsawDatumAggregateMixin,
            true, `${factoryKey} does not inherit from JigsawDatumAggregate`);
        }
      });
    });
  });
});
