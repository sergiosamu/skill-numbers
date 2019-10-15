const MIN_DIGITS=2
const MAX_DIGITS=9

const resources = {
    text: {
        sayNumberForDigits: "Can you say the number corresponding to the digits",
        howManyDigits: `The number of digits must be between ${MIN_DIGITS} and ${MAX_DIGITS} digits. How many digits do you want to practice with?`,
        numberInRange: `Can you tell me a number be between ${MIN_DIGITS} and ${MAX_DIGITS} digits`,
        noUnderstand: "Sorry but I didn't understand. Do you want to play again or change digits?",
        retry: "Say yes if you want you play again or no to exit the skill",
        tryAgain:  "Do you want to try again?",
        incorrectAnswer: "Incorrect answer. The correct number is ",
        practice: "Let's practice numbers. How many digits do you want to practice with?",
        tellDigits: `Tell me a number of digits between ${MIN_DIGITS} and ${MAX_DIGITS} to start practicing`,
        correctAnswer: "Awesome!! You nailed it. Do you want to play again?",
        help: "You can say a number of digits and I will tell you the digits for you to say the complete number. How many digits do you want to practice with?",
        thanks: "Thanks for playing. Goodbye!",
        error: "Sorry, I had trouble doing what you asked. Please try again"
    }
}

module.exports=resources;
module.exports.MIN_DIGITS=MIN_DIGITS;
module.exports.MAX_DIGITS=MAX_DIGITS;
