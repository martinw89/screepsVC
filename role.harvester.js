/*global
Game
ERR_NOT_IN_RANGE
RESOURCE_ENERGY
module
console
FIND_FLAGS
FIND_STRUCTURES
STRUCTURE_SPAWN
STRUCTURE_EXTENSION
STRUCTURE_TOWER */

let logicPathFinding = require('logic.pathFinding');

var roleHarvester = {

    /** @param {Creep} creep **/
    runBak: function(creep) {
        let debug = false ;
        debug ? console.log('Running harvester functions for ' + creep.name) : null;

        if(creep.store.getFreeCapacity() > 0) {

            debug ? console.log(creep.name + ' is harvesting more and has ' + creep.store.getFreeCapacity() + ' free.') : null;
            let sourceTarget;

            if (!creep.memory.target) {
                sourceTarget = logicPathFinding.pickSource(creep);
                creep.memory.target = sourceTarget.id;
                logicPathFinding.attachToSource(creep);
            }
            // var sources = creep.room.find(FIND_SOURCES_ACTIVE);
            // if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            //     creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            // }
            if(creep.harvest(Game.getObjectById(creep.memory.target)) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.target), {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            if (creep.memory.target) {
                logicPathFinding.detachFromSource(creep);
                creep.memory.target = false;
            }

            var targets = creep.room.find(FIND_STRUCTURES, {
            // var targets = Game.spawns['SpawnAlpha'].room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });

            debug ? console.log(creep.name + ' is full and is looking for targets.') : null;

            //let targets = Game.spawns;

            debug ? console.log(targets) : null;

            if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    },

    run: function(creep) {
        if (creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
            creep.memory.harvesting = false;
            creep.say('🚛 deposite');
            if (creep.memory.target) {
                logicPathFinding.detachFromSource(creep);
                creep.memory.target = false;
            }
        } else if (!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.harvesting = true;
            creep.say('⛏ harvest');

            creep.memory.target = logicPathFinding.pickSource(creep).id;
            logicPathFinding.attachToSource(creep);
        }

        if (creep.memory.harvesting) {
            if(creep.harvest(Game.getObjectById(creep.memory.target)) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.target), {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            var targets = creep.room.find(FIND_STRUCTURES, {
            // var targets = Game.spawns['SpawnAlpha'].room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            //If there aren't any open energy stores, don't just stand like a dumbass next to a source
            if (targets.length < 1) {
                targets = creep.room.find(FIND_FLAGS), {
                    filter: (flag) => {
                        return (flag.name.includes('HarvesterMuster'));
                    }
                };
                //console.log(targets);
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            //Make sure spawners and extensions (alphabetically before 'tower') get energy first
            } else if (targets.length > 1) {
                targets.sort(function (a,b) {
                    return a.structureType.localeCompare(b.structureType);
                });
            }
            if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};

module.exports = roleHarvester;
