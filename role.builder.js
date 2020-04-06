/* global
RESOURCE_ENERGY
Game
FIND_MY_CONSTRUCTION_SITES
ERR_NOT_IN_RANGE
module
*/

let logicPathFinding = require('logic.pathFinding');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        } else if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
            if (creep.memory.target) {
                logicPathFinding.detachFromSource(creep);
                creep.memory.target = false;
            }
        }

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
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

module.exports = roleBuilder;
