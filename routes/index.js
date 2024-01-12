var express = require('express');
var router = express.Router();

const dotenv = require('dotenv');
const { Client } = require('@notionhq/client');
dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const database_id = process.env.NOTION_DATABASE_ID;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Collèges listing. */
async function queryColleges(database_id) {
  try {
      const response = await notion.databases.query({
        database_id: database_id,
      });  
      return response.results;
  } catch (error){
      console.log(error.body);
  }
}
router.get('/markers', function(req, res) {
  queryColleges(database_id)
  .then(data => {
    let formatedData = []
    for(let i in data){
          // console.log(data[i].properties.Visited)
          let name = null;
          if(data[i].properties.Name.title.length) name = data[i].properties.Name.title[0].plain_text;

          let date = null;
          if(data[i].properties.Visited.date) date = data[i].properties.Visited.date.start
          
          let anchor = null;
          if(data[i].properties.geoCoding.rich_text.length) anchor = data[i].properties.geoCoding.rich_text[0].plain_text.split(', ');

          formatedData.push({name, date, anchor})
      }

      res.send(formatedData);
  });
});

module.exports = router;
