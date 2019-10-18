# Alexa Practice Numbers Skill

## Introduction

This is not my first contact with Alexa Skills. Some time ago I developed a more complex skill that this one that allowed you to get information about movie showtimes. The difference with this one is that I neither finished it nor got certified.

I wanted to develop a simple skill to learn the basics and go through the certification process and publish it wihout requiring a lot of time.

When developing this skill I aimed for these goals:

* Have fun developing a Voice User Interface (VUI)
* Practice with Javascript language
* Try Jest framework for unit testing
* Develop and deploy with a command line framework instead of working directly with AWS Console
* Integrate the skill in a CI/CD pipeline

## About the Skill

My mother tongue is not english and the reason of developing this skill was a Vaughn english exercise that always makes me struggle. The exercise consists in the teacher saying a number of random digits (normally four) and the student has to answer with the full number.

For example the answer to 4-5-1-3 would be four thousand five hundred and thirteen.

I have always struggled with this exercise because as I'm saying the number I forgot the last digits. Since the best way to improve is to rehearshal, what could be a better way than having an Alexa Skill acting as teacher? ;-)

### Skill Architecture

I decided to develop the lambda function in Javascript using node 8.10 as runtime.

The skill is very simple and neither database nor other AWS services but lambda itself are required.

You can find below the VUI diagram
<kbd><img src="https://github.com/sergiosamu/skill-numbers/blob/master/images/VUI.png" /></kbd>

The project structure follows the standard proposed by Amazon

Regarding testing I have chosen Jest because it is on fire at this moment and I wanted to give it a try. Tests are created using alexa-skill-test-framework as testing framework.

## Conclusions

The part I enjoyed the most was creating the voice interface.

The ASK is a nice tool that allows you to deploy both the skill and the lambda function with very simple commands.

The certification process is not hard and I got the skill certificed at the second attempt. The first time it was rejected because of a couple of bugs in the dialog model that were overlooked by unit tests.

Things to add/improve:

* Add integration tests using Bespoken framework
* Manage the dialog model using built-in features instead of handling it with session attributes
* Automate deployment using Travis CI

## Resources

* [Jest](https://jestjs.io/)
* [ASK](https://developer.amazon.com/en-US/alexa/alexa-skills-kit)
* [Alex Skill test framework](https://github.com/BrianMacIntosh/alexa-skill-test-framework)
* [SSML](https://developer.amazon.com/es/docs/custom-skills/speech-synthesis-markup-language-ssml-reference.html)
