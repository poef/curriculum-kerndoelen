	var Ajv = require('ajv');
	var ajv = new Ajv({
		'extendRefs': true,
		'allErrors': true,
		'jsonPointers': true
	});
	var validate = null;

	ajv.addKeyword('itemTypeReference', {
		validate: function(schema, data, parentSchema, dataPath, parentData, propertyName, rootData) {
			var matches = /.*\#\/definitions\/(.*)/g.exec(schema);
			if (matches) {
				var result = curriculum.types[data] == matches[1];
				return result;
			}
			console.log('Unknown #ref definition: '+schema);
		}
	});

	var curriculum     = require('../lib/curriculum.js');
	var doelenSchema     = curriculum.loadSchema('curriculum-doelen/context.json','curriculum-doelen/');
	var kerndoelenSchema = curriculum.loadSchema('context.json');

	var valid = ajv.addSchema(doelenSchema, 'https://opendata.slo.nl/curriculum/schemas/curriculum-doelen/context.json')
				   .addSchema(kerndoelenSchema, 'https://opendata.slo.nl/curriculum/schemas/curriculum-kerndoelen/context.json')
	               .validate('https://opendata.slo.nl/curriculum/schemas/curriculum-kerndoelen/context.json', curriculum.data);

	if (!valid) {
		ajv.errors.forEach(function(error) {
			console.log(error.dataPath+': '+error.message);
		});
	} else {
		console.log('data is valid!');
	}

