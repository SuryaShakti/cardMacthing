class AudioController{
    constructor() {
        this.bgmusic = new Audio('Audio/creepy.mp3');
        this.flipSound = new Audio('Audio/flip.wav');
        this.victorySound = new Audio('Audio/victory.wav');
        this.matchSound = new Audio('Audio/match.wav');
        this.gameoverSound = new Audio('Audio/gameOver.wav');
        this.bgmusic.volume = 0.2;
        this.bgmusic.loop = true;
    }
    startMusic() {
        this.bgmusic.play();
    }
    stopMusic() {
        this.bgmusic.pause();
        this.bgmusic.currentTime = 0;
    }
    flip() {
        this.flipSound.play();
    }
    match() {
        this.matchSound.play();
    }
    victory() {
        this.stopMusic();
        this.victorySound.play();
    }
    gameover() {
        this.stopMusic();
        this.gameoverSound.play();
    }
}


class MixOrMatch {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.ticker = document.getElementById('flips');
        this.timer = document.getElementById('time-remaining');
        this.audioController = new AudioController();
    }
    startGame() {
        this.cardToCheck = null;
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.matchedCard = [];
        this.busy = true;
        

        setTimeout(() => {
            this.audioController.startMusic();
            this.shuffleCards();
            this.countDown = this.startCountDown();
            this.busy = false;
        }, 500);

        this.hidecards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;
    }

    hidecards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }

    startCountDown() {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;

            if(this.timeRemaining === 0) {
                this.gameOver();
            }
        }, 1000);
    }
    gameOver() {
        clearInterval(this.countDown);
        this.audioController.gameover();
        document.getElementById('game-over-text').classList.add('visible');
    }
    
    victory() {
        clearInterval(this.countDown);
        this.audioController.victory();
        document.getElementById('victory-text').classList.add('visible');
    }

    flipCard(card) {
        if(this.canFlipCard(card)) {
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');
        
                if(this.cardToCheck)
                {
                    this.checkForcardMatch(card);
                }else{
                    this.cardToCheck = card;
                }
        }
    }

    checkForcardMatch(card) {
        if(this.getCardType(card) === this.getCardType(this.cardToCheck)){
            this.cardMatch(card, this.cardToCheck);
        }else{
            this.cardMisMatch(card, this.cardToCheck);
        } 

        this.cardToCheck = null;
    }

    cardMatch(card1, card2) {
        this.matchedCard.push(card1);
        this.matchedCard.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.audioController.match();

        if(this.matchedCard.length === this.cardsArray.length) {
            this.victory();
        }
    }
    cardMisMatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }

    getCardType(card) {
        return card.getElementsByClassName('fimgcenter')[0].src;
    }

    shuffleCards() {
        for(let i = this.cardsArray.length-1; i>0; i--) {
            let randIndex = Math.floor(Math.random() * (i+1));
            this.cardsArray[randIndex].style.order = i;
            this.cardsArray[i].style.order = randIndex;
        }

    }

    canFlipCard(card) {
        return !this.busy && !this.matchedCard.includes(card) && card !== this.cardToCheck;
    }
}

function ready() {
    let overlays = Array.from(document.getElementsByClassName("overlay-text"));
    let cards = Array.from(document.getElementsByClassName("card"));
    let game = new MixOrMatch(100, cards);
    
    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove("visible");
            game.startGame();
        });
    });
    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card)
        });
    });
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready());
} else {
    ready();
}

