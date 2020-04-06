/* global Game, _, FIND_MY_CREEPS, OK, console, module*/

let debug = false;

var logicSpawnDespawn = {
    // spawnHarvesters: function() {
    //     var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    //     console.log('Harvesters: ' + harvesters.length);
    //
    //     if(harvesters.length < 10 && Game.spawns[spawnName].room.energyAvailable >= 350) {
    //         var newName = 'Harvester' + Game.time;
    //         console.log('Spawning new harvester: ' + newName);
    //         Game.spawns[spawnName].spawnCreep([WORK,WORK,CARRY,MOVE,MOVE], newName,
    //             {memory: {role: 'harvester'}});
    //     }
    // },
    //
    // spawnBuilders: function() {
    //     var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    //     var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    //     var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    //     console.log('Builders: ' + builders.length);
    //
    //     if(builders.length < 10 && harvesters.length >= 10 && upgraders.length >= 10 && Game.spawns[spawnName].room.energyAvailable >= 350) {
    //         var newName = 'Builder' + Game.time;
    //         console.log('Spawning new builder: ' + newName);
    //         Game.spawns[spawnName].spawnCreep([WORK,WORK,CARRY,MOVE,MOVE], newName,
    //             {memory: {role: 'builder'}});
    //     }
    // },
    //
    // spawnUpgraders: function() {
    //     var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    //     var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    //     console.log('Upgraders: ' + upgraders.length);
    //
    //     if(upgraders.length < 10 && harvesters.length >= 10 && Game.spawns[spawnName].room.energyAvailable >= 350) {
    //         var newName = 'Upgrader' + Game.time;
    //         console.log('Spawning new upgrader: ' + newName);
    //         Game.spawns[spawnName].spawnCreep([WORK,WORK,CARRY,MOVE,MOVE], newName,
    //             {memory: {role: 'upgrader'}});
    //     }
    // }

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
                    let newName = creepRole + Game.time;
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
    }
};

module.exports = logicSpawnDespawn;
