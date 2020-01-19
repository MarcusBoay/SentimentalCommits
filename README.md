# SentimentalCommits
Analyses sentiment of recent commits of any GitHub repository


## How it works
The backend is running a simple express application listening on port 5000. 
The frontend is a create-react-app application running on port 3000.
ngrok is used to connect the frontend to the backend.
Sentiment analysis is done using Google's Cloud Natural Language API. (More information: https://cloud.google.com/natural-language/docs/reference/libraries#client-libraries-usage-nodejs)

## How to start
1. In the root directory of this repository, run `node main.js`. This will start the express backend.
2. Change directory to the react front end by running `cd client-app`. Then install all the node modules by running `npm install`.
3. Run the react code by running `npm start`.
