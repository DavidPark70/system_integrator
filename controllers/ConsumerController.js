const axios = require("axios");
const { response } = require("express");

module.exports = {

    get: async (req, res) => {
        const endpoint = req.body.endpoint;
        let keys = new Array();

        async function consumerPayload() {
            try {
                const response = await axios.get(endpoint);

                const obj = {
                    "book":
                    [
                        {
                            "name": "Harry Potter and the Goblet of Fire",
                            "author": "J. K. Rowling",
                            "year": 2000,
                            "characters": ["Harry Potter", "Hermione Granger", "Ron Weasley"],
                            "genre": "Fantasy Fiction",
                            "price": {
                                "paperback": "$10.40", "hardcover": "$20.32", "kindle": "$4.11"
                            }
                        },
                        {
                            "name": "The Lord of the Rings",
                            "author": "J. R. R. Tolkien",
                            "year": 1954,
                            "characters": ["Gandalf", "Frodo Baggins", "Aragorn"],
                            "genre": "Fantasy Fiction",
                            "price": {
                                "paperback": "$18.45", "hardcover": "$36.50", "kindle": "$7.17"
                            }
                        }
                    ]
                };

                function parseJson(obj, constructKeys) {
                    for (let k in obj) {
                        constructKeys.push(k);
                        keys.push([...constructKeys]);
                        if (obj[k] instanceof Object) parseJson(obj[k], constructKeys);
                        else constructKeys.pop();
                    }
                }

                parseJson(obj, []);
            } catch (error) {
                console.error(error);
            }
        }

        await consumerPayload();

        let payload = "{";
        let keysToString = "";
        let keysToStringArr = new Array();
        for (let i = 0; i < keys.length; i++) {
            for (let j = 0; j < keys[i].length; j++) {
                if (isNaN(keys[i][j])) keysToString += keys[i][j] + "."; // // takes care of this scenario: book.characters.0, book.1.author
            }

            // takes care of this scenario: book.characters., book.characters.price.paperback.
            if (keysToString.charAt(keysToString.length - 1) === ".") {
                keysToString = keysToString.split("");
                keysToString.pop();
                keysToString = keysToString.join("");
            }

            // takes care of duplicates
            let exist = false;
            for (let k = 0; k < keysToStringArr.length; k++) {
                if (keysToStringArr[k].localeCompare(keysToString) === 0) exist = true;
            }

            if (!exist) {
                keysToStringArr.push(keysToString);

                payload = payload + "\"" + "keyset" + i.toString() + "\"" + ":";
                payload += "\"" + keysToString + "\"";
                if (!(i+1 === keys.length)) payload += ",";
            }

            keysToString = "";
        }
        payload += "}";

        console.log("--->");
        console.log(payload);
        
        payload = JSON.parse(payload);

        res.send(payload);
    },

}