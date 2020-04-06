/* global
    Game,
    MOVE,
    WORK,
    CARRY,
    FIND_SOURCES_ACTIVE
    FIND_MY_STRUCTURES
    console
    module
    Memory
    STRUCTURE_TOWER*/

let roleHarvester = require('role.harvester');
let roleUpgrader = require('role.upgrader');
let roleBuilder = require('role.builder');
let roleRepairer = require('role.repairer');
let roleTower = require('role.tower');
let logicSpawnDespawn = require('logic.spawnDespawn');

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

    let creepsDesired = {
        'upgrader': 5,
        'harvester': 3,
        'builder': 5,
        'repairer': 2
    };

    let creepPrototypes = {
        'harvester': [MOVE, MOVE, MOVE, WORK, CARRY, CARRY],
        'builder': [WORK,WORK,CARRY,MOVE,MOVE],
        'upgrader': [WORK,WORK,CARRY,MOVE,MOVE],
        'repairer': [WORK,WORK,CARRY,MOVE,MOVE]
    };

    logicSpawnDespawn.spawnCreeps(creepsDesired, creepPrototypes);

    logicSpawnDespawn.echoSpawners();
    // logicSpawn.spawnHarvesters();
    // logicSpawn.spawnUpgraders();
    // logicSpawn.spawnBuilders();

    // if(Game.spawns['Spawn1'].spawning) {
    //     var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
    //     Game.spawns['Spawn1'].room.visual.text(
    //         '🛠️' + spawningCreep.memory.role,
    //         Game.spawns['Spawn1'].pos.x + 1,
    //         Game.spawns['Spawn1'].pos.y,
    //         {align: 'left', opacity: 0.8});
    // }

    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        switch(creep.memory.role) {
        case 'harvester':
            roleHarvester.run(creep);
            break;
        case 'upgrader':
            roleUpgrader.run(creep);
            break;
        case 'builder':
            roleBuilder.run(creep);
            break;
        case 'repairer':
            roleRepairer.run(creep);
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
