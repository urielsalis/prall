// ==UserScript==
// @name        PRALL
// @namespace   pnoexz.com
// @include     https://www.reddit.com/r/all/*
// @version     1
// @grant       none
// ==/UserScript==

console = unsafeWindow.console
var rules;

function ApiGet() {
$.ajax({
	url: 'https://www.reddit.com/api/multi/mine',
	success: function(data) {
		console.log('Fetched multi');
		// console.dir(data);
		return ApiParse(data);
	}
})
}

function ApiParse(data) {
	//data = [{"kind": "LabeledMulti", "data": {"can_edit": true, "display_name": "prall", "name": "prall", "description_html": "", "created": 1460065506.0, "copied_from": "/user/pnoexz/m/shitholes", "icon_url": null, "subreddits": [{"name": "TedCruzForPresident"}, {"name": "politics"}, {"name": "JebBush"}, {"name": "2016_elections"}, {"name": "news"}, {"name": "hillaryclinton"}, {"name": "trump"}, {"name": "donaldtrump"}, {"name": "nba"}, {"name": "sports"}, {"name": "Drumpf"}, {"name": "The_Donald"}, {"name": "TrumpForPresident"}, {"name": "Donald_Trump"}, {"name": "SandersForPresident"}, {"name": "soccer"}, {"name": "BlackPeopleTwitter"}], "created_utc": 1460036706.0, "key_color": "#cee3f8", "visibility": "private", "icon_name": "", "weighting_scheme": "classic", "path": "/user/Pnoexz/m/prall", "description_md": ""}}, {"kind": "LabeledMulti", "data": {"can_edit": true, "display_name": "prall_usa", "name": "prall_usa", "description_html": "", "created": 1460182685.0, "copied_from": null, "icon_url": null, "subreddits": [{"name": "TedCruzForPresident"}, {"name": "Hillary"}, {"name": "2016_elections"}, {"name": "conservatives"}, {"name": "hillaryclinton"}, {"name": "trump"}, {"name": "donaldtrump"}, {"name": "2016Elections"}, {"name": "Drumpf"}, {"name": "KasichForPresident"}, {"name": "trump16"}, {"name": "BernieSanders"}, {"name": "The_Donald"}, {"name": "TrumpForPresident"}, {"name": "TimCanova"}, {"name": "Donald_Trump"}, {"name": "JebBush"}, {"name": "bernieforpresident"}, {"name": "AskTrumpSupporters"}, {"name": "Marco_Rubio"}], "created_utc": 1460153885.0, "key_color": "#cee3f8", "visibility": "public", "icon_name": "", "weighting_scheme": "classic", "path": "/user/Pnoexz/m/prall_usa", "description_md": ""}}, {"kind": "LabeledMulti", "data": {"can_edit": true, "display_name": "totallysane", "name": "totallysane", "description_html": "", "created": 1460065886.0, "copied_from": null, "icon_url": null, "subreddits": [{"name": "TheMixedNuts"}, {"name": "Schizoid"}], "created_utc": 1460037086.0, "key_color": "#cee3f8", "visibility": "private", "icon_name": "", "weighting_scheme": "classic", "path": "/user/Pnoexz/m/totallysane", "description_md": ""}}];

	for (i in data) {
		if (data[i].kind == 'LabeledMulti') {

			if (data[i].data.display_name == 'prall') {
				var multi = data[i].data;
				rules = [];
				for (k in multi.subreddits) {
					rules.push(multi.subreddits[k].name);
				}
				console.log('Parsed data');
				//console.dir(rules);

				return ApplyFilter();

			}
		}
	}
	console.log('No suitable data found');
	return false;

}


function ApplyFilter() {
	//rules = [ "TedCruzForPresident", "soccer", "AdviceAnimals", "politics", "JebBush", "2016_elections", "news", "hillaryclinton", "trump", "donaldtrump", "nba", "sports" ];
	if (typeof rules == 'undefined') {
		console.log('no rules');
		return false;
	}
	console.log('Applying filter');
	console.dir(rules);
	for (j in rules) {
		$('div[data-subreddit="'+rules[j]+'"]').hide()
	}
	return true;
}

console.log('PRALL loaded.');
ApiGet();



MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var observer = new MutationObserver(function(mutations, observer) {
	// fired when a mutation occurs
	console.log(mutations, observer);
	ApplyFilter();
});

// define what element should be observed by the observer
// and what types of mutations trigger the callback
observer.observe(document.getElementById('siteTable'), {
	subtree: false,
	attributes: false,
	childList: true
	// http://stackoverflow.com/questions/2844565/is-there-a-jquery-dom-change-listener#2844704
});


/** Button
var btn = $(document.createElement('button'));

btn.text('start');
btn.on('click',function() { ApplyFilter() });

$('#header-bottom-right').append(btn);*/
