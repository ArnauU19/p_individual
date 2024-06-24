var options = function(){
    const default_options = {
        pairs:2,
        difficulty:'normal',
        difficulty2:1
    };
    
    var pairs = $('#pairs');
    var difficulty = $('#dif');
    var difficulty2= $('#dif2');

    var options = JSON.parse(localStorage.options||JSON.stringify(default_options));
    pairs.val(options.pairs);
    difficulty.val(options.difficulty);
    difficulty2.val(options.difficulty2)
    pairs.on('change',()=>options.pairs = pairs.val());
    difficulty.on('change',()=>options.difficulty = difficulty.val());
    difficulty2.on('change',()=>options.difficulty2 = difficulty2.val());
    
    return { 
        applyChanges: function(){
            localStorage.options = JSON.stringify(options);
        },
        defaultValues: function(){
            options.pairs = default_options.pairs;
            options.difficulty = default_options.difficulty;
            options.difficulty2 = default_options.difficulty2;
            pairs.val(options.pairs);
            difficulty.val(options.difficulty);
            difficulty2.val(options.difficulty2);
        }
    }
}();




$('#default').on('click',function(){
    options.defaultValues();
});

$('#apply').on('click',function(){
    options.applyChanges();
    location.assign("../");
});