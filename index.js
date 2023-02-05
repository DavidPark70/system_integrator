const express = require("express");
const consumerRoute = require("./routes/Consumer");

const app = express();
// for parsing application/json
app.use(express.json());
// for parsing application/x-www-form-urlendcoded
app.use(express.urlencoded( { extended: true } ));

app.use("/consumer", consumerRoute);

const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`listening on port ${port}`));