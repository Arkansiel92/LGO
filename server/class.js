class Room {
    constructor(id, author, type) {
        this.id = id
        this.author = author
        this.private = type
        this.players = []
        this.sockets = []
        this.roles = []
        this.votes = []
        this.kills = []
        this.options = {
            events: false,
            parkRanger: true,
            mayor: true
        }
        this.event = null
        this.healthPotion = true
        this.deathPotion = true
        this.horloger = null
        this.mentalist = false
        this.voteWolf = null
        this.messages = []
        this.nbTurn = 0
        this.oldManLife = 1
        this.oldManReveal = false
        this.lover_one = null
        this.lover_two = null
        this.infected = null
        this.protected = null
        this.dictator = false
        this.ravenSocket = null
        this.executioner = null
        this.mercenaryTarget = null
        this.mayorDialog = []
        this.roleActor = []
        this.eventsGypsy = [
            {
                name: "Résurrection aveugle",
                description: "Fait revenir un joueur au hasard d'entre les morts.",
                isUsed: false
            },
            {
                name: "Punition aveugle",
                description: "Tue un joueur au hasard.",
                isUsed: false
            }
        ]
        this.eventsParkRanger = [
            {
                name: "Bourreau",
                description: "Pour garder les mains propres, les villageois élisent un des leurs qui fera office de bourreau. Dorénavant et jusqu'à la fin du jeu, il sera le seul à décider qui sera tué.",
                isUsed: false,
                function: function () {
                    hub.optionsEventsParkRanger['executioner'] = true;

                    return;
                }
            },
            {
                name: "Somnambulisme",
                description: "La voyante est devenue somnambule. Dorénavant et jusqu'à la fin de la partie, le rôle de la personne scrutée apparaîtra dans le chat à la vue de tous. (mais pas son nom)",
                isUsed: false,
                function: function () {
                    hub.optionsEventsParkRanger['revealPsychic'] = true;

                    return;
                }
            },
            {
                name: "Pile ou face",
                description: "Aujourd'hui, le village rend hommage au célèbre joueur Hervé le Borgne. Aussitôt après le verdict du tribunal, on tire à pile ou face l'éventuelle grâce du condamné.",
                isUsed: false,
                function: function () {
                    hub.optionsEventsParkRanger['randomLife'] = true;

                    return;
                }
            }
        ]
        this.optionsEventsParkRanger = {
            executioner: false,
            revealPsychic: false,
            randomLife: false
        }
        this.night = false
        this.inGame = false
        this.winner = null
        this.step = "start"
    }

    getId() {
        return this.id;
    } 

    join(player, socket) {
        if (this.sockets.includes(socket)) return false;
        
        this.sockets.push(socket);
        this.players.push(player);

        return true;
    }

    leave(socket) {
        if (!this.sockets.includes(socket)) return false;
        
        return true;
    }
}

class Player {
    constructor(name, socket, sprite, x, y) {
        this.name = name
        this.socket = socket
        this.sprite = sprite
        this.x = x
        this.y = y
        this.frameX = 0
        this.frameY = 0
        this.vote = null
        this.votes = []
        this.voteWolf = null
        this.role = null
        this.isMayor = false
        this.isVote = true
        this.isDead = false
        this.isTurn = false
        this.isPower = false
        this.isCouple = false
        this.isSister = false
        this.isCharmed = false
        this.isHair = false
        this.isActor = false
        this.isScapegoat = false
        this.isParkRanger = false
    }
}

module.exports = {Room, Player};
