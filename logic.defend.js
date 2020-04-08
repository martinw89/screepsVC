/*global
module
FIND_HOSTILE_CREEPS
FIND_MY_SPAWNS
 */


var logicDefend = {
    checkInvaders: function(room) {
        let hostileCreeps = room.find(FIND_HOSTILE_CREEPS);
        if (hostileCreeps.length > 0) {
            return true;
        } else {
            return false;
        }
    },

    checkCriticalAttack: function(room) {
        let criticalAttack = false;
        let spawns = room.find(FIND_MY_SPAWNS);
        let controllerAttackers = room.controller.pos.findInRange(FIND_HOSTILE_CREEPS, 1.99).length;

        if(spawns != null) {
            criticalAttack = spawns.some(function(spawn) {
                return spawn.hits < spawn.hitsmax;
            });
            if (criticalAttack) {
                console.log('spawns');
            }
        }
        if (controllerAttackers > 0) {
            criticalAttack = true;
            console.log('controller');
        }

        return criticalAttack;
    }
};

module.exports = logicDefend;
