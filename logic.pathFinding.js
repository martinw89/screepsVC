/* global
FIND_SOURCES_ACTIVE
Memory
module
 */

var logicPathFinding = {

    /** @param {Creep} creep
        @returns {Source}
        **/
    pickSource: function (creep) {
        let activeSources = creep.room.find(FIND_SOURCES_ACTIVE);
        let maxCreeps = 5;

        activeSources.forEach(function (source) {
            if (Memory.sources[source.id] == undefined) {
                Memory.sources[source.id] = [];
            }
        });

        //sort by how many creeps are associated to each source
        activeSources.sort(function(a,b) {
            return Memory.sources[a.id].length - Memory.sources[b.id].length;
        });

        //try the closest first
        let closestSource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

        //it looks like if creeps surround the source, findClosestByPath cannot
        //find a path and returns null. Catch that condition and send the creep to the
        //source with the least creeps.
        //Since we reserve a source before actaully arriving there, we can hopefully
        //arrive around the time another creep is leaving
        if (closestSource == null) {
            return activeSources[0];
        } else if (Memory.sources[closestSource.id].length < maxCreeps) {
            return closestSource;
        } else {
            return activeSources[0];
        }
    },

    attachToSource: function(creep) {
        if ( ! Memory.sources[creep.memory.target].includes(creep.id) && creep.id != null) {
            Memory.sources[creep.memory.target].push(creep.id);
        }
    },

    detachFromSource: function(creep) {
        let index = Memory.sources[creep.memory.target].indexOf(creep.id);
        if(index > -1) {
            Memory.sources[creep.memory.target].splice(index, 1);
        }
    }
};

module.exports = logicPathFinding;
