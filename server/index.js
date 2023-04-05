const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const fs = require('fs');
const { log } = require('console');

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

let map = null;

function loadMap() {
    return new Promise((resolve, reject) => {
        tmx.parseFile('./assets/map1.tmx', function (err, loadedMap) {
            if (err) {
                reject(err);
            } else {
                resolve(loadedMap);
            }
        });
    });
}

const roles = [
    {
        name: "Villageois",
        name_function: "Villager",
        description: "Le villageois est un personnage qui incarne les habitants d\'un village. Son rôle est de découvrir l\'identité des loups-garous et de les éliminer avant qu\'ils ne tuent tous les villageois.",
        side: "village",
        step: null,
        descriptionInGame: null,
        max: 100,
        needVictim: false,
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
        needVictim: false,
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
        needVictim: false,
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
        needVictim: false,
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
    //     needVictim: false,
    //     img: "card-littleGirl.svg",
    // },
    {
        name: "Sorcière",
        name_function: "Witch",
        description: "La sorcière se réveille la nuit après tout le monde. Elle possède deux potions : une de vie et une de mort. Elle peut choisir de soigner la victime des loups garous. Elle peut également choisir de tuer une personne grâce à sa potion de mort. Elle ne peut utiliser qu'une seule fois chaque potion.",
        side: "village",
        step: "end",
        descriptionInGame: "Voulez-vous utiliser vos potions cette nuit ?",
        max: 1,
        needVictim: true,
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
        needVictim: false,
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
        needVictim: false,
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
        needVictim: false,
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
        needVictim: false,
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
        needVictim: false,
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
        needVictim: false,
        img: "card-flute.svg",
    },
    {
        name: "Garde",
        name_function: "Guard",
        description: "Chaque nuit, le garde protège une personne. Cette personne sera protégée et ne pourra donc pas mourir durant la nuit. Le garde ne peut pas protéger la même personne deux nuits de suite.",
        side: "village",
        step: "start",
        descriptionInGame: "Vous pouvez protéger un joueur. ",
        max: 1,
        needVictim: false,
        img: "card-gard.svg",
    },
    {
        name: "Corbeau",
        name_function: "Raven",
        description: "Le corbeau fait partie du village, il sera appelé chaque nuit et désignera une personne qui recevra deux votes de plus contre elle lors du vote de la journée suivante.",
        side: "village",
        step: "start",
        descriptionInGame: "Vous pouvez choisir un joueur qui se réveillera avec deux votes en plus.",
        max: 1,
        needVictim: false,
        img: "card-raven.svg",
    },
    {
        name: "Loup blanc",
        name_function: "WhiteWerewolf",
        description: "Le loup blanc se réveille la nuit avec les loups, mais son but est de gagner seul. Une nuit sur deux, il se réveille pour tuer une personne de son choix (loup ou villageois).",
        side: "seul",
        step: "middle",
        descriptionInGame: "Vous pouvez tuer un joueur de plus cette nuit.",
        max: 1,
        needVictim: false,
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
        needVictim: false,
        img: "card-angel.svg",
    },
    {
        name: "Chien-loup",
        name_function: "DogWerewolf",
        description: "La première nuit, il choisit d’être un villageois ou un Loup-garou.",
        side: "méchant",
        step: "start",
        descriptionInGame: "Voulez-vous être villageois ou loup-garou ?",
        max: 1,
        needVictim: false,
        img: "card-dogWolf.svg",
    },
    {
        name: "Comédien",
        name_function: "Actor",
        description: "Avant la partie. Chaque nuit, le comédien peut désigner un des rôles qui n'ont pas été choisi et utiliser le pouvoir correspondant jusqu’à la nuit suivante. Chaque rôle ne peut être utilisé qu'une seule fois et maximum 3 fois dans la partie.",
        side: "village",
        step: "start",
        descriptionInGame: "Vous pouvez choisir un rôle",
        max: 1,
        needVictim: false,
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
        needVictim: false,
        img: "card-sisters.svg",
    },
    {
        name: "Grand méchant loup",
        name_function: "BigBadWerewolf",
        description: "Son objectif est d'éliminer tout le village. Chaque nuit, il se réunit avec ses compères Loups pour décider d'une victime à éliminer... Tant qu'aucun autre loup n'est mort, il peut, chaque nuit, dévorer une victime supplémentaire.",
        side: "méchant",
        step: "middle",
        descriptionInGame: "vous pouvez tuez un villageois de plus cette nuit.",
        max: 1,
        needVictim: false,
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
        needVictim: false,
        img: "card-gypsy.svg",
    },
    {
        name: "Loup noir",
        name_function: "BlackWerewolf",
        description: "Chaque nuit après avoir joué avec les loups il peut décider d'infecter la victime. Elle devient alors Infectée et ne meurt pas. Il ne peut utiliser son pouvoir qu'une fois dans la partie.",
        side: "méchant",
        step: "middle",
        descriptionInGame: "Voulez-vous infecter la victime cette nuit ?",
        max: 1,
        needVictim: true,
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
    //     needVictim: false,
    //     img: "card-judge.svg",
    // },
    {
        name: "Renard",
        name_function: "Fox",
        description: "La première nuit, le renard flaire 3 joueurs. Si un loup garou est dans ce groupe, il pourra réutiliser son pouvoir la nuit suivante. Sinon, il devient villageois.",
        side: "village",
        step: "start",
        descriptionInGame: "Vous pouvez flairer 3 joueurs. Si aucun loup n'est dedans, vous perdez vos pouvoirs.",
        max: 1,
        needVictim: false,
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
    //     needVictim: false,
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
        needVictim: false,
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
        needVictim: false,
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
        needVictim: false,
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
        needVictim: false,
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
        needVictim: false,
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
        needVictim: false,
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
        description: "Tue un joueur au hasard."
    }
]

const TICK_RATE = 30;
const SPEED = 7;
const inputsMap = {};

io.on('connection', (socket) => {
    let hub = io.sockets.adapter.rooms.get(socket.room);
    let interval;

    // function tick() {
    //     if (hub && hub.players.length > 0) {
    //         for (const player of hub.players) {
    //             const inputs = inputsMap[player.socket];
    //             if (inputs.up) {
    //                 if (player.frameX > 0) {
    //                     player.frameX--
    //                 } else {
    //                     player.frameX = 7;
    //                 }

    //                 player.frameY = 1;
    //                 player.y -= SPEED;
    //             } else if (inputs.down) {
    //                 if (player.frameX < 7) {
    //                     player.frameX++
    //                 } else {
    //                     player.frameX = 0;
    //                 }

    //                 player.frameY = 0;
    //                 player.y += SPEED;
    //             }

    //             if (inputs.left) {
    //                 if (player.frameX > 0) {
    //                     player.frameX--
    //                 } else {
    //                     player.frameX = 7;
    //                 }

    //                 player.frameY = 1;
    //                 player.x -= SPEED;
    //             } else if (inputs.right) {
    //                 if (player.frameX < 7) {
    //                     player.frameX++
    //                 } else {
    //                     player.frameX = 0;
    //                 }

    //                 player.frameY = 0;
    //                 player.x += SPEED;
    //             } else if (!inputs.right && !inputs.left && !inputs.up && !inputs.down) {
    //                 player.frameX = 0;
    //             }
    //         }


    //         return room();
    //     }
    // }

    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

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

    function getRandomPlayer() {
        const index = Math.floor(Math.random() * hub.players.length);

        return hub.players[index];
    }

    function getRandomRole(nb) {
        let hiddenRole = [];

        roles.forEach((role) => {
            if (!hub.roles.includes(role) && role.descriptionInGame && role.side === "village") {
                if (role.name !== "Voleur" && role.name !== "Comédien" && role.name !== "L'Héritier") {
                    hiddenRole.push(role)
                }
            }
        })

        let choiceRole = []

        for (let i = 0; i < nb; i++) {
            let index = Math.floor(Math.random() * hiddenRole.length);

            while (hub.roleActor.includes(hiddenRole[index]) === true) {
                index = Math.floor(Math.random() * hiddenRole.length);
            }

            choiceRole.push(hiddenRole[index]);

            hiddenRole.splice(index, 1);
        }

        return choiceRole;
    }

    function room() {
        return io.to(socket.room).emit('getRoom', hub);
    }

    function actionInGame(socketID, bool) {
        return io.to(socketID).emit('action', bool);
    }

    function boxRole(socketID, box) {
        return io.to(socketID).emit('boxRole', box);
    }

    function setIsTurn(bool) {
        hub.players.forEach((player) => {
            player.isTurn = bool;
        })

        return room();
    }

    function navigate(id) {
        return io.to(socket.id).emit('navigate', id);
    }

    function clearIntervals() {
        return io.to(socket.room).emit('clearIntervals');
    }

    function sendMessage(type, recipient, msg) {
        hub.messages.push({
            socket: socket.id,
            author: getPlayer(socket.id).name,
            type: type,
            recipient: recipient,
            msg: msg,
            isDead: getPlayer(socket.id).isDead,
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
        boxRole(socket.room, null);
        setIsTurn(false);

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
                        if (!player.isDead && player.isPower) {
                            check = true;
                            player.isTurn = true;

                            let data = {
                                description: player.role.descriptionInGame,
                                victim: player.role.needVictim && hub.voteWolf ? getPlayer(hub.voteWolf).name : null
                            }

                            if (player.role.name === "Sorcière") {
                                data['health'] = hub.healthPotion && hub.voteWolf ? true : false;
                                data['death'] = hub.deathPotion ? true : false;
                            };

                            if (player.role.name === "Dictateur" || player.role.name === "Loup noir") {
                                data['setYes'] = "Oui";
                                data['setNo'] = "Non";
                            }

                            if (player.role.name === "Gitane") {
                                data['eventsGypsy'] = eventsGypsy;
                            }

                            if (player.role.name === "Chien-loup") {
                                data['setYes'] = "Loup-garou";
                                data['setNo'] = "Villageois";
                            }

                            if (player.role.name === "Comédien") {
                                data['actor'] = getRandomRole(3);
                            }

                            boxRole(player.socket, data);
                            sendMessage("server", null, player.role.name + " : utilisation de ses pouvoirs.");
                        }
                    }
                }
            })
        } else {
            sendMessage("server", null, "Les loups garou se réveillent...");

            hub.sockets.forEach((socket) => {
                let player = getPlayer(socket);

                if (!player.isDead) {
                    if (player.role.side === "méchant" || player.isInfected || player.role.name === "Loup blanc") {
                        check = true;
                        player.isTurn = true;
    
                        let data = {
                            description: "Vous pouvez tuer un joueur.",
                            role: player.role.name,
                        }
    
                        boxRole(player.socket, data);
                    }
                }
            });
        }

        room();

        if (check) {
            return time(10);
        } else {
            hub.step = order();
            return stepNight();
        }
    }

    function triggerEvent() {
        let target = getRandomPlayer;

        if (hub.event.name === "Résurrection aveugle") {

            while (target.isDead === false) {
                target = getRandomPlayer;
            }

            target.isDead = false;

            sendMessage("server", null, "Evènement : un joueur a été réanimé.");

        } else if (hub.event.name === "Punition aveugle") {

            while (target.isDead === true) {
                target = getRandomPlayer;
            }

            target.isDead = true;

            sendMessage("server", null, "Evènement : un joueur a été tué.");
        }

        hub.event = null;

        room();

        return sendMessage("server", null, "l'évènement a été déclenché avec succès.");
    }

    function day() {
        if (hub.nbTurn === 1) {
            if (hub.roles.includes("Mercenaire")) {
                let mercenary = getPlayerByRole("Mercenaire");

                let socketTarget = null;

                while (socketTarget === null || socketTarget === mercenary.socket) {
                    socketTarget = hub.sockets[Math.floor(Math.random() * hub.sockets.length)];
                }

                let target = getPlayer(socketTarget);
                hub.mercenaryTarget = target.socket;

                sendMessage('role', mercenary.socket, "Votre cible est " + target.name + ". Si vous parvenez à l'éliminer ce jour-ci, vous gagnez la partie.");
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
            sendMessage("server", null, "La gitane a décidé d'utiliser l'évènement " + hub.event.name + ". Il sera déclencher en fin de journée.");
        }

        if (hub.ravenSocket) {
            sendMessage("server", null, getPlayer(hub.ravenSocket).name + " a reçu la visite du corbeau cette nuit, il a deux votes en plus pour cette journée.");
            hub.ravenSocket = null;
        }

        let kills = Object.keys(hub.kills);
        let str = "";

        if (kills.length > 0) {

            kills.forEach(socket => {
                let player = getPlayer(socket);
                player.isDead = true;

                str += "Le jour se lève sans " + player.name + " (" + player.role.name + "). ";
            })
            
            sendMessage("server", null, str);

            if (hub.roles.includes("Chasseur")) {
                if (kills.includes(getPlayerByRole("Chasseur").socket)) {
                    let hunter = getPlayerByRole('Chasseur');

                    sendMessage("server", null, "Le chasseur est mort, il peut tuer quelqu'un avant de mourir.");
                    timeBySocket(30, hunter);
                    return boxRole(hunter.socket, {
                        description: hunter.role.descriptionInGame
                    });
                }
            }

            if (hub.roles.includes("Fossoyeur")) {
                if (kills.includes(getPlayerByRole('Fossoyeur').socket)) {
                    let gravedigger = getPlayerByRole("Fossoyeur");

                    sendMessage("server", null, "Le fossyeur est mort, sa mort lui permet d'activer son pouvoir.");
                    timeBySocket(30, gravedigger);
                    return boxRole(gravedigger.socket, {
                        description: gravedigger.descriptionInGame
                    });
                }
            }

        } else {
            sendMessage("server", null, "Le jour se lève et personne n'est mort cette nuit !");
        }

        // reset des votes
        hub.players.forEach((player) => {
            player.vote = null;
            player.votes = [];
        });

        hub.night = false;

        if (hub.nbTurn === 2) {
            sendMessage("server", null, "Election du maire !");
        }

        //time(120);

        boxRole(socket.room, { description: 'Vous pouvez voter pour exclure un joueur.' });

        time(10);

        return room();
    }

    function resetTurn() {
        hub.night = true;
        hub.nbTurn++;

        hub.players.forEach((player) => {
            if (player.role.name !== "Idiot du village") {
                player.isVote = true;
            }

            if (player.role.name === "Loup blanc") {
                if (hub.nbTurn % 2 === 0) {
                    player.isPower = true;
                } else {
                    player.isPower = false;
                }
            }

            if (player.role.name === "Grand méchant loup") {
                checkWolf = hub.players.find((player) => {
                    return player.isDead && player.role.side === "méchant"
                });

                if (checkWolf) {
                    player.isPower = false;
                }
            }

            if (player.isActor) {
                hub.roles.splice(hub.roles.indexOf(player.role), 1);

                player.isActor = false;
                player.role = {
                    name: "Comédien",
                    name_function: "Actor",
                    description: "Avant la partie. Chaque nuit, le comédien peut désigner un des rôles qui n'ont pas été choisi et utiliser le pouvoir correspondant jusqu’à la nuit suivante. Chaque rôle ne peut être utilisé qu'une seule fois et maximum 3 fois dans la partie.",
                    side: "village",
                    step: null,
                    descriptionInGame: "Vous pouvez choisir un rôle",
                    max: 1,
                    needVictim: false,
                    img: "card-actor.svg",
                }

                hub.roles.push(player.role.name);
            }
        })

        hub.votes = [''];
        hub.kills = {};
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
                        needVictim: false,
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
                sendMessage("server", null, "Le village a décidé d'exclure " + target.name + " qui était " + target.role.name);
                target.isDead = true;
                hub.roles.splice(hub.roles.indexOf(target.role.name), 1);
            } else {
                sendMessage("server", null, "Le village a décidé d'exclure " + target.name + " (" + target.role.name + "). Le village a pitié de lui et décide de le laisser en vie, mais en échange il perd son droit de vote.");
                target.isVote = false;
            }


            if (target.isHair) {
                let player = getPlayerByRole("L'Héritier");

                player.role = target.role;
                player.isPower = target.isPower;

                hub.roles.splice(hub.roles.indexOf("L'Héritier"), 1);
                hub.roles.push(target.role.name);

                sendMessage("role", player.socket, "Votre héritier est mort, vous héritez de ses pouvoirs et du rôle de " + target.role.name + ".");
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

                sendMessage("server", null, "Le village n'a pas réussi à se départager. Par dépit, le village décide de se tourner vers " + player.name + " qui est bouc émissaire. Il peut choisir une personne qui ne pourra pas voter au prochain tour.");
                actionInGame(player.socket, true);

                hub.step = order();

                return timeBySocket(30, player);
            } else {
                sendMessage("server", null, "Personne n'a été exclu du village.");
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
                    if (player.voteWolf !== null) {
                        votes.push(player.voteWolf);
                        player.voteWolf = null;
                    }
                }
            }
        })

        let playerKilled = null;
        let count = 0;

        if (votes.length > 0) {
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
    
                hub.kills[kill.socket] = {
                    name: kill.name,
                    role: kill.role.name,
                    killBy: "wolf"
                };
            };
        }

        room();

        return stepNight();
    }

    // function isActor(actor) {
    //     if (hub.roleActor.length < 3) {

    //         let hiddenRole = [];

    //         roles.forEach((role) => {
    //             if (!hub.roles.includes(role) && role.descriptionInGame && role.side === "village") {
    //                 if (role.name !== "Voleur" && role.name !== "Comédien" && role.name !== "L'Héritier") {
    //                     hiddenRole.push(role)
    //                 }
    //             }
    //         })

    //         let choiceRole = []

    //         for (let i = 0; i < 3; i++) {
    //             let index = Math.floor(Math.random() * hiddenRole.length);

    //             while (hub.roleActor.includes(hiddenRole[index]) === true) {
    //                 index = Math.floor(Math.random() * hiddenRole.length);
    //             }

    //             choiceRole.push(hiddenRole[index]);

    //             hiddenRole.splice(index, 1);
    //         }

    //         return boxRole(socket.id, {
    //             description: actor.role.descriptionInGame + " (" + hub.roleActor.length + "/3)",
    //             actor: choiceRole
    //         });
    //     } else {
    //         return actor.isPower = false;
    //     }
    // }

    socket.on('clearIntervals', () => {
        clearInterval(interval);
        console.log("clear des intervals : " + socket.id);
    })

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
            sendMessage("vote", null, villager.name + " a voté pour " + target.name + " !");
        };

    })

    socket.on('voteWolf', (targetID) => {
        const target = getPlayer(targetID);
        const wolf = getPlayer(socket.id);

        if (wolf.voteWolf == target.socket) {
            wolf.voteWolf = null;
            sendMessage("vote", wolf.socket, "Vote retiré");
        } else {
            wolf.voteWolf = target.socket;
            sendMessage("vote", wolf.socket, target.name);
        }

        return room();
    });

    // function Role
    socket.on('setThief', (targetID) => {
        if (targetID === socket.id) {
            return sendMessage("role", socket.id, "Vous ne pouvez pas voler votre carte.");
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
            needVictim: false,
            img: "card-villager.svg"
        };

        hub.roles.push("Villageois");

        sendMessage("role", target.socket, "Vous vous êtes fait voler votre carte. Vous devenez villageois.");
        sendMessage("role", socket.id, "Vous avez volé la carte de " + target.name + ". Il était " + player.role.name + ".")

        clearInterval(interval);

        room();
        
        return stepNight();

    })

    socket.on('setHunter', (targetID) => {
        let target = getPlayer(targetID);
        let player = getPlayer(socket.id);

        player.isPower = false;
        target.isDead = true;

        sendMessage('server', null, "Le chasseur a tiré sur " + target.name + " qui était " + target.role.name + ".");

        clearIntervals();

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

                let lover_one = getPlayer(hub.lover_one);
                let lover_two = getPlayer(hub.lover_two);

                lover_one.isCouple = true;
                lover_two.isCouple = true;

                sendMessage("love", lover_one.socket, "Vous venez de tomber amoureux de " + lover_two.name + ". Vous avez un chat à disposition pour parler avec l'être aimé.");
                sendMessage("love", lover_two.socket, "Vous venez de tomber amoureux de " + lover_one.name + ". Vous avez un chat à disposition pour parler avec l'être aimé.");

                actionInGame(socket.id, false);
            }
        }

        return room();
    })

    socket.on('setHair', (targetID) => {

        if (targetID === socket.id) {
            return sendMessage("role", socket.id, "Vous ne pouvez pas hériter de vous-même.");
        }

        const target = getPlayer(targetID);
        const player = getPlayer(socket.id);

        if (player.isPower) {

            player.isPower = false;
            target.isHair = true;

            actionInGame(socket.id, false);

            sendMessage("role", socket.id, "Vous recevrez les pouvoirs de " + target.name + " à sa mort.")
        }

        return room();
    })

    socket.on('setActor', (role) => {
        const actor = getPlayer(socket.id);


        actor.isActor = true;
        actor.role = role;

        // if (hub.roles.includes("Dictateur")) {
        //     socket.emit('dictator', true);
        // }

        hub.roles.splice(hub.roles.indexOf("Comédien"), 1);
        hub.roles.push(role.name);
        hub.roleActor.push(role);

        //clearInterval(interval);

        // ne pas fermer la boxRole si le role.step = "start"

        if (hub.roleActor.length === 3) {
            actor.isPower = false;
        }

        if (actor.role.step === "start") {
            let data = {
                description: actor.role.descriptionInGame
            }

            if (actor.role.name === "Dictateur") {
                data['setYes'] = "Oui";
                data['setNo'] = "Non";
            }

            if (actor.role.name === "Gitane") {
                data['eventsGypsy'] = eventsGypsy;
            }

            if (actor.role.name === "Chien-loup") {
                data['setYes'] = "Loup-garou";
                data['setNo'] = "Villageois";
            }

            boxRole(actor.socket, data);
        }

        return room();

        //return stepNight();
    })

    socket.on('setPsychic', (targetID) => {
        const target = getPlayer(targetID);
        const player = getPlayer(socket.id);


        if (targetID === socket.id) {
            return sendMessage("role", player.socket, "Vous ne pouvez pas voir votre propre carte.");
        }

        sendMessage("role", player.socket, target.name + " est " + target.role.name + ".");

        return actionInGame(player.socket, false);
    })

    socket.on('setGuard', (targetID) => {
        const target = getPlayer(targetID);
        const player = getPlayer(socket.id);

        if (hub.protected === target.socket) {
            sendMessage("role", player.socket, "Vous ne pouvez pas protéger deux fois de suite la même personne !");
            return room();
        } else {
            hub.protected = target.socket;
            sendMessage("role", player.socket, "Vous avez protéger " + target.name + " des loups pour cette nuit.");
        }

        return actionInGame(player.socket, false);

    })

    socket.on('setDictator', (action) => {
        if (action) {
            hub.dictator = action;
            getPlayer(socket.id).isPower = false;
        }

        sendMessage("role", socket.id, action ? "Vous avez choisi de faire un coup d'état le prochain tour" : "Vous avez choisi de ne pas faire de coup d'état.");

        return socket.emit('actionByRole', null);
    })

    socket.on('setRaven', (targetID) => {
        let target = getPlayer(targetID);

        target.votes.push('Corbeau', 'Corbeau');

        hub.ravenSocket = target.socket;

        sendMessage(null, socket.id, target.name + " se réveillera avec deux votes en plus !");

        return actionInGame(socket.id, false);
    })

    socket.on('setFox', (targetID) => {
        let target = getPlayer(targetID);
        let player = getPlayer(socket.id);

        if (target.socket === player.socket) {
            return sendMessage("role", player.socket, "Vous connaissez déjà votre rôle...");
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
            let isWolf = false;

            player.roleFox.forEach((r) => {
                if (r.side === "méchant") {
                    isWolf = true;
                }
            })

            if (isWolf) {
                player.socketFox = [];
                player.roleFox = [];
                sendMessage("role", player.socket, "Il y a un loup parmis ces personnes. Vous gardez vos pouvoirs.");
            } else {
                player.isPower = false;
                sendMessage("role", player.socket, "Il n'y a aucun loup parmis ces personnes. Vos pouvoirs vous quittent...");
            }

            return actionInGame(player.socket, false);
        }
    })

    socket.on('setWhiteWerewolf', (targetID) => {
        const target = getPlayer(targetID);

        hub.kills[target.socket] = {
            name: target.name,
            role: target.role.name,
            killBy: "whiteWerewolf"
        };

        room();

        return actionInGame(socket.id, false);
    })

    socket.on('setBlackWerewolf', (bool) => {
        if (bool) {
            hub.infected = hub.voteWolf;
            hub.voteWolf = null;

            hub.kills.splice(0, 1);

            getPlayer(socket.id).isPower = false;
            sendMessage("role", hub.infected, "Vous avez été infecté par le loup noir !");
        }

        return room();
    })

    socket.on('setWitchChoice', (bool) => {
        if (bool) {
            delete hub.kills[hub.voteWolf];

            console.log(hub.kills);
            
            hub.voteWolf = null;
            hub.healthPotion = false;
        } else {
            getPlayer(socket.id).isTurn = true;
            boxRole(socket.id, { description: "Vous pouvez tuer quelqu'un.", victim: null })
        }

        if (!hub.healthPotion && !hub.deathPotion) {
            getPlayer(socket.id).isPower = false;
        }

        return room();
    })

    socket.on('setWitch', (targetID) => {
        const target = getPlayer(targetID);

        hub.deathPotion = false;
        hub.kills[target.socket] = {
            name: target.name,
            role: target.name.role,
            killBy: "witch"
        }

        sendMessage("role", socket.id, "Vous avez décider de tuer " + target.name + " avec votre potion.");

        room();

        return actionInGame(socket.id, false);
    })

    socket.on('setGypsy', (choice) => {
        const player = getPlayer(socket.id);

        player.isPower = false;

        hub.event = eventsGypsy.find((event) => {
            return event.name === choice
        })

        sendMessage(
            null,
            socket.id,
            "Vous achez choisi de déclencher l'évènement : " + choice,
            false,
            false
        )

        return room();
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
                needVictim: false,
                img: "card-werewolf.svg",
            }

            sendMessage("role", player.socket, "Vous avez fait le choix de devenir un loup garou.");
        } else {
            player.role = {
                name: "Villageois",
                name_function: "Villager",
                description: "Le villageois est un personnage qui incarne les habitants d\'un village. Son rôle est de découvrir l\'identité des loups-garous et de les éliminer avant qu\'ils ne tuent tous les villageois.",
                side: "village",
                step: null,
                descriptionInGame: null,
                max: 100,
                needVictim: false,
                img: "card-villager.svg"
            }

            sendMessage("role", player.socket, "Vous avez fait le choix de rester un villageois.");
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
            return sendMessage("role", socket.id, "Vous ne pouvez pas vous charmer.");
        }

        if (target.isCharmed) {
            return sendMessage("role", socket.id, "Cette personne a déjà été charmé.");
        }

        target.isCharmed = true;

        sendMessage("role", socket.id, "Vous avez charmé " + target.name + " cette nuit.");

        return room();
    })

    socket.on('setGravedigger', targetID => {
        actionInGame(socket.id, false);

        let target = getPlayer(targetID);

        let randomPlayer = getRandomPlayer();

        while (randomPlayer.isDead === false && randomPlayer.socket === socket.id && randomPlayer.socket === target.socket && randomPlayer.role.side === target.role.side) {
            randomPlayer = getRandomPlayer();
        }

        room()

        return sendMessage("server", null, "Un loup se cache parmis " + target.name + " et " + randomPlayer.name);
    })

    socket.on('inGame', ready => {
        hub.inGame = ready;

        io.to(socket.room).emit('inGame', true);

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

        if (hub.roles.includes("Deux soeurs")) {
            hub.sockets.forEach(player => {
                if (getPlayer(player).role.name === "Deux soeurs") {
                    getPlayer(player).isSister = true;
                }
            })
        }

        resetTurn();

        room();


        if (hub.roles.includes("Voleur")) {
            const thief = getPlayerByRole("Voleur")

            if (thief) {
                sendMessage("server", null, "Le voleur décide du joueur à voler.");
                timeBySocket(30, thief);
                io.to(thief.socket).emit('actionByRole', { name: thief.role.name, descriptionInGame: thief.role.descriptionInGame, response: false })
                return actionInGame(thief.socket, true);
            }
        }

        return stepNight();
    })

    socket.on('addRole', role => {

        // if (role === "Renard" && hub.players.length < 4) {
        //     return;
        // }

        // if (role === "Deux soeurs" && hub.players.length < 2) {
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
                hub.roles = hub.roles.concat(['Deux soeurs', 'Deux soeurs']);
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

    socket.on('setMap', () => {
        loadMap().then((map) => {

            const layer = map.layer[0];
            const tiles = layer.tiles;

            const map2D = new Array(map.height).fill('').map(() => new Array(map.height));

            //console.log(map2D);
            //socket.emit('setMap', map);
        }).catch((err) => {
            console.error(err);
        });
    })

    socket.on("setMessage", ({ msg, type }) => sendMessage(type, null, msg));

    socket.on('getRoles', () => io.to(socket.id).emit('getRoles', roles));

    socket.on('getRoom', () => io.to(socket.id).emit('getRoom', hub));

    socket.on('join', ({ id, pseudo }) => {

        if (!io.sockets.adapter.rooms.get(id)) {
            return socket.emit('alert', 'Ce lobby n\'existe pas !');
        }

        if (io.sockets.adapter.rooms.get(id).inGame) {
            return socket.emit('alert', 'La partie a déjà démarré !');
        }

        const player = {
            name: pseudo,
            socket: socket.id,
            x: getRandomNumber(500, 700),
            y: getRandomNumber(400, 600),
            frameX: 0,
            frameY: 0,
            vote: null,
            votes: [],
            voteWolf: null,
            role: null,
            isMayor: false,
            isVote: true,
            isDead: false,
            isTurn: false,
            isPower: true,
            isCouple: false,
            isSister: false,
            isCharmed: false,
            isHair: false,
            isActor: false,
        }

        inputsMap[socket.id] = {
            up: false,
            down: false,
            left: false,
            right: false
        }

        hub = io.sockets.adapter.rooms.get(id);
        hub.players.push(player);
        hub.sockets.push(socket.id);
        hub.votes.push('');
        socket.name = pseudo;
        socket.room = id;
        socket.join(id);

        sendMessage('join', null, pseudo.toLowerCase() === "xprolive" || pseudo.toLowerCase() === "prolive" | pseudo.toLowerCase() === "alexis" ? pseudo + " vient d'arriver dans la partie ! (il sera loup-garou à la prochaine partie)" : pseudo + " vient d'arriver dans la partie !");

        io.to(socket.room).emit('getRoom', hub);
        room();
        return navigate(id);
    })

    socket.on('setRoom', ({ id, pseudo }) => {
        socket.name = pseudo
        socket.room = id;
        socket.join(id);

        // inputsMap[socket.id] = {
        //     up: false,
        //     down: false,
        //     left: false,
        //     right: false
        // }

        hub = io.sockets.adapter.rooms.get(id);

        hub.private = true;
        hub.author = socket.id;
        hub.players = [{
            name: pseudo,
            socket: socket.id,
            x: getRandomNumber(500, 1200),
            y: getRandomNumber(400, 600),
            frameX: 0,
            frameY: 0,
            vote: null,
            votes: [],
            voteWolf: null,
            role: null,
            isMayor: false,
            isVote: true,
            isDead: false,
            isTurn: false,
            isPower: true,
            isCouple: false,
            isSister: false,
            isCharmed: false,
            isHair: false,
            isActor: false,
        }];
        hub.sockets = [socket.id];
        hub.roles = [];
        hub.votes = [''];
        hub.kills = {};
        hub.event = null;
        hub.healthPotion = true;
        hub.deathPotion = true;
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

    socket.on('inputs', inputs => {
        inputsMap[socket.id] = inputs;
    })

    socket.on('clear', () => {
        if (hub) {
            hub.sockets.splice(hub.sockets.indexOf(socket.id), 1);

            hub.players.forEach((player, index) => {
                if (player.socket === socket.id) {
                    hub.players.splice(index, 1);
                    hub.votes.splice(index, 1);
                    socket.leave(room);
                }
            })

            return room();
        }

        hub = null;
    })

    socket.on('disconnect', () => {
        if (hub) {
            hub.sockets.splice(hub.sockets.indexOf(socket.id), 1);

            hub.players.forEach((player, index) => {
                if (player.socket === socket.id) {
                    hub.players.splice(index, 1);
                    hub.votes.splice(index, 1);
                    socket.leave(room);
                }
            })

            return room();
        }

        hub = null;
    })

    //setInterval(tick, 1000 / TICK_RATE);
})

server.listen(3001, () => {
    console.log("SERVER IS RUNNING");
});