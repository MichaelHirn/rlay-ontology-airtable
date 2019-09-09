const Airtable = require('airtable');
const { Mixin } = require('mixwith');
const check = require('check-types');

const AirtableRecordMixin = airtableApiKey => {
  return Mixin((superclass) => {
    class Class extends superclass {
      static from (payload) {
        const entity = super.from(payload);
        entity.$airtableClient = this.$airtableClient;
        entity.$airtableBaseClient = this.$airtableBaseClient;
        entity.$airtableTableClient = this.$airtableTableClient;
        return entity;
      }

      /* eslint-disable-next-line class-methods-use-this */
      async create (body, table = this.$airtableTableName, baseId = this.$airtableBaseId) {
        const airtableClients = this.$$getAirtableClients(baseId, table);

        if (this.airtableRecordObjectProperty) {
          let recordEntities = [];
          if (check.array(this.airtableRecordObjectProperty)) {
            recordEntities.push(...this.airtableRecordObjectProperty);
          } else {
            recordEntities.push(this.airtableRecordObjectProperty);
          }
          await Promise.all(recordEntities.map(entity => entity.resolve()));
          const hits = recordEntities.filter(recordEntity => {
            return Class.$$hasRecordEntity(airtableClients, recordEntity)
          });
          if (hits.length === 0) {
            return this.$$createRecordEntity(airtableClients, body);
          } else if (hits.length === 1) {
            return this.$$updateRecordEntity(
              airtableClients,
              this.airtableRecordObjectProperty.properties.airtableRecordDataProperty,
              body
            );
          }
          throw new Error(`found ${hits.length} records in table, expected 1. This should not happen`);
        }

        return this.$$createRecordEntity(airtableClients, body);
      }

      async $$updateRecordEntity (airtableClients, recordId, body) {
        return airtableClients.table.update(recordId, body);
      }

      async $$createRecordEntity (airtableClients, body) {
        const record = await airtableClients.table.create(body);
        const recordIndividual = await this.client.Individual.create({
          airtableRecordClass: true,
          airtableBaseDataProperty: record._table._base._id,
          airtableTableDataProperty: record._table.name,
          airtableRecordDataProperty: record.id,
        });
        this.remoteCid = this.cid;
        await Promise.all([
          this.assert({airtableRecordObjectProperty: recordIndividual}),
          recordIndividual.assert({airtableRecordeeObjectProperty: this})
        ]);
        return record;
      }

      static $$hasRecordEntity (airtableClients, airtableRecord) {
        const clientBase = airtableClients.base._base._id;
        const clientTable = airtableClients.table.name;
        const recordBase = airtableRecord.properties.airtableBaseDataProperty;
        const recordTable = airtableRecord.properties.airtableTableDataProperty;
        return clientBase === recordBase && clientTable === recordTable;
      }

      $$getAirtableClients (baseId, table) {
        // Allows to ingest $airtableXClient functions that will
        // be used if present. Can be used to introduce mocks/stubs
        /* eslint-disable-next-line init-declarations */
        let baseClient, tableClient;
        if (this.$airtableBaseClient) {
          baseClient = this.$airtableBaseClient;
        } else {
          baseClient = this.$airtableClient.base(baseId);
        }
        if (this.$airtableTableClient) {
          tableClient = this.$airtableTableClient;
        } else {
          tableClient = baseClient(table);
        }
        return {
          airtable: this.$airtableClient,
          base: baseClient,
          table: tableClient
        }
      }
    }
    if (!process.env.AIRTABLE_API_KEY) {
      Airtable.configure({
        endpointUrl: 'https://api.airtable.com',
        apiKey: airtableApiKey
      });
    }
    Class.$airtableClient = Airtable;
    return Class;
  });
};

module.exports = { AirtableRecordMixin };
