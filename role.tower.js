/* global
FIND_STRUCTURES
FIND_MY_STRUCTURES
module
FIND_HOSTILE_CREEPS
*/


var roleTower = {
    /** @param {Tower} tower **/
    run: function(tower) {
        let self = this;
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        } else {
            self.repair(tower);
        }
    },

    repair: function(tower) {
        let target;
        //Try to repair the important owned buildings first
        target = tower.pos.findClosestByRange(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                return structure.hits < structure.hitsMax;
            }
        });
        //If there aren't any owned buildings to repair, fix up the roads etc.
        if(target == null) {
            target = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.hits < structure.hitsMax;
                }
            });
        }
        if(target) {
            tower.repair(target);
        }
    }
};

module.exports = roleTower;
