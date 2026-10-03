/* Faded Thread module: 17-startup-final-loot.js | build 03 Oct 2026 */
resetGame();
        showHomeScreen();
        loop();
    

    // =====================================================================
    // FINAL PERFORMANCE + GUARANTEED BOSS LOOT CORRECTION
    // =====================================================================
    (function installGuaranteedBossLootFinal(){
      'use strict';
      const priorAwardBossReward = awardBossReward;
      const CORE_BOSS_REWARDS = {
        needle:'starHalo', weaver:'royalCape', gearSaint:'clockEye',
        thornMother:'crystalMantle', drownedStar:'cosmicCloak',
        prismRegent:'goldenEye', ashSeraph:'ash', silkJudge:'silk',
        hollowCrown:'crownShard', neonWarden:'cometThread',
        clockAbyss:'anchorPearl', shatteredChoir:'prismHeart',
        crimsonArchbishop:'cathedralBell', shadowMerchant:'shadowCoin',
        auroraKnight:'auroraPin', marrowQueen:'marrowCharm',
        starlitRelic:'relicStar', firstStitch:'threadCrown'
      };
      awardBossReward = function awardBossRewardGuaranteed(kind){
        // Existing reward/UI/save logic still runs first. No probability check is
        // permitted on the boss-kill path. The 2% roll exists only in wild spawn logic.
        priorAwardBossReward(kind);
        const guaranteed = new Set();
        if (CORE_BOSS_REWARDS[kind]) guaranteed.add(CORE_BOSS_REWARDS[kind]);
        const maps = [
          typeof ENDGAME_BOSS_REWARD_MAP_V27 !== 'undefined' ? ENDGAME_BOSS_REWARD_MAP_V27 : null,
          typeof TRUE_V30_BOSS_REWARD_MAP !== 'undefined' ? TRUE_V30_BOSS_REWARD_MAP : null,
          typeof V31_BOSS_REWARD_MAP !== 'undefined' ? V31_BOSS_REWARD_MAP : null,
          typeof V32_BOSS_REWARD_MAP !== 'undefined' ? V32_BOSS_REWARD_MAP : null
        ].filter(Boolean);
        for (const map of maps) {
          const reward = map[kind];
          if (reward && reward.equipment) guaranteed.add(reward.equipment);
        }
        // Future/expansion boss items are also discovered from bossSource, so a
        // later boss cannot accidentally inherit the 2% wild rule.
        for (const def of EQUIPMENT_TYPES || []) {
          if (def && def.bossSource === kind) guaranteed.add(def.id);
        }
        if (kind === 'firstStitch') guaranteed.add('jesusBoots');
        for (const id of guaranteed) {
          if (!(player.collectedEquipment || []).includes(id)) {
            collectEquipmentItem(id, 'boss');
          }
          WORLD_BOSS_REWARD_EQUIPMENT_IDS.add(id);
        }
      };
    })();
