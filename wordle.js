let col = 0;
let row = 0;
const maxCol = 5;
const maxRow = 6;
let currRow = "";
let word = "";
let wordObject = {};
let keyboardObject = {};

//api url
const WORD_URL = "https://words.dev-apis.com/word-of-the-day";

// async function init(){
//     const promise = await fetch(WORD_URL);
//     const processedResponse = await promise.json();
//     const wordAns processedResponse.word.toUpperCase();

// }
//call the api to give us the word of the day


const wordAns = "SMITH";
// console.log(wordAns);

//Post to api whether word is valid or not
// async function checkValidWord(wordToCheck){
//     const promise = await fetch("https://words.dev-apis.com/validate-word", {
//         method: "POST",
//         body: JSON.stringify({word: wordToCheck})
//       });
//     const processedResponse = await promise.json();
//     return processedResponse.validWord;
// }


function newRowObject(){
    wordObject = {};
    for (let i = 0; i < wordAns.length; i++){
        if (!(wordAns[i] in wordObject)){
            wordObject[wordAns[i]] = 1;
        }
        else{
            wordObject[wordAns[i]] = wordObject[wordAns[i]] + 1;
        }
    }
}


function newRow(){
    currRow = document.querySelector(".game-board").children[row]
    word = "";
    newRowObject();
}

newRow();

addEventListener("keyup", function(keyboardEvent){
    let typed = keyboardEvent.key;
    isLetter(typed);
    del(typed);
    enter(typed);
})


function isLetter(typed){
    if (typed.length === 1 && typed.toUpperCase().match(/[A-Z]/) && col < maxCol){
        currRow.children[col].innerText = typed.toUpperCase();
        currRow.children[col].style.border = "2px solid #878A8C";
        currRow.children[col].classList.add("ani-pop");
        col = col + 1;
        word = word + typed.toUpperCase();
    }
}

function del(typed){
    if (typed.toUpperCase() === "BACKSPACE" && col > 0) {
        col = col - 1;
        //the animation
        currRow.children[col].innerText = "";
        currRow.children[col].style.border = "2px solid #D3D6DA";
        currRow.children[col].classList.remove("ani-pop");
        //removing one letter
        word = word.substring(0, word.length - 1);
    }
}

function enter(typed){
    if (typed.toUpperCase() === "ENTER"){
        if (word === "WRONG"){
            warning("Not in word list");
            currRow.classList.remove("ani-shake");
            void currRow.offsetWidth;
            currRow.classList.add("ani-shake");
        }
        else{
            if (col === maxCol){
                for (let i = 0; i < currRow.childElementCount; i++){
                    currRow.children[i].style.backgroundColor = "#787C7E";
                    currRow.children[i].style.color = "white";
                    currRow.children[i].style.border = "none";
                    currRow.children[i].classList.add("ani-flip");
                    currRow.children[i].style.transitionDelay = `${i*100 + 250}ms`;
                    currRow.children[i].style.animationDelay = `${i*100}ms`;

                    currRow.children[i].addEventListener("animationend", function(event){
                        if(event.animationName === "flipped") {
                            event.target.classList.remove("ani-flip");
                            // event.target.style.animationDelay = `${(i*100)+250}ms`;
                            event.target.classList.add("ani-flip-out");
                        }
                    }, false);
                    
                }

                check();
                col = 0;
                row = row + 1;
                if (row === maxRow){
                    gameOver("You suck!");
                }
                newRow();
            }
            else{
                currRow.classList.add("shake");
                warning("Not enough letter!");
            }
        }
    }
}

function check(){
    for (let i = 0; i < currRow.childElementCount; i++){
        keyboard(word[i], "#787C7E");
        if (word[i] === wordAns[i]){
            currRow.children[i].style.backgroundColor = "#6AAA64";
            keyboard(word[i], "#6AAA64");
            delKeys(wordObject, word[i]);
        }
    }
    if (Object.keys(wordObject).length === 0){
        warning("Amazing!");
        gameOver("You Won!")

    }
    for (let i = 0; i < currRow.childElementCount; i++){
        if (word[i] in wordObject){
            currRow.children[i].style.backgroundColor = "#C9B458";
            keyboard(word[i], "#C9B458");
            delKeys(wordObject, word[i]);
        }
    }
}

function delKeys(object, letter){
    if (object[letter] === 1){
        delete object[letter];
    }
    else{
        object[letter] = object[letter] - 1;
    }
}


function keyboard(letter, newColor){
    const keyboard = document.querySelector(".keyboard-container");

    for (let row = 0; row < keyboard.childElementCount; row++){
        for (let col = 0; col <keyboard.children[row].childElementCount; col++){
            let key = keyboard.children[row].children[col];
            if (letter === key.innerText){
                if (!(letter in keyboardObject)){
                    keyboardObject[letter] = 1;
                }
                key.style.backgroundColor = colorRanking(letter, newColor);
            }
        }
    }
}

addEventListener("click", function(event){
    let clicked = event.target.innerText;
    isLetter(clicked);
    del(clicked);
    enter(clicked);
})


function warning(message){
    let messageBox = document.querySelector(".warning");
    messageBox.innerText = message;
    messageBox.classList.remove("ani-appear");
    void messageBox.offsetWidth;
    messageBox.classList.add("ani-appear");
}

function colorRanking(letter, newColor){
    //rank new color and curr color, only change if the new color's rank is higher
    let rankList = ["#D3D6DA","#787C7E","#C9B458","#6AAA64"];
    let rank = keyboardObject[letter];
    let newRank = rankList.indexOf(newColor);
    higher = Math.max(rank, newRank);
    keyboardObject[letter] = higher;
    return rankList[higher];
}

function gameOver(text){
    let message = document.querySelector(".game-over-box");
    message.children[0].children[0].innerText = text;
    message.style.display = "block";
}