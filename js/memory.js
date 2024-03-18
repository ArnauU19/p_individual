export var game = function(){
    const back = '../resources/back.png';
    const resources = ['../resources/cb.png', '../resources/co.png', '../resources/sb.png','../resources/so.png', '../resources/tb.png','../resources/to.png'];
    const card = {
        current: back,
        see: false, 
        clickable: true,
        goBack: function (){
            setTimeout(() => {
                this.current = back;
                this.see = false;
                this.clickable = true;
                this.callback();
            }, 1000);
        },
        goFront: function (){
            this.see = true;
            this.current = this.front;
            this.clickable = false;
            this.callback();
        }
    };
    var options = JSON.parse(localStorage.options||JSON.stringify(default_options));
    const default_options = {
        pairs:2,
        difficulty:'normal'
    };

    var lastCard;
    var difficulty=options.difficulty;
    var pairs=options.pairs;
    var points = 100;
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
                o.clickable = false; 
                setTimeout(() => {    
                    o.clickable = true;
                    o.current = back;
                    o.callback()
                }, temps);
            });    
            return carta;
            //return items.map(item => Object.create(card, {front: {value:item}, callback: {value:call}}));
        },
        click: function (card){
            if (!card.clickable) return;
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