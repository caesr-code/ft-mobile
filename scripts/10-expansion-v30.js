/* Faded Thread module: 10-expansion-v30.js | build 03 Oct 2026 */
// ─────────────────────────────────────────────────────────────────
        // TRUE v30 EXPANSION
        // Adds 30 realms, 30 enemies, 15 bosses, 30 world items and 15 boss rewards.
        // Also reinforces boss-fight scrolling/platform generation so boss fights
        // continue as normal side-scrolling worlds instead of locked arenas.
        // ─────────────────────────────────────────────────────────────────
        const TRUE_V30_REALMS = [
            { id: "rustedNursery", name: "Rusted Nursery", target: 68, enemies: [59,60], color: "#c99366" },
            { id: "paperMoon", name: "Paper Moon", target: 72, enemies: [61,62], color: "#f0e6ff" },
            { id: "bossV30_1", name: "The Rusted Nanny", boss: "rustedNanny", endgame: true },
            { id: "lanternBog", name: "Lantern Bog", target: 76, enemies: [63,64], color: "#98ffba" },
            { id: "sapphireRift", name: "Sapphire Rift", target: 80, enemies: [65,66], color: "#72b8ff" },
            { id: "bossV30_2", name: "The Paper Moon", boss: "paperMoonBoss", endgame: true },
            { id: "copperCanopy", name: "Copper Canopy", target: 84, enemies: [67,68], color: "#df8f45" },
            { id: "buriedCarnival", name: "Buried Carnival", target: 88, enemies: [69,70], color: "#ff7ab8" },
            { id: "bossV30_3", name: "The Lantern Maw", boss: "lanternMaw", endgame: true },
            { id: "mirrorRain", name: "Mirror Rain", target: 92, enemies: [71,72], color: "#c8fbff" },
            { id: "ivoryFoundry", name: "Ivory Foundry", target: 96, enemies: [73,74], color: "#fff0d0" },
            { id: "bossV30_4", name: "The Sapphire Split", boss: "sapphireSplit", endgame: true },
            { id: "mothCatacombs", name: "Moth Catacombs", target: 100, enemies: [75,76], color: "#d6c7ff" },
            { id: "emberChoir", name: "Ember Choir", target: 104, enemies: [77,78], color: "#ff8c5a" },
            { id: "bossV30_5", name: "The Copper Gardener", boss: "copperGardener", endgame: true },
            { id: "opalArchive", name: "Opal Archive", target: 108, enemies: [79,80], color: "#f6d5ff" },
            { id: "scarletHarbor", name: "Scarlet Harbor", target: 112, enemies: [81,82], color: "#ff4c68" },
            { id: "bossV30_6", name: "The Buried Ringmaster", boss: "buriedRingmaster", endgame: true },
            { id: "duskAqueduct", name: "Dusk Aqueduct", target: 116, enemies: [83,84], color: "#8bbdff" },
            { id: "boneObservatory", name: "Bone Observatory", target: 120, enemies: [85,86], color: "#ffe0c8" },
            { id: "bossV30_7", name: "The Mirror Widow", boss: "mirrorWidow", endgame: true },
            { id: "staticVineyard", name: "Static Vineyard", target: 124, enemies: [87,88], color: "#b6ff70" },
            { id: "frostedTheatre", name: "Frosted Theatre", target: 128, enemies: [59,65,71,83], color: "#d8f7ff" },
            { id: "bossV30_8", name: "The Ivory Furnace", boss: "ivoryFurnace", endgame: true },
            { id: "gildedSwamp", name: "Gilded Swamp", target: 132, enemies: [60,64,79,87], color: "#e6d36a" },
            { id: "velvetMeteor", name: "Velvet Meteor", target: 136, enemies: [62,70,76,82], color: "#d744ff" },
            { id: "bossV30_9", name: "The Moth Abbot", boss: "mothAbbot", endgame: true },
            { id: "blackglassSea", name: "Blackglass Sea", target: 140, enemies: [66,72,80,84], color: "#8df6ff" },
            { id: "threadedSun", name: "Threaded Sun", target: 144, enemies: [68,74,78,86], color: "#ffe76e" },
            { id: "bossV30_10", name: "The Ember Cantor", boss: "emberCantor", endgame: true },
            { id: "bossV30_11", name: "The Opal Librarian", boss: "opalLibrarian", endgame: true },
            { id: "bossV30_12", name: "The Scarlet Admiral", boss: "scarletAdmiral", endgame: true },
            { id: "bossV30_13", name: "The Dusk Engineer", boss: "duskEngineer", endgame: true },
            { id: "bossV30_14", name: "The Bone Astronomer", boss: "boneAstronomer", endgame: true },
            { id: "bossV30_15", name: "The Static Harvest", boss: "staticHarvest", endgame: true }
        ];

        const TRUE_V30_ENEMIES = {
            59:{name:"Rust Cradle",hp:6,speed:1.4,width:70,height:70,behaviorFlags:["walker","armor","lunge"]},
            60:{name:"Nail Wisp",hp:5,speed:2.8,width:54,height:48,behaviorFlags:["floating","projector","zigzag"]},
            61:{name:"Folded Imp",hp:5,speed:2.5,width:58,height:58,behaviorFlags:["charger","paper_dash"]},
            62:{name:"Moon Moth",hp:6,speed:2.1,width:76,height:46,behaviorFlags:["flying","sine_wave","homing"]},
            63:{name:"Bog Lantern",hp:7,speed:1.6,width:62,height:84,behaviorFlags:["floating","area_glow","projector"]},
            64:{name:"Mud Needleback",hp:8,speed:1.2,width:92,height:58,behaviorFlags:["heavy","shielded_front"]},
            65:{name:"Rift Minnow",hp:5,speed:3.2,width:76,height:34,behaviorFlags:["phase_drift","fast"]},
            66:{name:"Sapphire Bruiser",hp:9,speed:1.1,width:90,height:96,behaviorFlags:["heavy","ground_slam"]},
            67:{name:"Copper Beetle",hp:7,speed:2.0,width:66,height:52,behaviorFlags:["walker","shielded_front"]},
            68:{name:"Canopy Slicer",hp:6,speed:2.9,width:74,height:50,behaviorFlags:["flying","charger"]},
            69:{name:"Carnival Husk",hp:8,speed:1.8,width:72,height:88,behaviorFlags:["bounce","projector"]},
            70:{name:"Buried Juggler",hp:7,speed:2.4,width:68,height:70,behaviorFlags:["arc_projectile","evasive"]},
            71:{name:"Mirror Leech",hp:6,speed:2.7,width:64,height:44,behaviorFlags:["reflective","homing"]},
            72:{name:"Rain Shard",hp:5,speed:3.0,width:46,height:76,behaviorFlags:["falling","projector"]},
            73:{name:"Ivory Smith",hp:9,speed:1.4,width:82,height:94,behaviorFlags:["heavy","hammer"]},
            74:{name:"Foundry Sprite",hp:6,speed:2.6,width:58,height:58,behaviorFlags:["floating","ember_trail"]},
            75:{name:"Moth Monk",hp:8,speed:1.7,width:76,height:86,behaviorFlags:["shielded_front","teleport_short"]},
            76:{name:"Catacomb Larva",hp:7,speed:2.2,width:92,height:42,behaviorFlags:["crawler","poison_zone"]},
            77:{name:"Ember Singer",hp:7,speed:2.0,width:66,height:78,behaviorFlags:["projector","pulse"]},
            78:{name:"Choir Coal",hp:10,speed:1.0,width:88,height:100,behaviorFlags:["heavy","explodes_on_death"]},
            79:{name:"Opal Scribe",hp:7,speed:2.1,width:62,height:74,behaviorFlags:["floating","summoner"]},
            80:{name:"Archive Fang",hp:8,speed:2.8,width:80,height:46,behaviorFlags:["charger","book_dash"]},
            81:{name:"Scarlet Sailor",hp:8,speed:2.2,width:72,height:82,behaviorFlags:["walker","hook_pull"]},
            82:{name:"Harbor Siren",hp:7,speed:2.5,width:70,height:62,behaviorFlags:["floating","slow_field"]},
            83:{name:"Dusk Gearling",hp:8,speed:2.0,width:70,height:70,behaviorFlags:["gear_spin","boomerang_path"]},
            84:{name:"Aqueduct Eel",hp:7,speed:3.1,width:100,height:34,behaviorFlags:["sine_wave","fast"]},
            85:{name:"Bone Star",hp:9,speed:1.9,width:84,height:84,behaviorFlags:["orbiting","projector"]},
            86:{name:"Observatory Giant",hp:12,speed:0.9,width:112,height:122,behaviorFlags:["heavy","gravitational_pull"]},
            87:{name:"Static Grapevine",hp:8,speed:1.5,width:74,height:96,behaviorFlags:["rooted","electric_zone"]},
            88:{name:"Harvest Sprite",hp:7,speed:3.0,width:58,height:58,behaviorFlags:["flying","dash_combo"]}
        };

        const TRUE_V30_BOSSES = {
            rustedNanny:{name:"THE RUSTED NANNY",hp:42,width:180,height:245,color:"#c99366"},
            paperMoonBoss:{name:"THE PAPER MOON",hp:44,width:190,height:250,color:"#f0e6ff"},
            lanternMaw:{name:"THE LANTERN MAW",hp:46,width:200,height:255,color:"#98ffba"},
            sapphireSplit:{name:"THE SAPPHIRE SPLIT",hp:48,width:205,height:260,color:"#72b8ff"},
            copperGardener:{name:"THE COPPER GARDENER",hp:50,width:210,height:265,color:"#df8f45"},
            buriedRingmaster:{name:"THE BURIED RINGMASTER",hp:52,width:215,height:270,color:"#ff7ab8"},
            mirrorWidow:{name:"THE MIRROR WIDOW",hp:54,width:220,height:275,color:"#c8fbff"},
            ivoryFurnace:{name:"THE IVORY FURNACE",hp:56,width:225,height:280,color:"#fff0d0"},
            mothAbbot:{name:"THE MOTH ABBOT",hp:58,width:230,height:285,color:"#d6c7ff"},
            emberCantor:{name:"THE EMBER CANTOR",hp:60,width:235,height:290,color:"#ff8c5a"},
            opalLibrarian:{name:"THE OPAL LIBRARIAN",hp:62,width:240,height:295,color:"#f6d5ff"},
            scarletAdmiral:{name:"THE SCARLET ADMIRAL",hp:64,width:245,height:300,color:"#ff4c68"},
            duskEngineer:{name:"THE DUSK ENGINEER",hp:66,width:250,height:305,color:"#8bbdff"},
            boneAstronomer:{name:"THE BONE ASTRONOMER",hp:68,width:255,height:310,color:"#ffe0c8"},
            staticHarvest:{name:"THE STATIC HARVEST",hp:72,width:260,height:315,color:"#b6ff70"}
        };

        const TRUE_V30_WORLD_ITEMS = [
            ["rustedThimble","Rusted Thimble","#c99366","RUST","chest","Extra contact safety and stronger guard effects."],
            ["paperFeather","Paper Feather","#f0e6ff","PAPR","back","Slightly slower falling and smoother turns."],
            ["bogLamp","Bog Lamp","#98ffba","BOG","orbit","Heals appear a little more often visually and hidden drops glow."],
            ["sapphireNeedle","Sapphire Needle","#72b8ff","SAPH","hand","Larger slash and stronger boss hit spark."],
            ["copperLeaf","Copper Leaf","#df8f45","LEAF","hat","More movement speed and a copper head charm."],
            ["carnivalBell","Carnival Bell","#ff7ab8","RING","orbit","Enemy kills award more score."],
            ["mirrorThread","Mirror Thread","#c8fbff","MIRR","trail","Wider echo-like slash trail."],
            ["ivoryButton","Ivory Button","#fff0d0","IVRY","chest","Adds one uncapped life when equipped."],
            ["mothPin","Moth Pin","#d6c7ff","MOTH","hat","Safer falling and a moth pin visual."],
            ["emberRosary","Ember Rosary","#ff8c5a","FIRE","orbit","Kills can burst with extra score."],
            ["opalLens","Opal Lens","#f6d5ff","OPAL","face","Attack height increases."],
            ["scarletHook","Scarlet Hook","#ff4c68","HOOK","hand","Slash width increases."],
            ["duskCapacitor","Dusk Capacitor","#8bbdff","DUSK","trail","Improves acceleration and air control."],
            ["boneCompass","Bone Compass","#ffe0c8","BONE","face","Longer invulnerability after damage."],
            ["staticVine","Static Vine","#b6ff70","STAT","chest","Thorn aura style contact damage."],
            ["frostTicket","Frost Ticket","#d8f7ff","FRST","hand","Wider slash and slower fall during down attacks."],
            ["gildedMoss","Gilded Moss","#e6d36a","MOSS","feet","Safer landing control and pogo boost."],
            ["velvetShard","Velvet Shard","#d744ff","VELV","trail","Faster movement with violet trail."],
            ["blackglassPearl","Blackglass Pearl","#8df6ff","GLAS","chest","Chance to ignore damage."],
            ["sunSpindle","Sun Spindle","#ffe76e","SUN","orbit","Healing pickups restore more."],
            ["nurseryKey","Nursery Key","#d0a070","KEY","hand","Small score and range boost."],
            ["riftRibbon","Rift Ribbon","#9db8ff","RIBN","back","Unlocks sky dash."],
            ["canopyCharm","Canopy Charm","#86ff9d","TREE","hat","Speed and fall safety."],
            ["circusCoin","Circus Coin","#ffcc66","COIN","orbit","Enemy score boost."],
            ["rainPendant","Rain Pendant","#aeefff","RAIN","face","Smoother movement control."],
            ["foundryGlove","Foundry Glove","#ffaa66","GLOVE","hand","Boss slash range boost."],
            ["catacombSeal","Catacomb Seal","#cdb8ff","SEAL","chest","Extra life while equipped."],
            ["choirAsh","Choir Ash","#ffb088","ASH","trail","Ash-feather score effect."],
            ["archiveQuill","Archive Quill","#ffe6ff","QUIL","hand","Wider attacks and small score boost."],
            ["harvestCrown","Harvest Crown","#ccff88","HVST","hat","Late-game crown, score and speed boost."]
        ];

        const TRUE_V30_BOSS_ITEMS = [
            ["nannyNeedle","Nanny Needle","#c99366","NANY","hand","Boss Reward. Stronger boss slash damage and wider attacks.","rustedNanny"],
            ["moonFoldCape","Moon Fold Cape","#f0e6ff","MOON","back","Boss Reward. Sky Dash and slower falling.","paperMoonBoss"],
            ["mawLantern","Maw Lantern","#98ffba","MAW","orbit","Boss Reward. Hidden drops glow and kills build healing charge.","lanternMaw"],
            ["splitSapphire","Split Sapphire","#72b8ff","SPLT","face","Boss Reward. Chance to reflect damage.","sapphireSplit"],
            ["gardenerShears","Gardener Shears","#df8f45","SHER","hand","Boss Reward. Thorn slash and larger attack box.","copperGardener"],
            ["ringmasterHat","Ringmaster Hat","#ff7ab8","RING","hat","Boss Reward. Big score boost.","buriedRingmaster"],
            ["widowMirror","Widow Mirror","#c8fbff","WDOW","chest","Boss Reward. Guard and mirror style bonus.","mirrorWidow"],
            ["furnaceHeart","Furnace Heart","#fff0d0","FURN","chest","Boss Reward. +2 uncapped lives while equipped.","ivoryFurnace"],
            ["abbotWings","Abbot Wings","#d6c7ff","ABBT","back","Boss Reward. Safer falling and higher pogo bounce.","mothAbbot"],
            ["cantorBell","Cantor Bell","#ff8c5a","CANT","orbit","Boss Reward. Kill-heal charge and ash score effect.","emberCantor"],
            ["opalCodex","Opal Codex","#f6d5ff","CODE","hand","Boss Reward. Wider rift slash.","opalLibrarian"],
            ["admiralAnchor","Admiral Anchor","#ff4c68","ANCH","chest","Boss Reward. Heavy anchor control and longer invulnerability.","scarletAdmiral"],
            ["engineerGear","Engineer Gear","#8bbdff","GEAR","hand","Boss Reward. Speed, attack height and dash control.","duskEngineer"],
            ["astronomerHalo","Astronomer Halo","#ffe0c8","STAR","hat","Boss Reward. Life and score boost.","boneAstronomer"],
            ["staticScythe","Static Scythe","#b6ff70","SCYT","hand","Boss Reward. Final v30 attack range and score boost.","staticHarvest"]
        ];

        const TRUE_V30_BOSS_REWARD_MAP = Object.fromEntries(TRUE_V30_BOSS_ITEMS.map(item => [item[6], { name: item[1], equipment: item[0] }]));
        const TRUE_V30_REALM_BY_ID = Object.fromEntries(TRUE_V30_REALMS.filter(r => r.id).map(r => [r.id, r]));
        const TRUE_V30_ENEMY_TYPES = new Set(Object.keys(TRUE_V30_ENEMIES).map(Number));

        function makeV30BossActions(color) {
            return [
                { name: "v30 volley", telegraph: 320, spawn(b) { for (let a = -0.45; a <= 0.45; a += 0.3) spawnBossProjectile({ x: b.x - worldX, y: b.y + b.height / 2, vx: -7 * Math.cos(a), vy: 7 * Math.sin(a), width: 16, height: 16, life: 210, color, shape: "shard" }); } },
                { name: "v30 beam", telegraph: 430, spawn(b) { spawnBossBeam({ x: player.worldX - worldX, y: 0, width: 34, height: window.innerHeight, life: 44, color }); } },
                { name: "v30 field", telegraph: 460, spawn(b) { spawnBossHazard({ x: b.x - worldX, y: b.y + b.height / 2, width: 10, height: 10, maxRadius: 155, life: 70, growTime: 70, color, shape: "ring" }); } },
                { name: "v30 floor", telegraph: 500, spawn(b) { const startX = player.worldX - 140; for (let i = 0; i < 4; i++) spawnBossHazard({ x: startX + i * 80 - worldX, y: window.innerHeight - 90, width: 56, height: 44, life: 90, growTime: 18, color, shape: "spikes" }); } }
            ];
        }

        (function installTrueV30Expansion() {
            const firstStitchIndex = REALM_FLOW.findIndex(r => r.id === "boss3" || r.boss === "firstStitch");
            if (!REALM_FLOW.some(r => r.id === "rustedNursery")) {
                if (firstStitchIndex >= 0) REALM_FLOW.splice(firstStitchIndex, 0, ...TRUE_V30_REALMS);
                else REALM_FLOW.push(...TRUE_V30_REALMS);
            }
            Object.assign(BOSS_DEFS, TRUE_V30_BOSSES);
            for (const [kind, def] of Object.entries(TRUE_V30_BOSSES)) {
                BOSS_ACTIONS[kind] = makeV30BossActions(def.color);
                BOSS_ACTIONS_UNLOCKED_COUNT[kind] = 4;
            }
            for (const item of [...TRUE_V30_WORLD_ITEMS, ...TRUE_V30_BOSS_ITEMS]) {
                const obj = { id: item[0], name: item[1], color: item[2], short: item[3], slot: item[4], effect: item[5] };
                if (item[6]) { obj.bossOnly = true; obj.bossSource = item[6]; }
                if (!EQUIPMENT_TYPES.some(existing => existing.id === obj.id)) EQUIPMENT_TYPES.push(obj);
                if (obj.bossOnly) { BOSS_REWARD_EQUIPMENT_IDS.add(obj.id); WORLD_BOSS_REWARD_EQUIPMENT_IDS.add(obj.id); }
            }
        })();

        const createEnemyPreV30 = createEnemy;
        createEnemy = function createEnemyV30(x, y, type) {
            const def = TRUE_V30_ENEMIES[type];
            if (!def) return createEnemyPreV30(x, y, type);
            enemies.push({ x, y, startX: x, startY: y, type, hp: def.hp, speed: def.speed, dir: -1, width: def.width, height: def.height, floatOffset: Math.random() * 100, behaviorFlags: def.behaviorFlags || [] });
        };

        const extendWorldPreV30 = extendWorld;
        extendWorld = function extendWorldV30(targetX) {
            const data = TRUE_V30_REALM_BY_ID[currentRealm];
            if (!data || data.boss) return extendWorldPreV30(targetX);
            while (maxReachedX < targetX) {
                let lastP = platforms[platforms.length - 1];
                let gap = 115 + Math.random() * 125;
                let nextX = lastP.x + lastP.width + gap;
                let heightChange = (Math.random() - 0.5) * 210;
                let nextY = Math.max(150, Math.min(canvas.height - 220, lastP.y + heightChange));
                let nextW = 200 + Math.random() * 260;
                let nextIndex = lastP.index + 1;
                createPlatform(nextX, nextY, nextW, nextIndex);
                if (Math.random() > 0.50) {
                    const enemyChoices = data.enemies || [59, 60];
                    const randType = enemyChoices[Math.floor(Math.random() * enemyChoices.length)];
                    const enemyDef = TRUE_V30_ENEMIES[randType] || { height: 60, behaviorFlags: [] };
                    const enemyX = nextX + 50 + Math.random() * Math.max(50, nextW - 100);
                    const flags = enemyDef.behaviorFlags || [];
                    const flying = flags.some(flag => ["floating","flying","homing","projector","sine_wave","phase_drift","falling"].includes(flag));
                    const enemyY = flying ? nextY - 140 : nextY - Math.max(42, enemyDef.height * 0.82);
                    createEnemy(enemyX, enemyY, randType);
                }
                if (Math.random() < 0.15) spawnHeal(nextX + nextW / 2, nextY - 40);
                if (eligibleWorldDropIds().length > 0 && nextIndex >= nextMagicPlatformIndex) {
                    let itemX = nextX + 35 + Math.random() * Math.max(20, nextW - 70);
                    spawnMagicItem(itemX, nextY - 70);
                }
                maxReachedX = nextX + nextW;
            }
        };

        const updateUIPreV30 = updateUI;
        updateUI = function updateUIV30() {
            updateUIPreV30();
            const data = TRUE_V30_REALM_BY_ID[currentRealm];
            if (data && data.color) document.getElementById("ui").style.color = data.color;
        };

        const realmAccentPreV30 = realmAccent;
        realmAccent = function realmAccentV30() {
            const data = TRUE_V30_REALM_BY_ID[currentRealm];
            if (data && data.color) return hexToRgb(data.color);
            if (boss.active && TRUE_V30_BOSSES[boss.kind]) return hexToRgb(TRUE_V30_BOSSES[boss.kind].color);
            return realmAccentPreV30();
        };

        const awardBossRewardPreV30 = awardBossReward;
        awardBossReward = function awardBossRewardV30(kind) {
            const reward = TRUE_V30_BOSS_REWARD_MAP[kind];
            if (!reward) return awardBossRewardPreV30(kind);
            player.bossRewards = player.bossRewards || [];
            if (!player.bossRewards.includes(reward.name)) player.bossRewards.push(reward.name);
            collectEquipmentItem(reward.equipment, "boss");
            WORLD_BOSS_REWARD_EQUIPMENT_IDS.add(reward.equipment);
            showMagicNotice({ name: `${reward.name}: ${getEquipmentDef(reward.equipment).name}`, id: "bossReward" });
            saveGame();
        };

        const equipmentEffectTextPreV30 = equipmentEffectText;
        equipmentEffectText = function equipmentEffectTextV30(type) {
            const item = [...TRUE_V30_WORLD_ITEMS, ...TRUE_V30_BOSS_ITEMS].find(it => it[0] === type);
            if (item) return item[5];
            return equipmentEffectTextPreV30(type);
        };

        const recalculateEquipmentEffectsPreV30 = recalculateEquipmentEffects;
        recalculateEquipmentEffects = function recalculateEquipmentEffectsV30() {
            recalculateEquipmentEffectsPreV30();
            const eq = player.equippedEquipment || [];
            const has = id => eq.includes(id);
            const rangeIds = ["sapphireNeedle","scarletHook","foundryGlove","archiveQuill","nannyNeedle","gardenerShears","opalCodex","staticScythe","nurseryKey"];
            const speedIds = ["copperLeaf","duskCapacitor","velvetShard","canopyCharm","engineerGear","harvestCrown"];
            const lifeIds = ["ivoryButton","catacombSeal","furnaceHeart","astronomerHalo"];
            const scoreIds = ["carnivalBell","circusCoin","ringmasterHat","harvestCrown","archiveQuill"];
            const fallIds = ["paperFeather","mothPin","moonFoldCape","abbotWings","canopyCharm"];
            for (const id of rangeIds) if (has(id)) { player.attackBox.width += 28; player.attackBox.height += 14; }
            for (const id of speedIds) if (has(id)) { player.maxSpeed += 0.55; player.acceleration += 0.04; }
            for (const id of lifeIds) if (has(id)) player.maxLives += id === "furnaceHeart" ? 2 : 1;
            for (const id of fallIds) if (has(id)) player.maxFallSpeed = Math.max(6.2, player.maxFallSpeed - 0.45);
            for (const id of scoreIds) if (has(id)) player.scoreBoost = true;
            if (has("riftRibbon") || has("moonFoldCape") || has("engineerGear")) player.skyDash = true;
            if (has("blackglassPearl") || has("splitSapphire")) player.crystalGuard = true;
            if (has("staticVine") || has("gardenerShears")) player.thornAura = true;
            if (has("sunSpindle")) player.sunSpool = true;
            if (has("boneCompass") || has("admiralAnchor")) player.clockSlow = true;
            if (has("emberRosary") || has("choirAsh") || has("cantorBell")) player.ashFeather = true;
            if (has("opalCodex") || has("mirrorThread")) player.riftSlash = true;
            if (has("mothPin") || has("abbotWings")) player.auroraPin = true;
            player.attackRange = Math.max(player.attackBox.width, player.attackBox.height) / 2;
        };

        const drawEnemyPreV30 = drawEnemy;
        drawEnemy = function drawEnemyV30(e, screenX) {
            const def = TRUE_V30_ENEMIES[e.type];
            if (!def) return drawEnemyPreV30(e, screenX);
            ctx.save();
            const t = Date.now();
            const cx = screenX + e.width / 2;
            const cy = e.y + e.height / 2;
            const realm = TRUE_V30_REALMS.find(r => (r.enemies || []).includes(e.type));
            const color = realm ? realm.color : "#ffffff";
            ctx.shadowColor = color;
            ctx.shadowBlur = 18;
            ctx.strokeStyle = color;
            ctx.fillStyle = "rgba(255,255,255,0.18)";
            ctx.lineWidth = 2;
            const pulse = 1 + Math.sin(t * 0.006 + e.floatOffset) * 0.12;
            if ((def.behaviorFlags || []).some(f => ["flying","floating","sine_wave","homing","projector"].includes(f))) {
                ctx.beginPath(); ctx.ellipse(cx, cy, e.width * 0.48 * pulse, e.height * 0.38, Math.sin(t * 0.003) * 0.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                for (let i = -1; i <= 1; i += 2) { ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + i * e.width * 0.55, cy + Math.sin(t * 0.01 + i) * 20); ctx.stroke(); }
            } else if ((def.behaviorFlags || []).includes("heavy")) {
                ctx.beginPath(); ctx.roundRect(cx - e.width/2, cy - e.height/2, e.width, e.height, 16); ctx.fill(); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(cx - e.width * 0.32, cy - e.height * 0.18); ctx.lineTo(cx + e.width * 0.32, cy + e.height * 0.18); ctx.moveTo(cx + e.width * 0.32, cy - e.height * 0.18); ctx.lineTo(cx - e.width * 0.32, cy + e.height * 0.18); ctx.stroke();
            } else {
                ctx.beginPath(); ctx.moveTo(cx, cy - e.height * 0.45); ctx.lineTo(cx + e.width * 0.42, cy); ctx.lineTo(cx, cy + e.height * 0.45); ctx.lineTo(cx - e.width * 0.42, cy); ctx.closePath(); ctx.fill(); ctx.stroke();
            }
            ctx.fillStyle = "rgba(255,255,255,0.95)";
            ctx.beginPath(); ctx.arc(cx - 5, cy - 6, 3, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(cx + 6, cy - 6, 3, 0, Math.PI * 2); ctx.fill();
            ctx.font = "bold 8px Courier New"; ctx.textAlign = "center"; ctx.fillText(String(e.type), cx, cy + e.height * 0.35);
            ctx.restore();
        };

        const drawBossPreV30 = drawBoss;
        drawBoss = function drawBossV30(screenX) {
            const def = TRUE_V30_BOSSES[boss.kind];
            if (!def) return drawBossPreV30(screenX);
            ctx.save();
            const t = Date.now(), cx = screenX, cy = boss.y + boss.height / 2, c = hexToRgb(def.color);
            const w = def.width, h = def.height;
            const aura = ctx.createRadialGradient(cx, cy, 10, cx, cy, 190);
            aura.addColorStop(0, `rgba(${c.r},${c.g},${c.b},0.38)`); aura.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = aura; ctx.beginPath(); ctx.arc(cx, cy, 190, 0, Math.PI * 2); ctx.fill();
            ctx.shadowColor = def.color; ctx.shadowBlur = 26; ctx.strokeStyle = def.color; ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.85)`; ctx.lineWidth = 3;
            function eye(ex, ey, r = 5, ec = '#fff') { ctx.save(); ctx.shadowBlur = 6; ctx.fillStyle = ec; ctx.beginPath(); ctx.arc(ex, ey, r, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }

            switch (boss.kind) {
                case "rustedNanny": {
                    // Rocking-chair silhouette, apron, cracked porcelain face, swaying knitting-needle arms
                    ctx.beginPath(); ctx.moveTo(cx, cy - h*0.46); ctx.quadraticCurveTo(cx + w*0.34, cy - h*0.08, cx + w*0.3, cy + h*0.44);
                    ctx.lineTo(cx - w*0.3, cy + h*0.44); ctx.quadraticCurveTo(cx - w*0.34, cy - h*0.08, cx, cy - h*0.46); ctx.closePath(); ctx.fill(); ctx.stroke();
                    ctx.fillStyle = 'rgba(255,245,235,0.3)'; ctx.beginPath(); ctx.moveTo(cx, cy - h*0.05); ctx.lineTo(cx + w*0.2, cy + h*0.4); ctx.lineTo(cx - w*0.2, cy + h*0.4); ctx.closePath(); ctx.fill();
                    ctx.fillStyle = 'rgba(255,240,225,0.92)'; ctx.beginPath(); ctx.arc(cx, cy - h*0.4, w*0.15, 0, Math.PI*2); ctx.fill(); ctx.stroke();
                    ctx.strokeStyle = 'rgba(60,30,20,0.85)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(cx-4,cy-h*0.48); ctx.lineTo(cx+3,cy-h*0.4); ctx.lineTo(cx-2,cy-h*0.32); ctx.stroke();
                    eye(cx - w*0.06, cy - h*0.41, 3, '#1a0e08'); eye(cx + w*0.06, cy - h*0.41, 3, '#1a0e08');
                    ctx.strokeStyle = def.color; ctx.lineWidth = 4; const sway = Math.sin(t*0.003)*22;
                    ctx.beginPath(); ctx.moveTo(cx - w*0.28, cy - h*0.08); ctx.lineTo(cx - w*0.5 - sway, cy + h*0.06); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(cx + w*0.28, cy - h*0.08); ctx.lineTo(cx + w*0.5 + sway, cy + h*0.06); ctx.stroke();
                    break;
                }
                case "paperMoonBoss": {
                    // Folded-paper crescent moon with torn triangular craters and drifting scrap edges
                    ctx.beginPath(); ctx.arc(cx, cy, h*0.44, Math.PI*0.55, Math.PI*1.75); ctx.arc(cx + w*0.16, cy, h*0.36, Math.PI*1.7, Math.PI*0.6, true); ctx.closePath(); ctx.fill(); ctx.stroke();
                    ctx.strokeStyle='rgba(120,100,150,0.5)'; ctx.lineWidth=1.5;
                    for (let i=0;i<5;i++){ const a=i*1.1+0.4; ctx.beginPath(); ctx.moveTo(cx-w*0.1+Math.cos(a)*30, cy+Math.sin(a)*40); ctx.lineTo(cx-w*0.1+Math.cos(a)*44, cy+Math.sin(a)*58); ctx.stroke(); }
                    for (let i=0;i<4;i++){ const fx=cx-30+i*22+Math.sin(t*0.002+i)*10, fy=cy-h*0.5-10-((t*0.02+i*50)%(h+40)); ctx.fillStyle='rgba(240,230,255,0.4)'; ctx.beginPath(); ctx.moveTo(fx,fy); ctx.lineTo(fx+8,fy+4); ctx.lineTo(fx+2,fy+12); ctx.closePath(); ctx.fill(); }
                    eye(cx-14, cy-8, 4, '#5a4a80'); eye(cx+2, cy-8, 4, '#5a4a80');
                    break;
                }
                case "lanternMaw": {
                    // Hexagonal paper-lantern body, metal cap rings, zigzag toothy mouth, flickering flame core
                    ctx.beginPath(); for(let i=0;i<6;i++){ const a=Math.PI/6+i*Math.PI/3, px=cx+Math.cos(a)*w*0.38, py=cy+Math.sin(a)*h*0.42; i?ctx.lineTo(px,py):ctx.moveTo(px,py); } ctx.closePath(); ctx.fill(); ctx.stroke();
                    ctx.strokeStyle='rgba(40,30,10,0.7)'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(cx,cy-h*0.44); ctx.lineTo(cx,cy+h*0.44); ctx.stroke();
                    ctx.fillStyle='rgba(20,15,5,0.9)'; ctx.beginPath(); ctx.moveTo(cx-w*0.22,cy+h*0.06);
                    for(let i=0;i<=6;i++) ctx.lineTo(cx-w*0.22+i*(w*0.44/6), cy+h*0.06+((i%2)?18:0));
                    ctx.lineTo(cx+w*0.22,cy-h*0.05); ctx.lineTo(cx-w*0.22,cy-h*0.05); ctx.closePath(); ctx.fill();
                    const flick=0.6+Math.sin(t*0.02)*0.3; ctx.fillStyle=`rgba(255,210,120,${flick})`; ctx.beginPath(); ctx.arc(cx,cy,10,0,Math.PI*2); ctx.fill();
                    break;
                }
                case "sapphireSplit": {
                    // Faceted gem cracked into two mirrored halves that drift apart and snap back
                    const split = 6 + Math.sin(t*0.0025)*14;
                    for (const side of [-1,1]) {
                        ctx.save(); ctx.translate(side*split,0);
                        ctx.beginPath(); ctx.moveTo(cx, cy - h*0.46); ctx.lineTo(cx + side*w*0.3, cy - h*0.1); ctx.lineTo(cx + side*w*0.22, cy + h*0.4); ctx.lineTo(cx, cy + h*0.46); ctx.closePath(); ctx.fill(); ctx.stroke();
                        ctx.strokeStyle='rgba(255,255,255,0.5)'; ctx.beginPath(); ctx.moveTo(cx, cy - h*0.46); ctx.lineTo(cx + side*w*0.14, cy); ctx.lineTo(cx, cy + h*0.46); ctx.stroke();
                        ctx.strokeStyle = def.color;
                        ctx.restore();
                    }
                    eye(cx - split - 8, cy - 20, 3, '#e8f6ff'); eye(cx + split + 8, cy - 20, 3, '#e8f6ff');
                    break;
                }
                case "copperGardener": {
                    // Riveted copper torso, pruning-shear head, vine tendrils from the shoulders
                    ctx.beginPath(); ctx.roundRect(cx-w*0.24, cy-h*0.1, w*0.48, h*0.5, 14); ctx.fill(); ctx.stroke();
                    ctx.fillStyle='rgba(60,30,10,0.5)'; for(let i=0;i<4;i++) for(let j=0;j<3;j++){ ctx.beginPath(); ctx.arc(cx-w*0.18+i*w*0.12, cy-h*0.02+j*h*0.15, 2.5, 0, Math.PI*2); ctx.fill(); }
                    ctx.fillStyle=`rgba(${c.r},${c.g},${c.b},0.85)`; ctx.strokeStyle=def.color;
                    ctx.save(); ctx.translate(cx,cy-h*0.32); ctx.rotate(Math.sin(t*0.004)*0.3);
                    ctx.beginPath(); ctx.moveTo(-w*0.16,-10); ctx.lineTo(0,0); ctx.lineTo(-w*0.16,10); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(w*0.16,-10); ctx.lineTo(0,0); ctx.lineTo(w*0.16,10); ctx.stroke();
                    ctx.restore();
                    ctx.strokeStyle='rgba(120,220,120,0.7)'; ctx.lineWidth=2.5;
                    for (const side of [-1,1]) { ctx.beginPath(); ctx.moveTo(cx+side*w*0.24, cy-h*0.05); ctx.bezierCurveTo(cx+side*w*0.5, cy-h*0.15+Math.sin(t*0.003)*10, cx+side*w*0.55, cy+h*0.15, cx+side*w*0.42, cy+h*0.35); ctx.stroke(); }
                    break;
                }
                case "buriedRingmaster": {
                    // Top hat + coat lapels rising out of a rubble mound, single whip-arm
                    ctx.fillStyle='rgba(50,35,25,0.9)'; ctx.beginPath(); ctx.ellipse(cx, cy+h*0.38, w*0.4, h*0.14, 0, 0, Math.PI*2); ctx.fill();
                    ctx.fillStyle=`rgba(${c.r},${c.g},${c.b},0.85)`;
                    ctx.beginPath(); ctx.moveTo(cx-w*0.24,cy+h*0.32); ctx.lineTo(cx-w*0.18,cy-h*0.06); ctx.lineTo(cx+w*0.18,cy-h*0.06); ctx.lineTo(cx+w*0.24,cy+h*0.32); ctx.closePath(); ctx.fill(); ctx.stroke();
                    ctx.beginPath(); ctx.rect(cx-w*0.14, cy-h*0.36, w*0.28, h*0.32); ctx.fill(); ctx.stroke();
                    ctx.beginPath(); ctx.ellipse(cx, cy-h*0.05, w*0.2, 8, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
                    eye(cx-10, cy-h*0.14, 3); eye(cx+10, cy-h*0.14, 3);
                    ctx.strokeStyle=def.color; ctx.lineWidth=2.5; const wa=Math.sin(t*0.006)*40;
                    ctx.beginPath(); ctx.moveTo(cx+w*0.22, cy); ctx.quadraticCurveTo(cx+w*0.5, cy+wa*0.3, cx+w*0.6+wa, cy-20); ctx.stroke();
                    break;
                }
                case "mirrorWidow": {
                    // Eight thin mirrored spider legs radiating from a faceted gem abdomen
                    ctx.strokeStyle='rgba(220,250,255,0.85)'; ctx.lineWidth=3;
                    for (let i=0;i<8;i++){ const a=i*Math.PI/4+t*0.0015; const kx=cx+Math.cos(a)*w*0.1, ky=cy+Math.sin(a)*h*0.08;
                        ctx.beginPath(); ctx.moveTo(cx,cy); ctx.quadraticCurveTo(kx,ky, cx+Math.cos(a)*w*0.42, cy+Math.sin(a)*h*0.36); ctx.stroke(); }
                    ctx.fillStyle=`rgba(${c.r},${c.g},${c.b},0.85)`; ctx.beginPath();
                    for(let i=0;i<6;i++){ const a=Math.PI/6+i*Math.PI/3, px=cx+Math.cos(a)*w*0.16, py=cy+Math.sin(a)*h*0.2; i?ctx.lineTo(px,py):ctx.moveTo(px,py); } ctx.closePath(); ctx.fill(); ctx.stroke();
                    eye(cx-8,cy-6,3,'#fff'); eye(cx+8,cy-6,3,'#fff'); eye(cx,cy-12,2.5,'#fff');
                    break;
                }
                case "ivoryFurnace": {
                    // Squat bone-white kiln with arched glowing mouth and brick seams
                    ctx.beginPath(); ctx.roundRect(cx-w*0.32, cy-h*0.34, w*0.64, h*0.62, 20); ctx.fill(); ctx.stroke();
                    ctx.strokeStyle='rgba(150,120,90,0.4)'; ctx.lineWidth=1;
                    for(let row=0;row<4;row++){ ctx.beginPath(); ctx.moveTo(cx-w*0.32,cy-h*0.2+row*h*0.14); ctx.lineTo(cx+w*0.32,cy-h*0.2+row*h*0.14); ctx.stroke(); }
                    const glow=0.5+Math.sin(t*0.015)*0.35; ctx.fillStyle=`rgba(255,140,50,${glow})`;
                    ctx.beginPath(); ctx.arc(cx, cy+h*0.06, w*0.18, Math.PI, 0); ctx.fill();
                    ctx.strokeStyle=def.color; ctx.beginPath(); ctx.arc(cx, cy+h*0.06, w*0.18, Math.PI, 0); ctx.stroke();
                    ctx.fillStyle='rgba(255,255,255,0.9)'; ctx.beginPath(); ctx.rect(cx-w*0.05,cy-h*0.5,w*0.1,h*0.16); ctx.fill(); ctx.stroke();
                    break;
                }
                case "mothAbbot": {
                    // Hooded robed figure with large eye-spotted moth wings folded behind, antennae atop hood
                    ctx.fillStyle='rgba(30,20,45,0.4)';
                    for (const side of [-1,1]) { ctx.beginPath(); ctx.moveTo(cx,cy-h*0.1); ctx.bezierCurveTo(cx+side*w*0.5,cy-h*0.4,cx+side*w*0.62,cy+h*0.1,cx+side*w*0.3,cy+h*0.4);
                        ctx.bezierCurveTo(cx+side*w*0.15,cy+h*0.2,cx+side*w*0.1,cy,cx,cy-h*0.1); ctx.closePath(); ctx.fill(); ctx.stroke();
                        ctx.fillStyle=`rgba(${c.r},${c.g},${c.b},0.5)`; ctx.beginPath(); ctx.arc(cx+side*w*0.32, cy-h*0.02, 8, 0, Math.PI*2); ctx.fill(); ctx.fillStyle='rgba(30,20,45,0.4)'; }
                    ctx.fillStyle=`rgba(${c.r},${c.g},${c.b},0.9)`; ctx.beginPath(); ctx.moveTo(cx,cy-h*0.44); ctx.quadraticCurveTo(cx+w*0.2,cy-h*0.1,cx+w*0.14,cy+h*0.4); ctx.lineTo(cx-w*0.14,cy+h*0.4); ctx.quadraticCurveTo(cx-w*0.2,cy-h*0.1,cx,cy-h*0.44); ctx.closePath(); ctx.fill(); ctx.stroke();
                    ctx.strokeStyle=def.color; ctx.lineWidth=1.5; ctx.beginPath(); ctx.moveTo(cx-4,cy-h*0.44); ctx.quadraticCurveTo(cx-16,cy-h*0.56,cx-20+Math.sin(t*0.005)*4,cy-h*0.64); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(cx+4,cy-h*0.44); ctx.quadraticCurveTo(cx+16,cy-h*0.56,cx+20+Math.sin(t*0.005)*4,cy-h*0.64); ctx.stroke();
                    eye(cx-9,cy-h*0.28,3,'#2a1a10'); eye(cx+9,cy-h*0.28,3,'#2a1a10');
                    break;
                }
                case "emberCantor": {
                    // Choir robe holding an open glowing hymnal, embers rising off the hem
                    ctx.beginPath(); ctx.moveTo(cx,cy-h*0.42); ctx.lineTo(cx+w*0.24,cy+h*0.44); ctx.lineTo(cx-w*0.24,cy+h*0.44); ctx.closePath(); ctx.fill(); ctx.stroke();
                    ctx.fillStyle='rgba(255,255,240,0.9)'; ctx.beginPath(); ctx.moveTo(cx-w*0.16,cy+h*0.02); ctx.lineTo(cx,cy-h*0.06); ctx.lineTo(cx+w*0.16,cy+h*0.02); ctx.lineTo(cx+w*0.14,cy+h*0.16); ctx.lineTo(cx,cy+h*0.1); ctx.lineTo(cx-w*0.14,cy+h*0.16); ctx.closePath(); ctx.fill();
                    ctx.strokeStyle=`rgba(255,150,60,${0.7+Math.sin(t*0.02)*0.2})`; ctx.beginPath(); ctx.moveTo(cx,cy-h*0.06); ctx.lineTo(cx,cy+h*0.06); ctx.stroke();
                    for(let i=0;i<8;i++){ const ey=cy+h*0.4-((t*0.04+i*33)%(h*0.8)), ex=cx-w*0.2+i*w*0.05+Math.sin(i+t*0.003)*10; const al=1-((t*0.04+i*33)%(h*0.8))/(h*0.8);
                        ctx.fillStyle=`rgba(255,140,60,${0.6*al})`; ctx.beginPath(); ctx.arc(ex,ey,2.5,0,Math.PI*2); ctx.fill(); }
                    eye(cx-10,cy-h*0.3,3,'#fff2c8'); eye(cx+10,cy-h*0.3,3,'#fff2c8');
                    break;
                }
                case "opalLibrarian": {
                    // Cloaked figure orbited by open floating books, opalescent shimmer
                    const shimmer = `hsla(${(t*0.05)%360},60%,80%,0.9)`;
                    ctx.fillStyle=shimmer; ctx.strokeStyle=def.color;
                    ctx.beginPath(); ctx.moveTo(cx,cy-h*0.44); ctx.quadraticCurveTo(cx+w*0.26,cy,cx+w*0.16,cy+h*0.44); ctx.lineTo(cx-w*0.16,cy+h*0.44); ctx.quadraticCurveTo(cx-w*0.26,cy,cx,cy-h*0.44); ctx.closePath(); ctx.fill(); ctx.stroke();
                    for(let i=0;i<4;i++){ const a=t*0.0015+i*Math.PI/2, ox=cx+Math.cos(a)*w*0.42, oy=cy+Math.sin(a)*h*0.28;
                        ctx.save(); ctx.translate(ox,oy); ctx.rotate(a); ctx.fillStyle='rgba(240,230,255,0.85)';
                        ctx.beginPath(); ctx.moveTo(-9,-6); ctx.lineTo(0,-2); ctx.lineTo(9,-6); ctx.lineTo(9,6); ctx.lineTo(0,2); ctx.lineTo(-9,6); ctx.closePath(); ctx.fill(); ctx.strokeStyle='rgba(150,130,180,0.6)'; ctx.stroke(); ctx.restore(); }
                    eye(cx-8,cy-h*0.26,3,'#fff'); eye(cx+8,cy-h*0.26,3,'#fff');
                    break;
                }
                case "scarletAdmiral": {
                    // Tricorn hat, epauletted coat, ship's wheel drifting behind
                    ctx.strokeStyle=def.color; ctx.lineWidth=2.5;
                    ctx.save(); ctx.translate(cx-w*0.36, cy+h*0.06); ctx.rotate(t*0.0012); ctx.beginPath(); ctx.arc(0,0,w*0.16,0,Math.PI*2); ctx.stroke();
                    for(let i=0;i<8;i++){ const a=i*Math.PI/4; ctx.beginPath(); ctx.moveTo(Math.cos(a)*w*0.16,Math.sin(a)*w*0.16); ctx.lineTo(Math.cos(a)*w*0.24,Math.sin(a)*w*0.24); ctx.stroke(); } ctx.restore();
                    ctx.fillStyle=`rgba(${c.r},${c.g},${c.b},0.9)`; ctx.beginPath(); ctx.moveTo(cx-w*0.2,cy-h*0.1); ctx.lineTo(cx-w*0.16,cy+h*0.42); ctx.lineTo(cx+w*0.16,cy+h*0.42); ctx.lineTo(cx+w*0.2,cy-h*0.1); ctx.closePath(); ctx.fill(); ctx.stroke();
                    ctx.fillStyle='rgba(255,215,120,0.9)'; ctx.beginPath(); ctx.arc(cx-w*0.18,cy-h*0.06,5,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(cx+w*0.18,cy-h*0.06,5,0,Math.PI*2); ctx.fill();
                    ctx.fillStyle='rgba(20,10,10,0.9)'; ctx.beginPath(); ctx.moveTo(cx-w*0.26,cy-h*0.2); ctx.quadraticCurveTo(cx,cy-h*0.4,cx+w*0.26,cy-h*0.2); ctx.quadraticCurveTo(cx,cy-h*0.3,cx-w*0.26,cy-h*0.2); ctx.closePath(); ctx.fill(); ctx.stroke();
                    eye(cx-8,cy-h*0.1,3); eye(cx+8,cy-h*0.1,3);
                    break;
                }
                case "duskEngineer": {
                    // Boxy body, gear-shaped head, wrench-arm, round goggles
                    ctx.beginPath(); ctx.roundRect(cx-w*0.2,cy-h*0.1,w*0.4,h*0.5,10); ctx.fill(); ctx.stroke();
                    ctx.save(); ctx.translate(cx,cy-h*0.3); ctx.rotate(t*0.002);
                    for(let i=0;i<8;i++){ const a=i*Math.PI/4; ctx.beginPath(); ctx.rect(-4,-w*0.2,8,10); ctx.save(); ctx.rotate(a); ctx.fillRect(-4,-w*0.2,8,10); ctx.restore(); }
                    ctx.beginPath(); ctx.arc(0,0,w*0.14,0,Math.PI*2); ctx.fill(); ctx.stroke(); ctx.restore();
                    ctx.fillStyle='rgba(200,230,255,0.5)'; eye(cx-8,cy-h*0.3,6,'rgba(200,230,255,0.8)'); eye(cx+8,cy-h*0.3,6,'rgba(200,230,255,0.8)');
                    ctx.strokeStyle=def.color; ctx.lineWidth=5; const wr=Math.sin(t*0.006)*30;
                    ctx.beginPath(); ctx.moveTo(cx+w*0.2,cy+h*0.1); ctx.lineTo(cx+w*0.4+wr*0.3,cy+h*0.1+wr); ctx.stroke();
                    break;
                }
                case "boneAstronomer": {
                    // Skeletal ribcage torso, telescope arm, star-map cloak
                    ctx.strokeStyle=def.color; ctx.lineWidth=2.5;
                    for(let i=0;i<5;i++){ ctx.beginPath(); ctx.moveTo(cx-w*0.2,cy-h*0.2+i*h*0.1); ctx.quadraticCurveTo(cx,cy-h*0.15+i*h*0.1,cx+w*0.2,cy-h*0.2+i*h*0.1); ctx.stroke(); }
                    ctx.fillStyle='rgba(15,10,25,0.4)'; ctx.beginPath(); ctx.moveTo(cx,cy-h*0.4); ctx.lineTo(cx+w*0.3,cy+h*0.44); ctx.lineTo(cx-w*0.3,cy+h*0.44); ctx.closePath(); ctx.fill();
                    ctx.fillStyle='rgba(255,255,255,0.8)'; for(let i=0;i<14;i++){ const sx=cx-w*0.26+((i*37)%(w*0.52)), sy=cy-h*0.2+((i*53)%(h*0.55)); ctx.globalAlpha=0.4+0.5*Math.abs(Math.sin(t*0.003+i)); ctx.beginPath(); ctx.arc(sx,sy,1.6,0,Math.PI*2); ctx.fill(); } ctx.globalAlpha=1;
                    ctx.strokeStyle=def.color; ctx.lineWidth=6; const ta=Math.sin(t*0.0018)*0.4;
                    ctx.save(); ctx.translate(cx+w*0.16,cy-h*0.28); ctx.rotate(-0.6+ta); ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(w*0.38,0); ctx.stroke(); ctx.beginPath(); ctx.arc(w*0.38,0,6,0,Math.PI*2); ctx.fillStyle=`rgba(${c.r},${c.g},${c.b},0.9)`; ctx.fill(); ctx.restore();
                    eye(cx-8,cy-h*0.3,3,'#dff'); eye(cx+8,cy-h*0.3,3,'#dff');
                    break;
                }
                case "staticHarvest": {
                    // Scarecrow with crossed wooden arms, straw tufts, crackling lightning
                    ctx.strokeStyle='rgba(120,80,40,0.85)'; ctx.lineWidth=6;
                    ctx.beginPath(); ctx.moveTo(cx-w*0.36,cy-h*0.14); ctx.lineTo(cx+w*0.36,cy+h*0.1); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(cx-w*0.36,cy+h*0.1); ctx.lineTo(cx+w*0.36,cy-h*0.14); ctx.stroke();
                    ctx.fillStyle=`rgba(${c.r},${c.g},${c.b},0.85)`; ctx.beginPath(); ctx.moveTo(cx,cy-h*0.4); ctx.lineTo(cx+w*0.18,cy+h*0.4); ctx.lineTo(cx-w*0.18,cy+h*0.4); ctx.closePath(); ctx.fill(); ctx.stroke();
                    ctx.strokeStyle='rgba(220,200,90,0.8)'; ctx.lineWidth=2; for(let i=0;i<6;i++){ ctx.beginPath(); ctx.moveTo(cx-w*0.12+i*w*0.05, cy+h*0.4); ctx.lineTo(cx-w*0.14+i*w*0.05, cy+h*0.5); ctx.stroke(); }
                    if (Math.random()<0.15) { ctx.strokeStyle='rgba(230,255,180,0.95)'; ctx.lineWidth=2; ctx.beginPath(); let lx=cx,ly=cy-h*0.4; ctx.moveTo(lx,ly); for(let i=0;i<4;i++){ lx+=(Math.random()-0.5)*40; ly+=h*0.2; ctx.lineTo(lx,ly); } ctx.stroke(); }
                    eye(cx-8,cy-h*0.2,3,'#eaffb0'); eye(cx+8,cy-h*0.2,3,'#eaffb0');
                    break;
                }
                default:
                    ctx.beginPath(); ctx.roundRect(cx - w/2, cy - h/2, w, h, 28); ctx.fill(); ctx.stroke();
                    ctx.fillStyle = "rgba(255,255,255,0.95)"; ctx.beginPath(); ctx.arc(cx - 18, cy - 34, 8, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(cx + 18, cy - 34, 8, 0, Math.PI * 2); ctx.fill();
            }

            const bw = 300, bx = canvas.width / 2 - bw / 2, by = 36;
            ctx.shadowBlur = 0; ctx.fillStyle = "rgba(0,0,0,0.72)"; ctx.fillRect(bx - 2, by - 2, bw + 4, 20);
            const f = Math.max(0, boss.hp / boss.maxHp), g = ctx.createLinearGradient(bx, by, bx + bw, by);
            g.addColorStop(0, def.color); g.addColorStop(1, "#ffffff"); ctx.fillStyle = g; ctx.fillRect(bx, by, bw * f, 16); ctx.strokeStyle = def.color; ctx.strokeRect(bx, by, bw, 16);
            ctx.fillStyle = "rgba(255,245,235,0.9)"; ctx.font = "bold 11px Courier New"; ctx.fillText(boss.name, bx, by - 6);
            ctx.restore();
        };
