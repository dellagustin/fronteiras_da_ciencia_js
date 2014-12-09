var express = require('express');
var router = express.Router();

function prepareEpisode(episode) {
	episode.imageUrl = episode.imageFile ? 'http://www.ufrgs.br/frontdaciencia/imagens/' + episode.imageFile : false;
	episode.linkToArticle = '/episode/' + episode.number;
	episode.downloadCounterLink = 'http://dstats.net/dstatsjs.php?file=http://www6.ufrgs.br/frontdaciencia/arquivos/' + episode.audioFile;
	episode.disqusID = '\'Episode_' + episode.number + '\'';
}

function prepareEpisodes(episodes) {
	episodes.forEach(prepareEpisode);
}

function getContent() {
	var content = require('../content/content.json');
	
	return content;
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

	var content = getContent();
	
	content.episodes.sort( function(a, b) {
		return b.number-a.number;
	});
	
	prepareEpisodes(content.episodes);
	
	res.render('index', { episodes: content.episodes});
});

module.exports = router;
