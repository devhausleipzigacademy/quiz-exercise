// Install readline-sync and chalk@2.4.1
const rs = require("readline-sync")
const chalk = require("chalk")
const { readFileSync, writeFileSync } = require("fs")

// Print out welcome message
console.log(chalk.bold.green("Hello, welcome to the quiz"))

// Store player name
const name = rs.question("What's your name? ")
// Welcome player
console.log(chalk.green(`Hello ${name}, let's have some fun!`))

// Create a file called questions.json
// Get the questions from the json file
const questionsFile = readFileSync("./questions.json", { encoding: "utf-8" })
const questions = JSON.parse(questionsFile)

// Keep track if the game loop should continue running
let keepPlaying = true

// Write a function called play that will run the game loop
function play() {
  // Kepp track of the score
  let score = 0
  // Loop over questions
  for (let index = 0; index < questions.length; index++) {
    // Ask a question and store the answer
    const q = questions[index]
    const answer = rs.question(q.question + " ")
    // Check if the answer is correct
    if (answer.toLowerCase() === q.answer.toLowerCase()) {
      // If the answer is correct, print out "Awesome your answer is correct" and increment the score by 2
      console.log(chalk.bold.green("Awesome your answer is correct"))
      score += 2
    } else {
      // If the answer is wrong, print out "Sorry your answer is wrong" and decrement the score by 1
      console.log(chalk.bold.red("Sorry your answer is wrong"))
      score--
    }
    // Print out the score
    console.log(chalk.bold(`Your current score is ${score}`))
    console.log(chalk.bold.blue("------------------------------------------"))
  }
  // Print out final score after every question was answered
  console.log(chalk.bold(`Your final score is ${score}`))
  // Add users score to the high score list in a file called scores.json
  // Get all the scores
  const scoresFile = readFileSync("./scores.json", { encoding: "utf-8" })
  const scores = JSON.parse(scoresFile)
  const sortedOldScores = [...scores].sort((a, b) => b.points - a.points)

  const newScores = [...scores, { name, points: score }]
  const sortedScores = [...newScores].sort((a, b) => b.points - a.points)
  writeFileSync("./scores.json", JSON.stringify(sortedScores))
  // Print out high score table
  console.table(sortedScores)
  // Check if highscore was beaten
  if (score === sortedOldScores[0].points) {
    console.log("Almost, you tied the highscore")
  } else if (score > sortedOldScores[0].points) {
    console.log(chalk.bold("Congrats, you beat the highscore"))
  } else {
    console.log("Good luck next time")
  }

  keepPlaying = rs.keyInYN("Do you want to play again")

  if (!keepPlaying) {
    console.log("Good bye")
  }
  // Ask user if they want to play again
}

// Start the game loop
while (keepPlaying) {
  play()
}
// If no stop the game loop
