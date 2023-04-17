const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const fs = require('fs');

app.use(cors());

// const server = https.createServer({
//     key: fs.readFileSync("/etc/letsencrypt/live/moonrise-game.fr/privkey.pem"),
//     cert: fs.readFileSync("/etc/letsencrypt/live/moonrise-game.fr/cert.pem"),
// }, app);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "https://localhost:3000",
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
        descriptionInGame: "Vous êtes mort, vous pouvez tirer sur un joueur.",
        max: 1,
        needVictim: false,
        img: "card-hunter.svg",
    },
    {
        name: "Cupidon",
        name_function: "Cupidon",
        description: "Cupidon est appelé uniquement la première nuit afin d'unir un couple. Il désigne deux noms parmi les joueurs, ces deux joueurs seront Le couple. Si un des deux meurt l'autre meurt avec son amant. Ils peuvent se concerter en silence",
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
        description: "La sorcière se réveille la nuit. Elle possède deux potions : une de vie et une de mort. Elle peut choisir de soigner la victime des loups garous. Elle peut également choisir de tuer une personne grâce à sa potion de mort. Elle ne peut utiliser qu'une seule fois chaque potion.",
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
        descriptionInGame: "Vous pouvez voler la carte d'un joueur et prendre son rôle. La personne volée deviendra villageois.",
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
        description: "L’ancien possède deux vies durant la nuit. La première fois qu'il doit mourir, il en perd une. Le matin, il se réveille avec les autres, mais dévoile son rôle (la seconde fois qu’il est attaqué par les loups garous alors il meurt normalement). Si l’ancien est chassé du village par le vote des villageois il meurt directement et tous les rôles des villageois perdent leurs pouvoirs.",
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
        descriptionInGame: "Cible une personne qui ne pourra pas voter au prochain tour.",
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
        descriptionInGame: "Vous pouvez charmer un joueur.",
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
        descriptionInGame: "Vous pouvez protéger un joueur.",
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
        side: "village",
        step: "start",
        descriptionInGame: "Voulez-vous être villageois ou loup-garou ?",
        max: 1,
        needVictim: false,
        img: "card-dogWolf.svg",
    },
    {
        name: "Comédien",
        name_function: "Actor",
        description: "Chaque nuit, le comédien peut désigner un des rôles qui n'ont pas été choisi et utiliser le pouvoir correspondant jusqu’à la nuit suivante. Chaque rôle ne peut être utilisé qu'une seule fois et maximum 3 fois dans la partie.",
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
        description: "Leur objectif est d'éliminer tous les autres joueurs. Au début de la partie elles connaissent donc leur identité, et peuvent donc avoir confiance en elles. Elles peuvent se concerter en silence.",
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
        description: "Pendant la nuit, elle décide si elle veut déclencher un évènement pour le jour suivant. Le pouvoir n'est activable qu'une fois dans la partie",
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
        descriptionInGame: "Désignez un testataire qui vous léguera son rôle à sa mort",
        max: 1,
        needVictim: false,
        img: "card-hair.svg",
    },
    {
        name: "Mentaliste",
        name_function: "Mental",
        description: "Son objectif est de vaincre les Loups-Garous. Il peut percevoir l'issue du vote du village. 30 secondes avant la fin des votes, le Mentaliste reçoit un message lui indiquant si le vote se porte bien ou mal.",
        side: "village",
        step: null,
        descriptionInGame: null,
        max: 1,
        needVictim: false,
        img: "card-mental.svg",
    },
    {
        name: "L'Horloger",
        name_function: "Time",
        description: "Son objectif est de vaincre les Loups-garou. Pendant le vote du village, l'Horloger a le pouvoir de modifier la durée du temps imparti pour les discussions. Il peut réduire ou augmenter la durée du temps de débat. Ce pouvoir ne peut être utilisé qu'une fois par partie (crée par Myou).",
        side: "village",
        step: null,
        descriptionInGame: "Souhaitez-vous accélérer le temps de délibération du village ou le ralentir ?",
        max: 1,
        needVictim: false,
        img: "card-time.svg"
    }
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

