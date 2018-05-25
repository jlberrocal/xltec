let {Query} = require('mongoose');
(function(){
	/**
	 * Apply Pagination to query automatically
	 *
	 * @param {number} page
	 * @param {number} pageSize
	 * @return {Query}
	 */
	Query.prototype.paginate = function(page, pageSize){
		if(page && pageSize)
			this.skip((page - 1) * pageSize).limit(+pageSize);
		return this;
	}
})();