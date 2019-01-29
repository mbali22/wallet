import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import config from './config';
import transactions from './routes/transactions';
import person from "./routes/person";
import init from './routes/initialize';
import cors from 'cors';

let app = express();
app.server = http.createServer(app);

// middleware
// parse application/json
app.use(bodyParser.json({
  limit : config.bodyLimit
}));
app.use(cors());
// passport config

//routes for different section of app
app.use('/', init);
app.use('/transactions', transactions);
app.use('/persons', person);

app.server.listen(config.port);

console.log(`Started on port ${app.server.address().port}`); 





export default app;
