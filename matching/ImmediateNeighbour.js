import _ from 'underscore'

export default function (lobby, callback, opts) {
    var pool = lobby;

    opts = _(opts).defaults({threshold: 0});

    /*
     * The pool is sorted by (adjusted) MMR, so it is enough to simply check every player's
     * neighbour for a valid match based on the given thresholds. Matched pairs are emitted
     * and removed from the pool mid-cycle. Several matches can be emitted per matching cycle
     */
    return function () {
        var m1, m2, i, t, p1, p2;

        for (i = 0; i < pool.length; i++) {
            if (pool.length == 1 || i == pool.length - 1) {
                return;
            }

            p1 = pool[i];
            p2 = pool[i + 1];

            if (Math.abs(p1.adjustedMMR - p2.adjustedMMR) < opts.threshold) {
                pool.splice(i + 1, 1);
                pool.splice(i, 1);

                callback.apply(this, [p1, p2]);
            }
        }
    };
};
