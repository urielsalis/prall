// ==UserScript==
// @name        PRALL
// @namespace   pnoexz.com
// @include     https://www.reddit.com/r/all/*
// @version     2.0.0
// @grant       none
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// ==/UserScript==

console = unsafeWindow.console
var rules = [];
var multis = [];
var me = [];

$.ajax({
  type: 'GET',
  url: 'https://www.reddit.com/api/me.json',
  success: function(data) {
    me = data;
  },
  error: function(XMLHttpRequest, textStatus, errorThrown) {
    console.debug(XMLHttpRequest);
    alert("Error getting user info: " + errorThrown); 
  }
})



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
  multis = data;
	for (i in data) {
		if (data[i].kind == 'LabeledMulti') {

			if (data[i].data.display_name == 'prall' || data[i].data.display_name == 'prall2' || data[i].data.description_md == 'PRALL') {
				var multi = data[i].data;
				for (k in multi.subreddits) {
					rules.push(multi.subreddits[k].name);
				}
				console.log('Parsed data from multi: ' + data[i].data.display_name);
			}
		}
	}
  console.log('Total rules added: ' + rules.length)
	return ApplyFilter();
}


function ApplyFilter() {
	if (typeof rules == 'undefined') {
		console.log('no rules');
		return false;
	}
	console.log('Applying filter for ' + rules.length + ' subreddits');
	//console.dir(rules);
	for (j in rules) {
		$('div[data-subreddit="'+rules[j]+'"]').hide()
	}
	return true;
}

console.log('PRALL loaded.');
ApiGet();

function confirmFilterSubreddit(name) {
  if (confirm('Are you sure you want to filter ' + name) || true) {
    console.log('Filtering for real');
    filterSubreddit(name);
  } else {
  }
}

function filterSubreddit(subredditName) {
  var multi = findMultiWithSpace();
  var multiName = multi.data.name;

  $.ajax({
    url: 'https://www.reddit.com/api/multi/user/'+me.data.name+'/m/' + multiName + '//r/' + subredditName,
    type: 'PUT',
    contentType: "application/x-www-form-urlencoded",
    data: 'model=%7B%22name%22%3A%22' + multiName + '%22%7D',
    headers: {
      'X-modhash': me.data.modhash,
      'X-Requested-With': 'XMLHttpRequest'
    },
    success: function(data) {
      console.log('Added ' + subredditName + ' to PRALL multi ' + multiName);
      ApiGet();
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      console.debug(XMLHttpRequest);
      alert("Error filtering " + subredditName); 
    }
  })
}

function findMultiWithSpace() {
  for (i in multis) {
		if (multis[i].kind == 'LabeledMulti' && multis[i].data.description_md == 'PRALL') {
      if (!isMultiFull(multis[i])) {
        console.log('Found multi with room: ' + multis[i].data.name);
        return multis[i];
      } else {
        console.log('Rejecting multi: ' + multis[i].data.name);
      }
    }
  }
  alert('Didnt find any suitable multi. Create a multi and set its description to: "PRALL"');
}

function isMultiFull(multi) {
  if (multi.data.subreddits.length > 99) {
    return true;
  }
  return false;
}

function drawButtons() {
  console.log('Drawing buttons');
  $('p.tagline').each(function() {
    var button = $(document.createElement('a'));
    button.text('[-]');
    button.css({
      'padding-left': '5px',
      'cursor': 'pointer'
    });
    var subreddit = $(this).parent().parent().parent().attr('data-subreddit');
    button.attr('data-subreddit', subreddit);
    
    button.on('click', function () {
      confirmFilterSubreddit(subreddit);
    });
    $(this).append(button);
  });
}
                      
drawButtons();



MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var observer = new MutationObserver(function(mutations, observer) {
	// fired when a mutation occurs
	console.log(mutations, observer);
	ApplyFilter();
	drawButtons();
});

// define what element should be observed by the observer
// and what types of mutations trigger the callback
observer.observe(document.getElementById('siteTable'), {
	subtree: false,
	attributes: false,
	childList: true
	// http://stackoverflow.com/questions/2844565/is-there-a-jquery-dom-change-listener#2844704
});


/* Button
var btn = $(document.createElement('button'));

btn.text('start');
btn.on('click',function() { ApplyFilter() });

$('#header-bottom-right').append(btn);*/

/**
@TODO add useragent to requests
@TODO autocreate multi when all are full
@TODO cleanup
*/
