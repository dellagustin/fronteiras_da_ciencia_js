/**
 * New node file
 */

var fs = require('fs');
// var http = require('http');
var parseString = require('xml2js').parseString;

var options = {
	host: 'www.if.ufrgs.br',
	path: '/~arenzon/fronteirasdaciencia.xml'
};

var feedXml = '';

var parseCallBack = function (err, result) {
	var content = {
		episodes: []
	};

  result.rss.channel[0].item.forEach(function(item) {
    var episode = {};

    episode.title = item.title[0];
    episode.description = item.description[0];
    episode.audioFile = item.enclosure[0].$.url.substring(72);

    var subGuid = item.guid[0].substring(31);

    if(subGuid.substring(1, 2) === 'T') {
    	episode.seasonNumber = parseInt(subGuid.substring(2, 4));
    	episode.seasonEpisodeNumber = parseInt(subGuid.substring(5, 7));
    }
    else {
    	episode.seasonNumber = 1;
    	episode.seasonEpisodeNumber = parseInt(subGuid.substring(1));
    }

    content.episodes.push(episode);
	});

	content.episodes.sort(function(a, b) {
		return (a.seasonNumber*100 + a.seasonEpisodeNumber) - (b.seasonNumber*100 + b.seasonEpisodeNumber);
	});

	var episodeCounter = 1;

	content.episodes.forEach(function(item) {
		item.number = episodeCounter;
		episodeCounter++;
	});

	console.log(JSON.stringify(content));
}

callback = function(response) {
  var feedXml = '';

  //another chunk of data has been received, so append it to `str`
  response.on('data', function (chunk) {
	feedXml += chunk;
  });

  //the whole response has been recieved, so we just print it out here
  response.on('end', function () {
    parseString(feedXml, parseCallBack);
  });
}

http.request(options, callback).end();

/*
fs.readFile(__dirname + '/fronteirasdaciencia.xml', function(err, data) {
	if(data) {
		parseString(data, parseCallBack);
	}
	else {
		console.log(err);
	}
});
*/
