const rlay = require('@rlay/web3-rlay');
const utils = require('./utils');

const classes = () => ({
  ...utils.class({
    name: 'airtableRecord',
    label: 'Airtable Record',
    description: 'A Airtable Record individual',
  })
});

const dataProperties = () => ({
  ...utils.dataProp({
    name: 'airtableBase',
    label: 'Airtable Base',
    description: 'The ID of an Airtable Base',
  }),

  ...utils.dataProp({
    name: 'airtableTable',
    label: 'Airtable Table',
    description: 'The Name of an Airtable Table',
  }),

  ...utils.dataProp({
    name: 'airtableRecord',
    label: 'Airtable Record',
    description: 'The ID of an Airtable Record',
  }),
});

const objectProperties = () => ({
  ...utils.objectProp({
    name: 'airtableRecord',
    label: 'Airtable Record',
    description: 'Points to a Airtable Record individual',
  }),

  ...utils.objectProp({
    name: 'airtableRecordee',
    label: 'Airtable Recordee',
    description: 'Points to individual recorded in a Airtable Record',
  }),
});

module.exports = {
  version: '2',
  includeImportsInOutput: true,
  imports: {
    ...rlay.builtins,
  },
  entities: {
    ...classes(),
    ...dataProperties(),
    ...objectProperties(),
  },
};
