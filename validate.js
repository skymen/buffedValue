const fs = require("fs");
const path = require("path");

const config = require("./src/behaviorConfig.js");
const { exit } = require("process");

function validateDisplayText(name, obj) {
    // check if obj has displayText property
    if (obj.hasOwnProperty("displayText")) {
        const paramCount = obj.params.length;
        // use regex to find the number of {/d} in displayText
        const regex = /{\d}/g;
        const matches = obj.displayText.match(regex);
        const matchCount = matches ? matches.length : 0;
        // check if the number of {/d} matches the number of params
        if (paramCount !== matchCount) {
            console.log(
                `Error: ${name} has ${matchCount} {x} in displayText but has ${paramCount} params`
            );
            return false; // validation failed
        }
    }
    return true; // validation passed
} 


const validationPipeline = [
    validateDisplayText
];

function validateBehavior(behaviorConfig) {
    //assume file is valid
    const validations = [];

    // iterate over all the actions
    Object.keys(behaviorConfig.Acts).forEach((key) => {
        const action = behaviorConfig.Acts[key];
        validationPipeline.forEach((validationFunction) => {
            validations.push(validationFunction(key, action));
        });
    });

    // iterate over all the conditions
    Object.keys(behaviorConfig.Cnds).forEach((key) => {
        const condition = behaviorConfig.Cnds[key];
        validationPipeline.forEach((validationFunction) => {
            validations.push(validationFunction(key, condition));
        });
    });

    // iterate over all the expressions
    Object.keys(behaviorConfig.Exps).forEach((key) => {
        const expression = behaviorConfig.Exps[key];
        validationPipeline.forEach((validationFunction) => {
            validations.push(validationFunction(key, expression));
        });
    });

    // check if any validation failed
    return validations.every((validation) => validation);
}


// check if the file is valid
if (validateBehavior(config)) {
    console.info("Validation Passed");
    exit(0);
} else {
    console.error("Validation Failed");
    exit(1);
}