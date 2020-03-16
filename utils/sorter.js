
let {Query} = require('mongoose');
(function(){
	/**
	 * Apply sorts automatically to query
	 *
	 * @param {Object} sorts
	 * @return {Query}
	 */
	Query.prototype.sorter = function(sorts){
		if(sorts)
			try {
				let sortObj = typeof sorts === 'string' ? JSON.parse(sorts) : sorts;
				this.sort(sortObj);
			} catch(e) {
				console.error(e);
			}

		return this;
	}
})();