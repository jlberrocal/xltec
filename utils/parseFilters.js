/**
 * parse filters as an valid object for mongoose
 *
 * @param {string} filters
 * @return {Object}
 */
function parseDeviceFilters(filters) {
	if(!filters)
		return {};
	try {
		let parsed = JSON.parse(filters);
		let filterObject = {};
		Object.keys(parsed).forEach(key => {
			switch(key) {
				case 'mac':
				case 'name':
					filterObject[key] = RegExp(parsed[key], 'gi');
					break;
				case 'users':
					filterObject['linkedUsers'] = {$in: parsed[key]};
					break;
			}
		});
		console.log(filterObject);
		return filterObject;
	} catch(e){
		console.error(e);
		return {};
	}
}

module.exports = parseDeviceFilters;