const axios = require("axios");
const { response } = require("express");

module.exports = {

    get: async (req, res) => {
        const endpoint = req.body.endpoint;
        let keySets = [];

        async function consumerPayload() {
            try {
                const response = await axios.get(endpoint);

                const obj = {
                    "book": {
                        "name": "Harry Potter and the Goblet of Fire",
                        "author": "J. K. Rowling",
                        "year": 2000,
                        "characters": ["Harry Potter", "Hermione Granger", "Ron Weasley"],
                        "genre": "Fantasy Fiction",
                        "price": {
                            "paperback": "$10.40", "hardcover": "$20.32", "kindle": "$4.11"
                        }
                    }
                };

                function constructKeyHelper(constructKeys) {
                    let concatKeys = "";
                    for (let i = 0; i < constructKeys.length; i++) {
                        concatKeys = concatKeys.concat(constructKeys[i]);
                        if (!(i+1 === constructKeys.length)) concatKeys = concatKeys.concat(".");
                    }
                    return concatKeys;
                }

                function printKeys(obj, constructKeys) {
                    for (let k in obj) {
                        constructKeys.push(k);
                        if (obj[k] instanceof Object) {
                            if (isNaN(k)) keySets.push(constructKeyHelper(constructKeys));
                            printKeys(obj[k], constructKeys);
                        } else {                            
                            if (isNaN(k)) keySets.push(constructKeyHelper(constructKeys));
                            constructKeys.pop();
                        }
                    }
                }

                console.log("--->");

                printKeys(obj, []);

            } catch (error) {
                console.error(error);
            }
        }

        await consumerPayload();

        let payload = "{";
        for (let i = 0; i < keySets.length; i++) {
            let temp = i + 1;
            temp = temp.toString();
            payload = payload + "\"" + "keyset" + temp + "\"" + ":" + "\"" + keySets[i] + "\"";
            if (!(i+1 === keySets.length)) payload = payload + ",";
        }
        payload += "}"

        payload = JSON.parse(payload)

        res.send(payload);
    },

}