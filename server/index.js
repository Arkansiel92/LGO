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
        description: "Le villageois est un personnage qui incarne les habitants d\'un village. Son rôle est de découvrir l\'identité des loups-garous et de les éliminer avant qu\'ils ne tuent tous les villageois.",
        side: "village",
        max: 100,
        img: "card-villager.png"
    },
    {
        name: "Chasseur",
        description: "À sa mort, le chasseur élimine une personne de son choix.",
        side: "village",
        max: 1,
        img: "card-hunter.png"
    },
    {
        name: "Cupidon",
        description: "Cupidon est appelé uniquement la première nuit afin d'unir un couple. Il désigne deux noms parmi les joueurs, ces deux personnes seront Le couple. Si un des deux qui sont en couple meurt l'autre meurt avec son amant.",
        side: "village",
        max: 1,
        img: "card-cupidon.png"
    },
    {
        name: "Loup-garou",
        description: "Le loup-garou est un être mi-homme mi-loup qui se transforme la nuit pour tuer les villageois. Il se réunit chaque nuit avec les autres loups-garous pour décider de leur victime.",
        side: "méchant",
        max: 100,
        img: "card-werewolf.png"
    },
    {
        name: "Petite fille",
        description: "La petite fille est un villageois qui peut se réveiller au moment où les loups garous sont appelés.",
        side: "village",
        max: 1,
        img: "card-littleGirl.png"
    },
    {
        name: "Sorcière",
        description: "La sorcière se réveille la nuit après tout le monde. Elle possède deux potions : une de vie et une de mort. Elle peut choisir de soigner la victime des loups garous. Elle peut également choisir de tuer une personne grâce à sa potion de mort. Elle ne peut utiliser qu'une seule fois chaque potion.",
        side: "village",
        max: 1,
        img: "card-witch.png"
    },
    {
        name: "Voleur",
        description: "Le voleur est appelé uniquement la première nuit. Il peut décider ou non, d'échanger sa carte avec celle d'un autre joueur. A la suite de ça, le joueur qui a la carte voleur devient un simple villageois.",
        side: "village",
        max: 1,
        img: "card-thief.png"
    },
    {
        name: "Voyante",
        description: "Chaque nuit, elle a le pouvoir de regarder la carte d'un joueur.",
        side: "village",
        max: 1,
        img: "card-psychic.png"
    },
    {
        name: "Ancien du village",
        description: "L’ancien possède deux vies durant la nuit. La première fois qu'il doit mourir, il en perd une sans en être averti. Le matin, il se réveille avec les autres, mais dévoile sa carte (la seconde fois qu’il est attaqué par les loups garous alors il meurt normalement). Si l’ancien est chassé du village par le vote des villageois il meurt directement et tous les rôles des villageois perdent leurs pouvoirs.",
        side: "village",
        max: 1,
        img: "card-oldman.png"
    },
    {
        name: "Bouc émissaire",
        description: "En cas d'égalité dans les votes du village, c'est lui qui meurt. Il a la capacité, à sa mort, de décider qui ne pourra pas voter le tour suivant.",
        side: "village",
        max: 1,
        img: "card-scapegoat.png"
    },
    {
        name: "Idiot du village",
        description: "S'il est désigné par le vote du village, il ne meurt pas, mais perd seulement sa capacité à voter.",
        side: "village",
        max: 1,
        img: "card-idiot.png"
    },
    {
        name: "Joueur de flûte",
        description: "Le joueur de flûte se réveille en dernier. Il peut alors charmer un ou deux joueurs (en fonction du nombre de joueurs) qui deviendront les charmés. Il gagne lorsque tous les joueurs en vie sont charmés.",
        side: "seul",
        max: 1,
        img: "card-flute.png"
    },
    {
        name: "Garde",
        description: "Chaque nuit, le salvateur protège une personne . Cette personne sera protégée et ne pourra donc pas mourir durant la nuit. Le salvateur ne peut pas protéger la même personne deux nuits de suite.",
        side: "village",
        max: 1,
        img: "card-gard.png"
    },
    {
        name: "Corbeau",
        description: "Le corbeau fait partie du village, il sera appelé chaque nuit et désignera une personne qui recevra automatiquement deux votes de plus contre elle lors du vote de la journée suivante.",
        side: "village",
        max: 1,
        img: "card-raven.png"
    },
    {
        name: "Loup blanc",
        description: "Le loup blanc se réveille la nuit avec les loups, mais son but est de gagner seul. Une nuit sur deux, il se réveille pour tuer une personne de son choix (loup ou villageois).",
        side: "seul",
        max: 1,
        img: "card-whiteWerewolf.png"
    },
    {
        name: "L'ange",
        description: "S'il se fait éliminer au premier tour par le Village uniquement, il gagne la partie et le village aussi. Sinon, il devient Simple Villageois. S'il se fait éliminer par les loup-garou ou par un autre rôle, il meurt tout simplement.",
        side: "village",
        max: 1,
        img: "card-angel.png"
    },
    {
        name: "Chien-loup",
        description: "La première nuit, il choisit d’être un Simple Villageois ou un Loup-garou.",
        side: "méchant",
        max: 1,
        img: "card-dogWolf.png"
    },
    {
        name: "Comédien",
        description: "Avant la partie. Chaque nuit, le comédien peut désigner un des rôles qui n'ont pas été choisi et utiliser le pouvoir correspondant jusqu’à la nuit suivante. Chaque rôle ne peut être utilisé qu'une seule fois et maximum 3 fois dans la partie.",
        side: "village",
        max: 1,
        img: "card-actor.png"
    },
    {
        name: "Deux soeurs",
        description: "Leur objectif est d'éliminer tous les autres joueurs. Au début de la partie elles connaissent donc leur identité, et peuvent donc avoir confiance en elles. Elles peuvent se concerter en silence. Si l'une d'elle meurt, l'autre ne meurt pas forcément.",
        side: "seul",
        max: 2,
        img: "card-sisters.png"
    },
    {
        name: "Grand méchant loup",
        description: "Son objectif est d'éliminer tout le village. Chaque nuit, il se réunit avec ses compères Loups pour décider d'une victime à éliminer... Tant qu'aucun autre loup n'est mort, il peut, chaque nuit, dévorer une victime supplémentaire.",
        side: "méchant",
        max: 1,
        img: "card-bigBadWolf.png"
    },
    {
        name: "Gitane",
        description: "Pendant la nuit, elle décide si oui ou non elle veut déclencher un évènement. Le pouvoir n'est activable qu'une fois dans la partie",
        side: "village",
        max: 1,
        img: ""
    },
    {
        name: "Loup noir",
        description: "Chaque nuit après avoir joué avec les loups il peut décider d'infecter la victime. Elle devient alors Infectée et ne meurt pas. Il ne peut utiliser son pouvoir qu'une fois dans la partie.",
        side: "méchant",
        max: 1,
        img: "card-BlackWerewolf.png"
    },
    {
        name: "Juge bègue",
        description: "Ce pouvoir ne peut être utilisé qu'une fois dans la partie. Après le vote du village, le juge bègue décide si il faut refaire le vote. Dans ce cas, un nouveau vote à lieu, immédiatement et sans débat.",
        side: "village",
        max: 1,
        img: "card-judge.png"
    },
    {
        name: "Renard",
        description: "La première nuit, le renard flaire 3 personnes. Si un loup garou est dans ce groupe, il pourra réutiliser son pouvoir la nuit suivante. Sinon, il devient simple villageois.",
        side: "village",
        max: 1,
        img: "card-fox.png"
    },
    {
        name: "Servante Dévouée",
        description: "Une fois dans la partie, elle peut choisir de prendre le rôle d'un des morts jusqu'à la fin de la partie sauf si elle est en couple, car son amour est plus fort que sa volonté de changer de rôle",
        side: "village",
        max: 1,
        img: ""
    },
    {
        name: "Mercenaire",
        description: "Le premier jour, l'objectif du mercenaire est d'éliminer la cible qui lui est attribuée. S'il y parvient, il gagne seul la partie instantanément. Sinon, il devient villageois.",
        side: "seul",
        max: 1,
        img: ""
    },
    {
        name: "Nécromancien",
        description: "Vaincre les loups-garous est son objectif. La nuit, il peut communiquer avec les morts, afin d'en tirer des informations capitales...",
        side: "village",
        max: 1,
        img: "card-necromancer.png"
    },
    {
        name: "Fossoyeur",
        description: "Vaincre les loups-garous est son objectif. À sa mort, le fossoyeur creuse la tombe d'un joueur qu'il choisit et d'un joueur du camp opposé. Les noms de ces deux joueurs seront annoncés...",
        side: "village",
        max: 1,
        img: ""
    },
    {
        name: "Dictateur",
        description: "Vaincre les loups-garous est son objectif. Il peut s'emparer du pouvoir de vote du village une fois dans la partie. S'il exécute un loup-garou, il devient Maire, sinon, il meurt.",
        side: "village",
        max: 1,
        img: ""
    },
    {
        name: "Le Chaperon Rouge",
        description: "Son objectif est de vaincre les Loups-Garous. Tant que le Chasseur est en vie, il est protégé contre les attaques des Loups-Garous.",
        side: "village",
        max: 1,
        img: ""
    },
    {
        name: "L'Héritier",
        description: "Son objectif est de vaincre les Loups-Garous tant qu'il ne reçoit pas de nouveau rôle. La première nuit, il désigne un testataire qui lui léguera son rôle lors de sa mort.",
        side: "village",
        max: 1,
        img: ""
    },
]

