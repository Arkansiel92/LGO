const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const fs = require('fs');

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
        name: "Simple villageois",
        name_function: "Villager",
        description: "Le villageois est un personnage qui incarne les habitants d\'un village. Son rôle est de découvrir l\'identité des loups-garous et de les éliminer avant qu\'ils ne tuent tous les villageois.",
        side: "village",
        descriptionInGame: null,
        max: 100,
        img: "card-villager.svg"
    },
    {
        name: "Loup-garou",
        name_function: "Werewolf",
        description: "Le loup-garou est un être mi-homme mi-loup qui se transforme la nuit pour tuer les villageois. Il se réunit chaque nuit avec les autres loups-garous pour décider de leur victime.",
        side: "méchant",
        descriptionInGame: "Vous pouvez manger un joueur ce soir !",
        max: 100,
        img: "card-werewolf.svg",
    },
    {
        name: "Chasseur",
        name_function: "Hunter",
        description: "À sa mort, le chasseur élimine une personne de son choix.",
        side: "village",
        descriptionInGame: "Vous êtes mort, vous pouvez emporter un joueur avec vous.",
        max: 1,
        img: "card-hunter.svg",
    },
    {
        name: "Cupidon",
        name_function: "Cupidon",
        description: "Cupidon est appelé uniquement la première nuit afin d'unir un couple. Il désigne deux noms parmi les joueurs, ces deux joueurs seront Le couple. Si un des deux qui sont en couple meurt l'autre meurt avec son amant.",
        side: "village",
        descriptionInGame: "Selectionnez deux joueurs qui seront lié à la vie et à la mort ! Si l'un d'eux meurt, il emporte son amant dans la tombe.",
        max: 1,
        img: "card-cupidon.svg",
    },
    {
        name: "Petite fille",
        name_function: "LittleGirl",
        description: "La petite fille est un villageois qui peut se réveiller au moment où les loups garous sont appelés.",
        side: "village",
        descriptionInGame: "",
        max: 1,
        img: "card-littleGirl.svg",
    },
    {
        name: "Sorcière",
        name_function: "Witch",
        description: "La sorcière se réveille la nuit après tout le monde. Elle possède deux potions : une de vie et une de mort. Elle peut choisir de soigner la victime des loups garous. Elle peut également choisir de tuer une personne grâce à sa potion de mort. Elle ne peut utiliser qu'une seule fois chaque potion.",
        side: "village",
        descriptionInGame: "Vous avez le droit de vie ou de mort !",
        max: 1,
        img: "card-witch.svg",
    },
    {
        name: "Voleur",
        name_function: "Thief",
        description: "Le voleur est appelé uniquement la première nuit. Il peut décider ou non, d'échanger sa carte avec celle d'un autre joueur. A la suite de ça, le joueur qui a la carte voleur devient un simple villageois.",
        side: "village",
        descriptionInGame: "Pouvoir à usage unique : vous pouvez voler la carte d'un joueur. Cette personne deviendra villageois à la suite de ce vol.",
        max: 1,
        img: "card-thief.svg",
    },
    {
        name: "Voyante",
        name_function: "Psychic",
        description: "Chaque nuit, elle a le pouvoir de regarder la carte d'un joueur.",
        side: "village",
        descriptionInGame: "Vous pouvez regarder la carte d'un joueur.",
        max: 1,
        img: "card-psychic.svg",
    },
    {
        name: "Ancien du village",
        name_function: "OldMan",
        description: "L’ancien possède deux vies durant la nuit. La première fois qu'il doit mourir, il en perd une sans en être averti. Le matin, il se réveille avec les autres, mais dévoile sa carte (la seconde fois qu’il est attaqué par les loups garous alors il meurt normalement). Si l’ancien est chassé du village par le vote des villageois il meurt directement et tous les rôles des villageois perdent leurs pouvoirs.",
        side: "village",
        descriptionInGame: null,
        max: 1,
        img: "card-oldman.svg",
    },
    {
        name: "Bouc émissaire",
        name_function: "Scapegoat",
        description: "En cas d'égalité dans les votes du village, c'est lui qui meurt. Il a la capacité, à sa mort, de décider qui ne pourra pas voter le tour suivant.",
        side: "village",
        descriptionInGame: null,
        max: 1,
        img: "card-scapegoat.svg",
    },
    {
        name: "Idiot du village",
        name_function: "Idiot",
        description: "S'il est désigné par le vote du village, il ne meurt pas, mais perd seulement sa capacité à voter.",
        side: "village",
        descriptionInGame: null,
        max: 1,
        img: "card-idiot.svg",
    },
    {
        name: "Joueur de flûte",
        name_function: "Flute",
        description: "Se réveille en dernier. Il peut alors charmer un ou deux joueurs (en fonction du nombre de joueurs) qui deviendront les charmés. Il gagne lorsque tous les joueurs en vie sont charmés.",
        side: "seul",
        descriptionInGame: "Vous pouvez charmer un/plusieurs joueur(s)",
        max: 1,
        img: "card-flute.svg",
    },
    {
        name: "Garde",
        name_function: "Guard",
        description: "Chaque nuit, le garde protège une personne . Cette personne sera protégée et ne pourra donc pas mourir durant la nuit. Le garde ne peut pas protéger la même personne deux nuits de suite.",
        side: "village",
        descriptionInGame: "Vous pouvez protéger un joueur (Le garde ne peut pas protéger la même personne deux nuits de suite)",
        max: 1,
        img: "card-gard.svg",
    },
    {
        name: "Corbeau",
        name_function: "Raven",
        description: "Le corbeau fait partie du village, il sera appelé chaque nuit et désignera une personne qui recevra automatiquement deux votes de plus contre elle lors du vote de la journée suivante.",
        side: "village",
        descriptionInGame: "Vous pouvez choisir un joueur qui se réveillera avec deux votes automatiquement.",
        max: 1,
        img: "card-raven.svg",
    },
    {
        name: "Loup blanc",
        name_function: "WhiteWerewolf",
        description: "Le loup blanc se réveille la nuit avec les loups, mais son but est de gagner seul. Une nuit sur deux, il se réveille pour tuer une personne de son choix (loup ou villageois).",
        side: "seul",
        descriptionInGame: "Vous pouvez tuer un joueur",
        max: 1,
        img: "card-whiteWerewolf.svg",
    },
    {
        name: "L'ange",
        name_function: "Angel",
        description: "S'il se fait éliminer au premier tour par le Village uniquement, il gagne la partie et le village aussi. Sinon, il devient Simple Villageois. S'il se fait éliminer par les loup-garou ou par un autre rôle, il meurt tout simplement.",
        side: "village",
        descriptionInGame: null,
        max: 1,
        img: "card-angel.svg",
    },
    {
        name: "Chien-loup",
        name_function: "DogWerewolf",
        description: "La première nuit, il choisit d’être un Simple Villageois ou un Loup-garou.",
        side: "méchant",
        descriptionInGame: "Vous pouvez tuer un joueur",
        max: 1,
        img: "card-dogWolf.svg",
    },
    {
        name: "Comédien",
        name_function: "Actor",
        description: "Avant la partie. Chaque nuit, le comédien peut désigner un des rôles qui n'ont pas été choisi et utiliser le pouvoir correspondant jusqu’à la nuit suivante. Chaque rôle ne peut être utilisé qu'une seule fois et maximum 3 fois dans la partie.",
        side: "village",
        descriptionInGame: "Vous pouvez choisir un rôle",
        max: 1,
        img: "card-actor.svg",
    },
    {
        name: "Deux soeurs",
        name_function: "Sisters",
        description: "Leur objectif est d'éliminer tous les autres joueurs. Au début de la partie elles connaissent donc leur identité, et peuvent donc avoir confiance en elles. Elles peuvent se concerter en silence. Si l'une d'elle meurt, l'autre ne meurt pas forcément.",
        side: "seul",
        descriptionInGame: null,
        max: 2,
        img: "card-sisters.svg",
    },
    {
        name: "Grand méchant loup",
        name_function: "BigBadWerewolf",
        description: "Son objectif est d'éliminer tout le village. Chaque nuit, il se réunit avec ses compères Loups pour décider d'une victime à éliminer... Tant qu'aucun autre loup n'est mort, il peut, chaque nuit, dévorer une victime supplémentaire.",
        side: "méchant",
        descriptionInGame: "Vous pouvez tuer un joueur",
        max: 1,
        img: "card-bigBadWolf.svg",
    },
    {
        name: "Gitane",
        name_function: "Gypsy",
        description: "Pendant la nuit, elle décide si oui ou non elle veut déclencher un évènement. Le pouvoir n'est activable qu'une fois dans la partie",
        side: "village",
        descriptionInGame: "Voulez-vous déclencher un évènement pour la prochaine journée ?",
        max: 1,
        img: "card-gypsy.svg",
    },
    {
        name: "Loup noir",
        name_function: "BlackWerewolf",
        description: "Chaque nuit après avoir joué avec les loups il peut décider d'infecter la victime. Elle devient alors Infectée et ne meurt pas. Il ne peut utiliser son pouvoir qu'une fois dans la partie.",
        side: "méchant",
        descriptionInGame: "Vous pouvez tuer un joueur",
        max: 1,
        img: "card-BlackWerewolf.svg",
    },
    {
        name: "Juge bègue",
        name_function: "Judge",
        description: "Ce pouvoir ne peut être utilisé qu'une fois dans la partie. Après le vote du village, le juge bègue décide si il faut refaire le vote. Dans ce cas, un nouveau vote à lieu, immédiatement et sans débat.",
        side: "village",
        descriptionInGame: "Voulez-vous déclencher un second vote ?",
        max: 1,
        img: "card-judge.svg",
    },
    {
        name: "Renard",
        name_function: "Fox",
        description: "La première nuit, le renard flaire 3 joueurs. Si un loup garou est dans ce groupe, il pourra réutiliser son pouvoir la nuit suivante. Sinon, il devient simple villageois.",
        side: "village",
        descriptionInGame: "Vous pouvez flairer 3 joueurs",
        max: 1,
        img: "card-fox.svg",
    },
    {
        name: "Servante Dévouée",
        name_function: "Servant",
        description: "Une fois dans la partie, elle peut choisir de prendre le rôle d'un des morts jusqu'à la fin de la partie sauf si elle est en couple, car son amour est plus fort que sa volonté de changer de rôle",
        side: "village",
        descriptionInGame: "Voulez-vous prendre le rôle d'un mort ?",
        max: 1,
        img: "card-servant.svg",
    },
    {
        name: "Mercenaire",
        name_function: "Mercenary",
        description: "Le premier jour, l'objectif du mercenaire est d'éliminer la cible qui lui est attribuée. S'il y parvient, il gagne seul la partie instantanément. Sinon, il devient villageois.",
        side: "seul",
        descriptionInGame: null,
        max: 1,
        img: "card-mercenary.svg",
    },
    {
        name: "Nécromancien",
        name_function: "Necromancer",
        description: "Vaincre les loups-garous est son objectif. La nuit, il peut communiquer avec les morts, afin d'en tirer des informations capitales...",
        side: "village",
        descriptionInGame: "C'est la nuit, vous pouvez communiquer avec les morts",
        max: 1,
        img: "card-necromancer.svg",
    },
    {
        name: "Fossoyeur",
        name_function: "Gravedigger",
        description: "Vaincre les loups-garous est son objectif. À sa mort, le fossoyeur creuse la tombe d'un joueur qu'il choisit et d'un joueur au hasard du camp opposé. Les noms de ces deux joueurs seront annoncés...",
        side: "village",
        descriptionInGame: "Vous êtes mort, qui voulez-vous cibler ?",
        max: 1,
        img: "card-gravedigger.svg",
    },
    {
        name: "Dictateur",
        name_function: "Dictator",
        description: "Vaincre les loups-garous est son objectif. Il peut s'emparer du pouvoir de vote du village une fois dans la partie. S'il exécute un loup-garou, il devient Maire, sinon, il meurt.",
        side: "village",
        descriptionInGame: "Voulez-vous faire un coup d'état la prochaine nuit ?",
        max: 1,
        img: "card-dictator.svg",
    },
    {
        name: "Le Chaperon Rouge",
        name_function: "Chaperone",
        description: "Son objectif est de vaincre les Loups-Garous. Tant que le Chasseur est en vie, il est protégé contre les attaques des Loups-Garous.",
        side: "village",
        descriptionInGame: null,
        max: 1,
        img: "card-chaperon.svg",
    },
    {
        name: "L'Héritier",
        name_function: "Hair",
        description: "Son objectif est de vaincre les Loups-Garous tant qu'il ne reçoit pas de nouveau rôle. La première nuit, il désigne un testataire qui lui léguera son rôle lors de sa mort.",
        side: "village",
        descriptionInGame: "Désignez un testataire qui vous léguera son rôle lors dà sa mort",
        max: 1,
        img: "card-heir.svg",
    },
]

