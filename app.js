/*
    Travis Ryan and Terry James
    Cannon Game - HTML Canvas
*/

// Global game gameObjects
var gameBoard;
var background;
var cannon;
var target;
var cannonball;

// Canvas width and height (constant)
const canvasWidth = 800; // game board width
const canvasHeight = 500; // game board height

// Numeric globals (number of balls left and targetsHit)
var angle = 0; // Angle of the cannon
var remainingBalls = 10; // Number of balls remaining
var targetsHit = 0; // number of targets player has hit

// Boolean globals
var currentlyFiring = false; // if the player is currently launching a ball
var targetHit = false; // a target has just been hit

// Current algorithm the user is trying to classify
var currentAlgorithmIndex = 0;

var algorithms = ["Quick Sort", "Merge Sort", "Bubble Sort", "Insertion Sort", "Selection Sort", "Heap Sort",
                "Shell Sort", "Comb Sort", "Timsort", "Tree Sort"];

var algorithmSolutions = {
    "Quick Sort" : "n^2",
    "Merge Sort" : "nlogn",
    "Bubble Sort" : "n^2",
    "Insertion Sort" : "n^2",
    "Selection Sort" : "n^2",
    "Heap Sort" : "nlogn",
    "Shell Sort" : "n^2",
    "Comb Sort" : "n^2",
    "Timsort" : "nlogn",
    "Tree Sort" : "n^2"
}

// Function is called once on init
function startGame() {

    // get gameBoard from HTML
    gameBoard = document.getElementById("gameBoard");

    // Initialize all gameObjects
    background = new gameObject("background", canvasWidth, canvasHeight, 0, 0, "img/background.png");
    target = new gameObject("target", 70, 70, (canvasWidth / 2) - 45, 20, "img/nlogn.png");
    target2 = new gameObject("target", 70, 70, (canvasWidth / 2) - 45, 110, "img/nSquared.png");
    cannon = new gameObject("cannon", 60, 120, (canvasWidth / 2 - 30), canvasHeight - 100, "img/cannon.png");
    cannonball = new gameObject("cannonball", 40, 40, (canvasWidth / 2 - 20), canvasHeight - 50, "img/cannonball.png");

    // Initialize game area
    gameArea.init();
}

// Function to start over with a new game
function startOver(){
    // Reset targetsHit, angle, and remaining balls
    targetsHit = 0;
    angle = 0;
    remainingBalls = 10;
    $("#targetsHit").html("Correct Hits: " + targetsHit); // update targetsHit text
    $("#ballCount").text("Remaining Balls: " + remainingBalls); // update remainingBalls text
    $("#message").html("Hit the target!"); // Update message in case game over is showing
    target.speedX = 10; // Reset target speed to 10
    target2.speedX = -10; // Reset target2 speed to -10
    $("#currentAlgorithm").html(algorithms[0]); // Reset algorithms back to 0
    currentAlgorithmIndex = 0; // Reset algorithm index to 0
}

