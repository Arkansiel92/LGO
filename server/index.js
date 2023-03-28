const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const fs = require('fs');

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
        descriptionInGame: "Vous pouvez manger un joueur ce soir.",
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
    // {
    //     name: "Petite fille",
    //     name_function: "LittleGirl",
    //     description: "La petite fille est un villageois qui peut se réveiller au moment où les loups garous sont appelés.",
    //     side: "village",
    //     step: null,
    //     descriptionInGame: "",
    //     max: 1,
    //     img: "card-littleGirl.svg",
    // },
    {
        name: "Sorcière",
        name_function: "Witch",
        description: "La sorcière se réveille la nuit après tout le monde. Elle possède deux potions : une de vie et une de mort. Elle peut choisir de soigner la victime des loups garous. Elle peut également choisir de tuer une personne grâce à sa potion de mort. Elle ne peut utiliser qu'une seule fois chaque potion.",
        side: "village",
        step: "end",
        descriptionInGame: "Voulez-vous le sauver ?",
        max: 1,
        img: "card-witch.svg",
    },
    {
        name: "Voleur",
        name_function: "Thief",
        description: "Le voleur est appelé uniquement la première nuit. Il peut décider ou non, d'échanger sa carte avec celle d'un autre joueur. A la suite de ça, le joueur qui a la carte voleur devient un Villageois.",
        side: "village",
        step: null,
        descriptionInGame: "Vous pouvez voler la carte d'un joueur et prendre son rôle. Cette personne deviendra villageois à la suite de ce vol.",
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
        description: "Se réveille en dernier. Il peut charmer un joueur par tour qui deviendra charmé. Il gagne lorsque tous les joueurs en vie sont charmés.",
        side: "seul",
        step: "end",
        descriptionInGame: "Vous pouvez charmer un/plusieurs joueur(s)",
        max: 1,
        img: "card-flute.svg",
    },
    {
        name: "Garde",
        name_function: "Guard",
        description: "Chaque nuit, le garde protège une personne. Cette personne sera protégée et ne pourra donc pas mourir durant la nuit. Le garde ne peut pas protéger la même personne deux nuits de suite.",
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
        step: "start",
        descriptionInGame: "Vous avez le choix d'être loup-garou ou de rester vilageois. Voulez-vous être loup-garou ?",
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
        description: "Leur objectif est d'éliminer tous les autres joueurs. Au début de la partie elles connaissent donc leur identité, et peuvent donc avoir confiance en elles. Elles peuvent se concerter en silence. Si l'une d'elle meurt, l'autre ne meurt pas forcément. (min joueurs dans la partie : 4)",
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
        descriptionInGame: "Aucun loup n'a encore été tué, vous pouvez tuez un villageois de plus.",
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
        descriptionInGame: "Voulez-vous infecter ce joueur ?",
        max: 1,
        img: "card-BlackWerewolf.svg",
    },
    // {
    //     name: "Juge bègue",
    //     name_function: "Judge",
    //     description: "Ce pouvoir ne peut être utilisé qu'une fois dans la partie. Après le vote du village, le juge bègue décide si il faut refaire le vote. Dans ce cas, un nouveau vote à lieu, immédiatement et sans débat.",
    //     side: "village",
    //     step: null,
    //     descriptionInGame: "Voulez-vous déclencher un second vote ?",
    //     max: 1,
    //     img: "card-judge.svg",
    // },
    {
        name: "Renard",
        name_function: "Fox",
        description: "La première nuit, le renard flaire 3 joueurs. Si un loup garou est dans ce groupe, il pourra réutiliser son pouvoir la nuit suivante. Sinon, il devient villageois. (min joueurs dans la partie : 4)",
        side: "village",
        step: "start",
        descriptionInGame: "Vous pouvez flairer 3 joueurs. Si aucun loup n'est dedans, vous perdez vos pouvoirs.",
        max: 1,
        img: "card-fox.svg",
    },
    // {
    //     name: "Servante Dévouée",
    //     name_function: "Servant",
    //     description: "Une fois dans la partie, elle peut choisir de prendre le rôle d'un des morts jusqu'à la fin de la partie sauf si elle est en couple, car son amour est plus fort que sa volonté de changer de rôle",
    //     side: "village",
    //     step: "start",
    //     descriptionInGame: "Voulez-vous prendre le rôle d'un mort ?",
    //     max: 1,
    //     img: "card-servant.svg",
    // },
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
        description: "Vaincre les loups-garous est son objectif. À sa mort, le fossoyeur creuse la tombe d'un joueur qu'il choisit et d'un joueur au hasard du camp opposé. Les noms de ces deux joueurs seront annoncés et l'un des deux sera forcément loup.",
        side: "village",
        step: null,
        descriptionInGame: "Vous êtes mort, vous pouvez choisir un joueur et un autre joueur sera choisi au hasard. Les noms de ces deux joueurs seront annoncés et l'un des deux sera forcément loup.",
        max: 1,
        img: "card-gravedigger.svg",
    },
    {
        name: "Dictateur",
        name_function: "Dictator",
        description: "Vaincre les loups-garous est son objectif. Il peut s'emparer du pouvoir de vote du village une fois dans la partie. S'il exécute un loup-garou, il devient Maire, sinon, il meurt.",
        side: "village",
        step: "start",
        descriptionInGame: "Voulez-vous faire un coup d'état pour le début du prochain jour ?",
        max: 1,
        img: "card-dictator.svg",
    },
    {
        name: "Le Chaperon Rouge",
        name_function: "Chaperone",
        description: "Son objectif est de vaincre les Loups-Garous. Tant que le Chasseur est en vie, elle est protégée contre les attaques des Loups-Garous.",
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
        img: "card-hair.svg",
    },
]

