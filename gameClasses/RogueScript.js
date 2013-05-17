var RogueScript = {
    version: ".01",
    log: function (message, type) {
        console.log("[Turn Into IGE LOG] RS LOG - " + message);
    },
    dataClean : {
        verifyRequired: function (item, source, funcName, varName) {

            if (item === 'undefined' || item === null) {
                throw "RS - Invalid Data (Required) - " + source + " - " + funcName + " - " + varName + " : " + item;
            }

            return item;
        },
        verifyNumber: function (item, source, funcName, varName) {

            this.verifyRequired(item, source, funcName);

            if (typeof item !== 'number' || isNaN(item)) {
                throw "RS - Invalid Data (Not a Number) - " + source + " - " + funcName + " - " + varName + " : " + item;
            }

            return item;
        }


    }


};


window.RogueScript = window.RS = RogueScript;