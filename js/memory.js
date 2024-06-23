export var game = function(){
    const back = '../resources/back.png';
    const resources = ['../resources/cb.png', '../resources/co.png', '../resources/sb.png','../resources/so.png', '../resources/tb.png','../resources/to.png'];
    const card = {
        current: back,
        see: false, 
        click: true,
        goBack: function (){
            setTimeout(() => {
                this.current = back;
                this.see = false;
                this.click = true;
                this.callback();
            }, 1000);
        },
        goFront: function (){
            this.see = true;
            this.current = this.front;
            this.click = false;
            this.callback();
        }
    };
    const default_options = {
        pairs:2,
        difficulty:'normal'
    };
    var options = JSON.parse(localStorage.options||JSON.stringify(default_options));
 

    var lastCard;
    var difficulty=options.difficulty;
    var pairs=options.pairs;
    var points = 100;
<<<<<<< Updated upstream
    var temps = 1000;

    if (difficulty == 'eazy'){
        temps = 6000;
    }
    else if (difficulty == 'normal'){
        temps = 2000;
    }
    else {
        temps = 500;
    };

    return {
        init: function (call){
            var items = resources.slice(); // Copiem l'array
            items.sort(() => Math.random() - 0.5); // Aleatòria
            items = items.slice(0, pairs); // Agafem els primers
            items = items.concat(items);
            items.sort(() => Math.random() - 0.5); // Aleatòria


            var carta = items.map(item =>
            Object.create(card, {front: {value:item}, callback: {value:call}}));
                carta.forEach( o =>{
                o.current = o.front;
                o.see = false; 
                o.click = false; 
                setTimeout(() => {    
                    o.click = true;
                    o.current = back;
                    o.callback()
                }, temps);
            });    
            return carta;
            //return items.map(item => Object.create(card, {front: {value:item}, callback: {value:call}}));
=======
    var temps = getTemps(difficulty);
    var cards = []; // List of cards

    function getTemps(difficulty) {
        if (difficulty === 'eazy') {
            temps = 6000;
        } else if (difficulty === 'normal') {
            temps = 2000;
        } else {
            temps = 500;
        }
    }

    var mix = function() {
        var items = resources.slice(); // Copy the array
        items.sort(() => Math.random() - 0.5); // Shuffle
        items = items.slice(0, pairs); // Take the first
        items = items.concat(items); // Duplicate
        return items.sort(() => Math.random() - 0.5); // Shuffle again
    }

    return {
        init: function(call) {
            if (sessionStorage.save) { // Load game
                let partida = JSON.parse(sessionStorage.save);
                pairs = partida.pairs;
                points = partida.points;
                difficulty = partida.difficulty;  // Add this line
                temps = getTemps(difficulty);
                partida.cards.map(item => {
                    let it = Object.create(card);
                    it.front = item.front;
                    it.current = item.current;
                    it.isDone = item.isDone;
                    it.waiting = item.waiting;
                    it.callback = call;
                    cards.push(it);
                    if (it.current !== back && !it.waiting && !it.isDone) it.goBack();
                    else if (it.waiting) lastCard = it;
                });
                return cards;
            } else {
                var items = mix();
                var carta = items.map(item =>
                    Object.create(card, { front: { value: item }, callback: { value: call } }));
                carta.forEach(o => {
                    o.current = o.front;
                    o.see = false;
                    o.clickable = false;
                    setTimeout(() => {
                        o.clickable = true;
                        o.current = back;
                        o.callback();
                    }, temps);
                });
                return carta;
            }
>>>>>>> Stashed changes
        },
        click: function (card){
            if (!card.click) return;
            card.goFront();
            if (lastCard){ // Segona carta
                if (card.front === lastCard.front){
                    pairs--;
                    if (pairs <= 0){
                        alert("Has guanyat amb " + points + " punts!");
                        window.location.replace("../");
                    }
                }
                else{
                    [card, lastCard].forEach(c=>c.goBack());
                    points-=25;
                    if (points <= 0){
                        alert ("Has perdut");
                        window.location.replace("../");
                    }
                }
                lastCard = null;
            }
            else lastCard = card; // Primera carta
        }
    }
}();