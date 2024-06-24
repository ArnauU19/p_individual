export var game = function(){
    //la part de darrerra carta i part de davant
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
            }, 1000); //si volem que el delay al girar cartes depengui del temps canviar 1000 per var temps
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
    var temps = 1000; //temps que es mostren 2 cartes quan no coincideixen


    //comprovar en quin mode estem jugant, si es el mode 1, aquesta dificultat,
    //si es el mode 2, serà un altre llistat de if, else if...
    if (difficulty == 'eazy'){
        temps = 6000;
    }
    else if (difficulty == 'normal'){
        temps = 2000;
    }
    else if (difficulty == 'hard'){
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
                }, temps);//temps al crear les cartes
            });    
            return carta;
            //return items.map(item => Object.create(card, {front: {value:item}, callback: {value:call}}));
        },
        click: function (card){
            if (!card.click) return;
            card.goFront();
            if (lastCard){ // Segona carta
                if (card.front === lastCard.front){
                    pairs--;
                    if (pairs <= 0){
                        alert("Has guanyat amb " + points + " punts!");
                        //si estem en el mode 2, ha de cargar partida, augmentant la dificultat
                        window.location.replace("../");
                    }
                }
                else{
                    [card, lastCard].forEach(c=>c.goBack());
                    points-=25;//el que es resta hauria de canviar amb la dificultat
                    if (points <= 0){
                        alert ("Has perdut");
                        window.location.replace("../");
                    }
                }
                lastCard = null;
            }else {
                lastCard = card; // Primera carta
            }
        }
    }
}();