const eventsGypsy = [
    {
        name: "Résurrection aveugle",
        description: "Fait revenir un joueur au hasard d'entre les morts."
    },
    {
        name: "Punition aveugle",
        description: "Tue quelqu'un au hasard."
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

    function room() {
        return io.to(socket.room).emit('getRoom', hub);
    }

    function actionInGame(socketID, bool) {
        return io.to(socketID).emit('action', bool);
    }

    function navigate(id) {
        return io.to(socket.id).emit('navigate', id);
    }

    function sendMessage(author, recipient, msg, sister, loved) {
        hub.messages.push({
            socket: socket.id,
            author: author,
            recipient: recipient,
            msg: msg,
            isDead: getPlayer(socket.id).isDead,
            loved: loved,
            sister: sister
        })

        return room();
    }

    function finishedByMercenary(mercenary) {
        return sendMessage("server", null, "Le joueur expulsé était la cible de " + mercenary.name + " qui était Mercenaire. Il gagne la partie.");
    }

    function finishedByAngel(angel) {
        return sendMessage("server", null, angel.name + " était l'Ange. Il gagne la partie.");
    }

    function order() {
        if (hub.step === "start") {

            return "werewolf";

        } else if (hub.step === "werewolf") {

            return "middle";

        } else if (hub.step === "middle") {

            return "end";

        } else if (hub.step === "end") {

            return "day";

        } else if (hub.step === "day") {

            if (hub.event) {
                triggerEvent();
                hub.event = null;
            }

            resetTurn();

            return "start";
        } else {
            return hub.step;
        }
    }

    function stepNight() {
        if (hub.step === "day") {
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
                            if (player.role.name === "Chien-loup") {
                                check = true;
                                io.to(player.socket).emit('actionByRole', { name: player.role.name, name_function: player.role.name_function, descriptionInGame: player.role.descriptionInGame, response: true })
                                sendMessage("server", null, "Le chien-loup décide si il veut être villageois ou loup-garou.")
                            }

                            if (player.role.name === "Dictateur") {
                                check = true;
                                io.to(player.socket).emit('actionByRole', { name: player.role.name, name_function: player.role.name_function, descriptionInGame: player.role.descriptionInGame, response: true })
                                sendMessage("server", null, "Le dictateur décide si il veut faire un coup d'état.")
                            }

                            if (player.role.name === "Gitane") {
                                check = true;
                                io.to(player.socket).emit('actionByRole', { name: player.role.name, descriptionInGame: player.role.descriptionInGame, response: false, gypsy: eventsGypsy })
                                sendMessage("server", null, "La gitane décide si elle veut déclencher un évènement.")
                            }

                            if (player.role.name === "Loup noir") {
                                if (player.isPower && hub.voteWolf) {
                                    check = true;
                                    io.to(player.socket).emit('actionByRole', { name: player.role.name, name_function: player.role.name_function, descriptionInGame: player.role.descriptionInGame, response: true, victim: getPlayer(hub.voteWolf).name })
                                    sendMessage("server", null, "Le loup noir décide si il veut infecter sa victime.")
                                }
                            }

                            if (player.role.name === "Sorcière") {
                                // vérifier qu'il n'y a pas eu d'infection ce tour-ci en vérifiant que le joueur infecté 
                                // n'est pas le même que celui  qui a reçu le vote
                                if (player.isPower) {
                                    check = true;

                                    io.to(player.socket).emit("actionByRole", { name: player.role.name, name_function: player.role.name_function, descriptionInGame: player.role.descriptionInGame, response: true, victim: getPlayer(hub.voteWolf).name })

                                    sendMessage("server", null, "La sorcière décide si elle veut utiliser ses potions.")
                                }
                            }

                            if (player.role.name === "Loup blanc") {
                                if (player.isPower) {
                                    check = true;
                                    if (hub.nbTurn % 2 === 0) {
                                        actionInGame(player.socket, true);
                                        sendMessage("server", null, "Le loup blanc peut manger une personne de plus cette nuit.");
                                    }
                                }
                            }

                            if (player.role.name !== "Dictateur" && player.role.name !== "Comédien" && player.role.name !== "Sorcière" && player.role.name !== "Loup noir" && player.role.name !== "Loup blanc" && player.role.name !== "Grand méchant loup" && player.role.name !== "Gitane" && player.role.name !== "Chien-loup") {
                                check = true;
                                actionInGame(player.socket, true);
                                sendMessage("server", null, player.role.name + " : utilisation de ses pouvoirs.")
                            }
                        }
                    } else {
                        io.to(player.socket).emit('actionByRole', null);
                        actionInGame(player.socket, false);
                    }
                }
            })
        } else {
            sendMessage("server", null, "Les loups garou se réveillent...");

            hub.sockets.forEach((socket) => {
                const player = getPlayer(socket);

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

    function triggerEvent() {
        let target = getPlayer(hub.sockets[Math.floor(Math.random() * hub.sockets.length)]);

        if (hub.event.name === "Résurrection aveugle") {

            while (target.isDead === false) {
                target = getPlayer(hub.sockets[Math.floor(Math.random() * hub.sockets.length)]);
            }

            target.isDead = false;

        } else if (hub.event.name === "Punition aveugle") {

            while (target.isDead === true) {
                target = getPlayer(hub.sockets[Math.floor(Math.random() * hub.sockets.length)]);
            }

            target.isDead = true;
        }

        console.log(target.name, target.isDead);

        room();

        return sendMessage("server", null, "l'évènement a été déclenché avec succès.", false, false);
    }

    function day() {
        // reset des votes
        hub.players.forEach((player) => {
            player.vote = null;
            player.votes = [];
        });
        
        hub.night = false;

        if (hub.nbTurn === 1) {
            if (hub.roles.includes("Mercenaire")) {
                let mercenary = getPlayerByRole("Mercenaire");
                
                let socket = null;

                while (socket === null || socket === mercenary.socket) {
                    socket = hub.sockets[Math.floor(Math.random() * hub.sockets.length)];
                }

                let target = getPlayer(socket);
                hub.mercenaryTarget = target.socket;

                sendMessage(null, mercenary.socket, "Votre cible est " + target.name + ". Si vous parvenez à l'éliminer ce jour-ci, vous gagnez la partie.", false, false);
            }
        }

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

            if (!hub.oldManReveal && hub.oldManLife === 0) {
                sendMessage("server", null, getPlayerByRole("Ancien du village").name + " a échappé à la mort cette nuit. Son rôle d'ancien du village lui permet d'esquiver une mort certaine pour cette nuit seulement.");

                hub.oldManReveal = true;
            }
        }

        if (hub.event) {
            sendMessage("server", null, "La gitane a décidé d'utiliser l'évènement " + hub.event.name + ". Il sera déclencher en fin de journée. Préparez-vous...");
        }

        if (hub.ravenSocket) {
            sendMessage("server", null, getPlayer(hub.ravenSocket).name + " a reçu la visite du corbeau cette nuit, il a deux votes en plus pour cette journée.");
            hub.ravenSocket = null;
        }

        if (hub.kills.length > 0) {
            if (hub.voteWolf) {
                getPlayer(hub.voteWolf).isDead = true;
            }

            sendMessage("server", null, "Le jour se lève sans " + hub.kills.toString() + ".");

            if (hub.roles.includes("Chasseur")) {
                if (hub.killsSockets.includes(getPlayerByRole("Chasseur").socket)) {
                    sendMessage("server", null, "Le chasseur est mort, il peut tuer quelqu'un avant de mourir.");
                    timeBySocket(30, target);
                    actionInGame(target.socket, true);
                    return io.to('actionByRole', { name: target.role.name, descriptionInGame: target.role.descriptionInGame, name_function: target.role.name_function, response: false })
                }
            }
        } else {
            sendMessage("server", null, "Le jour se lève et personne n'est mort cette nuit !");
        }

        
        if (hub.nbTurn === 2) {
            sendMessage("server", null, "Election du maire !", false, false);
        }

        //time(120);

        time(10);

        return room();
    }

    function resetTurn() {
        hub.players.forEach((player) => {
            if (player.role.name !== "Idiot du village") {
                player.isVote = true;
            }
        })

        hub.night = true;
        hub.nbTurn++;

        hub.votes = [''];
        hub.voteWolf = null;
        hub.infected = null;
        hub.protected = null;
        hub.dictator = false;
        hub.ravenSocket = null;
        hub.actorSocket = null;

        room();

        return;
    }

    function time(time) {
        // clear tous les setInterval avant
        clearInterval(interval);

        interval = setInterval(() => {
            io.to(socket.room).emit('counter', time);

            if (time <= 0) {
                clearInterval(interval);

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

                room();

                return stepNight();
            }

            return time--;
        }, 1000)
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

        let equality = false;

        hub.players.forEach((player) => {
            if (player !== target) {
                if (count === player.votes.length && player.votes.length > 0) {
                    equality = true;
                };
            }
        });

        if (target && !equality) {
            if (hub.nbTurn === 1) {
                if (target.socket === hub.mercenaryTarget) {
                    return finishedByMercenary(getPlayerByRole("Mercenaire"));
                }

                if (hub.roles.includes("L'ange")) {
                    let angel = getPlayerByRole("L'ange");

                    if (angel.socket === target.socket) {
                        return finishedByAngel(angel)
                    }
                }
            }
            
            if (target.role.name !== "Idiot du village") {
                sendMessage("server", null, "Le village a décidé d'exclure " + target.name + " qui était " + target.role.name, false, false);
                target.isDead = true;
                hub.roles.splice(hub.roles.indexOf(target.role.name), 1);
            } else {
                sendMessage("server", null, "Le village a décidé d'exclure " + target.name + " (" + target.role.name + "). Le village a pitié de lui et décide de le laisser en vie, mais en échange il perd son droit de vote.", false, false);
                target.isVote = false;
            }


            if (target.isHair) {
                let player = getPlayerByRole("L'Héritier");

                player.role = target.role;
                player.isPower = target.isPower;

                hub.roles.splice(hub.roles.indexOf("L'Héritier"), 1);
                hub.roles.push(target.role.name);

                sendMessage(null, player.socket, "Votre héritier est mort, vous héritez de ses pouvoirs et du rôle de " + target.role.name + ".", false, false);
            }

            if (target.role.name === "Chasseur") {
                sendMessage("server", null, "Le chasseur est mort, il peut tuer quelqu'un avant de mourir.");
                timeBySocket(30, target);
                actionInGame(target.socket, true);
                return io.to('actionByRole', { name: target.role.name, descriptionInGame: target.role.descriptionInGame, name_function: target.role.name_function, response: false })
            }

        } else {
            if (equality && hub.roles.includes("Bouc émissaire")) {
                let player = getPlayerByRole("Bouc émissaire");

                sendMessage("server", null, "Le village n'a pas réussi à se départager. Par dépit, le village décide de se tourner vers " + player.name + " qui est bouc émissaire. Il peut choisir une personne qui ne pourra pas voter au prochain tour.", false, false);
                actionInGame(player.socket, true);

                hub.step = order();

                return timeBySocket(30, player);
            } else {
                sendMessage("server", null, "Personne n'a été exclu du village.", false, false);
            }
        }

        hub.step = order();
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
            hub.voteWolf = playerKilled

            let kill = getPlayer(hub.voteWolf);

            hub.killsSockets.push(kill.socket);
            hub.kills.push(kill.name + ' (' + kill.role.name + ')');

            console.log("Joueur tué : " + kill.name);
        } else {
            hub.voteWolf = null;
        }

        room();

        return stepNight();
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

            io.to(actor.socket).emit("actionByRole", { name: actor.role.name, descriptionInGame: actor.role.descriptionInGame, response: false, actorRoles: choiceRole });
            //io.to(actor.socket).emit("roleForActor", choiceRole);
        } else {
            actor.isPower = false;
        }
    }

    socket.on('voteVillage', (targetID) => {
        const target = getPlayer(targetID);
        const villager = getPlayer(socket.id);

        if (targetID === villager.vote) {
            villager.vote = null;
            let index = target.votes.indexOf(villager.socket);
            target.votes.splice(index, 1);
            return;
        } else {
            villager.vote = targetID;
            target.votes.push(villager.socket);
            sendMessage("server", null, villager.name + " a voté pour " + target.name + " !", false, false);
        };

    })

    socket.on('voteWolf', (targetID) => {
        const target = getPlayer(targetID);
        const wolf = getPlayer(socket.id);

        if (wolf.voteWolf == target.socket) {
            wolf.voteWolf = null;
            sendMessage(null, wolf.socket, "Vote retiré", false, false);
        } else {
            wolf.voteWolf = target.socket;
            sendMessage(null, wolf.socket, "Vous avez voté pour " + target.name, false, false);
        }

        return room();
    })

    socket.on('getEvents', () => {
        socket.emit('setEvents', eventsGypsy);
    })

    // function Role
    socket.on('setThief', (targetID) => {
        if (targetID === socket.id) {
            return sendMessage(null, socket.id, "Vous ne pouvez pas voler votre carte.", false, false);
        }

        let target = getPlayer(targetID);
        let player = getPlayer(socket.id);

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

        sendMessage(null, socket.id, "Vous avez volé la carte de " + target.name + ". Il était " + player.role.name + ".", false, false)

        clearInterval(interval);

        io.to(socket.id).emit('actionByRole', null);
        actionInGame(socket.id, false);

        room();

        if (hub.roles.includes("Comédien")) {
            const actor = getPlayerByRole("Comédien");

            return isActor(actor);
        } else {
            return stepNight();
        }

    })

    socket.on('setHunter', (targetID) => {
        let target = getPlayer(targetID);
        let player = getPlayer(socket.id);

        player.isPower = false;
        target.isDead = true;

        sendMessage('server', null, "Le chasseur a tiré sur " + target.name + " qui était " + target.role.name + ".", false, false);

        return room();
    })

    socket.on('setCupidon', (targetID) => {

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
            let cupidon = getPlayer(socket.id);

            if (cupidon.isPower) {
                cupidon.isPower = false;
                cupidon.isPlayed = true;

                let lover_one = getPlayer(hub.lover_one);
                let lover_two = getPlayer(hub.lover_two);

                lover_one.isCouple = true;
                lover_two.isCouple = true;

                sendMessage(null, lover_one.socket, "Vous venez de tomber amoureux de " + lover_two.name + ". Vous avez un chat à disposition pour parler avec l'être aimé.", false, false);
                sendMessage(null, lover_two.socket, "Vous venez de tomber amoureux de " + lover_one.name + ". Vous avez un chat à disposition pour parler avec l'être aimé.", false, false);

                actionInGame(socket.id, false);
            }
        }

        return room();
    })

    socket.on('setHair', (targetID) => {

        if (targetID === socket.id) {
            return sendMessage(null, socket.id, "Vous ne pouvez pas hériter de vous-même.", false, false);
        }

        const target = getPlayer(targetID);
        const player = getPlayer(socket.id);

        if (player.isPower) {

            player.isPower = false;
            target.isHair = true;

            actionInGame(socket.id, false);

            sendMessage(null, socket.id, "Vous recevrez les pouvoirs de " + target.name + " à sa mort.", false, false)
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

        hub.roles.splice(hub.roles.indexOf("Comédien"), 1);
        hub.roles.push(role.name);

        clearInterval(interval);

        io.to(actor.socket).emit('actionByRole', null);

        room();

        return stepNight();
    })

    socket.on('setPsychic', (targetID) => {
        const target = getPlayer(targetID);
        const player = getPlayer(socket.id);


        if (targetID === socket.id) {
            return sendMessage(null, player.socket, "Vous ne pouvez pas voir votre propre carte.", false, false);
        }

        player.isPlayed = true;

        sendMessage(null, player.socket, target.name + " est " + target.role.name + ".", false, false);

        return actionInGame(player.socket, false);
    })

    socket.on('setGuard', (targetID) => {
        const target = getPlayer(targetID);
        const player = getPlayer(socket.id);

        if (hub.protected === target.socket) {
            sendMessage(null, player.socket, "Vous ne pouvez pas protéger deux fois de suite la même personne !", false, false);
            return room();
        } else {
            hub.protected = target.socket;
            sendMessage(null, player.socket, "Vous avez protéger " + target.name + " des loups pour cette nuit.", false, false);
        }

        player.isPlayed = true;

        return actionInGame(player.socket, false);

    })

    socket.on('setDictator', (action) => {
        if (action) {
            hub.dictator = action;
        }

        getPlayer(socket.id).isPower = false;

        sendMessage(null, socket.id, action ? "Vous avez choisi de faire un coup d'état le prochain tour" : "Vous avez choisi de ne pas faire de coup d'état.", false, false);

        return socket.emit('actionByRole', null);
    })

    socket.on('setRaven', (targetID) => {
        let target = getPlayer(targetID);
        let player = getPlayer(socket.id);

        target.votes.push('Corbeau', 'Corbeau');

        hub.ravenSocket = target.socket;

        player.isPlayed = true;

        sendMessage(null, player.socket, target.name + " se réveillera avec deux votes en plus !", false, false);

        return actionInGame(player.socket, false);
    })

    socket.on('setFox', (targetID) => {
        let target = getPlayer(targetID);
        let player = getPlayer(socket.id);

        if (target.socket === player.socket) {
            return sendMessage(null, player.socket, "Vous connaissez déjà votre rôle...", false, false);
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
                sendMessage(null, player.socket, "Il y a un loup parmis ces personnes. Vous gardez vos pouvoirs.", false, false);
            } else {
                player.isPower = false;
                sendMessage(null, player.socket, "Il n'y a aucun loup parmis ces personnes. Vos pouvoirs vous quittent...", false, false);
            }

            player.isPlayed = true;

            return actionInGame(player.socket, false);
        }
    })

    socket.on('setWhiteWerewolf', (targetID) => {
        const target = getPlayer(targetID);

        hub.killsSockets.push(targetID);
        hub.kills.push(target.name + ' (' + target.role.name + ')');

        room();

        return actionInGame(player.socket, false);
    })

    socket.on('setBlackWerewolf', (bool) => {
        socket.emit('actionByRole', null)

        if (bool) {
            hub.infected = hub.voteWolf;
            hub.voteWolf = null;

            hub.kills.splice(0, 1);

            getPlayer(socket.id).isPower = false;
            sendMessage(null, hub.infected, "Vous avez été infecté par le loup noir !", false, false);
        }

        return room();
    })

    socket.on('setWitchChoice', (bool) => {

        socket.emit('actionByRole', null);

        if (bool) {
            hub.voteWolf = null;
            getPlayer(socket.id).healthPotion = false;
        } else {
            actionInGame(socket.id, true);
        }
    })

    socket.on('setWitch', (targetID) => {
        const target = getPlayer(targetID);
        const player = getPlayer(socket.id);

        player.deathPotion = false;

        hub.killsSockets.push(targetID);
        hub.kills.push(target.name + ' (' + target.role.name + ')');

        sendMessage(null, player.socket, "Vous avez décider de tuer " + target.name, false, false);

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

        return socket.emit('actionByRole', null);
    })

    socket.on('setDogWerewolf', bool => {
        let player = getPlayer(socket.id);

        socket.emit('actionByRole', null);

        hub.roles.splice(hub.roles.indexOf("Chien-loup"), 1);

        if (bool) {

            player.role = {
                name: "Loup-garou",
                name_function: "Werewolf",
                description: "Le loup-garou est un être mi-homme mi-loup qui se transforme la nuit pour tuer les villageois. Il se réunit chaque nuit avec les autres loups-garous pour décider de leur victime.",
                side: "méchant",
                step: "werewolf",
                descriptionInGame: "Vous pouvez manger un joueur ce soir !",
                max: 100,
                img: "card-werewolf.svg",
            }

            sendMessage(null, player.socket, "Vous avez fait le choix de devenir un loup garou.");
        } else {
            player.role = {
                name: "Villageois",
                name_function: "Villager",
                description: "Le villageois est un personnage qui incarne les habitants d\'un village. Son rôle est de découvrir l\'identité des loups-garous et de les éliminer avant qu\'ils ne tuent tous les villageois.",
                side: "village",
                step: null,
                descriptionInGame: null,
                max: 100,
                img: "card-villager.svg"
            }

            sendMessage(null, player.socket, "Vous avez fait le choix de rester un villageois.");
        }

        hub.roles.push(player.role.name);

        return room();
    })

    socket.on('setScapegoat', (targetID) => {
        actionInGame(socket.id, false);

        let target = getPlayer(targetID);

        target.isVote = false;

        sendMessage('server', null, target.name + " ne pourra pas voter le prochain tour.");

        return room();
    })

    socket.on('setFlute', (targetID) => {
        actionInGame(socket.id, false);

        let target = getPlayer(targetID);

        if (target.socket === socket.id) {
            return sendMessage(null, socket.id, "Vous ne pouvez pas vous charmer.");
        }

        if (target.isCharmed) {
            return sendMessage(null, socket.id, "Cette personne a déjà été charmé.");
        }

        target.isCharmed = true;

        sendMessage(null, socket.id, "Vous avez charmé " + target.name + " cette nuit.");

        return room();
    })

    socket.on('inGame', ready => {
        hub.inGame = ready;

        io.to(socket.room).emit('inGame', true);

        hub.night = true;
        hub.step = "start";

        sendMessage("server", null, "La nuit tombe sur le village...", false, false);

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
                sendMessage("server", null, "Le voleur décide du joueur à voler.", false, false);
                timeBySocket(30, thief);
                io.to(thief.socket).emit('actionByRole', { name: thief.role.name, descriptionInGame: thief.role.descriptionInGame, response: false })
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
                timeBySocket(30, actor);
                sendMessage("server", null, "Le comédien décide du rôle à jouer cette nuit.", false, false);
                return isActor(actor);
            }
        }

        return stepNight();
    })

    socket.on('addRole', role => {

        // if (role === "Renard" && hub.players.length < 4) {
        //     return;
        // }

        // if (role === "Deux soeurs" && hub.players.length < 4) {
        //     return;
        // }

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

    socket.on("setMessage", ({ msg, sister, lover }) => {
        return sendMessage(socket.name, null, msg, sister, lover);
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
            vote: null,
            votes: [],
            voteWolf: null,
            role: null,
            isVote: true,
            isDead: false,
            isTurn: false,
            isPower: true,
            isCouple: false,
            isSister: false,
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
            isVote: true,
            isDead: false,
            isTurn: false,
            isPower: true,
            isCouple: false,
            isSister: false,
            isCharmed: false,
            isHair: false,
            isActor: false,
            healthPotion: true,
            deathPotion: true
        }];
        hub.sockets = [socket.id];
        hub.roles = [];
        hub.votes = [''];
        hub.kills = [];
        hub.killsSockets = [];
        hub.event = null;
        hub.night = false;
        hub.voteWolf = null;
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
        hub.mercenaryTarget = null;
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

            sendMessage("server", null, socket.name + " vient de quitter la partie !", false, false);

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

            sendMessage("server", null, socket.name + " vient de quitter la partie !", false, false);

            return room();
        }
    })
})

server.listen(3001, () => {
    console.log("SERVER IS RUNNING");
});