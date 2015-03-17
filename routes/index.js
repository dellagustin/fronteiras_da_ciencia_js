var express = require('express');
var fs = require('fs');

var router = express.Router();

var content;

var updateContent = function () {
	fs.readFile('./content/content.json', function(err, data) {
		if(data) {
		  content = JSON.parse(data);
		}
		else {
			console.log(err);
		}
	});
}

function prepareEpisode(episode) {
	episode.downloadLink = 'http://dstats.net/download/http://www6.ufrgs.br/frontdaciencia/arquivos/' + episode.audioFile;
	episode.imageUrl = episode.imageFile ? 'http://www.ufrgs.br/frontdaciencia/imagens/' + episode.imageFile : false;
	episode.linkToArticle = '/episode/' + episode.number;
	episode.downloadCounterLink = 'http://dstats.net/dstatsjs.php?file=http://www6.ufrgs.br/frontdaciencia/arquivos/' + episode.audioFile;
	episode.disqusID = '\'Episode_' + episode.number + '\'';
}

function prepareEpisodes(episodes) {
	episodes.forEach(prepareEpisode);
}

router.get('/season/:seasonNumber', function(req, res) {

	var seasonNumber = req.params.seasonNumber;
	var seasonEspisodes = [];
	var content = getContent();

	content.episodes.sort( function(a, b) {
		return b.number-a.number;
	});

	content.episodes.forEach(function(item) {
		if(parseInt(item.seasonNumber) === parseInt(seasonNumber)) {
			seasonEspisodes.push(item);
		}
	});

	prepareEpisodes(seasonEspisodes);

	res.render('index', { episodes: seasonEspisodes});
});

router.get('/episode/:episodeNumber', function(req, res) {

	var episodeNumber = req.params.episodeNumber;

	var content = getContent();

	var episode;

	content.episodes.forEach(function(item) {
	    if(item.number + '' === episodeNumber + '') {
	    	episode = item;
	    }
	});

	if(episode) {
		prepareEpisode(episode);
		res.render('episode', { episode: episode });
	}
	else {
		res.render('episode_not_found', { episode: episode });
    }
});

/* GET home page. */
router.get('/', function(req, res) {

	// var content = getContent();

	content.episodes.sort( function(a, b) {
		return b.number-a.number;
	});

	prepareEpisodes(content.episodes);

	res.render('index', { episodes: content.episodes});
});

module.exports = router;
module.exports.updateContent = updateContent;

updateContent( );
