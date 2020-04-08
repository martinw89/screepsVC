/* global Game, _, FIND_MY_CREEPS, OK, module*/

let debug = false;

var logicSpawn = {

    spawnCreeps: function(creepsDesired, creepPrototypes, override = '') {
        debug ? console.log('Spawning creeps') : null;
        for (let spawnName in Game.spawns) {
            debug ? console.log('Spawning creeps at ' + spawnName) : null;
            //Balance amounts of creeps
            let creepRole = '';
            if (override == '') {
                let creepsPercents = [];
                for (let creepRole in creepsDesired) {
                    creepsPercents.push([creepRole, _.filter(Game.spawns[spawnName].room.find(FIND_MY_CREEPS), (creep) => creep.memory.role == creepRole).length / creepsDesired[creepRole]]);
                    creepsPercents.sort(function(a, b) {
                        return a[1] - b[1];
                    });
                }

                //console.log(creepsPercents);

                //creepsPercents.forEach(function(creepPercent) {
                creepRole = creepsPercents[0][0];
            } else {
                creepRole = override;
            }
            debug ? console.log('Spawning ' + creepRole + ' at ' + spawnName) : null;
            //Do we desire to have more creeps in this room?
            if (_.filter(Game.spawns[spawnName].room.find(FIND_MY_CREEPS), (creep) => creep.memory.role == creepRole).length < creepsDesired[creepRole]) {
                //Will we actually be able to spawn a creep with these body parts?
                debug ? console.log(Game.spawns[spawnName].spawning) : null;
                if (Game.spawns[spawnName].spawning == null && Game.spawns[spawnName].spawnCreep(creepPrototypes[creepRole], 'dryRunName', {'dryRun': true}) == OK) {
                    //OK, let's actually make that new creep
                    //Include spawn name in creep name to avoid the INCREDIBLY rare edge case of two spawns simultaneously making the same creep with the same name because I am neurotic
                    let newName = creepRole + spawnName + Game.time;
                    debug ? console.log('Spawning new ' + creepRole + ': ' + newName) : null;
                    Game.spawns[spawnName].spawnCreep(creepPrototypes[creepRole], newName, {memory: {role: creepRole}});
                }
            }
            //});
        }
    },

    echoSpawners: function() {
        for (let spawnName in Game.spawns) {
            if(Game.spawns[spawnName].spawning) {
                var spawningCreep = Game.creeps[Game.spawns[spawnName].spawning.name];
                Game.spawns[spawnName].room.visual.text(
                    '🛠️' + spawningCreep.memory.role,
                    Game.spawns[spawnName].pos.x + 1,
                    Game.spawns[spawnName].pos.y,
                    {align: 'left', opacity: 0.8});
            }
        }
    },

    generateBodyArrays: function(energyCapacity) {
        // do some magic math to figure out body parts based on energy capacity
    }
};

module.exports = logicSpawn;
