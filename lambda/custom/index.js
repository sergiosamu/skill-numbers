// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
const numberGenerator = require('./number_generator.js');

const DIALOG_STATE = {
    WAITING_DIGITS: 'digits',
    WAITING_NUMBER: 'numbers',
    WAITING_RETRY_CONFRMATION: 'retry'
}

const helper = {
    forceEnglish(text) {
        return '<voice name="Joanna"><lang xml:lang="en-US">' + text + '</lang></voice>';
    },

    askNumber(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
            
        var randomNumber = numberGenerator.getRandomNumber(sessionAttributes.numberLength);    			

        sessionAttributes.numberToGuess=randomNumber;
        sessionAttributes.dialogState=DIALOG_STATE.WAITING_NUMBER;
            
        var speakOutput = helper.forceEnglish("Can you say the number corresponding to the digits <prosody rate=\"x-slow\"><say-as interpret-as=\"digits\">" + randomNumber + "</say-as></prosody>?");
        var speakReprompt = speakOutput;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakReprompt)
            .getResponse();    
    },
    
    askForDigits(handlerInput) {
        var speakOutput = helper.forceEnglish("The number of digits must be between 2 and 9 digits. How many digits do you want to practice with?");
        var speakReprompt = helper.forceEnglish("Can you tell me a number be between 2 and 9 digits?");
        
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
            .speak("Sorry but I didn't understand. Do you want to play again or change digits?")
            .reprompt("Say yes if you want you play again or no to exit the skill")
            .getResponse();
    },

    incorrectAnswer(handlerInput) {
        var speakOutput = helper.forceEnglish("Incorrect answer. The correct number is " + sessionAttributes.numberToGuess + ". Do you want to try again?");
        var speakReprompt = helper.forceEnglish("Say yes if you want to try again");

        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

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
        const speakOutput = helper.forceEnglish("Let's practice numbers. How many digits do you want to practice with?");
        const speaKReprompt = helper.forceEnglish("Tell me a number of digits between 2 and 9 to start practicing");
        
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

        // Si ya está definida la cantidad de cifras, es que el Intent no es el correcto
        if (sessionAttributes.numberLength) {
            return helper.askAgain(handlerInput);
               
        } else {
        
            var digitsNumber = parseInt(handlerInput.requestEnvelope.request.intent.slots.digits.value);
    
            if (digitsNumber >= 2 && digitsNumber <= 6) {
                sessionAttributes.numberLength=digitsNumber;        
                return YesIntentHandler.handle(handlerInput);
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
        if (handlerInput.requestEnvelope.request.intent.slots.digits.value) {
            sessionAttributes.numberLength=handlerInput.requestEnvelope.request.intent.slots.digits.value;
            return helper.askNumber(handlerInput);
        } else {
            sessionAttributes.numberLength=null;
            return AskNumberIntentHandler.handle(handlerInput);
        }

    }
};

const GuessNumberIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GuessNumberIntent';
    },
    handle(handlerInput) {

        if (!handlerInput.attributesManager.getSessionAttributes().numberToGuess) {
            handlerInput.requestEnvelope.request.intent.slots.digits= handlerInput.requestEnvelope.request.intent.slots.guess;
            return AskNumberIntentHandler.handle(handlerInput);
        }
		
		const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        var guess = handlerInput.requestEnvelope.request.intent.slots.guess.value;

        if (sessionAttributes.DIALOG_STATE === DIALOG_STATE.WAITING_NUMBER) {
            if ( parseInt(guess) !== parseInt(sessionAttributes.numberToGuess) ) {
                return helper.incorrectAnswer(handlerInput)
            } else {

                sessionAttributes.numberToGuess=null;
                sessionAttributes.dialogState=DIALOG_STATE.WAITING_RETRY_CONFRMATION

                var speakOutput = helper.forceEnglish('Awesome!! You nailed it. Do you want to play again?');
                var speakReprompt = helper.forceEnglish('Say yes if you want to play again or no to exit the skill');

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
        const speakOutput = forceEnglish('You can say a number of digits and I will tell you the digits for you to say the complete number');

        return helper.askForDigits(handlerInput)

    }
};

const YesIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.YesIntent';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        if (sessionAttributes.dialogState==DIALOG_STATE.WAITING_NUMBER) {
            return helper.incorrectAnswer(handlerInput);
        } else if (sessionAttributes.dialogState==DIALOG_STATE.WAITING_DIGITS) {
            return helper.askNumber(handlerInput);
        } else {
            return helper.askForDigits(handlerInput);
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

        if (sessionAttributes.dialogState==DIALOG_STATE.WAITING_NUMBER) {
            
            return helper.incorrectAnswer(handlerInput);

        } else if (sessionAttributes.dialogState==DIALOG_STATE.WAITING_DIGITS) {
            
            return helper.askForDigits(handlerInput);

        } else {
        
            const speakOutput = helper.forceEnglish("Thanks for playing. Goodbye!");
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
        const speakOutput = helper.forceEnglish("Goodbye!");
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
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

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
