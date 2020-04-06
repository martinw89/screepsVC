/*global
Game
ERR_NOT_IN_RANGE
RESOURCE_ENERGY
module
FIND_FLAGS
FIND_STRUCTURES
STRUCTURE_SPAWN
STRUCTURE_EXTENSION
STRUCTURE_TOWER */

let logicPathFinding = require('logic.pathFinding');

var roleHarvester = {

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

            let muster = false;
            //If there aren't any open energy stores, don't just stand like a dumbass next to a source
            if (targets.length < 1) {
                targets = logicPathFinding.muster(creep);
                muster = true;
                //console.log(targets);
                // creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            //Make sure spawners and extensions (alphabetically before 'tower') get energy first
            } else if (targets.length > 1) {
                targets.sort(function (a,b) {
                    return a.structureType.localeCompare(b.structureType);
                });
            }

            if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE || muster) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};

module.exports = roleHarvester;
