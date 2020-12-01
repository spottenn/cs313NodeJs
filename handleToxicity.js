const toxicity = require('@tensorflow-models/toxicity');

// The minimum prediction confidence.
const threshold = 0.9;

// Which toxicity labels to return.
const labelsToInclude =
    ['toxicity', 'severe_toxicity', 'identity_attack', 'insult', 'threat', 'sexual_explicit', 'obscene'];
const prettyLabels = {
    'toxicity': "Toxic",
    'severe_toxicity': "Severely Toxic",
    'identity_attack': "Identity Attack",
    'insult': "Insult",
    'threat': "Threat",
    'sexual_explicit': "Sexually Explicit",
    'obscene': "Obscene"
}
let model = undefined;

function getPrettyLabels(labels) {
    for (let i = 0; i < labels.length; i++) {
        labels[i] = prettyLabels[labels[i]];
    }
    return labels

}
async function getGuesses(text)  {
    if (model === undefined) {
        model = await toxicity.load(threshold, labelsToInclude);
    }
    let predictions = await model.classify([text]);
    //console.log(JSON.stringify(predictions));
    let guesses = [];
    for (let i = 0; i < predictions.length; i++) {
        if (predictions[i].results[0].match === true) {
            guesses.push(predictions[i].label);
        }
    }
    //console.log(guesses);
    return guesses;
}
exports.threshold = threshold;
exports.labelsToInclude = labelsToInclude;
exports.getGuessesDiv = async (req, res) => {
    let guesses = await getGuesses(req.query.text)
    guesses = getPrettyLabels(guesses);
    if (guesses.length === 0) {
        guesses.push("Not Toxic");
    }
    res.render('partials/guess', {guesses: guesses});
}

exports.getGuessesJson = async (req, res) => {
    let guesses = await getGuesses(req.query.text)
    res.json(guesses);
}
