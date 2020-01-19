const express = require("express");
const request = require("request");
const cors = require("cors");
// Imports the Google Cloud client library
const language = require("@google-cloud/language");
const app = express();
const port = 5000;

app.use(cors());

const options = {
  url: "https://api.github.com/repos/MarcusBoay/maze-game/commits",
  headers: {
    "User-Agent": "Awesome-Octocat-App"
  }
};

app.get("/analyse", (req, resp) => {
  console.log("/analyse hit!");

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
      console.log(ress[i]);
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
