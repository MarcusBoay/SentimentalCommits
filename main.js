const express = require("express");
const request = require("request");
const cors = require("cors");
const bodyParser = require("body-parser");
// Imports the Google Cloud client library
const language = require("@google-cloud/language");
const app = express();
const port = 5000;

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.post("/analyse", (req, resp) => {
  console.log("/analyse hit!");

  let _url = req.body.url.split("/");

  const options = {
    url: "https://api.github.com/repos/" + _url[3] + "/" + _url[4] + "/commits",
    headers: {
      "User-Agent": "Awesome-Octocat-App"
    }
  };

  let _commits = [];

  request(options, async (err, res, body) => {
    let ress = JSON.parse(body);
    for (let i = 0; i < ress.length; i++) {
      const profPic =
        ress[i].committer != null && ress[i].committer.avatar_url != null
          ? ress[i].committer.avatar_url
          : null;

      _commits.push({
        committer: ress[i].commit.committer.name,
        profPic: profPic,
        message: ress[i].commit.message,
        date: ress[i].commit.committer.date
      });
    }

    // Instantiates a client
    const client = new language.LanguageServiceClient();

    var commits = [];
    for (let i = 0; i < _commits.length; i++) {
      // The text to analyze
      const text = _commits[i].message;
      const document = {
        content: text,
        type: "PLAIN_TEXT"
      };

      // Detects the sentiment of the text
      const [result] = await client.analyzeSentiment({ document: document });
      const sentiment = result.documentSentiment;

      commits.push({
        profPic: _commits[i].profPic,
        committer: _commits[i].committer,
        message: text,
        y: sentiment.score,
        x: _commits[i].date,
        sentimentMagnitude: sentiment.magnitude
      });
    }

    resp.json({
      commits: commits
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
