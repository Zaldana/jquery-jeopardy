//Audio clips
const intro = new Audio('sounds/jeopardy-intro.mp3');
const questionTheme = new Audio('sounds/jeopardy-themelq.mp3');

//Score update
let initialValue = localStorage.getItem('score');
if (initialValue === null) {
    initialValue = 0;
}

let score = $(".score-update");
score.text(initialValue);

//async function for questions
async function game() {
    
    const rawData = await fetch('jeopardy.json');
    let data = await rawData.json();
    data = data.filter(question => question.showNumber === 6245);
    data = data.filter(question => question.round === "Jeopardy!")
    return data

}

//Intro music start and categories
$(document).ready( async function () {
    
    intro.play()

    const data = await game();

    for (let i = 0; i <= 6; i++) {

        if ($("div.cat").hasClass(i)) {

            $(`.cat.${i}`).text(`${data[i].category}`);

        }
    }
    
});

let answerIndex = '';

//button click function
$("button.question").click( async function () {

    const data = await game();

    for (let i = 0; i <= 29; i++) {

        if ($(this).hasClass(i)) {

            questionTheme.play();
            $('.modal').modal('show');
            $("h5.modal-title").text(`${data[i].value} ${data[i].category}`);
            $("p").text(`${data[i].question}`);
            answerIndex = i
        
        }
    }

});

$("button.btn").click(async function () {

    const data = await game();
    console.log(answerIndex, $("textarea.form-control").val(), data[answerIndex].answer );
    if ($("textarea.form-control").val() === data[answerIndex].answer) {

        alert("Correct!")
        $('.modal').modal('hide');
        let newScore = data[answerIndex].value
        let numScore = Number(newScore.replace("$", ""));
        console.log(numScore);
        console.log(Number(score.text()));
        console.log(numScore + Number(score.text()));

        score.text(Number(score.text()) + numScore)
        localStorage.setItem('score', score.text());


    } else {
        alert("Nope");
    }
})