const beginNightOrder = ['Voleur', 'Cupidon', 'L\'héritier', 'Comédien', 'Servante Dévouée', 'Voyante', 'Garde', 'Dictateur', 'Corbeau', 'Renard', 'Gitane']
const middleNightOrder = ['Loup-garou', 'Loup noir', 'Chien-loup', 'Grand méchant loup', 'Loup blanc']
const lastNightOrder = ['sorcière', 'Joueur de flûte']

const roleOrderNight = ['Voleur', 'Cupidon', 'L\'héritier', 'Comédien', 'Servante Dévouée', 'Voyante', 'Garde', 'Dictateur', 'Corbeau', 'Renard', 'Gitane', 'Loup-garou', 'Loup noir', 'Chien-loup', 'Grand méchant loup', 'Loup blanc', 'sorcière', 'Joueur de flûte']

io.on('connection', (socket) => {
    let hub = io.sockets.adapter.rooms.get(socket.room);

    function getPlayer(socketID) {
        const player = hub.players.find((player) => {
            return player.socket === socketID;
        })

        return player;
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

    function counter() {

    }

    function turn() {
        console.log('Début du tour');

        hub.nbTurn++;

        room();
        io.to(socket.room).emit('night', true);

        beginNightOrder.forEach((role) => {
            if (hub.roles.includes(role)) {
                const player = hub.players.find((player) => {
                    return player.role.name === role;
                })

                if (player.isDead === false) {
                    if (player.isPower) {
                        actionInGame(player.socket, true)
                    }
                }
            }
        })

    }

    // function Role

    socket.on('setWerewolf', data => {
        console.log(data);
    })

    socket.on('setThief', ({targetID, userID}) => {

        if (targetID === userID) {
            return;
        }

        const target = getPlayer(targetID);
        const user = getPlayer(userID);
        
        if (user.isPower) {
            user.isPower = false;
            user.role = target.role;

            target.role = {
                name: "Simple villageois",
                name_function: "Villager",
                description: "Le villageois est un personnage qui incarne les habitants d\'un village. Son rôle est de découvrir l\'identité des loups-garous et de les éliminer avant qu\'ils ne tuent tous les villageois.",
                side: "village",
                descriptionInGame: null,
                max: 100,
                img: "card-villager.svg"
            };

            actionInGame(userID, false);

        }

        return room();
    })  

    socket.on('setCupidon', ({cupidonID, target1, target2}) => {
        const cupidon = getPlayer(cupidonID);
        const lover_one = getPlayer(target1);
        const lover_two = getPlayer(target2);

        if (cupidon.isPower) {
            cupidon.isPower = false;

            lover_one.isCouple = true;
            lover_two.isCouple = true;

            actionInGame(cupidonID, false);
        }

        return room();
    })

    socket.on('inGame', ready => {
        hub.inGame = ready;

        io.to(socket.room).emit('inGame', true);

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

        return turn();
    })

    socket.on('addRole', role => {
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
        hub.messages.push({
            socket: socket.id,
            author: socket.name,
            recipient: null,
            msg: msg
        })

        return room();
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
            isDead: false,
            isTurn: false,
            isPower: true,
            isCouple: false,
            isCharmed: false,
            isRaven: false,
            isProtected: false,
            isInfected: false
        }

        hub.players.push(player);
        hub.sockets.push(socket.id);
        hub.votes.push('');
        socket.name = pseudo;
        socket.room = id;
        socket.join(id);

        hub.messages.push({
            socket: null,
            author: "MJ",
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
            role: null,
            isDead: false,
            isTurn: false,
            isPower: true,
            isCouple: false,
            isCharmed: false,
            isRaven: false,
            isProtected: false,
            isInfected: false
        }];
        hub.sockets = [socket.id];
        hub.roles = [],
        hub.votes = [''];
        hub.messages = [];
        hub.nbTurn = 0;
        hub.inGame = false;

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