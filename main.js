/* global
    Game,
    MOVE,
    WORK,
    CARRY,
    FIND_SOURCES_ACTIVE
    FIND_MY_STRUCTURES
    module
    Memory
    STRUCTURE_TOWER*/

let roleHarvester = require('role.harvester');
let roleUpgrader = require('role.upgrader');
let roleBuilder = require('role.builder');
let roleRepairer = require('role.repairer');
let roleTower = require('role.tower');
let logicSpawn = require('logic.spawn');
let logicDefend = require('logic.defend');
let logicPathFinding = require('logic.pathFinding');

Memory.sources = {};
for (let room in Game.rooms) {
    Game.rooms[room].find(FIND_SOURCES_ACTIVE).forEach( function(source) {
        Memory.sources[source.id] = [];
    });
}

module.exports.loop = function () {
    let debug = false;
    debug ? console.log(Game) : null;

    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    for (let room in Game.rooms) {
        let underAttack = logicDefend.checkInvaders(Game.rooms[room]);
        if (underAttack) {
            if (logicDefend.checkCriticalAttack(Game.rooms[room])) {
                Game.rooms[room].controller.activateSafeMode();
                console.log('Holy crap we\'re all gonna die!');
            }
        }
    }


    let creepsDesired = {
        'upgrader': 5,
        'harvester': 5,
        'builder': 3,
        'repairer': 4
    };

    let creepPrototypes = {
        'harvester': [MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY,CARRY,CARRY],
        'builder': [MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY],
        'upgrader': [MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY],
        'repairer': [MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY]
    };

    logicSpawn.spawnCreeps(creepsDesired, creepPrototypes);

    logicSpawn.echoSpawners();

    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        switch(creep.memory.role) {
        case 'harvester':
            roleHarvester.run(creep, logicPathFinding);
            break;
        case 'upgrader':
            roleUpgrader.run(creep, logicPathFinding);
            break;
        case 'builder':
            roleBuilder.run(creep, logicPathFinding);
            break;
        case 'repairer':
            roleRepairer.run(creep, logicPathFinding);
            break;
        }
    }
    for(let name in Game.rooms) {
        let towers = Game.rooms[name].find(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_TOWER;
            }
        });
        towers.forEach(function (tower) {
            roleTower.run(tower);
        });
    }
};
