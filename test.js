// Device Object //

function Device () {
  this.wireless = true,
  this.keyboard = true
};

// Phone Object via prototype pattern //

function Phone (args) {
  this.manufacturer = args.manufacturer;
  this.make = args.make;
  this.os = args.os;
};

for (var eachitem in Phone) {
  console.log(eachitem);
}

Phone.prototype.getMake = function() {
  return this.make;
};

Phone.prototype.getManufacturer = function() {
  return this.manufacturer;
};

Phone.prototype.formattedSpecs = function() {
  return this.make + ' / ' + this.manufacturer + ' / ' + this.os;
};

// Tablet Object //

function Tablet(args) {
  this.size = args.size;
  this.resolution = args.resolution;
};

Tablet.prototype = new Device();
Phone.prototype = new Device();

// Data //

var iphone = {}; // new iPhone obj

// define using bracket notation
iphone['make'] = 'iPhone 5s';
iphone['manufacturer'] = 'Apple';
iphone['os'] = 'IOS7';

// define using an object literal 
var nexus = {
  size: 'small',
  resolution: '1200x800'
};

var galaxys = {}; // new galaxys obj

// define using dot notation
galaxys.make = 'galaxy s5';
galaxys.manufacturer = 'Samsung';
galaxys.os = 'Android';

var galaxyS = new Phone(galaxys);
var iPhone = new Phone(iphone);
var nexus7 = new Tablet(nexus);

// iPhone //
console.log('iPhone => ', iPhone);

// nexus7 //
console.log('nexus7 =>', nexus7);

// galaxy s3 //
console.log('galaxy s3 =>', galaxyS);


// User Function //

function User (theName, theEmail) {
  this.name = theName;
  this.email = theEmail;
  this.quizScores = [];
  this.currentScore = 0;
}

User.prototype = {
  constructor: User,
  saveScore: function(theScoreToAdd) {
    this.quizScores.push(theScoreToAdd);
    console.log('saved =>', this.quizScores);
  },
  showNameAndScores: function() {
    var scores = this.quizScores.length > 0
      ? this.quizScores.join(",")
      : "No Scores Yet";

    return scores;
  },
  changeEmail: function(newEmail) {
    this.email = newEmail;
    return "New Email Saved " + this.email;
  }
}

// New instances of the user //

var firstUser = new User('austin', 'austin@yhmg.com');
firstUser.changeEmail('austin.cornelio@gmail.com');
firstUser.saveScore(10);
firstUser.saveScore(70);

console.log(firstUser.showNameAndScores());

var secondUser = new User('bill', 'bill@yhmg.com');
secondUser.saveScore(30);
console.log(secondUser.showNameAndScores());

var cars = {
  type: 'toyota',
  wheels: 4
}

var toyota = Object.create(cars);

console.log(toyota.type);

function inheritPrototype(childObject, parentObject) {
    // use Crockford’s method to copy the properties and methods from the parentObject onto the childObject
    // So the copyOfParent object now has everything the parentObject has 
    var copyOfParent = Object.create(parentObject.prototype);

    //Then we set the constructor of this new object to point to the childObject.
    //This step is necessary because the preceding step overwrote the childObject constructor when it overwrote the childObject prototype (during the Object.create() process)
    copyOfParent.constructor = childObject;

    // Then we set the childObject prototype to copyOfParent, so that the childObject can in turn inherit everything from copyOfParent (from parentObject)
    childObject.prototype = copyOfParent;
};

// Parasitic combination inheritance //

function Question(theQuestion, theChoices, theCorrectAnswer) {
  this.question = theQuestion;
  this.choices = theChoices;
  this.correctAnswer = theCorrectAnswer;
  this.userAnswer = "";

  //private properties cannot be changed by instances
  var newDate = new Date();

  // Constant variable: available to all instances through the instance method below. This is also a private property.
  QUIZ_CREATED_DATE = newDate.toLocaleDateString();

  // This is the only way to access the private QUIZ_CREATED_DATE variable 
  // This is an example of a privilege method: it can access private properties and it can be called publicly
  this.getQuizDate = function() {
    return QUIZ_CREATED_DATE;
  };

  // confimation message
  console.log("Quiz created on: " + this.getQuizDate());

};

Question.prototype.getCorrectAnswer = function() {
  return this.correctAnswer;
}

Question.prototype.getUserAnswer = function() {
  return this.userAnswer;
}

Question.prototype.displayQuestion = function() {

  var questionToDisplay = "<div class='question'>" + this.question + "</div><ul>";
  var choiceCounter = 0;

  this.choices.forEach(function(eachChoice) {
    questionToDisplay += '<li><input type="radio" name="choice" value="' + choiceCounter + '">' + eachChoice + '</li>';
    choiceCounter ++;
  });

  questionToDisplay += "</ul>";

  return questionToDisplay;

};

// A multiple choice question
function MultipleChoiceQuestion(theQuestion, theChoices, theCorrectAnswer) {

  // For MultipleChoiceQuestion to properly inherit from Question, here inside the MultipleChoiceQuestion constructor, we have to explicitly call the Question constructor
  // passing MultipleChoiceQuestion as the this object, and the parameters we want to use in the Question constructor:
  Question.call(this, theQuestion, theChoices, theCorrectAnswer);
};

inheritPrototype(MultipleChoiceQuestion, Question);

// A dnd question
function DragAndDropQuestion(theQuestion, theChoices, theCorrectAnswer) {
  Question.call(this, theQuestion, theChoices, theCorrectAnswer);
};

// Override the inherited 'displayQuestion' method

inheritPrototype(DragAndDropQuestion, Question);

DragAndDropQuestion.prototype.displayQuestion = function() {
  var questionToDisplay = "<div class='question'>" + this.question + "</div><ul>";
  var choiceCounter = 0;

  this.choices.forEach(function(eachChoice) {
    questionToDisplay += '<div style="background:red; margin-bottom:10px; padding:10px;">' + eachChoice + ' (drag me) </div>';
    choiceCounter ++;
  });

  return questionToDisplay;
};

// A t/f question
function TrueFalseQuestion(theQuestion, theChoices, theCorrectAnswer) {
  Question.call(this, theQuestion, theChoices, theCorrectAnswer);
};

inheritPrototype(TrueFalseQuestion, Question);

// Initialize some questions and add them to an array
var allQuestions = [
  new MultipleChoiceQuestion("Who is Prime Minister of England?", ["Obama", "Blair", "Brown", "Cameron"], 3),
  new MultipleChoiceQuestion("What is the Capital of Brazil?", ["São Paulo", "Rio de Janeiro", "Brasília"], 2),
  new DragAndDropQuestion("Drag the correct City to the world map.", ["Washington, DC", "Rio de Janeiro", "Stockholm"], 0),
  new TrueFalseQuestion("Is 10 > 8?", ["True", "False"], 0)
];

$(function() {
  // Display all the questions
  allQuestions.forEach(function (eachQuestion)  {

    console.log('each =>', eachQuestion);

    eachQuestion.displayQuestion();
    $('#demo').append(eachQuestion.displayQuestion());
  });
});