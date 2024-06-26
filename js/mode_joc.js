$('#mode1').on('click',function(){
    localStorage.setItem('isMode1', 'true');
    window.location.assign("./game.html");// sense ./html perque no se
    //passar informació a opcions o memory de quin mode estem jugant    
});

$('#mode2').on('click',function(){
    var options = JSON.parse(localStorage.options||JSON.stringify(default_options));
    localStorage.originalDifficulty2 = options.difficulty2;
    localStorage.setItem('isMode1', 'false');
    window.location.assign("./game.html");
    //console.error("Opció no implementada");
    //passar informació a opcions o memory de quin mode estem jugant
});