
const Alexa = require('ask-sdk-core');
const numberGenerator = require('./number_generator.js');
const Resources = require('./resources.js');

const DIALOG_STATE = {
    WAITING_DIGITS: 'digits',
    WAITING_NUMBER: 'numbers',
    WAITING_RETRY_CONFRMATION: 'retry'
}

const helper = {

    askNumber(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
            
        var randomNumber = numberGenerator.getRandomNumber(sessionAttributes.numberLength);    			

        sessionAttributes.numberToGuess=randomNumber;
        sessionAttributes.dialogState=DIALOG_STATE.WAITING_NUMBER;
            
        var speakOutput = Resources.text.sayNumberForDigits + " <prosody rate=\"x-slow\"><say-as interpret-as=\"digits\">" + randomNumber + "</say-as></prosody>?";
        var speakReprompt = speakOutput;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakReprompt)
            .getResponse();    
    },
    
    askForDigits(handlerInput) {
        var speakOutput = Resources.text.howManyDigits;
        var speakReprompt = Resources.text.numberInRange;
        
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.dialogState=DIALOG_STATE.WAITING_DIGITS;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakReprompt)
            .getResponse();
    },

    askAgain(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.dialogState=DIALOG_STATE.WAITING_RETRY_CONFRMATION;

        return handlerInput.responseBuilder
            .speak(Resources.text.noUnderstand)
            .reprompt(Resources.text.retry)
            .getResponse();
    },

    incorrectAnswer(handlerInput) {
        console.log("Dentro incorrect answer")
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        var speakOutput = Resources.text.incorrectAnswer + sessionAttributes.numberToGuess + ". " + Resources.text.tryAgain;
        var speakReprompt = Resources.text.retry;

        sessionAttributes.numberToGuess=null;
        sessionAttributes.dialogState=DIALOG_STATE.WAITING_RETRY_CONFRMATION;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakReprompt)
            .getResponse();  
    }
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = Resources.text.practice;
        const speaKReprompt = Resources.text.tellDigits;
        
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.dialogState=DIALOG_STATE.WAITING_DIGITS;
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speaKReprompt)
            .getResponse();
    }
};

const AskNumberIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AskNumberIntent';
    },
    handle(handlerInput) {

        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        if (!sessionAttributes.dialogState && !handlerInput.requestEnvelope.request.intent.slots.digits) {
            return helper.askForDigits(handlerInput);
        } else if (sessionAttributes.dialogState && sessionAttributes.dialogState!==DIALOG_STATE.WAITING_DIGITS) {
            return helper.askAgain(handlerInput);
                   
        } else {
        
            var digitsNumber = parseInt(handlerInput.requestEnvelope.request.intent.slots.digits.value);
    
            if (digitsNumber >= Resources.MIN_DIGITS && digitsNumber <= Resources.MAX_DIGITS) {
                sessionAttributes.numberLength=digitsNumber;        
                return helper.askNumber(handlerInput);
            } else {
                return helper.askForDigits(handlerInput);
            }
        }
    }
};

const ChangeDigitsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ChangeDigitsIntent';
    },
    handle(handlerInput) {

        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        if (handlerInput.requestEnvelope.request.intent.slots.digits) {
            sessionAttributes.numberLength=handlerInput.requestEnvelope.request.intent.slots.digits.value;
            return helper.askNumber(handlerInput);
        } else {
            sessionAttributes.numberLength=null;
            return AskNumberIntentHandler.handle(handlerInput);
        }

    }
};

const OtherNumberIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'OtherNumberIntent';
    },
    handle(handlerInput) {

        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        if  (sessionAttributes.dialogState===DIALOG_STATE.WAITING_NUMBER) {
            return helper.askNumber(handlerInput);
        } else if (sessionAttributes.dialogState===DIALOG_STATE.WAITING_DIGITS) {
            return helper.askForDigits(handlerInput);
        } else {
            return helper.askAgain(handlerInput)
        }

    }
};

const GuessNumberIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GuessNumberIntent';
    },
    handle(handlerInput) {

		const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        if (sessionAttributes.dialogState===DIALOG_STATE.WAITING_DIGITS) {
            handlerInput.requestEnvelope.request.intent.slots.digits= handlerInput.requestEnvelope.request.intent.slots.guess;
            return AskNumberIntentHandler.handle(handlerInput);
        }

        var guess = handlerInput.requestEnvelope.request.intent.slots.guess.value;

        if (sessionAttributes.dialogState === DIALOG_STATE.WAITING_NUMBER) {
            if ( parseInt(guess) !== parseInt(sessionAttributes.numberToGuess) ) {
                return helper.incorrectAnswer(handlerInput)
            } else {

                sessionAttributes.numberToGuess=null;
                sessionAttributes.dialogState=DIALOG_STATE.WAITING_RETRY_CONFRMATION

                var speakOutput = Resources.text.correctAnswer;
                var speakReprompt = Resources.text.retry;

                return handlerInput.responseBuilder
                    .speak(speakOutput)
                    .reprompt(speakReprompt)
                    .getResponse();     
            }
        } else {
            return helper.askAgain(handlerInput);
        }

    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = Resources.text.help;
        const speakReprompt = Resources.text.howManyDigits;
        
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        sessionAttributes.numberLength=null
        sessionAttributes.dialogState=DIALOG_STATE.WAITING_DIGITS

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakReprompt)
            .getResponse();    

    }
};

const YesIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.YesIntent';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        if (sessionAttributes.dialogState===DIALOG_STATE.WAITING_DIGITS) {
            return helper.askForDigits(handlerInput);
        } else if (sessionAttributes.dialogState===DIALOG_STATE.WAITING_NUMBER) {
            return helper.incorrectAnswer(handlerInput);
        } else {
            return helper.askNumber(handlerInput);
        }
    }
};

const NoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NoIntent';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        if (sessionAttributes.dialogState===DIALOG_STATE.WAITING_DIGITS) {
            return helper.askForDigits(handlerInput);
        } else if (sessionAttributes.dialogState===DIALOG_STATE.WAITING_NUMBER) {
            return helper.incorrectAnswer(handlerInput);
            
        } else {
        
            const speakOutput = Resources.text.thanks;
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        }
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = Resources.text.thanks;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};



const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = Resources.text.error;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        GuessNumberIntentHandler,        
        AskNumberIntentHandler,
        ChangeDigitsIntentHandler,
        OtherNumberIntentHandler,
        HelpIntentHandler,
        YesIntentHandler,
        NoIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
        ) 
    .addErrorHandlers(
        ErrorHandler,
        )
    .lambda();
