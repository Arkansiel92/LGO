const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const fs = require('fs');
const { send } = require('process');

app.use(cors());

const server = http.createServer({
    key: fs.readFileSync('cert/key.pem'),
    cert: fs.readFileSync('cert/cert.pem')
}, app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        method: ["GET", "POST"]
    }
});

const roles = [
    {
        name: "Villageois",
        name_function: "Villager",
        description: "Le villageois est un personnage qui incarne les habitants d\'un village. Son rôle est de découvrir l\'identité des loups-garous et de les éliminer avant qu\'ils ne tuent tous les villageois.",
        side: "village",
        step: null,
        descriptionInGame: null,
        max: 100,
        img: "card-villager.svg"
    },
    {
        name: "Loup-garou",
        name_function: "Werewolf",
        description: "Le loup-garou est un être mi-homme mi-loup qui se transforme la nuit pour tuer les villageois. Il se réunit chaque nuit avec les autres loups-garous pour décider de leur victime.",
        side: "méchant",
        step: "werewolf",
        descriptionInGame: "Vous pouvez manger un joueur ce soir !",
        max: 100,
        img: "card-werewolf.svg",
    },
    {
        name: "Chasseur",
        name_function: "Hunter",
        description: "À sa mort, le chasseur élimine une personne de son choix.",
        side: "village",
        step: null,
        descriptionInGame: "Vous êtes mort, vous pouvez emporter un joueur avec vous.",
        max: 1,
        img: "card-hunter.svg",
    },
    {
        name: "Cupidon",
        name_function: "Cupidon",
        description: "Cupidon est appelé uniquement la première nuit afin d'unir un couple. Il désigne deux noms parmi les joueurs, ces deux joueurs seront Le couple. Si un des deux qui sont en couple meurt l'autre meurt avec son amant.",
        side: "village",
        step: "start",
        descriptionInGame: "Selectionnez deux joueurs qui seront lié à la vie et à la mort ! Si l'un d'eux meurt, il emporte son amant dans la tombe.",
        max: 1,
        img: "card-cupidon.svg",
    },
    {
        name: "Petite fille",
        name_function: "LittleGirl",
        description: "La petite fille est un villageois qui peut se réveiller au moment où les loups garous sont appelés.",
        side: "village",
        step: null,
        descriptionInGame: "",
        max: 1,
        img: "card-littleGirl.svg",
    },
    {
        name: "Sorcière",
        name_function: "Witch",
        description: "La sorcière se réveille la nuit après tout le monde. Elle possède deux potions : une de vie et une de mort. Elle peut choisir de soigner la victime des loups garous. Elle peut également choisir de tuer une personne grâce à sa potion de mort. Elle ne peut utiliser qu'une seule fois chaque potion.",
        side: "village",
        step: "end",
        descriptionInGame: "Vous avez le droit de vie ou de mort !",
        max: 1,
        img: "card-witch.svg",
    },
    {
        name: "Voleur",
        name_function: "Thief",
        description: "Le voleur est appelé uniquement la première nuit. Il peut décider ou non, d'échanger sa carte avec celle d'un autre joueur. A la suite de ça, le joueur qui a la carte voleur devient un Villageois.",
        side: "village",
        step: null,
        descriptionInGame: "Pouvoir à usage unique : vous pouvez voler la carte d'un joueur. Cette personne deviendra villageois à la suite de ce vol.",
        max: 1,
        img: "card-thief.svg",
    },
    {
        name: "Voyante",
        name_function: "Psychic",
        description: "Chaque nuit, elle a le pouvoir de regarder la carte d'un joueur.",
        side: "village",
        step: "start",
        descriptionInGame: "Vous pouvez regarder la carte d'un joueur.",
        max: 1,
        img: "card-psychic.svg",
    },
    {
        name: "Ancien du village",
        name_function: "OldMan",
        description: "L’ancien possède deux vies durant la nuit. La première fois qu'il doit mourir, il en perd une sans en être averti. Le matin, il se réveille avec les autres, mais dévoile sa carte (la seconde fois qu’il est attaqué par les loups garous alors il meurt normalement). Si l’ancien est chassé du village par le vote des villageois il meurt directement et tous les rôles des villageois perdent leurs pouvoirs.",
        side: "village",
        step: null,
        descriptionInGame: null,
        max: 1,
        img: "card-oldman.svg",
    },
    {
        name: "Bouc émissaire",
        name_function: "Scapegoat",
        description: "En cas d'égalité dans les votes du village, c'est lui qui meurt. Il a la capacité, à sa mort, de décider qui ne pourra pas voter le tour suivant.",
        side: "village",
        step: null,
        descriptionInGame: null,
        max: 1,
        img: "card-scapegoat.svg",
    },
    {
        name: "Idiot du village",
        name_function: "Idiot",
        description: "S'il est désigné par le vote du village, il ne meurt pas, mais perd seulement sa capacité à voter.",
        side: "village",
        step: null,
        descriptionInGame: null,
        max: 1,
        img: "card-idiot.svg",
    },
    {
        name: "Joueur de flûte",
        name_function: "Flute",
        description: "Se réveille en dernier. Il peut alors charmer un ou deux joueurs (en fonction du nombre de joueurs) qui deviendront les charmés. Il gagne lorsque tous les joueurs en vie sont charmés.",
        side: "seul",
        step: "end",
        descriptionInGame: "Vous pouvez charmer un/plusieurs joueur(s)",
        max: 1,
        img: "card-flute.svg",
    },
    {
        name: "Garde",
        name_function: "Guard",
        description: "Chaque nuit, le garde protège une personne . Cette personne sera protégée et ne pourra donc pas mourir durant la nuit. Le garde ne peut pas protéger la même personne deux nuits de suite.",
        side: "village",
        step: "start",
        descriptionInGame: "Vous pouvez protéger un joueur (Le garde ne peut pas protéger la même personne deux nuits de suite)",
        max: 1,
        img: "card-gard.svg",
    },
    {
        name: "Corbeau",
        name_function: "Raven",
        description: "Le corbeau fait partie du village, il sera appelé chaque nuit et désignera une personne qui recevra automatiquement deux votes de plus contre elle lors du vote de la journée suivante.",
        side: "village",
        step: "start",
        descriptionInGame: "Vous pouvez choisir un joueur qui se réveillera avec deux votes automatiquement.",
        max: 1,
        img: "card-raven.svg",
    },
    {
        name: "Loup blanc",
        name_function: "WhiteWerewolf",
        description: "Le loup blanc se réveille la nuit avec les loups, mais son but est de gagner seul. Une nuit sur deux, il se réveille pour tuer une personne de son choix (loup ou villageois).",
        side: "seul",
        step: "middle",
        descriptionInGame: "Vous pouvez tuer un joueur",
        max: 1,
        img: "card-whiteWerewolf.svg",
    },
    {
        name: "L'ange",
        name_function: "Angel",
        description: "S'il se fait éliminer au premier tour par le Village uniquement, il gagne la partie et le village aussi. Sinon, il devient villageois. S'il se fait éliminer par les loup-garou ou par un autre rôle, il meurt tout simplement.",
        side: "village",
        step: null,
        descriptionInGame: null,
        max: 1,
        img: "card-angel.svg",
    },
    {
        name: "Chien-loup",
        name_function: "DogWerewolf",
        description: "La première nuit, il choisit d’être un villageois ou un Loup-garou.",
        side: "méchant",
        step: null,
        descriptionInGame: "Vous pouvez tuer un joueur",
        max: 1,
        img: "card-dogWolf.svg",
    },
    {
        name: "Comédien",
        name_function: "Actor",
        description: "Avant la partie. Chaque nuit, le comédien peut désigner un des rôles qui n'ont pas été choisi et utiliser le pouvoir correspondant jusqu’à la nuit suivante. Chaque rôle ne peut être utilisé qu'une seule fois et maximum 3 fois dans la partie.",
        side: "village",
        step: null,
        descriptionInGame: "Vous pouvez choisir un rôle",
        max: 1,
        img: "card-actor.svg",
    },
    {
        name: "Deux soeurs",
        name_function: "Sisters",
        description: "Leur objectif est d'éliminer tous les autres joueurs. Au début de la partie elles connaissent donc leur identité, et peuvent donc avoir confiance en elles. Elles peuvent se concerter en silence. Si l'une d'elle meurt, l'autre ne meurt pas forcément.",
        side: "seul",
        step: null,
        descriptionInGame: null,
        max: 2,
        img: "card-sisters.svg",
    },
    {
        name: "Grand méchant loup",
        name_function: "BigBadWerewolf",
        description: "Son objectif est d'éliminer tout le village. Chaque nuit, il se réunit avec ses compères Loups pour décider d'une victime à éliminer... Tant qu'aucun autre loup n'est mort, il peut, chaque nuit, dévorer une victime supplémentaire.",
        side: "méchant",
        step: "middle",
        descriptionInGame: "Vous pouvez tuer un joueur",
        max: 1,
        img: "card-bigBadWolf.svg",
    },
    {
        name: "Gitane",
        name_function: "Gypsy",
        description: "Pendant la nuit, elle décide si oui ou non elle veut déclencher un évènement pour le jour suivant. Le pouvoir n'est activable qu'une fois dans la partie",
        side: "village",
        step: "start",
        descriptionInGame: "Voulez-vous déclencher un évènement pour la prochaine journée ?",
        max: 1,
        img: "card-gypsy.svg",
    },
    {
        name: "Loup noir",
        name_function: "BlackWerewolf",
        description: "Chaque nuit après avoir joué avec les loups il peut décider d'infecter la victime. Elle devient alors Infectée et ne meurt pas. Il ne peut utiliser son pouvoir qu'une fois dans la partie.",
        side: "méchant",
        step: "middle",
        descriptionInGame: "Vous pouvez tuer un joueur",
        max: 1,
        img: "card-BlackWerewolf.svg",
    },
    {
        name: "Juge bègue",
        name_function: "Judge",
        description: "Ce pouvoir ne peut être utilisé qu'une fois dans la partie. Après le vote du village, le juge bègue décide si il faut refaire le vote. Dans ce cas, un nouveau vote à lieu, immédiatement et sans débat.",
        side: "village",
        step: null,
        descriptionInGame: "Voulez-vous déclencher un second vote ?",
        max: 1,
        img: "card-judge.svg",
    },
    {
        name: "Renard",
        name_function: "Fox",
        description: "La première nuit, le renard flaire 3 joueurs. Si un loup garou est dans ce groupe, il pourra réutiliser son pouvoir la nuit suivante. Sinon, il devient villageois.",
        side: "village",
        step: "start",
        descriptionInGame: "Vous pouvez flairer 3 joueurs",
        max: 1,
        img: "card-fox.svg",
    },
    {
        name: "Servante Dévouée",
        name_function: "Servant",
        description: "Une fois dans la partie, elle peut choisir de prendre le rôle d'un des morts jusqu'à la fin de la partie sauf si elle est en couple, car son amour est plus fort que sa volonté de changer de rôle",
        side: "village",
        step: "start",
        descriptionInGame: "Voulez-vous prendre le rôle d'un mort ?",
        max: 1,
        img: "card-servant.svg",
    },
    {
        name: "Mercenaire",
        name_function: "Mercenary",
        description: "Le premier jour, l'objectif du mercenaire est d'éliminer la cible qui lui est attribuée. S'il y parvient, il gagne seul la partie instantanément. Sinon, il devient villageois.",
        side: "seul",
        step: null,
        descriptionInGame: null,
        max: 1,
        img: "card-mercenary.svg",
    },
    {
        name: "Nécromancien",
        name_function: "Necromancer",
        description: "Vaincre les loups-garous est son objectif. La nuit, il peut communiquer avec les morts, afin d'en tirer des informations capitales...",
        side: "village",
        step: null,
        descriptionInGame: "C'est la nuit, vous pouvez communiquer avec les morts",
        max: 1,
        img: "card-necromancer.svg",
    },
    {
        name: "Fossoyeur",
        name_function: "Gravedigger",
        description: "Vaincre les loups-garous est son objectif. À sa mort, le fossoyeur creuse la tombe d'un joueur qu'il choisit et d'un joueur au hasard du camp opposé. Les noms de ces deux joueurs seront annoncés...",
        side: "village",
        step: null,
        descriptionInGame: "Vous êtes mort, qui voulez-vous cibler ?",
        max: 1,
        img: "card-gravedigger.svg",
    },
    {
        name: "Dictateur",
        name_function: "Dictator",
        description: "Vaincre les loups-garous est son objectif. Il peut s'emparer du pouvoir de vote du village une fois dans la partie. S'il exécute un loup-garou, il devient Maire, sinon, il meurt.",
        side: "village",
        step: "start",
        descriptionInGame: "Voulez-vous faire un coup d'état la prochaine nuit ?",
        max: 1,
        img: "card-dictator.svg",
    },
    {
        name: "Le Chaperon Rouge",
        name_function: "Chaperone",
        description: "Son objectif est de vaincre les Loups-Garous. Tant que le Chasseur est en vie, il est protégé contre les attaques des Loups-Garous.",
        side: "village",
        step: null,
        descriptionInGame: null,
        max: 1,
        img: "card-chaperon.svg",
    },
    {
        name: "L'Héritier",
        name_function: "Hair",
        description: "Son objectif est de vaincre les Loups-Garous tant qu'il ne reçoit pas de nouveau rôle. La première nuit, il désigne un testataire qui lui léguera son rôle lors de sa mort.",
        side: "village",
        step: "start",
        descriptionInGame: "Désignez un testataire qui vous léguera son rôle lors dà sa mort",
        max: 1,
        img: "card-heir.svg",
    },
]