// Define the game area object (for freezing/clearing the game state for animation)
var gameArea = {
    canvas: document.createElement("canvas"), // store the canvas object as a property

    init: function () { // on construction, set width, height, and initial values
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.context = this.canvas.getContext("2d");
        gameBoard.insertBefore(this.canvas, gameBoard.childNodes[0]); // add canvas to board area as child
        this.interval = setInterval(updateFrames, 40); // update game at 40 FPS
        target.speedX = 10; // Set target's initial speed to 10
        target2.speedX = -10;
    },

    clear: function () { // Clears the game area (for rotation with redrawing)
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

// The core game piece object. For every object on the board, keeps track of name, coords, image, speed, etc.
// Based on the Component idea from W3Schools
function gameObject(name, width, height, x, y, imageLocation) {
    // Instance variables
    this.name = name;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.startingX = x;
    this.startingY = y;
    var img = new Image();
    img.src = imageLocation;

    this.update = function () {
        // Grabs the game area
        ctx = gameArea.context;
        if (this.name == "cannon") { // Rotate if the object is the cannon
            // Mark the pivot point of the rotation object
            var xOffset = width / -2;
            var yOffset = -90;
            // Perform rotation (method from W3Schools)
            // Canvas doesn't allow individual component rotation, so entire canvas must be rotated, object drawn, then canvas restored
            ctx.save(); // Save game context
            ctx.translate(gameArea.canvas.width / 2, gameArea.canvas.height - 30); // Translate the entire canvas
            ctx.rotate(angle); // Rotate the canvas
            ctx.drawImage(img, xOffset, yOffset, this.width, this.height); // Draw the new cannon
            ctx.restore(); // Restore the original (non-rotated) context of the canvas
        } else { // For non-cannon objects
            ctx.drawImage(img, this.x, this.y, this.width, this.height);
        }
    }

    // A function that checks for a collision between 2 gameObjects (used for cannonball and target collision)
    this.isCollision = function (secondGameObject) {
        // Four possible collision scenarios
        if ((this.x > secondGameObject.x + (secondGameObject.width)) || // Left right collision
            (this.x + (this.width) < secondGameObject.x) || // Right left collision
            (this.y + (this.height) < secondGameObject.y) || // Upper lower collision
            (this.y > secondGameObject.y + (secondGameObject.height))) // Lower upper collision
            return false; // Return false if no collision
        else // Otherwise collision has occurred, return true
            return true;
    }
}

// Processes a hit to check if the user correctly classified the algorithm
function processHit(runtimeAnswer){
    console.log(algorithms[currentAlgorithmIndex]);
    console.log(runtimeAnswer);
    if(algorithmSolutions[algorithms[currentAlgorithmIndex]]===runtimeAnswer){ // A correct hit
        targetsHit++; // increment user targetsHit
        $("#targetsHit").html("Correct Hits: " + targetsHit); // update targetsHit text
        currentAlgorithmIndex++;
        $("#currentAlgorithm").html(algorithms[currentAlgorithmIndex]);
        showHitMessage();
    }
}

// Main update function called on every frame
function updateFrames() {
    var hitOccurred = false;
    if (cannonball.isCollision(target)) {
        hitOccurred = true;
        processHit("nlogn");
    } else if (cannonball.isCollision(target2)) {
        hitOccurred = true;
        processHit("n^2");
    }
    if(hitOccurred){
        if (remainingBalls == 0) { // Check for game over
            $("#message").html("Game over!"); // Print game over message if necessary
            target.speedX = 0; // Stop target from moving on game over
            target2.speedX = 0; // Stop target from moving on game over
        }
        resetCannonball();
    }
    // Update the coordinate positions of the target and the ball
    updateTargetPositions();
    updateBallPosition();
    // Clear the game area and redraw the background
    gameArea.clear();
    background.update();
    // Redraw all gameObjects
    cannonball.update();
    target.update();
    target2.update();
    cannon.update();
    if(remainingBalls==0)
        $("#message").html("Game over!");
}

// Function for when a target is hit and a message needs to be displayed
function showHitMessage(){
    updateMessage("Target was hit!"); // show hit message
    setTimeout(function(){ updateMessage("Hit the target!") }, 1500); // show hit message for 1.5 seconds
}

function updateMessage(message){
    $("#message").html(message);
}

// Function updates the position of the target, accounting for wall collisions to redirect
function updateTargetPositions() {
    if (target.x < 0 || target.x > canvasWidth - target.width) // target is out of bounds
        target.speedX = target.speedX * -1; // move speed in the opposite direction 
    target.x += target.speedX; // Update target2's X coordinate based on its speed
    if (target2.x < 0 || target2.x > canvasWidth - target2.width) // target2 is out of bounds
        target2.speedX = target2.speedX * -1; // move speed in the opposite direction 
    target2.x += target2.speedX; // Update target2's X coordinate based on its speed
}

// Resets the cannonball to its position beneath the cannon
function resetCannonball() {
    // Make the speed to 0
    cannonball.speedX = 0;
    cannonball.speedY = 0;
    // Reset the position 
    cannonball.x = cannonball.startingX;
    cannonball.y = cannonball.startingY;
    // Player is no longer firing
    currentlyFiring = false;
}

// Function updates the position of the cannonball
function updateBallPosition() {
    // Update the cannon ball speed
    cannonball.x += cannonball.speedX;
    cannonball.y += cannonball.speedY;
    // If the cannonball goes out of bounds
    if (cannonball.y < -20 || cannonball.x < -20 || cannonball.x > canvasWidth + 20 || cannonball.y > canvasHeight + 20) {
        resetCannonball(); // Reset the cannonball underneath the cannon
        if (remainingBalls == 0) { // Check for game over (last ball was missed)
            $("#message").html("Game over!"); // Print game over message
            target.speedX = 0;
            target2.speedX = 0;
        }
    }
}

// Rotates the cannon whenever the mouse is moved in the canvas window
function rotateCannon(mouseMoveEvent) {
    // Get the mouse x and y axis
    mouseXPosition = parseInt(mouseMoveEvent.clientX);
    mouseYPosition = parseInt(mouseMoveEvent.clientY);
    
    // Get canvas width/height using JQuery to account for resized screens
    var canvasWidth = $("canvas").width();
    var canvasHeight = $("canvas").height();
    // Get width of the HTML body to allow cannon rotation for different screen sizes
    var bodyWidth = $("body").width();

    // Move the x relative to its position based on the difference between the canvas and the body encompassing it
    mouseXPosition -= ((bodyWidth - canvasWidth)/2 + (canvasWidth / 2));
    mouseYPosition -= (gameArea.canvas.offsetTop * 2 + (canvasHeight - 20));

    // Adds a necessary 90 degree offset to the cannon rotation angle (necessary due to image's starting position)
    angle = Math.atan2(mouseYPosition, mouseXPosition) + toRadians(90);
}

// Once the document has loaded, initialize an on-click event listener that fires cannonballs if possible
$(document).ready(function () {
    // Add an event listener for rotating the cannon on mouse move
    $(gameArea.canvas).mousemove(rotateCannon); // Call rotate cannon function
    
    // Add an event listener for clicking the game area
    $(gameBoard).click(function () {
        if (!currentlyFiring && remainingBalls > 0) { // User can not fire while already firing and must have balls left
            currentlyFiring = true; // Update firing flag
            remainingBalls--; // Decrement number of balls available
            $("#ballCount").text("Remaining Balls: " + remainingBalls); // Update balls remaining text
            // Launch the cannonball
            var ballAngle = angle - toRadians(90); // Subtract the 90 degree offset given to the cannon
            cannonball.speedX += 20 * Math.cos(ballAngle); // Launch the cannonball's X coord at a speed of 20 times the angle
            cannonball.speedY += 20 * Math.sin(ballAngle); // Launch the cannonball's Y coord at a speed of 20 times the angle
        }
    });
});

// Aux function to convert degrees to radians (used in angle calculation)
function toRadians(angle) {
    return angle * (Math.PI / 180);
}