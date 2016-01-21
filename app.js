(function(exports) {

var searchStr = '';
var artistJSON = {};
var relatedArtists = [];
// var queue = [];
var popularityThreshold = 50;
var totalArtistsThreshold = 100;
var pq = new PriorityQueue();

var getRelatedArtists = function(artist) {
	if(!artist) {
		console.log(artistJSON);
		return;	
	}
	relatedArtists = [];
	var url = 'https://api.spotify.com/v1/artists/' + artist.id + '/related-artists';
	$.ajax(url, {
		datatype: 'json',
		success: function(result) {
			relatedArtists = result.artists;
			for(var i = 0; i < relatedArtists.length; i++) {
				if(relatedArtists[i].popularity >= popularityThreshold) {
					addToJSON(relatedArtists[i]);
				}
			}
		},
		error: function(result) {
			console.log('Error when fetching Related Artists!!!!');
			console.log(artistJSON);
		}
	}).done(function() {
		if(Object.keys(artistJSON).length > totalArtistsThreshold || pq.size() === 0) {
			console.log(artistJSON);
			return;	
		}
		else {
			// var art = queue.shift();
			var art = pq.pop();
			console.log('Removing ' + art.name + " with popularity of " + art.popularity);
			setTimeout(function(){
				console.log(Object.keys(artistJSON).length + " " + pq.size());
				console.log(Object.keys(artistJSON).length - pq.size());
				getRelatedArtists(art);
				// getRelatedArtists(queue[[0]]);
			}, 50);	
		}
	});
};

var bfs = function(artist) {
	// Get the Related Artists
	// queue = [];
	// queue.push(artist);
	getRelatedArtists(artist);
	// DeQueue and EnQueue till there is no tomorrow.
};


var addToJSON = function(artist) {
	if (artistJSON[artist.id] !== undefined || artist.id === undefined) {
		return false;
	}
	artistJSON[artist.id] = [artist.name, artist.popularity];
	pq.push(artist, artist.popularity);
	// queue.push(artist);
	return true;
};

var createMap = function() {
	// Get the String from the Input Box
	searchStr = $('#artistText').val().trim();
	// Get the artists from Spotify using the Search API
	var url = 'https://api.spotify.com/v1/search?q=' + searchStr + '&type=artist&market=US&limit=1';
	$.ajax(url, {
		datatype: 'json',
		success: function(result) {
			// Get the first artist's ID and add it to the JSON
			var artist = result.artists.items[0];
			var id = artist.id;
			var name = artist.name;
			addToJSON(artist);
			// console.log(artist);
			bfs(artist);
		},
		error: function(result) {
			console.log('Error when fetching the Artist!!');
		}
	});

// Create a JSON file
};

exports.startApp = function() {
	// Create Map using the Input String
	$('#start').click(function() {
		if($('#popularityText').val()) {
			popularityThreshold = parseInt($('#popularityText').val().trim());
		}
		if($('#maximumText').val()) {
			totalArtistsThreshold = parseInt($('#maximumText').val().trim());
		}
		createMap();
	});
};

})(window);
