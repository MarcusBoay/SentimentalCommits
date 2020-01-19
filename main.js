const express = require("express");
const request = require("request");
// Imports the Google Cloud client library
const language = require("@google-cloud/language");
const app = express();
const port = 3000;

const options = {
  url: "https://api.github.com/repos/MarcusBoay/maze-game/commits",
  headers: {
    "User-Agent": "Awesome-Octocat-App"
  }
};

app.get("/analyse", (req, res) => {
  console.log("/analyse hit!");

  let _commits = [];

  request(options, async (err, res, body) => {
    let ress = JSON.parse(body);
    for (let i = 0; i < ress.length; i++) {
      _commits.push(ress[i].commit.message);
    }

    // Instantiates a client
    const client = new language.LanguageServiceClient();

    var commits = [];
    for (let i = 0; i < _commits.length; i++) {
      // The text to analyze
      const text = _commits[i];
      const document = {
        content: text,
        type: "PLAIN_TEXT"
      };

      // Detects the sentiment of the text
      const [result] = await client.analyzeSentiment({ document: document });
      const sentiment = result.documentSentiment;
      console.log(`Text: ${text}`);
      console.log(`Sentiment score: ${sentiment.score}`);
      console.log(`Sentiment magnitude: ${sentiment.magnitude}`);

      commits.push({
        message: text,
        sentimentScore: sentiment.score,
        sentimentMagnitude: sentiment.magnitude
      });
    }
  });
  //   res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
