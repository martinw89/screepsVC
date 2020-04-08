/* global
RESOURCE_ENERGY
Game
FIND_STRUCTURES
FIND_MY_STRUCTURES
ERR_NOT_IN_RANGE
module
*/

var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep, logicPathFinding) {

        if(creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repairing = false;
            creep.say('🔄 harvest');
        } else if(!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
            creep.memory.repairing = true;
            creep.say('🛠 repair');
            if (creep.memory.target) {
                logicPathFinding.detachFromSource(creep);
                creep.memory.target = false;
            }
        }

        if(creep.memory.repairing) {
            let targets;
            //Try to repair the important owned buildings first
            targets = creep.room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return structure.hits < structure.hitsMax;
                }
            });
            //If there aren't any owned buildings to repair, fix up the roads etc.
            if(targets.length < 1) {
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.hits < structure.hitsMax;
                    }
                });
            }
            if(targets.length) {
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#99ff99'}});
                }
            }
        } else {
            let sourceTarget;
            if (!creep.memory.target) {
                sourceTarget = logicPathFinding.pickSource(creep);
                creep.memory.target = sourceTarget.id;
                logicPathFinding.attachToSource(creep);
            }
            //var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(Game.getObjectById(creep.memory.target)) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.target), {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleRepairer;