const eventsGypsy = [
    {
        name: "Résurrection aveugle",
        description: "Fait revenir un joueur au hasard d'entre les morts."
    },
    {
        name: "Punition aveugle",
        description: "Tue quelqu'un au hasard (y compris vous)"
    }
]

io.on('connection', (socket) => {
    let hub = io.sockets.adapter.rooms.get(socket.room);
    let interval;

    function getPlayer(socketID) {
        const player = hub.players.find((player) => {
            return player.socket === socketID;
        })

        return player;
    }

    function getPlayerByRole(role) {
        const player = hub.players.find((player) => {
            return player.role.name === role;
        })

        return player;
    }

    function order() {
        if(hub.step === "start") {
            let dictator = getPlayerByRole("Dictateur");

            if (dictator) {
                io.to(dictator.socket).emit('dictator', false);
            }

            return "werewolf";

        } else if (hub.step === "werewolf") {

            return "middle";

        } else if (hub.step === "middle") {
            let blackWerewolf = getPlayerByRole("Loup noir");

            if (blackWerewolf) {
                io.to(blackWerewolf.socket).emit('blackWerewolf', false);
            }
            
            return "end";

        } else if (hub.step === "end") {
            return "day";
        } else {
            return hub.step;
        }
    }

    function stepNight() {
        if(hub.step === "day") {
            return day();
        }

        let check = false;

        console.log("ETAPE : " + hub.step);
        if (hub.step !== "werewolf") {
            roles.forEach((role) => {
                if (hub.roles.includes(role.name)) {
                    const player = getPlayerByRole(role.name);
                    if (role.step === hub.step) {
                        if (!player.isDead && player.isPower && !player.isPlayed) {
                            if (player.role.name === "Dictateur") {
                                check = true;
                                io.to(player.socket).emit('dictator', true)
                                sendMessage("server", null, "Le dictateur décide si il veut faire un coup d'état.")
                            }

                            if (player.role.name === "Gitane") {
                                check = true;
                                io.to(player.socket).emit('gypsy', true)
                                sendMessage("server", null, "La gitane décide si elle veut déclencher un évènement.")
                            }

                            if (player.role.name === "Loup noir") {
                                if (player.isPower && hub.voteWolf) {
                                    const target = getPlayer(hub.voteWolf);
                                    if (target.role.side !== "méchant" && target.role.name !== "Loup blanc") {
                                        check = true;
                                        io.to(player.socket).emit('victim', target.name);
                                        io.to(player.socket).emit('blackWerewolf', true)
                                        sendMessage("server", null, "Le loup noir décide si il veut infecter sa victime.")
                                    }
                                }
                            }

                            if (player.role.name === "Sorcière") {
                                check = true;
                                // vérifier qu'il n'y a pas eu d'infection ce tour-ci en vérifiant que le joueur infecté 
                                // n'est pas le même que celui  qui a reçu le vote
                                if (player.isPower) {

                                    if (hub.voteWolf === hub.protected || hub.infected === hub.voteWolf || hub.voteWolf === null) {
                                        io.to(player.socket).emit('victim', null);
                                    } else {
                                        io.to(player.socket).emit('victim', getPlayer(hub.voteWolf).name);
                                    }

                                    io.to(player.socket).emit('witch', true);
                                    sendMessage("server", null, "La sorcière décide si elle veut utiliser ses potions.")
                                }
                            }

                            if (player.role.name === "Loup blanc") {
                                check = true;
                                if (player.isPower) {
                                    if (hub.nbTurn % 2 === 0) {
                                        actionInGame(player.socket, true);
                                        sendMessage("server", null, "Le loup blanc peut manger une personne cette nuit.");
                                    }
                                }
                            }

                            if (player.role.name !== "Dictateur" && player.role.name !== "Comédien" && player.role.name !== "Sorcière" && player.role.name !== "Loup noir" && player.role.name !== "Loup blanc" && player.role.name !== "Grand méchant loup" && player.role.name !== "Gitane") {
                                check = true;
                                actionInGame(player.socket, true);
                                sendMessage("server", null, player.role.name + " : utilisation de ses pouvoirs.")
                            }
                        }
                    } else {
                        actionInGame(player.socket, false);

                    }
                }
            })
        } else {
            sendMessage("server", null, "Les loups garou se réveillent...");

            hub.roles.forEach((role) => {
                const player = getPlayerByRole(role);

                if (player.role.side === "méchant" || player.isInfected || player.role.name === "Loup blanc") {
                    check = true;
                    io.to(player.socket).emit('setWolf', true);
                }
            });
        }

        if (check) {
            return time(30);
        } else {
            hub.step = order();
            return stepNight();
        }
    }

    function day() {
        hub.night = false;

        if (hub.protected === hub.voteWolf) {
            hub.voteWolf = null
            hub.protected = null;
        }

        if (hub.roles.includes("Chasseur") && hub.roles.includes("Le Chaperon Rouge")) {
            let hunter = getPlayerByRole("Chasseur");
            let chaperon = getPlayerByRole("Le Chaperon Rouge");

            if (chaperon.socket === hub.voteWolf) {
                if (!hunter.isDead) {
                    hub.voteWolf = null;
                }
            }
        }

        if (hub.roles.includes("Ancien du village")) {
            if (hub.oldManLife > 0) {
                hub.oldManLife--;

                hub.voteWolf = null;
            }
        }
        
        if (hub.voteWolf) {
            const target = getPlayer(hub.voteWolf);

            target.isDead = true;

            sendMessage("server", null, "Le jour se lève sans " + target.name + " qui était " + target.role.name)
        } else {
            sendMessage("server", null, "Le jour se lève et personne n'est mort cette nuit !")
        }

        if (hub.event) {
            sendMessage("server", null, "La gitane a décidé de déclencher l'évènement " + hub.event.name + ". " + hub.event.description);

            hub.event = null;
        }

        if (!hub.oldManReveal && hub.oldManLife === 0) {
            sendMessage("server", null, getPlayerByRole("Ancien du village").name + " est mort cette nuit. Son rôle d'ancien du village lui permet d'esquiver une mort certaine pour cette nuit seulement.");
            
            hub.oldManReveal = true;
        }

        if (hub.ravenSocket) {
            sendMessage("server", null, getPlayer(hub.ravenSocket).name + " a reçu la visite du corbeau cette nuit, il a deux votes en plus pour cette journée.");

            hub.ravenSocket = null;
        }

        //time(120);

        time(10);

        return room();
    }

    function time(time) {
        // clear tous les setInterval avant
        clearInterval(interval);

        interval = setInterval(() => {
            io.to(socket.room).emit('counter', time);

            if (time <= 0) {
                clearInterval(interval);

                console.log('coucou');

                if (hub.step === "day") {
                    return voteVillagers();
                }

                hub.step = order();

                if (hub.step === "middle") {
                    return voteWolf()
                } else {
                    return stepNight();
                }
            }

            return time--;
        }, 1000)
    }

    function timeBySocket(time, player) {
        clearInterval(interval);

        interval = setInterval(() => {
            io.to(player.socket).emit('counter', time);

            if (time <= 0) {
                clearInterval(interval);

                if (player.role.name === "Voleur") {
                    player.role = {
                        name: "Villageois",
                        name_function: "Villager",
                        description: "Le villageois est un personnage qui incarne les habitants d\'un village. Son rôle est de découvrir l\'identité des loups-garous et de les éliminer avant qu\'ils ne tuent tous les villageois.",
                        side: "village",
                        step: null,
                        descriptionInGame: null,
                        max: 100,
                        img: "card-villager.svg"
                    };

                    hub.roles.splice(hub.roles.indexOf("Voleur"), 1);
                    hub.roles.push("Villageois");

                }
                
                if (player.role.name === "Comédien") {
                    io.to(player.socket).emit("roleForActor", []);
                }

                room();

                return stepNight();
            }

            return time--;
        }, 1000)
    }

    function navigate(id) {
        return io.to(socket.id).emit('navigate', id);
    }

    function room() {
        return io.to(socket.room).emit('getRoom', hub);
    }

    function actionInGame(socketID, bool) {
        return io.to(socketID).emit('action', bool);
    }

    function sendMessage(author, recipient, msg) {
        hub.messages.push({
            socket: socket.id,
            author: author,
            recipient: recipient,
            msg: msg
        })

        return room();
    }

    function isActor(actor) {
        if (hub.roleActor.length < 3) {

            const hiddenRole = [];

            roles.forEach((role) => {
                if (!hub.roles.includes(role) && role.descriptionInGame && role.side === "village") {
                    if (role.name !== "Voleur" && role.name !== "Comédien" && role.name !== "L'Héritier") {
                        hiddenRole.push(role)
                    }
                }
            })

            let choiceRole = []

            for (let i = 0; i < 3; i++) {
                let index = Math.floor(Math.random() * hiddenRole.length);

                while (hub.roleActor.includes(hiddenRole[index]) === true) {
                    index = Math.floor(Math.random() * hiddenRole.length);
                }

                choiceRole.push(hiddenRole[index]);

                hiddenRole.splice(index, 1);
            }

            io.to(actor.socket).emit("roleForActor", choiceRole);
        } else {
            actor.isPower = false;
        }
    }

    function voteVillagers() {
        let target = null;
        let count = 0;

        hub.players.forEach((player) => {
            if (!player.isDead) {
                if (player.votes.length > count) {
                    target = player;
                    count = player.votes.length;
                }
            }
        });

        console.log("count : " + count);
        console.log(target);

        if (target) {
            if (target.isHair) {
                let player = getPlayerByRole("L'Héritier");

                player.role = target.role;
                player.isPower = target.isPower;
            }

            sendMessage("server", null,"Le village a décidé d'exclure " + target.name + " qui était " + target.role.name);
            target.isDead = true;
        } else {
            sendMessage("server", null, "Personne n'a été exclu du village.");
        }
        
        hub.night = true;
        hub.nbTurn++;
        hub.step = "start";
        return stepNight();
    }

    function voteWolf() {
        const votes = [];

        hub.players.forEach((player) => {
            if (!player.isDead) {
                if (player.role.side === "méchant" || player.isInfected || player.role.name === "Loup blanc") {
                    io.to(player.socket).emit('setWolf', false);

                    votes.push(player.voteWolf);
                    player.voteWolf = null;
                }
            }
        })

        let playerKilled = "";
        let count = 0;

        votes.forEach((vote) => {
            countValue = 0;
            for (let i = 0; i < votes.length; i++) {
                if (vote === votes[i]) {
                    countValue++;
                }

                if (countValue > count) {
                    count = countValue;
                    playerKilled = vote;
                }
            }
        })

        let equality = false;

        votes.forEach((vote) => {
            countValue = 0;
            if (vote !== playerKilled) {
                for (let i = 0; i < votes.length; i++) {
                    if (vote === votes[i]) {
                        countValue++;
                    }
                }

                if (count === countValue) {
                    equality = true;
                };
            }
        });

        if (!equality) {
            hub.voteWolf = playerKilled;
        } else {
            hub.voteWolf = null;
        }

        console.log("Joueur tué : " + hub.voteWolf);

        room();

        return stepNight();
    }

    socket.on('voteVillage', ({targetID, userID}) => {
        const target = getPlayer(targetID);
        const villager = getPlayer(userID);

        if (targetID === villager.vote) {
            villager.vote = null;
            let index = target.votes.indexOf(villager.socket);
            target.votes.splice(index, 1);
            return;
        } else {
            villager.vote = targetID;
            target.votes.push(villager.socket);
            sendMessage("server", null, villager.name + " a voté pour " + target.name + " !");
        };

    })

    socket.on('voteWolf', ({ targetID, userID }) => {
        const target = getPlayer(targetID);
        const wolf = getPlayer(userID);

        if (wolf.voteWolf == target.socket) {
            wolf.voteWolf = null;
            sendMessage(null, wolf.socket, "Vote retiré");
        } else {
            wolf.voteWolf = target.socket;
            sendMessage(null, wolf.socket, "Vous avez voté pour " + target.name);
        }

        return room();
    })

    socket.on('getEvents', () => {
        socket.emit('setEvents', eventsGypsy);
    })

    // function Role
    socket.on('setThief', ({ targetID, userID }) => {
        if (targetID === userID) {
            return sendMessage(null, userID, "Vous ne pouvez pas voler votre carte.");
        }

        const target = getPlayer(targetID);
        const player = getPlayer(userID);

        // pas necessaire de mettre player.isPower = false car il vole le pouvoir forcément actif d'un joueur

        player.role = target.role;

        hub.roles.splice(hub.roles.indexOf("Voleur"), 1);

        target.role = {
            name: "Villageois",
            name_function: "Villager",
            description: "Le villageois est un personnage qui incarne les habitants d\'un village. Son rôle est de découvrir l\'identité des loups-garous et de les éliminer avant qu\'ils ne tuent tous les villageois.",
            side: "village",
            step: "",
            descriptionInGame: null,
            max: 100,
            img: "card-villager.svg"
        };
        
        hub.roles.push("Villageois");

        sendMessage(null, userID, "Vous avez volé la carte de " + target.name + ". Il était " + player.role.name + ".")

        clearInterval(interval);

        actionInGame(userID, false);
        room();

        if (hub.roles.includes("Comédien")) {
            const actor = getPlayerByRole("Comédien");

            return isActor(actor);
        } else {
            return stepNight();
        }

    })

    socket.on('setCupidon', ({ targetID, userID }) => {

        if (hub.lover_one === targetID) {
            hub.lover_one = null;
            return room();
        }

        if (!hub.lover_one) {
            hub.lover_one = targetID;
        } else {
            hub.lover_two = targetID;
        }

        if (hub.lover_one && hub.lover_two) {
            const cupidon = getPlayer(userID);

            if (cupidon.isPower) {
                cupidon.isPower = false;
                cupidon.isPlayed = true;

                const lover_one = getPlayer(hub.lover_one);
                const lover_two = getPlayer(hub.lover_two);

                lover_one.isCouple = true;
                lover_two.isCouple = true;

                sendMessage(null, lover_one.socket, "Vous venez de tomber amoureux de " + lover_two.name);
                sendMessage(null, lover_two.socket, "Vous venez de tomber amoureux de " + lover_one.name);

                actionInGame(userID, false);
            }
        }

        return room();
    })

    socket.on('setHair', ({ targetID, userID }) => {

        if (targetID === userID) {
            return sendMessage(null, socket.id, "Vous ne pouvez pas hériter de vous-même.");
        }

        const target = getPlayer(targetID);
        const player = getPlayer(userID);

        if (player.isPower) {

            player.isPower = false;
            player.isPlayed = true;

            target.isHair = true;

            hub.hairRole = target.role;

            actionInGame(userID, false);

            sendMessage(null, socket.id, "Vous recevrez les pouvoirs de " + target.name + " à sa mort.")
        }

        return room();
    })

    socket.on('setActor', (role) => {
        const actor = getPlayer(socket.id);

        hub.roleActor.push(role);

        actor.isActor = true;
        actor.role = role;

        if (hub.roles.includes("Dictateur")) {
            socket.emit('dictator', true);
        }

        // enlever le component du comédien
        socket.emit("roleForActor", []);

        hub.roles.splice(hub.roles.indexOf("Comédien"), 1);
        hub.roles.push(role.name);


        clearInterval(interval);

        room();

        return stepNight();
    })

    socket.on('setPsychic', ({ targetID, userID }) => {
        const target = getPlayer(targetID);
        const player = getPlayer(userID);


        if (targetID === userID) {
            return sendMessage(null, player.socket, "Vous ne pouvez pas voir votre propre carte.");
        }

        player.isPlayed = true;

        sendMessage(null, player.socket, target.name + " est " + target.role.name + ".");

        return actionInGame(player.socket, false);
    })

    socket.on('setGuard', ({ targetID, userID }) => {
        const target = getPlayer(targetID);
        const player = getPlayer(userID);

        if (hub.protected === target.socket) {
            sendMessage(null, player.socket, "Vous ne pouvez pas protéger deux fois de suite la même personne !");
            return room();
        } else {
            hub.protected = target.socket;
            sendMessage(null, player.socket, "Vous avez protéger " + target.name + " des loups pour cette nuit.");
        }

        player.isPlayed = true;

        return actionInGame(player.socket, false);

    })

    socket.on('setDictator', (action) => {
        socket.emit('dictator', false);

        if (action) {
            hub.dictator = action;
        }

        sendMessage(null, socket.id, action ? "Vous avez choisi de faire un coup d'état le prochain tour" : "Vous avez choisi de ne pas faire de coup d'état.");

        return room();
    })

    socket.on('setRaven', ({ targetID, userID }) => {
        const target = getPlayer(targetID);
        const player = getPlayer(userID);

        target.votes.push('Corbeau', 'Corbeau');

        hub.ravenSocket = target.socket;

        player.isPlayed = true;

        sendMessage(null, player.socket, target.name + " se réveillera avec deux votes en plus !");

        return actionInGame(player.socket, false);
    })

    socket.on('setFox', ({ targetID, userID }) => {
        const target = getPlayer(targetID);
        const player = getPlayer(userID);

        if (target.socket === player.socket) {
            return sendMessage(null, player.socket, "Vous connaissez déjà votre rôle...");
        }

        if (!player.socketFox && !player.roleFox) {
            player.socketFox = [];
            player.roleFox = [];
        }

        if (player.socketFox.includes(target.socket)) {
            const index = player.socketFox.indexOf(target.socket);
            player.socketFox.splice(index, 1);
        } else {
            player.socketFox.push(target.socket);
            player.roleFox.push(target.role);
        }

        if (player.socketFox.length === 3) {
            let vilain = false;

            player.roleFox.forEach((r) => {
                if (r.side === "méchant") {
                    vilain = true;
                }
            })

            if (vilain) {
                player.socketFox = [];
                player.roleFox = [];
                sendMessage(null, player.socket, "Il y a un loup parmis ces personnes. Vous gardez vos pouvoirs.");
            } else {
                player.isPower = false;
                sendMessage(null, player.socket, "Il n'y a aucun loup parmis ces personnes. Vos pouvoirs vous quittent...");
            }

            player.isPlayed = true;

            return actionInGame(player.socket, false);
        }
    })

    socket.on('setWhiteWerewolf', ({ targetID, userID }) => {
        const target = getPlayer(targetID);

        hub.voteWhiteWolf = target.socket;

        room();

        return actionInGame(player.socket, false);
    })

    socket.on('setBlackWerewolf', (bool) => {
        socket.emit('blackWerewolf', false)

        if (bool) {
            hub.infected = hub.voteWolf;
            hub.voteWolf = null;
            getPlayer(socket.id).isPower = false;
            sendMessage("server", hub.infected, "Vous avez été infecté par le loup noir !");
        }

        return room();
    })

    socket.on('setWitchChoice', (bool) => {
        socket.emit('witch', false);

        if (bool) {
            hub.voteWolf = null;
            getPlayer(socket.id).healthPotion = false;
        } else {
            actionInGame(socket.id, true);
        }
    })

    socket.on('setWitch', ({targetID, userID}) => {
        const target = getPlayer(targetID);
        const player = getPlayer(userID);

        player.deathPotion = false;

        hub.witchVictim = target.socket;

        sendMessage("server", player.socket, "Vous avez décider de tuer " + target.name);

        room();

        return actionInGame(socket.id, false);
    })

    socket.on('setGypsy', (choice) => {
        const player = getPlayer(socket.id);
        let eventChoice;
        player.isPower = false;

        eventsGypsy.forEach((event) => {
            if (event.name === choice) {
                eventChoice = event;
            }
        })

        hub.event = eventChoice;

        return socket.emit('gypsy', false);
    })

    socket.on('inGame', ready => {
        hub.inGame = ready;

        io.to(socket.room).emit('inGame', true);

        hub.night = true;
        hub.step = "start";

        sendMessage("server", null, "La nuit tombe sur le village...");

        // copy array
        let roleArray = [...hub.roles];
        let playerArray = [...hub.sockets];
        let rolesArray = [...roles];

        while (roleArray.length > 0) {
            const randomRole = Math.floor(Math.random() * roleArray.length);
            const randomPlayer = Math.floor(Math.random() * playerArray.length);

            // récupération de l'objet role
            let roleToPlayer = rolesArray.find((role) => {
                return role.name === roleArray[randomRole]
            });

            // récupération du joueur qui héritera du rôle
            const player = hub.players.find(player => {
                return player.socket === playerArray[randomPlayer]
            });

            player.role = roleToPlayer // attribution du rôle

            io.to(playerArray[randomPlayer]).emit('getPlayer', player);

            roleArray.splice(randomRole, 1);
            playerArray.splice(randomPlayer, 1);
        }

        hub.nbTurn++;

        room();
    
        if (hub.roles.includes("Voleur")) {
            const thief = getPlayerByRole("Voleur")

            if (thief) {
                sendMessage("server", null, "Le voleur décide du joueur à voler.");
                timeBySocket(30, thief);
                return actionInGame(thief.socket, true);
            }
        }

        if (hub.roles.includes("Comédien")) {
            const actor = getPlayerByRole("Comédien")

            if (!actor) {

                const actor = hub.players.find((player) => {
                    return player.socket === hub.actorSocket;
                })

                if (actor.isActor) {
                    actor.isActor = false;

                    player.role = {
                        name: "Comédien",
                        name_function: "Actor",
                        description: "Avant la partie. Chaque nuit, le comédien peut désigner un des rôles qui n'ont pas été choisi et utiliser le pouvoir correspondant jusqu’à la nuit suivante. Chaque rôle ne peut être utilisé qu'une seule fois et maximum 3 fois dans la partie.",
                        side: "village",
                        step: null,
                        descriptionInGame: "Vous pouvez choisir un rôle",
                        max: 1,
                        img: "card-actor.svg",
                    }
                }
            }

            hub.actorSocket = actor.socket;

            if (actor.isPower) {
                timeBySocket(5, actor);
                sendMessage("server", null, "Le comédien décide du rôle à jouer cette nuit.");
                return isActor(actor);
            }
        }

        return stepNight();
    })

    socket.on('addRole', role => {

        if (role === "Renard" && hub.players.length < 4) {
            return;
        }

        if (role === "Deux soeurs" && hub.players.length < 4) {
            return;
        }

        const roleObject = roles.find((roleObject) => {
            return roleObject.name === role;
        })

        const nbrRole = hub.roles.filter((roleObject) => {
            return roleObject === role;
        }).length

        if (nbrRole < roleObject.max) {

            if (role === "Deux soeurs") {
                hub.roles = hub.roles.concat(['Deux soeurs', 'Deux soeurs'])
            } else {
                hub.roles.push(role);
            }

            return room();
        }
    });

    socket.on('deleteRole', role => {
        const index = hub.roles.indexOf(role);

        if (index > -1) {
            if (role === "Deux soeurs") { // les deux soeurs se jouent à deux, on supprime 2 index
                hub.roles.splice(index, 2);
            } else {
                hub.roles.splice(index, 1);
            }

            return room();
        }
    });

    socket.on("setMessage", msg => {
        return sendMessage(socket.name, null, msg);
    })

    socket.on('getRoles', () => io.to(socket.id).emit('getRoles', roles));

    socket.on('getRoom', () => io.to(socket.id).emit('getRoom', hub));

    socket.on('join', ({ id, pseudo }) => {
        hub = io.sockets.adapter.rooms.get(id);

        if (!hub) {
            return socket.emit('alert', 'Ce lobby n\'existe pas !');
        }

        if (hub.inGame) {
            return socket.emit('alert', 'La partie a déjà démarré !');
        }

        const player = {
            name: pseudo,
            socket: socket.id,
            role: null,
            vote: null,
            votes: [],
            voteWolf: null,
            isDead: false,
            isPlayed: false,
            isPower: true,
            isCouple: false,
            isCharmed: false,
            isHair: false,
            isActor: false,
            healthPotion: true,
            deathPotion: true
        }

        hub.players.push(player);
        hub.sockets.push(socket.id);
        hub.votes.push('');
        socket.name = pseudo;
        socket.room = id;
        socket.join(id);

        hub.messages.push({
            socket: null,
            author: "server",
            msg: pseudo.toLowerCase() === "xprolive" || pseudo.toLowerCase() === "prolive" | pseudo.toLowerCase() === "alexis" ? pseudo + " vient d'arriver dans la partie ! (il sera loup-garou à la prochaine partie)" : pseudo + " vient d'arriver dans la partie !"
        })

        room();
        return navigate(id);
    })

    socket.on('setRoom', ({ id, pseudo }) => {
        socket.name = pseudo
        socket.room = id;
        socket.join(id);

        hub = io.sockets.adapter.rooms.get(id);

        hub.private = true;
        hub.author = socket.id;
        hub.players = [{
            name: pseudo,
            socket: socket.id,
            vote: null,
            votes: [],
            voteWolf: null,
            role: null,
            isDead: false,
            isTurn: false,
            isPower: true,
            isCouple: false,
            isCharmed: false,
            isHair: false,
            isActor: false,
            healthPotion: true,
            deathPotion: true
        }];
        hub.sockets = [socket.id];
        hub.roles = [];
        hub.votes = [''];
        hub.event = null;
        hub.night = false;
        hub.voteWolf = null;
        hub.voteWhiteWolf = null;
        hub.witchVictim = null;
        hub.messages = [];
        hub.nbTurn = 0;
        hub.oldManLife = 1;
        hub.oldManReveal = false;
        hub.lover_one = null;
        hub.lover_two = null;
        hub.infected = null;
        hub.protected = null;
        hub.dictator = false;
        hub.ravenSocket = null;
        hub.actorSocket = null;
        hub.hairRole = null;
        hub.roleActor = [];
        hub.inGame = false;
        hub.step = "start";

        return navigate(id);
    })

    socket.on('clear', () => {
        if (hub) {
            const index = hub.sockets.indexOf(socket.id);

            hub.sockets.splice(index, 1);

            hub.players.forEach((player, index) => {
                if (player.socket === socket.id) {
                    hub.players.splice(index, 1);
                    hub.votes.splice(index, 1);
                    socket.leave(room);
                }
            })

            hub.messages.push({
                socket: null,
                recipient: null,
                author: "MJ",
                msg: socket.name + " vient de quitter la partie !"
            })

            return room();
        }
    })

    socket.on('disconnect', () => {
        if (hub) {
            const index = hub.sockets.indexOf(socket.id);

            hub.sockets.splice(index, 1);

            hub.players.forEach((player, index) => {
                if (player.socket === socket.id) {
                    hub.players.splice(index, 1);
                    hub.votes.splice(index, 1);
                    socket.leave(room);
                }
            })

            hub.messages.push({
                socket: null,
                author: "MJ",
                msg: socket.name + " vient de quitter la partie !"
            })

            return room();
        }
    })
})

server.listen(3001, () => {
    console.log("SERVER IS RUNNING");
});