const ANSWERS_INTERNAL_LOCUS = [1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1 ];

function calculateInternalResults(answers) {
    let internalLocus = 0;
    for(let i=0; i<answers.length; i++) {
        if(answers[i] === ANSWERS_INTERNAL_LOCUS[i]) internalLocus++;
    }
    return internalLocus;
}

function calculateExternalResults(answers) {
    let externalLocus = 0;
    for(let i=0; i<answers.length; i++) {
        if(answers[i] !== ANSWERS_INTERNAL_LOCUS[i]) externalLocus++;
    }
    return externalLocus;
}

function calculateLocus(answers) {
    return calculateInternalResults(answers) > calculateExternalResults(answers) ? "Locus Interno" : "Locus Externo";
}

const functions = {
    calculateLocus,
    calculateExternalResults,
    calculateInternalResults,
    ANSWERS_INTERNAL_LOCUS
}

module.exports = functions;