io.on('connection', (socket) => {
    let hub = io.sockets.adapter.rooms.get(socket.room);

    console.log(`CONNECTION : ${socket.id}`);

    function navigate(id) {
        return io.to(socket.id).emit('navigate', id);
    }

    function room() {
        return io.to(socket.room).emit('getRoom', hub);
    }

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
            console.log(hub.roles);
            return room();
        }
    });

    socket.on('deleteRole', role => {
        const index = hub.roles.indexOf(role);

        if (index > -1) {
            if (role === "Deux soeurs") {
                hub.roles.splice(index, 2);
            } else {
                hub.roles.splice(index, 1);
            }
            console.log(hub.roles);
            return room();
        }
    });

    socket.on('getRoles', () => io.to(socket.id).emit('getRoles', roles));

    socket.on('getRoom', () => io.to(socket.id).emit('getRoom', hub));

    socket.on('join', ({ id, pseudo }) => {
        hub = io.sockets.adapter.rooms.get(id);

        if (!hub) {
            return socket.emit('alert', 'Ce lobby n\'existe pas !');
        }

        hub.players.push(pseudo);
        hub.votes.push('');
        socket.room = id;
        socket.name = pseudo;
        socket.join(id);

        room();
        return navigate(id);
    })

    socket.on('setRoom', ({ id, pseudo }) => {
        socket.room = id;
        socket.name = pseudo
        socket.join(id);

        hub = io.sockets.adapter.rooms.get(id);

        hub.status = 'private';
        hub.author = socket.id;
        hub.players = [socket.name];
        hub.roles = [],
            hub.votes = [''];

        return navigate(id);
    })

    socket.on('clear', () => {
        let rooms = [...socket.rooms];

        rooms.forEach((room) => {
            if (room !== socket.id) {
                socket.leave(room);
                console.log(`Clear de la room : ${room} du socket : ${socket.id}`)
            }
        })

        rooms.filter(room => room.length === 0);
    })

    socket.on('disconnect', () => {
        console.log(`DISCONNECT : ${socket.id}`);
    })
})

server.listen(3001, () => {
    console.log("SERVER IS RUNNING");
});