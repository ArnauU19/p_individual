
addEventListener('load', function() {
    $('#play').on('click',function(){
        sessionStorage.removeItem("save");
        window.location.assign("./html/game.html");
    });

    $('#saves').on('click',function(){
        fetch("./php/load.php",{
            method: "POST",
            body: "",
            headers: {"content-type":"application/json; charset=UTF-8"}
        })
        .then(response=>{
            if (response.ok) response.text();
            else trow("PHP connection fail");
        })
        .then(partida=>sessionStorage.save = partida)
        .catch(err=>sessionStorage.save = localStorage.save)
        .finally(()=>window.location.assign("./html/game.html"));

    });

    $('#options').on('click',function(){
        window.location.assign("./html/options.html");
    });
    $('#exit').on('click',function(){
        console.warn("No es pot sortir!");
    });
});