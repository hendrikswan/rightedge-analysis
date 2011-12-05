m = function(price) {
	emit(this.share_id, {records: 1, close: this.close});   
};

r = function(key, values){
    var total = 0;
    values.forEach(function(price){
		total+= price.close;
    });
	
	average = total/values.length;
	deviation_total = 0;
	
    values.forEach(function(price){
		deviation_total += Math.pow(price.close - average, 2);
    });
	
    var std_dev = {
		records: values.length, 
		dev: Math.sqrt(deviation_total/values.length), 
		avg: average
	};
	
	std_dev.percentage = (std_dev.dev/average) * 100;
	std_dev.company = db.companies.find({share_id: key})[0]
	
	return std_dev;
};

db.prices.mapReduce(m, r, 
	{ 
		query : {date: {$gt: new Date(2011, 9, 30, 0, 0, 0, 0)}}, 
		out : { replace : "standard_deviation" }
	});
	
	

var interestingShares = db.standard_deviation.find({"value.dev" : {$gt : 300}})

interestingShares.forEach(function(share){
	print(share.value.company.code);
	print("\tsector: " + share.value.company.sector);
	print("\tdev: " + share.value.dev);
	print("\tavg: " + share.value.avg);
});