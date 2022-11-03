const cheerio = require('cheerio');
const unirest = require('unirest');


const CrawledPage = require('../models/CrawledPageModel');

const  crawl = async (req, res) => {
  const {url} = req.body
  return unirest
    .get(url)
    .headers({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36'
    })
    .then(response => {
      let $ = cheerio.load(response.body);

      let titles = [];
      let links = [];
      let snippets = [];
      let displayedLinks = [];
      $('.yuRUbf > a > h3').each((i, el) => {
        titles[i] = $(el).text();
      });
      $('.yuRUbf > a').each((i, el) => {
        links[i] = $(el).attr('href');
      });
      $('.g .VwiC3b ').each((i, el) => {
        snippets[i] = $(el).text();
      });
      $('.g .yuRUbf .NJjxre .tjvcx').each((i, el) => {

        displayedLinks[i] = $(el).text();
      });

      const organicResults = [];

      for (let i = 0; i < 5; i++) {
        organicResults[i] = {
          title: titles[i],
          links: links[i],
          snippet: snippets[i],
          displayedLink: displayedLinks[i],
        };
        const doc = CrawledPage.create(
          organicResults, function (err , data) {
            if (err) {
              return res.status(400).json(err);
            }
          })
        }
        res.status(200).json(organicResults)
    });
};

//load history using mongoose -> https://mongoosejs.com/
 const getHistory = (req, res) => {
  CrawledPage.find({}, (error, pages) => {
    if (error) {
      return res.status(400).json(error);
    }
    res.send(pages);
  });
};

module.exports = {crawl ,getHistory }
