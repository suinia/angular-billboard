var moment = require('moment');
if(typeof module !== 'undefined' && typeof exports !== 'undefined' && module.exports === exports) {
	module.exports = 'airagFilters';
}
(function(angular) {
	angular.module('airagFilters', [])
		.filter('ae_date', function(){
			return function(date, format){
				if(!date){return ''}
				return moment(date, 'YY-MM-DD-HH-mm').format(format);
			}
		});
}(angular))