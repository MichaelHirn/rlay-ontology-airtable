
    const { Client } = require('@rlay/rlay-client-lib');
    const map = new Map();
    const entityFactories = require('./entities');

    const getClient = (config) => {
      const stringConfig = JSON.stringify(config);
      if (map.has(stringConfig)) {
        return map.get(stringConfig);
      } else {
        const client = new Client(config);
        const schemaCIDs = {"airtableRecordClassLabel":"0x019580031b20890840234fc3d06aa41894b81f132074e1654f038797a00488db348e9458698f","airtableRecordClassDescription":"0x019580031b2065aab2decb0a8bb433fc52efd70dfa0ab670c4822dece8c74680af1612206875","airtableRecordClass":"0x018080031b20ac79f4de4bc71f22b82eb084f965a3114e727526e32f9e4b5b01fdf4cb4ed289","airtableBaseDataPropertyLabel":"0x019580031b20fda22213af8cf31ec96f91a9139015da3b8134ea1bd610a64da15e8aacf77969","airtableBaseDataPropertyDescription":"0x019580031b203813a772d0d19e34de3c2e96548cd1bf9b0e6e04853da8ff0ee324a4955b3c44","airtableBaseDataProperty":"0x019480031b20cfd1819148ac860e072e7c898a1df67b36b5c91e5a9cc1b0546c0f335d82c0c3","airtableTableDataPropertyLabel":"0x019580031b203bf3e5a742c7734fbee4f9eb8922f5ad6ef823dac287fcbf753b330def30be36","airtableTableDataPropertyDescription":"0x019580031b20c62ff6997d2a90790d3b982d00f1723f94c266c8d0f968750a905341a4de12ec","airtableTableDataProperty":"0x019480031b20ad20c8daa3047b6100c8e723a6a9921691be5a2a1101f7d897177d3df0a2fde6","airtableRecordDataPropertyLabel":"0x019580031b20890840234fc3d06aa41894b81f132074e1654f038797a00488db348e9458698f","airtableRecordDataPropertyDescription":"0x019580031b2083e04d218b8ab827311c5ca104cdc78d6cc34904a935d5dfd19a2339789136b8","airtableRecordDataProperty":"0x019480031b20c6f6e0c1d89169098841bb74bf676dee75f2723f716cf5ea43707c75bde777fa","airtableRecordObjectPropertyLabel":"0x019580031b20890840234fc3d06aa41894b81f132074e1654f038797a00488db348e9458698f","airtableRecordObjectPropertyDescription":"0x019580031b20488b9796d150cd5dccfc4e15fd6bcd4aa56610295edacc8fe06f69769d852ff5","airtableRecordObjectProperty":"0x019280031b20b3645e064fe251ff70a8057366a93c210b11a353c10c4e3163fa3585d1aca4b7","airtableRecordeeObjectPropertyLabel":"0x019580031b202e7da47b2569626286d4f556e40ec1fd2ab4979eeb95cbd302d8719894c00117","airtableRecordeeObjectPropertyDescription":"0x019580031b20e92cd68f5a41b2684426c6d5bfad77f652fc4451ad778db6d41c510bc0e9a82c","airtableRecordeeObjectProperty":"0x019280031b209c7a2a71a94ca40ae8f2c20b6ce1e434f490e8349b43d10787901f6038f344f8","labelAnnotationProperty":"0x019780031b20b3179194677268c88cfd1644c6a1e100729465b42846a2bf7f0bddcd07e300a9","seeAlsoAnnotationProperty":"0x019780031b2073df9fe9531a29afa7435bb4564336d0613c2f5ca550dabd9427d8d854e01de5","commentAnnotationProperty":"0x019780031b20e77fddce0bc5ecd30e3959d43d9dc36ef5448a113b7524621bac9053c02b3319"};
        const schema = [{"key":"airtableRecordClass","assertion":{"type":"Class","annotations":["0x019580031b20890840234fc3d06aa41894b81f132074e1654f038797a00488db348e9458698f","0x019580031b2065aab2decb0a8bb433fc52efd70dfa0ab670c4822dece8c74680af1612206875"]}},{"key":"airtableBaseDataProperty","assertion":{"type":"DataProperty","annotations":["0x019580031b20fda22213af8cf31ec96f91a9139015da3b8134ea1bd610a64da15e8aacf77969","0x019580031b203813a772d0d19e34de3c2e96548cd1bf9b0e6e04853da8ff0ee324a4955b3c44"]}},{"key":"airtableTableDataProperty","assertion":{"type":"DataProperty","annotations":["0x019580031b203bf3e5a742c7734fbee4f9eb8922f5ad6ef823dac287fcbf753b330def30be36","0x019580031b20c62ff6997d2a90790d3b982d00f1723f94c266c8d0f968750a905341a4de12ec"]}},{"key":"airtableRecordDataProperty","assertion":{"type":"DataProperty","annotations":["0x019580031b20890840234fc3d06aa41894b81f132074e1654f038797a00488db348e9458698f","0x019580031b2083e04d218b8ab827311c5ca104cdc78d6cc34904a935d5dfd19a2339789136b8"]}},{"key":"airtableRecordObjectProperty","assertion":{"type":"ObjectProperty","annotations":["0x019580031b20890840234fc3d06aa41894b81f132074e1654f038797a00488db348e9458698f","0x019580031b20488b9796d150cd5dccfc4e15fd6bcd4aa56610295edacc8fe06f69769d852ff5"]}},{"key":"airtableRecordeeObjectProperty","assertion":{"type":"ObjectProperty","annotations":["0x019580031b202e7da47b2569626286d4f556e40ec1fd2ab4979eeb95cbd302d8719894c00117","0x019580031b20e92cd68f5a41b2684426c6d5bfad77f652fc4451ad778db6d41c510bc0e9a82c"]}}];

        client.initSchema(schemaCIDs, schema);
        client.initClient();

        // set the correct client for the entityFactories
        Object.keys(entityFactories).forEach(key => {
          if (!key.endsWith('Mixin')) entityFactories[key].client = client
        });
        Object.assign(client, entityFactories);

        map.set(stringConfig, client);
        return getClient(config);
      }
    }

const t = getClient({});
t.getClient = getClient;

module.exports = t;
