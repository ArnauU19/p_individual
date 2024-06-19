export var game = function() {
    const back = '../resources/back.png';
    const resources = [
        '../resources/cb.png', '../resources/co.png', '../resources/sb.png',
        '../resources/so.png', '../resources/tb.png', '../resources/to.png'
    ];

    const card = {
        current: back,
        see: false,
        clickable: true,
        waiting: false,
        isDone: false,
        goBack: function() {
            setTimeout(() => {
                this.current = back;
                this.see = false;
                this.clickable = true;
                this.callback();
            }, 1000);
        },
        goFront: function(last) {
            if (last) {
                this.waiting = last.waiting = false;
            } else {
                this.waiting = true;
            }
            this.current = this.front;
            this.see = true;
            this.clickable = false;
            this.callback();
        },
        check: function(other) {
            if (this.front === other.front) {
                this.isDone = other.isDone = true;
            }
            return this.isDone;
        }
    };

    const default_options = {
        pairs: 2,
        difficulty: 'normal'
    };
    var options = JSON.parse(localStorage.options || JSON.stringify(default_options));

    var lastCard;
    var difficulty = options.difficulty;
    var pairs = options.pairs;
    var points = 100;
    var temps = 1000;
    var cards = []; // List of cards

    if (difficulty === 'eazy') {
        temps = 6000;
    } else if (difficulty === 'normal') {
        temps = 2000;
    } else {
        temps = 500;
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
                var temps = this.getTemps(difficulty);
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
        },
        click: function(card) {
            if (!card.clickable) return;
            card.goFront(lastCard);
            if (lastCard) { // Second card
                if (card.check(lastCard)) {
                    pairs--;
                    if (pairs <= 0) {
                        alert("You won with " + points + " points!");
                        window.location.replace("../");
                    }
                } else {
                    [card, lastCard].forEach(c => c.goBack());
                    points -= 25;
                    if (points <= 0) {
                        alert("You lost");
                        window.location.replace("../");
                    }
                }
                lastCard = null;
            } else lastCard = card; // First card
        },
        save: function() {
            var partida = {
                uuid: localStorage.uuid,
                pairs: pairs,
                points: points,
                difficulty: difficulty,  // Add this line
                cards: []
            };
            cards.forEach(c => {
                partida.cards.push({
                    current: c.current,
                    front: c.front,
                    isDone: c.isDone,
                    waiting: c.waiting
                });
            });

            let json_partida = JSON.stringify(partida);

            fetch("../php/save.php", {
                method: "POST",
                body: json_partida,
                headers: { "content-type": "application/json; charset=UTF-8" }
            })
            .then(response => response.json())
            .then(json => {
                console.log(json);
            })
            .catch(err => {
                console.log(err);
                sessionStorage.save = json_partida; // Use sessionStorage instead of localStorage for save
                console.log(sessionStorage.save);
            })
            .finally(() => {
                window.location.replace("../");
            });
        },
        getTemps: function(difficulty) {
            if (difficulty === 'eazy') {
                return 6000;
            } else if (difficulty === 'normal') {
                return 2000;
            } else {
                return 500;
            }
        }
    }
}();