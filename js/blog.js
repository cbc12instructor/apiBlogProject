
let results = [];
let currentPage = 1; // start on page load with the first 10 articles
var articleIndex = 0;

// helper functions
function getEl(id) {
	return document.getElementById(id);
}

// return to main page function 
// TODO - refactor our default loading behavior
function loadPage(page) {
	// TODO - make sure we load the page we were on when we go back from an article
	currentPage = page;

	// clear the page so that we are always fresh.
	getEl('articles').innerHTML = `<span>Page ${currentPage}</span>`;

	// this helps our loop below handle pagination.
	// the only edge case is that page 1 needs to use the
	// zeroth index.
	articleIndex = 0;
	if ( page > 1 ) {
		articleIndex = page * 10;
	}
	
	// call articles API
	let xhr = new XMLHttpRequest();
	xhr.onload = function() {
		results = JSON.parse(this.responseText);
	
		console.log('what is article index?' + articleIndex);

		// loop through results
		let stopAtIndex = articleIndex + 10;

		for ( ; window.articleIndex < stopAtIndex; window.articleIndex++ ) {
			// TODO - check to make sure that there is a value 
			console.log('index is - ' + articleIndex);
			let body = results[window.articleIndex].body;
			let title = results[window.articleIndex].title;
			let id = results[window.articleIndex].id;

			// fetch count of comments - https://jsonplaceholder.typicode.com/posts/${id}/comments
			let articletpl = `<article><a name="article_id_${id}"></a><h2><a class="article_link" href="/article/${id}">${title}</a></h2><p>${body}</p><span id="${id}_comments">- comments</span></article>`;

			getEl('articles').innerHTML += articletpl;

			// grab a reference to the comments
			getCommentCount(id);
		}

		// create an element for first ten entries
	};
	xhr.open('GET', 'https://jsonplaceholder.typicode.com/posts');
	xhr.send();
}


// returns a count and updates the main page
function getCommentCount(id) {
	// create XHR request to get the comments of this ID
	let xhr = new XMLHttpRequest();
	xhr.onload = function() {
		// update the comment count for this id #{$id}_comments
		let comments = JSON.parse(this.responseText);

		// get the count
		let count = comments.length;

		// update the span
		// TODO (turn this into a link)
		getEl(`${id}_comments`).innerHTML = count + ' comments';
	}
	xhr.open('GET', 'https://jsonplaceholder.typicode.com/posts/' + id + '/comments');
	xhr.send();
}

// function to load the full comments/article page
function loadArticle(article_id) {
	
	// replace the articles section with our article and comments
	// /article/${id}
	// load the comments with XHR
	let xhr = new XMLHttpRequest();
	xhr.onload = function() {
		let outputHTML = '';

		// grab article out of results array
		let article = results[ article_id - 1 ];
		let body = article.body;
		let title = article.title;
		let id = article.id;
		outputHTML += `<article><a class="go_back" data-previous-page="${currentPage}" href="/articles/${currentPage}">Back to Articles Page ${currentPage}</a><h2>${title}</h2><p>${body}</p><span id="${id}_comments">- comments</span></article>`;

		// load the comments 
		let comments = JSON.parse(this.responseText);
		console.log(comments);
		for ( let i = 0; i < comments.length; i++ ) {
			let body = comments[i].body;
			let title = comments[i].name;
			outputHTML += `<div class="comment" id="comment_${i}"><h3>${title}</h3><p>${body}</p></div>`;
		}

		// display both article and comments
		getEl('articles').innerHTML = outputHTML;
	};
	xhr.open('GET', 'https://jsonplaceholder.typicode.com/posts/' + article_id + '/comments');
	xhr.send();

	
}

document.addEventListener('DOMContentLoaded', function( ) {
	// event handlers - article_link
	getEl('articles').addEventListener('click', function(event) {
		let el = event.target;
		if ( el.className == 'article_link' ) {
			// if the event.target is an article_link, do not navigate away
			event.preventDefault();

			// get the current article id
			let article_id = el.getAttribute('href').split('/')[2];		

			loadArticle(article_id);

		} else if ( el.className == 'go_back' ) {
			event.preventDefault();

			// event.target
			let pageNum = event.target.dataset.previousPage;

			loadPage(pageNum);
		}
	})

	// when the page is loaded, load a list of articles
	loadPage(1);
	
});

