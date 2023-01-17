// Random Quotes Api URL
const quoteApiUrl = "https://api.quotable.io/random?minLength = 80&maxLength=100";

const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");

let quote = "";
let time = 60;
let timer = "";
let mistakes = 0;

// Display random quotes
const renderNewQuotes = async () => {
    //Fetch contents form url
    const response = await fetch(quoteApiUrl);

    let data = await response.json();
        
    // store response
    quote = data.content;

    // Array of characters in the quote
    let arr = quote.split("").map((value) => {
        // wrap the characters in a span tag
        return "<span class='quote-chars'>" + value + "</span>";
    });
    // join array for displaying 
    quoteSection.innerHTML += arr.join("");
    // console.log(data.content);
};

// Logic for comparin input words with quote
userInput.addEventListener("input", () => {
    let quoteChars = document.querySelectorAll(".quote-chars");
    // Create an array from recieved span tags 
    quoteChars = Array.from(quoteChars);

    // arrray of user input characters
    let userInputChars = userInput.value.split("");

    // Loop through each characteer in quote
    quoteChars.forEach((char, index) => {
        //    Checck if char(quote character) = userInputChars [index](input character)
        if (char.innerText == userInputChars[index]) {
            char.classList.add("success");
        }
        // If user hasn't entere anything or backspaced
        else if (userInputChars[index] == null) {
            // Remove class if any
            if (char.classList.remove("success")) {
                char.classList.remove("success");
            }
            else {
                char.classList.remove("fail");
            }
        }
        // If user enter wrong character
        else {
            // Checks if we already have added fail class
            if (!char.classList.contains("fail")) {
                // increment and display mistakes
                mistakes += 1;
                char.classList.add("fail");
            }
            document.getElementById("mistakes").innerText = mistakes;
        }
        // Return true if all the characters are enteres correctly
        let check = quoteChars.every((element) => {
            return element.classList.contains("success");
        });
        // End test if all characters are correct
        if (check) {
            displayResult();
        }
    });
});

// update Timer on screen
function updateTimer() {
    if (time == 0) {
        // End test of timer reaaches 0
        displayResult();
    }
    else {
        document.getElementById("timer").innerText = --time + "s";
    }
}

// Sets Timer
const timerReduce = () => {
    time = 60;
    timer = setInterval(updateTimer, 1000);
}

// End Test 
const displayResult = () => {
    // display result div 
    document.querySelector(".result").style.display = "block";
    clearInterval(timer);
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
    let timeTaken = 1;
    if (time != 0) {
        timeTaken = (60 - time) / 100;
    }
    document.getElementById("wpm").innerText = (userInput.value.length / 5 / timeTaken).toFixed(2) + "wpm";
    document.getElementById("accuracy").innerText = Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100) + "%";
};

// Start Test
const startTest = () => {
    mistakes = 0;
    timer = "";
    userInput.disabled = false;
    timerReduce();
    document.getElementById("start-test").style.display = "none";
    document.getElementById("stop-test").style.display = "block";
}

window.onload=()=> {
    userInput.value = "";
    document.getElementById("start-test").style.display = "block";
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
    renderNewQuotes();
}

