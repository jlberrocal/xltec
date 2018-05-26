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
		try{
			if(page && pageSize)
				this.skip((page - 1) * pageSize).limit(+pageSize);
		} catch(e){
			console.error(e);
		}
		return this;
	}
})();