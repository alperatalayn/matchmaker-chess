import _ from 'underscore'

export default function (lobby, opts) {
    var pool = lobby;

    opts = _(opts).defaults({
        tuningDelay: 1000
    });

    /**
     * Maintain each player's MMR until a player remains unnmatched for --opts.tuningDelay-- time (ms) at
     * which point start adjusting that player's MMR closer to the pool's average with each tick (reaching exact pool
     * average within 3 seconds). This adjustment continues as the pool's average changes from newly joining players.
     */
    return function () {
        var avgUnadjustedMMR,
            sum,
            cycleTime = new Date().getTime();

        sum = _(pool).reduce(function (carry, player) {
            return carry + player.MMR;
        }, 0);

        avgUnadjustedMMR = Math.floor(sum / pool.length);

        _(pool).each(function (player) {
            var poolTime = cycleTime - player.time, diff;

            if (poolTime > opts.tuningDelay) {
                diff = avgUnadjustedMMR - player.MMR;

                player.adjustedMMR = player.MMR + Math.min((poolTime - opts.tuningDelay) / 3000, 1) *diff;
            }
        });

        _(pool).sortBy("adjustedMMR");
    };
};