const randomEvents = [
    {
        title: "Le guerriseur",
        description: "Un étranger arrive, affirmant qu'il peut guérir toutes les maladies grâce à une potion mystérieuse qu'il a préparée. Les villageois sont d'abord méfiants, mais quand ils voient qu'il a réussi à guérir une personne gravement malade en peu de temps, ils commencent à se demander si ce n'est pas une mauvaise idée de lui acheter.",
        responseYes: "Lui acheter ses potions",
        responseNo: "Lui dire de passer son chemin à ce SDF. (Vous êtes pas cool sérieux)",
        messageYes: "Le village décide de lui acheter plusieurs potion. Cependant ils s'aperçoivent que les potions utilisées étaient des fausses et qu'il a utilisé un complice. Peu à peu tous les villageois tombent malade et la sorcière est obligé d'utiliser toutes ses fioles pour aider les villageois. (La sorcière perd toutes ses potions)",
        messageNo: "Le village décide de se méfier de l'étranger. En regardant dans la roulotte de l'étranger, ils voient un inconnu ligoté. Le village décide de chasser l'étranger et d'aider l'homme ligoté. C'était l'ancien sorcier d'un village. En récompense il donne au village plusieurs ingrédients. (La sorcière récupère toutes ses potions)",
        function: function(hub, choice) {
            if (choice) {
                hub.deathPotion = false;
                hub.healthPotion = false;
            } else {
                hub.deathPotion = true;
                hub.healthPotion = true;
            }

            return hub;
        }
    },
    // {
    //     title: "Les voyageurs",
    //     description: "une troupe de voyageurs arrive au village. Ils sont riches et bien habillés, et offrent au village une grande quantité d'argent pour les héberger pendant leur séjour.",
    //     responseYes: "Les héberger pendant quelques jours",
    //     responseNo: "Refuser leur proposition et les chasser du village",
    //     messageYes: "Le village décide d'héberger la troupe de voyageur pendant quelques jours. Après quelques jours à sympathiser et rigoler avec eux, les villageois remarquent leur absence un beau matin. Ils apprennent plus tard que c'était une bonne de voleur connu qui jouait de leurs charmes pour dévaliser les villages.",
    //     messageNo: "Peu de temps avant leur venu, les gardes avaient averti le village qu'un groupe d'escorcs était dans les parages. En comprenant que c'était bien eux, ils appelairent les gardes.",
    //     function: function(hub, choice) {
    //         if (choice) {
    //             // mauvais choix
    //         } else {
    //             // bon choix
    //         }

    //         return hub;
    //     }
    // },
    // {
    //     title: "La vagabonde",
    //     description: "Un jour, une belle jeune femme arrive au village. Elle est enceinte et cherche un endroit pour se reposer et se nourrir.",
    //     responseYes: "L'accueillir au sein du village pendant quelques temps",
    //     responseNo: "La refuser, et lui demander de partir sur le champ",
    //     messageYes: "Le village décide de l'accueillir au sein du village pour lui permettre de se reposer. elle y reste quelques jours et aide le village et ses membres à se développer. A son départ, il utilise une magie ancienne qui permet au village de recouvrir ses pouvoirs perdus (Tous les membres du village recouvre leurs pouvoirs pour le tour suivant)",
    //     messageNo: "Le village décide de ne pas accéder à sa requête et lui demande de partir. Peu avant son départ, elle marmonne des mots obscurs. Quelques jours plus tard, l'entièreté du village ne se sens pas bien et comprend que la femme leur a lancé un sort. (Tous les membres du village perdent leurs pouvoirs pour le tour suivant)",
    //     function: function(hub, choice) {
    //         if (choice) {
    //             // bon choix
    //         } else {
    //             // mauvais choix
    //         }

    //         return hub;
    //     }
    // }
]

const TICK_RATE = 30;
const SPEED = 7;
const inputsMap = {};

let interval;

