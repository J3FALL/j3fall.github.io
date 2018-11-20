quotesUrl = "https://raw.githubusercontent.com/mdn/learning-area/master/accessibility/aria/quotes.json";

class Quote {
    constructor(author, text) {
        this.author = author;
        this.text = text;
    }
}

var currentQuoteIdx = 0;

var quotes = [new Quote('Big Smoke', 'ALL YOU HAD TO DO WAS FOLLOW THE DAMN TRAIN CJ!'),
    new Quote('Alexander Hvatov', 'As you maybe have noticed, we have a new article, ' +
        'concerning waves in a periodic elastic layer with a reduced-order models approximation.'),
    new Quote('Louis C.K.', 'I finally have the body I want. ' +
        'It\'s easy actually, you just have to want a really shitty body')];


function nextQuote() {
    changeQuoteFields(quotes[currentQuoteIdx]);

    currentQuoteIdx++;

    if (currentQuoteIdx >= quotes.length) currentQuoteIdx = 0;
}

function quotesFromUrl() {
    fetch(quotesUrl)
        .then(data => {
            return data.json()
        })
        .then(res => {

            var quotes = parsedQuotesFromJson(res);
            var quoteIdx = Math.floor(Math.random() * quotes.length);
            changeQuoteFields(quotes[quoteIdx]);
        })
}

function changeQuoteFields(quote) {
    document.getElementById("quote").innerText = quote.text;
    document.getElementById("author").innerText = quote.author;
}

function parsedQuotesFromJson(json) {
    return json.map(q => new Quote(q.author, q.quote));
}
