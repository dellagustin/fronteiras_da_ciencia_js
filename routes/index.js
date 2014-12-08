var express = require('express');
var router = express.Router();

router.get('/episode/:episodeNumber', function(req, res) {
	
	var episodeNumber = req.params.episodeNumber;
	
	var content = require('../content/content.json');
	
	var episode;
	
	content.episodes.forEach(function(item) {
	    if(item.number + '' === episodeNumber + '') {
	    	episode = item;
	    }
	});
	
	if(episode) {
		episode.downloadLink = 'http://dstats.net/download/http://www6.ufrgs.br/frontdaciencia/arquivos/' + episode.audioFile;
		episode.imageUrl = episode.imageFile ? 'http://www.ufrgs.br/frontdaciencia/imagens/' + episode.imageFile : false;
		episode.downloadCounterLink = 'http://dstats.net/dstatsjs.php?file=http://www6.ufrgs.br/frontdaciencia/arquivos/' + episode.audioFile;
		episode.disqusID = '\'Episode_' + episode.number + '\'';
		
		res.render('episode', { episode: episode });
	}
	else {
		res.render('episode_not_found', { episode: episode });
    }
});

/* GET home page. */
router.get('/', function(req, res) {

	var content = require('../content/content.json');
	
	content.episodes.sort( function(a, b) {
		return b.number-a.number;
	});
	
	content.episodes.forEach(function(item) {
		item.imageUrl = item.imageFile ? 'http://www.ufrgs.br/frontdaciencia/imagens/' + item.imageFile : false;
		item.linkToArticle = 'episode/' + item.number;
		item.downloadCounterLink = 'http://dstats.net/dstatsjs.php?file=http://www6.ufrgs.br/frontdaciencia/arquivos/' + item.audioFile;
		item.disqusID = '\'Episode_' + item.number + '\'';
	});
	
	console.log(content.episodes);
	
	res.render('index', { episodes: content.episodes});
});

module.exports = router;