io.on('connection', (socket) => {
    let hub = io.sockets.adapter.rooms.get(socket.room);

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

    function getMyLover(name) {
        const lover = hub.players.find((player) => {
            return player.isCouple && player.name !== name;
        })

        return lover;
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

    function getSideTarget() {
        let target = null;
        let side = null;
        let count = null;

        hub.players.forEach((player) => {
            if (!player.isDead) {
                if (player.votes.length > count) {
                    target = player;
                    side = player.role.side
                    count = player.votes.length;
                }
            }
            player.isTurn = false;
        });

        let equality = false;

        hub.players.forEach((player) => {
            if (player !== target) {
                if (count === player.votes.length && player.votes.length > 0) {
                    equality = true;
                };
            }
        });

        if (equality) {
            return null;
        } else {
            return side;
        }
    }

    function room() {
        return io.to(socket.room).emit('getRoom', hub);
    }

    function boxRole(socketID, box) {
        return io.to(socketID).emit('boxRole', box);
    }

    function setIsTurnRoom(bool) {
        hub.players.forEach((player) => {
            if (!player.isDead) {
                player.isTurn = bool;
            } else {
                player.isTurn = false;
            }
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
        let player = getPlayer(socket.id)

        hub.messages.push({
            socket: socket.id,
            author: type === "chat" ? player.name : null,
            type: type,
            recipient: recipient,
            msg: msg,
            isDead: type === "chat" ? player.isDead : null,
        })

        return room();
    }

    function finishedByMercenary(mercenary) {
        hub.step = "overview";

        return sendMessage("server", null, "Le joueur expulsé était la cible de " + mercenary.name + " qui était Mercenaire. Il gagne la partie.");
    }

    function finishedByAngel(angel) {
        hub.step = "overview";

        return sendMessage("server", null, angel.name + " était l'Ange. Il gagne la partie.");
    }

    function finishedBySide() {
        let playerAlive = [];
        let check = false;

        hub.players.forEach(player => {
            if (!player.isDead) {
                playerAlive.push(player);
            }
        })

        if (playerAlive.length === 2) {
            if (playerAlive[0].isCouple && playerAlive[1].isCouple) {
                hub.step = "overview";
                hub.winner = "lovers";
                room();
                return true;
            }

            if (playerAlive[0].isSister && playerAlive[1].isSister) {
                hub.step = "overview";
                hub.winner = "sisters";
                room();
                return true;
            }
        }

        let side = null;

        playerAlive.forEach((p) => {
            if (!side) {
                side = p.role.side;
            } else {
                if (side !== p.role.side) {
                    check = true;
                }
            }
        })

        if (playerAlive.length === 0 || !check) {
            hub.step = "overview";

            if (playerAlive.length === 0) {
                hub.winner = "égalité";
            }

            if (!check) {
                hub.winner = side;
            } 
    
            room();
            return true;
        } else {
            return false;
        }
    }

    function events() {
        setIsTurnRoom(false);

        let responseYes = hub.randomEvents['responseYes'].length;
        let responseNo = hub.randomEvents['responseNo'].length;

        let event = randomEvents.find((event) => {
            return event.title === hub.randomEvents['title'];
        })

        if (responseYes > responseNo) {
            hub = event.function(hub, true);

            sendMessage('event', null, event.messageYes);
        } else if (responseYes < responseNo) {
            hub = event.function(hub, false);

            sendMessage('event', null, event.messageNo);
        } else {
            sendMessage('event', null, "Le village n'a pas pu se décider à temps sur le choix à faire...");
        }
 
        hub.step = "day";

        room();

        return day();
    }

    function order() {
        setIsTurnRoom(false);

        if (hub.step === "start") {

            return "werewolf";

        } else if (hub.step === "werewolf") {

            return "middle";

        } else if (hub.step === "middle") {

            return "end";

        } else if (hub.step === "end") {

            return "preVillage";

        } else if (hub.step === "preVillage") {

            return "village";

        } else if (hub.step === "village" || "postVillage") {

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
        if (hub.step === "preVillage") {
            return day();
        }

        if (finishedBySide()) {
            return sendMessage('server', null, "FIN DE LA PARTIE");
        }

        let check = false;

        //console.log("ETAPE : " + hub.step);
        if (hub.step !== "werewolf") {
            hub.players.forEach((player) => {
                if (player.role.step === hub.step) {
                    if (!player.isDead && player.isPower) {
                        let data = {
                            description: player.role.descriptionInGame,
                            victim: player.role.needVictim && hub.voteWolf ? getPlayer(hub.voteWolf).name : null,
                            doNothing: true
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

                        if (player.role.name === "Loup noir") {
                            if (hub.voteWolf) {
                                boxRole(player.socket, data);
                                sendMessage("server", null, player.role.name + " : utilisation de ses pouvoirs.");
                                check = true;
                                player.isTurn = true;
                            }
                        } else {
                            boxRole(player.socket, data);
                            sendMessage("server", null, player.role.name + " : utilisation de ses pouvoirs.");
                            check = true;
                            player.isTurn = true;
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
                            doNothing: false
                        }

                        boxRole(player.socket, data);
                    }
                }
            });
        }

        room();

        if (check) {
            return time(15);
        } else {
            hub.step = order();
            return stepNight();
        }
    }

    function triggerEvent() {
        let target = getRandomPlayer();

        if (hub.event.name === "Résurrection aveugle") {

            while (target.isDead === false) {
                target = getRandomPlayer();
            }

            target.isDead = false;

            sendMessage("server", null, "Evènement : un joueur a été réanimé.");

        } else if (hub.event.name === "Punition aveugle") {

            while (target.isDead === true) {
                target = getRandomPlayer();
            }

            target.isDead = true;

            sendMessage("server", null, "Evènement : un joueur a été tué.");
        }

        hub.event = null;

        room();

        return sendMessage("death", target.socket, "Vous entendez un langage ancien. Vous comprenez que la gitane est en train de lancer un envoûtement qui vous touche de plein fouet. Vous venez de mourir.");
    }

    function day() {
        if (finishedBySide()) {
            return sendMessage('server', null, "FIN DE LA PARTIE");
        }

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
            let oldMan = getPlayerByRole("Ancien du village");

            if (hub.oldManLife > 0) {
                hub.oldManLife--;

                hub.voteWolf = null;

                delete hub.kills[oldMan.socket];
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
        let str = "Le jour se lève sans ";

        if (kills.length > 0) {

            kills.forEach(socket => {
                let player = getPlayer(socket);
                player.isDead = true;

                str += player.name + " (" + player.role.name + "). ";

                if (player.isInfected) {
                    str += "(infecté) ";
                }

                if (player.isHair) {
                    let hair = getPlayerByRole('L\'Héritier');

                    hair.role = player.role;
                    hair.isPower = player.isPower;
    
                    hub.roles.splice(hub.roles.indexOf("L'Héritier"), 1);
                    hub.roles.push(hair.role.name);
    
                    sendMessage("role", hair.socket, "Votre héritier est mort, vous héritez de ses pouvoirs et du rôle de " + player.role.name + ".");
                }

                if (player.isCouple) {
                    let lover = getMyLover(player.name);

                    lover.isDead = true;

                    str += "par amour " + lover.name + " (" + lover.role.name + ") s'est donné la mort. ";
                }
            })

            sendMessage("death", null, str);

            if (hub.roles.includes("Chasseur")) {
                let hunter = getPlayerByRole('Chasseur');

                if (kills.includes(hunter.socket) && hunter.isPower) {
                    hunter.isTurn = true;

                    sendMessage("server", null, "Le chasseur est mort, il peut tuer quelqu'un avant de mourir.");
                    boxRole(hunter.socket, { description: hunter.role.descriptionInGame });
                    room();

                    return time(15);
                }
            }

            if (hub.roles.includes("Fossoyeur")) {
                let gravedigger = getPlayerByRole("Fossoyeur");

                if (kills.includes(gravedigger.socket) && gravedigger.isPower) {

                    sendMessage("server", null, "Le fossoyeur est mort, il peut activer son pouvoir et sonder deux personnes.");
                    boxRole(gravedigger.socket, { description: gravedigger.descriptionInGame });
                    room();

                    return time(15);
                }
            }
        } else {
            sendMessage("server", null, "Le jour se lève et personne est mort cette nuit.");
        }

        if (hub.dictator) {
            let player = getPlayerByRole("Dictateur");

            player.isTurn = true;
            sendMessage("role", null, "Le dictateur a décidé de prendre le pouvoir et de faire un coup d'état");

            boxRole(player.socket, { description: "Vous pouvez éliminer un joueur." });
            room();

            return time(15);
        }

        // reset des votes
        hub.players.forEach((player) => {
            player.vote = null;
            if (player.isVote && !player.isDead) {
                player.isTurn = true;
            }
        });

        hub.night = false;

        if (hub.nbTurn === 2 && !hub.mayor) {
            sendMessage("server", null, "Election du maire !");

            hub.step = "mayor";

            hub.players.forEach((player) => {
                player.isTurn = true;
                boxRole(player.socket, {
                    title: "Election", 
                    description: "Vous pouvez vous présenter.", 
                    textarea: true, 
                    doNothing: true 
                });
            })

            return time(120);
        }

        if (hub.nbTurn % 6 === 0 && !hub.randomEvents['title']) {

            let event = randomEvents[Math.floor(Math.random() * randomEvents.length)]

            hub.step = "randomEvents";
            hub.randomEvents['title'] = event.title;

            boxRole(socket.room, {
                type: "event",
                title: event.title,
                description: event.description,
                setYes: event.responseYes,
                setNo: event.responseNo
            })

            sendMessage('event', null, "Un évènement aléatoire est déclenché");

            return time(45);
        }

        hub.step = "village";

        boxRole(socket.room, { title: "Village", description: 'Vous pouvez voter pour exclure un joueur.', doNothing: false });

        if (hub.roles.includes("L'Horloger")) {
            let player = getPlayerByRole('L\'Horloger');

            if (!player.isDead && player.isPower) {
                let data = {
                    description: player.role.descriptionInGame,
                    setYes: "Augmenter le temps",
                    setNo: "Réduire le temps",
                }

                boxRole(player.socket, data);
            }
        }

        //time(120);
        time(10);

        return room();
    }

    function resetTurn() {
        hub.night = true;
        hub.nbTurn++;

        hub.players.forEach((player) => {
            player.vote = null;
            player.votes = [];

            if (!player.isScapegoat && player.role.name !== "Idiot du village") {
                player.isVote = true;
            }

            player.isScapegoat = false;

            if (player.role.name === "Loup blanc" && !player.isDead) {
                if (hub.nbTurn % 2 === 0) {
                    player.isPower = true;
                } else {
                    player.isPower = false;
                }
            }

            if (player.role.name === "Grand méchant loup" && !player.isDead) {
                if (player.isPower) {
                    checkWolf = hub.players.find((player) => {
                        return player.isDead && player.role.side === "méchant"
                    });

                    if (checkWolf) {
                        player.isPower = false;
                    }
                }
            }

            if (player.isActor && !player.isDead) {
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
        hub.mentalist = false;
        hub.ravenSocket = null;
        hub.randomEvents['responseYes'] = [];
        hub.randomEvents['responseNo'] = [];
        hub.randomEvents['title'] = null;

        return room();
    }

    function time(time) {
        if (interval) {
            clearInterval(interval);
        }

        interval = setInterval(() => {
            io.to(socket.room).emit('counter', time);

            if (hub.horloger !== null) {
                if (hub.horloger) {
                    time += 60;
                } else {
                    time = 10;
                }

                hub.horloger = null;
            }

            if (time <= 30 && hub.step === "village") {
                if (!hub.mentalist && hub.roles.includes('Mentaliste')) {
                    let player = getPlayerByRole('Mentaliste');

                    if (player.isPower) {
                        let side = getSideTarget();
                        
                        if (side) {
                            if (side !== "méchant") {
                                sendMessage('role', player.socket, "Le vote ne se porte pas très bien, le village risque d'éliminer la mauvaise personne pour l'instant...");
                            } else {
                                sendMessage('role', player.socket, "Le vote se porte à merveille, le village a eu une bonne intuition pour l'instant...");
                            }
                            hub.mentalist = true;
                        }
                    }
                }
            }

            if (time <= 0) {
                clearInterval(interval);

                if (hub.roles.includes('Voleur')) {
                    let player = getPlayerByRole("Voleur");

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

                    sendMessage('role', player.socket, "Vous devenez un villageois.");
                }

                if (hub.roles.includes("Chien-loup")) {
                    let player = getPlayerByRole('Chien-loup');

                    hub.roles.splice(hub.roles.indexOf("Chien-loup"), 1);

                    if (getRandomNumber(0, 1) === 0) {
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

                        hub.roles.push("Villageois");
                    } else {
                        player.role = {
                            name: "Loup-garou",
                            name_function: "Werewolf",
                            description: "Le loup-garou est un être mi-homme mi-loup qui se transforme la nuit pour tuer les villageois. Il se réunit chaque nuit avec les autres loups-garous pour décider de leur victime.",
                            side: "méchant",
                            step: "werewolf",
                            descriptionInGame: "Vous pouvez manger un joueur ce soir.",
                            max: 100,
                            needVictim: false,
                            img: "card-werewolf.svg",
                        }

                        hub.roles.push("Loup-garou");
                    }

                    sendMessage("role", player.socket, "Vous venez de devenir " + player.role.name + ".");
                }

                if (hub.step === "mayor") {
                    return voteMayor();
                }

                if (hub.step === "randomEvents") {
                    return events();
                }

                if (hub.step === "village") {
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

    function voteVillagers() {
        let target = null;
        let count = 0;

        hub.step = "postVillage";

        hub.players.forEach((player) => {
            if (!player.isDead) {
                if (player.votes.length > count) {
                    target = player;
                    count = player.votes.length;
                }
            }
            player.isTurn = false;
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

            if (target.role.name === "Idiot du village") {
                sendMessage("death", null, "Le village a décidé d'exclure " + target.name + " (" + target.role.name + "). Cependant le village a pitié de lui et décide de le laisser en vie, mais en échange il perd son droit de vote.");
                target.isVote = false;
            } else {
                if (!target.isInfected) {
                    sendMessage("death", null, "Le village a décidé d'exclure " + target.name + " qui était " + target.role.name + ".");
                } else {
                    sendMessage("death", null, "Le village a décidé d'exclure " + target.name + " qui était " + target.role.name + ' (infecté).');
                }
                target.isDead = true;
            }

            if (target.role.name === "Ancien du village") {

                hub.players.forEach((player) => {
                    if (player.role.side === "village") {
                        player.isPower = false;
                    }
                })

                sendMessage("death", null, "L'ancien du village a été exclu cette nuit. Dans son dernier souffle, il lance une malédiction qui annulent tous les pouvoirs des villageois.");
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
                target.isTurn = true;

                boxRole(target.socket, { description: target.role.descriptionInGame })
                room();

                return time(15);
            }

            if (target.role.name === "Fossoyeur") {
                sendMessage("server", null, "Le fossoyeur est mort, il peut activer son pouvoir et sonder deux personnes.");
                target.isTurn = true;

                boxRole(gravedigger.socket, { description: gravedigger.descriptionInGame });
                room();

                return time(15);
            }
        } else {
            if (equality && hub.roles.includes("Bouc émissaire")) {
                let player = getPlayerByRole("Bouc émissaire");

                player.isDead = true;
                player.isTurn = true;

                sendMessage("server", null, "Le village n'a pas réussi à se départager. Par dépit, le village décide de se tourner vers " + player.name + " qui est bouc émissaire. Il peut choisir une personne qui ne pourra pas voter au prochain tour.");

                boxRole(target.socket, { description: target.role.descriptionInGame });
                room();

                return time(15);
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

    function voteMayor() {
        setIsTurnRoom(false);

        let target = null;
        let count = 0;

        hub.mayorDialog.forEach((dialog) => {
            if (dialog.votes.length > count) {
                target = dialog.socket;
                count = dialog.votes.length;
            }
        });

        let equality = false;

        hub.mayorDialog.forEach((dialog) => {
            if (dialog.socket !== target) {
                if (count === dialog.votes.length && dialog.votes.length > 0) {
                    equality = true;
                };
            }
        });

        if (!equality && target) {
            let player = getPlayer(target);

            player.isMayor = true;
            hub.mayor = player.socket;
        } else {
            let index = Math.floor(Math.random() * hub.players.length);

            hub.players[index].isMayor = true;
            hub.mayor = hub.players[index].socket;
        }

        if (count === 0) {
            let index = Math.floor(Math.random() * hub.players.length);

            hub.players[index].isMayor = true;
            hub.mayor = hub.players[index].socket;
        }

        hub.step = "day";

        room();

        return day();
    }

    socket.on("voteMayor", name => {
        let player = getPlayer(socket.id);

        if (player.vote) {

            let oldDialog = hub.mayorDialog.find((dialog) => {
                return dialog.name === player.vote
            })

            oldDialog.votes.splice(oldDialog.votes.indexOf(player.name), 1);

            if (player.vote === name) {
                player.vote = null;
                return room();
            }
        }

        player.vote = name;

        let dialog = hub.mayorDialog.find((d) => {
            return d.name === player.vote
        })

        dialog.votes.push(player.name);

        return room();
    })

    socket.on('setRandomEvent', bool => {
        let player = getPlayer(socket.id);

        if (bool) {
            hub.randomEvents['responseYes'].push(player.name);

            sendMessage('server', null, player.name + " a voté pour.");
        } else {
            hub.randomEvents['responseNo'].push(player.name);

            sendMessage('server', null, player.name + " a voté contre.");
        }

        return room();
    })

    socket.on('resetGame', () => {
        hub.players.forEach((player) => {
            player.vote = null
            player.votes = []
            player.voteWolf = null
            player.role = null
            player.isMayor = false
            player.isVote = true
            player.isDead = false
            player.isTurn = false
            player.isPower = true
            player.isCouple = false
            player.isSister = false
            player.isCharmed = false
            player.isHair = false
            player.isActor = false
            player.isScapegoat = false
        })

        hub.roles = [];
        hub.votes = [];
        hub.kills = {};
        hub.event = null;
        hub.healthPotion = true;
        hub.deathPotion = true;
        hub.horloger = null;
        hub.mentalist = false;
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
        hub.mercenaryTarget = null;
        hub.mayorDialog = []
        hub.roleActor = [];
        hub.night = false;
        hub.inGame = false;
        hub.step = "start";
        
        sendMessage('server', null, "Le jeu est en bêta-test. Merci de report les bugs/améliorations sur le discord. Coeur sur vous et votre famille.");

        return room();
    })

    socket.on('setMayor', input => {
        let player = getPlayer(socket.id);

        hub.mayorDialog.push({
            name: player.name,
            socket: player.socket,
            content: input,
            votes: []
        })

        player.isTurn = false;

        return room();
    });

    socket.on('voteVillage', (targetID) => {
        const target = getPlayer(targetID);
        const player = getPlayer(socket.id);
        let indexMayor = 1;

        if (player.isMayor) {
            indexMayor = 2;
        }

        if (player.vote) {
            let oldTarget = getPlayer(player.vote);
            oldTarget.votes.splice(oldTarget.votes.indexOf(player.name), indexMayor);
        }

        if (targetID === player.vote) {
            player.vote = null;
            let index = target.votes.indexOf(player.name);
            target.votes.splice(index, indexMayor);
        } else {
            player.vote = targetID;

            if (player.isMayor) {
                target.votes.push(player.name, player.name);
            } else {
                target.votes.push(player.name);
            }

            sendMessage("vote", null, player.name + " a voté pour " + target.name + ".");
        };

        return room();
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

        player.isTurn = false;
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
        sendMessage("role", socket.id, "Vous avez volé la carte de " + target.name + ". Il était " + player.role.name + ".");

        room();

        return stepNight();

    })

    socket.on('setHunter', (targetID) => {
        let target = getPlayer(targetID);
        let player = getPlayer(socket.id);

        player.isPower = false;
        player.isTurn = false;

        target.isDead = true;

        sendMessage('death', null, "Le chasseur a tiré sur " + target.name + " (" + target.role.name + ").");

        room();

        return stepNight();
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
                cupidon.isTurn = false;
                cupidon.isPower = false;

                let lover_one = getPlayer(hub.lover_one);
                let lover_two = getPlayer(hub.lover_two);

                lover_one.isCouple = true;
                lover_two.isCouple = true;

                sendMessage("role", lover_one.socket, "Vous venez de tomber amoureux de " + lover_two.name + ". Vous avez un chat à disposition pour parler avec l'être aimé.");
                sendMessage("role", lover_two.socket, "Vous venez de tomber amoureux de " + lover_one.name + ". Vous avez un chat à disposition pour parler avec l'être aimé.");

                sendMessage('love', null, "Un chat est disponible pour parler entre vous à l'abri des regards !");
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
            player.isTurn = false;

            target.isHair = true;

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
        } else {
            actor.isTurn = false;
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

        player.isTurn = false;

        return room();
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

        player.isTurn = false;

        return room();

    })

    socket.on('setDictator', (action) => {
        let player = getPlayer(socket.id);

        player.isTurn = false;

        if (hub.dictator) {
            let target = getPlayer(action);

            target.isDead = true;

            sendMessage("role", null, "Le dictateur a décidé d'éliminer " + target.name + " (" + target.role.name + ")");

            hub.dictator = false;
            hub.step = "start";

            room();

            return stepNight();
        }

        if (action) {
            hub.dictator = true;
            player.isPower = false;
        }

        sendMessage("role", socket.id, action ? "Vous avez choisi de faire un coup d'état le prochain tour" : "Vous avez choisi de ne pas faire de coup d'état.");

        return room();
    })

    socket.on('setRaven', (targetID) => {
        let target = getPlayer(targetID);
        let player = getPlayer(socket.id);

        target.votes.push('Corbeau', 'Corbeau');

        hub.ravenSocket = target.socket;

        sendMessage(null, player.socket, target.name + " se réveillera avec deux votes en plus !");

        player.isTurn = false;

        return room();
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
                sendMessage("role", player.socket, "Il n'y a aucun loup parmis ces personnes. Vos pouvoirs vous quittent peu à peu...");
            }

            player.isTurn = false;

            return room();
        }
    })

    socket.on('setWhiteWerewolf', (targetID) => {
        let target = getPlayer(targetID);
        let player = getPlayer(socket.id);

        hub.kills[target.socket] = {
            name: target.name,
            role: target.role.name,
            killBy: "whiteWerewolf"
        };

        player.isTurn = false;

        return room();
    })

    socket.on('setBlackWerewolf', (bool) => {
        let player = getPlayer(socket.id);

        if (bool) {
            hub.infected = hub.voteWolf;
            hub.voteWolf = null;

            delete hub.kills[hub.infected];

            getPlayer(hub.infected).isInfected = true;

            player.isPower = false;
            sendMessage("role", hub.infected, "Vous avez été infecté par le loup noir !");
        }

        player.isTurn = false;

        return room();
    })

    socket.on('setWitchChoice', (bool) => {
        let witch = getPlayer(socket.id);

        if (bool) {
            delete hub.kills[hub.voteWolf];

            hub.voteWolf = null;
            hub.healthPotion = false;
            witch.isTurn = false;
        } else {
            boxRole(witch.socket, { description: "Vous pouvez tuer quelqu'un.", victim: null })
        }

        if (!hub.healthPotion && !hub.deathPotion) {
            witch.isPower = false;
        }

        return room();
    })

    socket.on('setWitch', (targetID) => {
        let witch = getPlayer(socket.id);
        let target = getPlayer(targetID);

        hub.deathPotion = false;
        hub.kills[target.socket] = {
            name: target.name,
            role: target.name.role,
            killBy: "witch"
        }

        sendMessage("role", witch.socket, "Vous avez décider de tuer " + target.name + " avec votre potion.");

        witch.isTurn = false

        return room();
    })

    socket.on('setGypsy', (choice) => {
        let gypsy = getPlayer(socket.id);

        if (choice === "Résurrection aveugle") {
            let isDead = false;

            hub.players.forEach(player => {
                if (player.isDead) {
                    isDead = true;
                }
            })

            if (!isDead) {
                return sendMessage('role', gypsy.socket, "Personne n'est encore mort dans le village.");
            }
        }

        gypsy.isPower = false;
        gypsy.isTurn = false;

        hub.event = eventsGypsy.find((event) => {
            return event.name === choice
        })

        sendMessage("role", socket.id, "Vous achez choisi de déclencher l'évènement " + choice);

        return room();
    })

    socket.on('setDogWerewolf', bool => {
        let player = getPlayer(socket.id);

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

        player.isTurn = false;

        return room();
    })

    socket.on('setScapegoat', (targetID) => {
        let target = getPlayer(targetID);

        target.isVote = false;
        target.isScapegoat = true;

        getPlayer(socket.id).isTurn = false;

        sendMessage('role', null, target.name + " ne pourra pas voter le prochain tour.");

        return room();
    })

    socket.on('setFlute', (targetID) => {
        let target = getPlayer(targetID);
        let player = getPlayer(socket.id);

        if (!player.isCharmed) {
            player.isCharmed = true;
        }

        if (target.socket === socket.id) {
            return sendMessage("role", socket.id, "Vous ne pouvez pas vous charmer.");
        }

        if (target.isCharmed) {
            return sendMessage("role", socket.id, "Cette personne a déjà été charmé.");
        }

        target.isCharmed = true;
        player.isTurn = false;

        sendMessage("role", player.socket, "Vous avez charmé " + target.name + " cette nuit.");
        sendMessage("role", target.socket, "Vous avez été charmé par le Joueur de flûte cette nuit.");

        return room();
    })

    socket.on('setTime', action => {
        let player = getPlayer(socket.id);

        boxRole(socket.id, {description: "Vous pouvez voter pour exclure un joueur."});
        player.isPower = false;

        if (action) {
            sendMessage('role', null, "L'horloger a activé son pouvoir, le temps est augmenté !");
            hub.horloger = true;
        } else {
            sendMessage('role', null, "L'horloger a activé son pouvoir, le temps est réduit !");
            hub.horloger = false;
        }

        return room();
    })

    socket.on('setGravedigger', targetID => {
        let target = getPlayer(targetID);

        let villageArray = [];
        let wolfArray = [];

        hub.players.forEach((player) => {
            if (!player.isDead) {
                if (player.role.side === "village" || player.role.side === "seul" && player.role.name !== "Loup blanc") {
                    villageArray.push(player.name);
                } else {
                    wolfArray.push(player.name);
                }
            }
        })

        let randomPlayer = null;

        if (target.role.side !== "méchant" && target.role.name !== "Loup blanc") {
            randomPlayer = wolfArray[Math.floor(Math.random() * wolfArray.length)];
        } else {
            randomPlayer = villageArray[Math.floor(Math.random() * villageArray.length)];
        }

        getPlayer(socket.id).isPower = false;

        room();

        sendMessage("server", null, "Un loup se cache entre " + target.name + " et " + randomPlayer + ".");

        return stepNight();
    })

    socket.on('inGame', () => {
        hub.inGame = true;
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
                    sendMessage("role", player.socket, "Vous avez le rôle Soeur, vous avez un chat disponible pour parler à votre frangine.");
                }
            })

            sendMessage('sister', null, "Un chat est disponible pour parler entre vous à l'abri des regards !");
        }

        resetTurn();

        room();

        if (hub.roles.includes("Voleur")) {
            const thief = getPlayerByRole("Voleur")

            if (thief) {
                sendMessage("server", null, "Le voleur décide du joueur à voler.");
                thief.isTurn = true;
                boxRole(thief.socket, {
                    description: thief.role.descriptionInGame,
                    doNothing: true
                });
                room();
                return time(20);
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

    // socket.on('setMap', () => {
    //     loadMap().then((map) => {

    //         const layer = map.layer[0];
    //         const tiles = layer.tiles;

    //         const map2D = new Array(map.height).fill('').map(() => new Array(map.height));

    //         //console.log(map2D);
    //         //socket.emit('setMap', map);
    //     }).catch((err) => {
    //         console.error(err);
    //     });
    // })

    socket.on("setMessage", ({ msg, type }) => sendMessage(type, null, msg));

    socket.on('getRoles', () => io.to(socket.id).emit('getRoles', roles));

    socket.on('getRoom', () => io.to(socket.id).emit('getRoom', hub));

    socket.on('join', ({ id, pseudo }) => {

        if (!io.sockets.adapter.rooms.get(id)) {
            return socket.emit('alert', 'Ce lobby n\'existe pas ou a été supprimé !');
        }

        if (io.sockets.adapter.rooms.get(id).inGame) {
            return socket.emit('alert', 'La partie a déjà démarré !');
        }

        const player = {
            name: pseudo,
            socket: socket.id,
            x: getRandomNumber(20, 80),
            y: getRandomNumber(70, 90),
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
            isScapegoat: false,
        }

        // inputsMap[socket.id] = {
        //     up: false,
        //     down: false,
        //     left: false,
        //     right: false
        // }

        hub = io.sockets.adapter.rooms.get(id);
        hub.players.push(player);
        hub.sockets.push(socket.id);
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
            x: getRandomNumber(20, 80),
            y: getRandomNumber(70, 90),
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
            isScapegoat: false,
        }];
        hub.sockets = [socket.id];
        hub.roles = [];
        hub.votes = [];
        hub.kills = {};
        hub.event = null;
        hub.healthPotion = true;
        hub.deathPotion = true;
        hub.horloger = null;
        hub.mentalist = false;
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
        hub.mercenaryTarget = null;
        hub.mayorDialog = []
        hub.roleActor = [];
        hub.randomEvents = {
            title: null,
            responseYes : [],
            responseNo : []
        }
        hub.night = false;
        hub.inGame = false;
        hub.winner = null;
        hub.step = "start";

        sendMessage('server', null, "Le jeu est en bêta-test. Merci de report les bugs/améliorations sur le discord. Coeur sur vous et votre famille.");

        return navigate(id);
    })

    // socket.on('inputs', inputs => {
    //     inputsMap[socket.id] = inputs;
    // })

    socket.on('clear', () => {
        if (hub) {
            hub.sockets.splice(hub.sockets.indexOf(socket.id), 1);

            hub.players.forEach((player, index) => {
                if (player.socket === socket.id) {
                    hub.players.splice(index, 1);
                    hub.votes.splice(index, 1);
                    socket.leave(room);
                    sendMessage('leave', null, player.name + " a quitté la partie.");
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
                    sendMessage('leave', null, player.name + " a quitté la partie.");
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