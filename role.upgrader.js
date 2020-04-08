/*global
RESOURCE_ENERGY
ERR_NOT_IN_RANGE
module
Game
 */

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep, logicPathFinding) {

        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        } else if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
            if (creep.memory.target) {
                logicPathFinding.detachFromSource(creep);
                creep.memory.target = false;
            }
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            // else {
            //     if (creep.room.controller.sign.username != "martinw89") {
            //         if(creep.signController(creep.room.controller, "HELLO MY NAME IS MARTIN") == ERR_NOT_IN_RANGE) {
            //             creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            //         }
            //     }
            // }
        } else {
            // let closest_source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            // if(creep.harvest(closest_source) == ERR_NOT_IN_RANGE) {
            //     creep.moveTo(closest_source, {visualizePathStyle: {stroke: '#ffaa00'}});
            // }
            let sourceTarget;
            if (!creep.memory.target) {
                sourceTarget = logicPathFinding.pickSource(creep);
                creep.memory.target = sourceTarget.id;
                logicPathFinding.attachToSource(creep);
            }
            let source = Game.getObjectById(creep.memory.target);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleUpgrader;
