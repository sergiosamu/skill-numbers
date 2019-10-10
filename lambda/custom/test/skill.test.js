/*
Mocha tests for the Alexa skill "Hello World" example for SDK v2
Using the Alexa Skill Test Framework (https://github.com/BrianMacIntosh/alexa-skill-test-framework).

Run with 'mocha examples/skill-sample-nodejs-ask2/helloworld-tests.js'.
*/

// include the testing framework
const alexaTest = require('alexa-skill-test-framework');

// initialize the testing framework
alexaTest.initialize(
	require('../index.js'),
	"amzn1.ask.skill.00000000-0000-0000-0000-000000000000",
	"amzn1.ask.account.VOID");

describe ("Launch request", () => {
	//console.log(alexaTest.getLaunchRequest());
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
			request: alexaTest.getIntentRequest("AskNumberIntent",{digits:1}),
			says: "The number of digits must be between 2 and 6 digits. Can you tell me a different number?"
		}
	]);

	alexaTest.test([
		{
			request: alexaTest.getIntentRequest("AskNumberIntent",{digits:7}),
			says: "The number of digits must be between 2 and 6 digits. Can you tell me a different number?"
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
			says: "Awesome!! You nailed it. Do you want to play again?",
			withSessionAttributes: {
				numberToGuess:123
			}
		}
	]);

	alexaTest.test([
		{
			request: alexaTest.getIntentRequest("GuessNumberIntent",{guess:123}),
			saysLike: "Incorrect answer",
			withSessionAttributes: {
				numberToGuess:321
			}
		}
	]);

});

/*
describe("Hello World Skill", function () {
	// tests the behavior of the skill's LaunchRequest
	describe("LaunchRequest", function () {
		alexaTest.test([
			{
				request: alexaTest.getLaunchRequest(),
				says: "Welcome to the Alexa Skills Kit, you can say hello!",
				repromptsNothing: true,
				shouldEndSession: true
			}
		]);
	});
	
	// tests the behavior of the skill's HelloWorldIntent
	describe("HelloWorldIntent", function () {
		alexaTest.test([
			{
				request: alexaTest.getIntentRequest("HelloWorldIntent"),
				says: "Hello World!", repromptsNothing: true, shouldEndSession: true,
				hasAttributes: {
					foo: 'bar'
				}
			}
		]);
	});
	
	// tests the behavior of the skill's HelloWorldIntent with like operator
	describe("HelloWorldIntent like", function () {
		alexaTest.test([
			{
				request: alexaTest.getIntentRequest("HelloWorldIntent"),
				saysLike: "World", repromptsNothing: true, shouldEndSession: true
			}
		]);
	});
});
*/