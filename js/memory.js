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
        difficulty1:'normal',
        difficulty2:1
    };
    var options = JSON.parse(localStorage.options||JSON.stringify(default_options));
 
    if (!localStorage.originalDifficulty2) {
        localStorage.originalDifficulty2 = options.difficulty2;
    }

    var lastCard;
    var difficulty1=options.difficulty;
    var difficulty2=options.difficulty2;
    
    //VARIABLES només utilitzables en el mode1
    var pairs=options.pairs;
    var points = 100; //he de veure com guardo els punts cada vegada que he recargo en mode2, potser aixó m'ho sobrescriu
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
        //FUNCIONAAAAAAAA
        console.log("mode 2 detectat: ", difficulty2)
        switch (difficulty2) {
            case "1":
                console.log("case 1")
                                    //tI, tE, pa, +P, -P
                establir_dificultat2(2000,3000,2,10,20)
                break
            case "2":
                console.log("case 2")
                establir_dificultat2(5000,3000,2,20,30)
                break
            case "3":
                console.log("case 3")
                establir_dificultat2(4500,3000,2,25,40)
                break
            case "4":
                console.log("case 4")
                establir_dificultat2(4500,2500,3,30,50)
                break
            case "5":
                console.log("case 5")
                establir_dificultat2(4000,2500,3,35,60)
                break
            case "6":
                establir_dificultat2(3500,2500,3,40,60)
                break
            case "7":
                establir_dificultat2(3500,2500,4,45,70)
                break
            case "8":
                establir_dificultat2(3500,2000,4,55,70)
                break
            case "9":
                establir_dificultat2(3000,2000,4,60,80)
                break
            case "10":
                establir_dificultat2(2500,2000,5,65,90)
                break
            case "11":
                establir_dificultat2(2000,2000,5,70,100)
                break
            case "12":
                establir_dificultat2(1500,1000,5,75,120)
                break
            case "13":
                establir_dificultat2(1000,1000,6,80,140)
                break
            case "14":
                establir_dificultat2(500,500,6,85,150)
                break
            case "15":
                establir_dificultat2(500,500,6,90,160)
                break
            default:
                console.log("default: ", difficulty2)
                //mateixa configuració que nivell 1
                establir_dificultat2(6000,3000,2,10,20)
                break
            
        }

        //console.log("dificultat mode 2: ",difficulty2);


    }

    function establir_dificultat2(a,b,c,d,e){
        temps_ini=a
        temps_error=b
        pairs=c
        sum_punts=d
        desc_punts=e
    }

    function incrementDifficulty2() {
        difficulty2 = parseInt(difficulty2) + 1;
        options.difficulty2 = difficulty2;
        localStorage.options = JSON.stringify(options);
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
                            window.location.replace("../");
                        }else {
                            //var options = JSON.parse(localStorage.options||JSON.stringify(default_options));
                            //var new_dif2= difficulty2+1;
                            //options.difficulty2+=1;
                            //augemntar dificultat en opcions
                            //options.applyChanges();
                            //options.act_dif2()
                            //options.act_dif2()


                            incrementDifficulty2();
                            //localStorage.setItem('options', JSON.stringify(options));
                            if(difficulty2<=5){
                                //guardar puntuació
                               
                                window.location.reload();
                            }else{
                                console.log("finish")
                                //guardar puntuació
                                localStorage.removeItem('originalDifficulty2');
                                window.location.replace("../")
                            }
                            //if maxima dificultat 
                                //guardar puntuació
                                //window.location.replace("../");
                            //else
                                //cargar de nou aquesta escena
                        }
                    }
                }
                else{
                    [card, lastCard].forEach(c=>c.goBack());
                    points-=desc_punts;
                    //points+=sum_punts
                    //desc_punts canvia en el mode 2, punts que es descompta quan falles, default=25
                    if (points <= 0){
                        alert ("Has perdut");
                        localStorage.removeItem('originalDifficulty2');
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