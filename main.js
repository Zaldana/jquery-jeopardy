//Show Array
const show = [5957, 6245, 5243, 4107, 5851, 4335, 4936 ];

//Audio clips
const intro = new Audio('sounds/jeopardy-intro.mp3');
const questionTheme = new Audio('sounds/jeopardy-themelq.mp3');
const double = new Audio('sounds/jeopardy-daily-double.mp3');
const right = new Audio('sounds/rightanswer.mp3');
const wrong = new Audio('sounds/times-up.mp3');

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
    data = data.filter(question => question.showNumber === 4936);
    data = data.filter(question => question.round === "Jeopardy!")
    return data

}

//Intro music start and categories
$(document).ready( async function () {
    
    intro.load()
    intro.play()

    const data = await game();

    for (let i = 0; i <= 6; i++) {

        if ($("div.cat").hasClass(i)) {

            $(`.cat.${i}`).text(`${data[i].category}`);

        }
    }

});

let answerIndex = '';

//Question click function
$("button.question").click( async function () {

    $(this).prop('disabled', true);
    $(this).css({
        "color": "rgb(8, 49, 124)",
        "background-color": "rgb(8, 49, 124)",
        "text-stroke": "2px black"
    });

    intro.pause();

    const data = await game();

    for (let i = 0; i <= 29; i++) {

        if ($(this).hasClass(i) && $(this).hasClass('double')) {

                double.load();
                double.play();
                questionTheme.load();
                questionTheme.play();
                $('.modal').modal('show');
                $("h5.modal-title").text(`DAILY DOUBLE ${data[i].value}${data[i].category}`);
                $("p").text(`${data[i].question}`);
                answerIndex = i

        } if ($(this).hasClass(i)) {

            questionTheme.load();
            questionTheme.play();
            $('.modal').modal('show');
            $("h5.modal-title").text(`${data[i].value} ${data[i].category}`);
            $("p").text(`${data[i].question}`);
            answerIndex = i
        
        } 
    }

});

//Answer click function
$("button.btn").click(async function () {

    const data = await game();

    const formatedData = data[answerIndex].answer.toLowerCase().replace(/[^\w\s]|_/g, "")
                        .replace(/\s+/g, " ");

    const formatedAnswer = $("textarea.form-control").val().toLowerCase().replace(/[^\w\s]|_/g, "")
                            .replace(/\s+/g, " ");

    if (formatedData === formatedAnswer) {

        right.load();
        right.play();
        alert("Correct!")
        $('.modal').modal('hide');
        const newScore = data[answerIndex].value;
        let numScore = Number(newScore.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " "));
        score.text(Number(score.text()) + numScore)
        localStorage.setItem('score', score.text());
        questionTheme.pause();

    } else {
        
        wrong.load();
        wrong.play();
        alert("Nope");
    
    }
})
