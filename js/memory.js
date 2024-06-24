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
            }, temps_error); //el temps que una carta es mostra després de cometre error
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
        difficulty1:'normal'
    };
    var options = JSON.parse(localStorage.options||JSON.stringify(default_options));
 

    var lastCard;
    var difficulty1=options.difficulty;
    var difficulty2=options.niv_difficulty;
    
    //VARIABLES només utilitzables en el mode1
    var pairs=options.pairs;
    var points = 100;
    var temps_ini = 1000; //temps que es mostren les cartes al crearles


    //VARIABLES només utilitzades en el mode2, també utilitza les del mode 1
    var temps_error=1000 //el temps que una carta es mostra després de cometre error
    var desc_punts=25
    var sum_punts=10
    const isMode1 = localStorage.getItem('isMode1') === 'true';


    //comprovar en quin mode estem jugant, si es el mode 1, aquesta dificultat,
    //si es el mode 2, serà un altre llistat de if, else if...
    if (isMode1){
        if (difficulty1 == 'eazy'){
            temps_ini = 6000;
        }
        else if (difficulty1 == 'normal'){
            temps_ini = 2000;
        }
        else if (difficulty1 == 'hard'){
            temps_ini = 500;
        };
    }else{
        switch (difficulty2) {
            case 0:

                break
            case 1:

                break
            case 2:
                break
            case 3:
                break

        }
        console.log("dificultat mode 2");


    }

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
                }, temps_ini);//temps al crear les cartes
            });    
            return carta;
            //ja estava comentada aquesta linia abans
            //return items.map(item => Object.create(card, {front: {value:item}, callback: {value:call}}));
        },
        click: function (card){
            if (!card.click) return;
            card.goFront();
            if (lastCard){ // Segona carta
                if (card.front === lastCard.front){
                    pairs--;
                    points+=sum_punts;
                    //augmentar punts jugador, ha fet una correcta convinació
                    if (pairs <= 0){
                        alert("Has guanyat amb " + points + " punts!");
                        //si estem en el mode 2, ha de cargar partida, augmentant la dificultat
                        if (isMode1){
                            //augemntar dificultat en opcions
                            //cargar de nou aquesta escena
                        }else {
                            window.location.replace("../");
                        }
                    }
                }
                else{
                    [card, lastCard].forEach(c=>c.goBack());
                    points-=desc_punts;
                    //desc_punts canvia en el mode 2, punts que es descompta quan falles, default=25
                    if (points <= 0){
                        alert ("Has perdut");
                        window.location.replace("../");
                        //si estem en el mode 2, guarda la puntuació en un ranking, puntuacio.js i puntaucio.html
                    }
                }
                lastCard = null;
            }else {
                lastCard = card; // Primera carta
            }
        }
    }
}();