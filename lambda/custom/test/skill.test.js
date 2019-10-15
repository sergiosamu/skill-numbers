/*
Mocha tests for the Alexa skill "Hello World" example for SDK v2
Using the Alexa Skill Test Framework (https://github.com/BrianMacIntosh/alexa-skill-test-framework).

Run with 'mocha examples/skill-sample-nodejs-ask2/helloworld-tests.js'.
*/

// include the testing framework
const alexaTest = require('alexa-skill-test-framework');
const Resources = require('../resources.js');

const DIALOG_STATE = {
    WAITING_DIGITS: 'digits',
    WAITING_NUMBER: 'numbers',
    WAITING_RETRY_CONFRMATION: 'retry'
}

// initialize the testing framework
alexaTest.initialize(
	require('../index.js'),
	"amzn1.ask.skill.00000000-0000-0000-0000-000000000000",
	"amzn1.ask.account.VOID");

describe ("Launch request", () => {
	alexaTest.test([
		{
			request: alexaTest.getLaunchRequest(),
			saysLike: "Let's practice numbers. How many digits",			
			repromptsNothing: false,
			shouldEndSession: false
		}
	]);
	
});

describe ("Ask digits request", () => {

	alexaTest.test([
		{
			request: alexaTest.getIntentRequest("AskNumberIntent"),
			saysLike: "The number of digits must be between"
		}
	]);

	alexaTest.test([
		{
			request: alexaTest.getIntentRequest("AskNumberIntent",{digits:Resources.MIN_DIGITS-1}),
			saysLike: "Sorry but I didn't understand",
			withSessionAttributes: {
				dialogState: DIALOG_STATE.WAITING_NUMBER
			}
		}
	]);

	alexaTest.test([
		{
			request: alexaTest.getIntentRequest("AskNumberIntent",{digits:Resources.MIN_DIGITS-1}),
			saysLike: "The number of digits must be between",
			withSessionAttributes: {
				dialogState: DIALOG_STATE.WAITING_DIGITS
			}
		}
	]);

	alexaTest.test([
		{
			request: alexaTest.getIntentRequest("AskNumberIntent",{digits:Resources.MAX_DIGITS+1}),
			saysLike: "The number of digits must be between",
			withSessionAttributes: {
				dialogState: DIALOG_STATE.WAITING_DIGITS
			}
		}
	]);

	alexaTest.test([
		{
			request: alexaTest.getIntentRequest("AskNumberIntent",{digits:3}),
			saysLike: "Can you say the number corresponding",
			hasAttributes: {
				"numberToGuess": (n) => {return n > 99 && n < 1000}
			}
		}
	]);

});

describe ("Try to guess number", () => {
	alexaTest.test([
		{
			request: alexaTest.getIntentRequest("GuessNumberIntent",{guess:123}),
			saysLike: "Awesome!! You nailed it",
			withSessionAttributes: {
				numberToGuess:123,
				dialogState: DIALOG_STATE.WAITING_NUMBER
			}
		}
	]);

	alexaTest.test([
		{
			request: alexaTest.getIntentRequest("GuessNumberIntent",{guess:123}),
			saysLike: "Incorrect answer",
			withSessionAttributes: {
				numberToGuess:321,
				dialogState: DIALOG_STATE.WAITING_NUMBER
			}
		}
	]);

	alexaTest.test([
		{
			request: alexaTest.getIntentRequest("GuessNumberIntent",{guess:3}),
			saysLike: "Can you say the number",
			withSessionAttributes: {
				dialogState: DIALOG_STATE.WAITING_DIGITS
			}
		}
	]);	

	alexaTest.test([
		{
			request: alexaTest.getIntentRequest("GuessNumberIntent",{guess:3}),
			saysLike: "Sorry but I didn't understand",
			withSessionAttributes: {
				dialogState: DIALOG_STATE.WAITING_RETRY_CONFRMATION
			}
		}
	]);		

});

describe ("Change digits", () => {
	alexaTest.test([
		{
			request: alexaTest.getIntentRequest("ChangeDigitsIntent",{digits:3}),
			saysLike: "Can you say the number",
			hasAttributes: {
				"numberToGuess": (n) => {return n > 99 && n < 1000}
			}
		}
	]);

	alexaTest.test([
		{
			request: alexaTest.getIntentRequest("ChangeDigitsIntent"),
			saysLike: "The number of digits",
			hasAttributes: {
				numberLength: null
			}
		}
	]);
});

describe ("Other number", () => {
	alexaTest.test([
		{
			request: alexaTest.getIntentRequest("OtherNumberIntent"),
			saysLike: "Can you say the number",
			withSessionAttributes: {
				dialogState: DIALOG_STATE.WAITING_NUMBER
			}
		}
	]);

	alexaTest.test([
		{
			request: alexaTest.getIntentRequest("OtherNumberIntent"),
			saysLike: "The number of digits must",
			withSessionAttributes: {
				dialogState: DIALOG_STATE.WAITING_DIGITS
			}
		}
	]);

	alexaTest.test([
		{
			request: alexaTest.getIntentRequest("OtherNumberIntent"),
			saysLike: "Sorry but I didn't understand",
			withSessionAttributes: {
				dialogState: DIALOG_STATE.WAITING_RETRY_CONFRMATION
			}
		}
	]);
});

describe ("Help", () => {
	alexaTest.test([
		{
			request: alexaTest.getIntentRequest("AMAZON.HelpIntent"),
			saysLike: "You can say a number",
			hasAttributes: {
				numberLength: null,
				dialogState: DIALOG_STATE.WAITING_DIGITS
			}
		}
	]);
});

describe ("Yes", () => {
	alexaTest.test([
		{
			request: alexaTest.getIntentRequest("AMAZON.YesIntent"),
			saysLike: "The number of digits must be",
			withSessionAttributes: {
				dialogState: DIALOG_STATE.WAITING_DIGITS
			}
		}
	]);

	alexaTest.test([
		{
			request: alexaTest.getIntentRequest("AMAZON.YesIntent"),
			saysLike: Resources.text.incorrectAnswer,
			withSessionAttributes: {
				dialogState: DIALOG_STATE.WAITING_NUMBER
			}
		}
	]);

	alexaTest.test([
		{
			request: alexaTest.getIntentRequest("AMAZON.YesIntent"),
			saysLike: Resources.text.sayNumberForDigits,
			withSessionAttributes: {
				dialogState: DIALOG_STATE.WAITING_RETRY_CONFRMATION
			}
		}
	]);
});

describe ("No", () => {
	alexaTest.test([
		{
			request: alexaTest.getIntentRequest("AMAZON.NoIntent"),
			saysLike: "The number of digits must be",
			withSessionAttributes: {
				dialogState: DIALOG_STATE.WAITING_DIGITS
			}
		}
	]);

	alexaTest.test([
		{
			request: alexaTest.getIntentRequest("AMAZON.NoIntent"),
			saysLike: Resources.text.incorrectAnswer,
			withSessionAttributes: {
				dialogState: DIALOG_STATE.WAITING_NUMBER
			}
		}
	]);

	alexaTest.test([
		{
			request: alexaTest.getIntentRequest("AMAZON.NoIntent"),
			saysLike: Resources.text.thanks,
			withSessionAttributes: {
				dialogState: DIALOG_STATE.WAITING_RETRY_CONFRMATION
			},
			shouldEndSession: true
		}
	]);
	
});