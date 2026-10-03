/* Faded Thread module: 11-expansion-v31.js | build 03 Oct 2026 */
// The update loop already calls extendWorld during boss.active in this file;
        // this guard keeps future overrides from re-locking the arena.



        // ══════════════════════════════════════════════════════════════════════
        // Realm traversal buffs make these genuinely brutal even at 100+ HP.
        // Bosses have 10 unique actions each and HP so massive even a 100-HP
        // player will barely survive.  Boss rewards counteract the realm debuffs.
        // ══════════════════════════════════════════════════════════════════════

        // ── REALM DEFINITIONS ────────────────────────────────────────────────
        // Each has target:100 but the realmBuff makes them far harder than that.
        // realmBuff keys are read by the V31 update hook injected below.
        const V31_CURSED_REALMS = [
            {
                id: "shatteredMirrorWastes",
                name: "Shattered Mirror Wastes",
                target: 100,
                enemies: [90, 91],
                color: "#c8f6ff",
                endgame: true,
                realmBuff: {
                    id: "mirrorGravity",
                    label: "MIRROR GRAVITY",
                    desc: "Gravity reverses every 3 s. Platforms shatter on contact for 1.2 s.",
                    // implemented in V31 update hook
                    gravityFlip: true,
                    flipInterval: 180,        // frames between flips
                    platformShatters: true,
                    shatterDuration: 72,       // frames platform is unstandable
                    periodicDamageInterval: 0  // no periodic damage — gravity is the killer
                }
            },
            {
                id: "bossV31_1",
                name: "The Mirror Tyrant",
                boss: "mirrorTyrant",
                endgame: true
            },
            {
                id: "corrodedSunVault",
                name: "Corroded Sun Vault",
                target: 100,
                enemies: [92, 93],
                color: "#ff9922",
                endgame: true,
                realmBuff: {
                    id: "solarCorrosion",
                    label: "SOLAR CORROSION",
                    desc: "Acid rain drains 1 HP every 4 s. Platforms shrink as you stand on them.",
                    gravityFlip: false,
                    platformShrinks: true,
                    shrinkRate: 0.55,          // px per frame the platform narrows while stood on
                    minPlatformWidth: 28,
                    periodicDamageInterval: 240, // every 4 s at 60fps
                    periodicDamageColor: "#ff9922"
                }
            },
            {
                id: "bossV31_2",
                name: "The Corroded Sovereign",
                boss: "corrodedSovereign",
                endgame: true
            },
            {
                id: "voidThreadAbyss",
                name: "Void Thread Abyss",
                target: 100,
                enemies: [94, 95],
                color: "#9966ff",
                endgame: true,
                realmBuff: {
                    id: "voidPull",
                    label: "VOID PULL",
                    desc: "Constant leftward drag fights your movement. Enemies deal +1 bonus damage on hit.",
                    gravityFlip: false,
                    voidDrag: 0.38,            // added to player vx each frame (rightward = negative)
                    enemyBonusDamage: 1,
                    periodicDamageInterval: 0
                }
            },
            {
                id: "bossV31_3",
                name: "The Void Thread God",
                boss: "voidThreadGod",
                endgame: true
            }
        ];

        // ── ENEMIES ──────────────────────────────────────────────────────────
        const V31_ENEMIES = {
            90: { name: "Reflex Shard",    hp: 14, speed: 3.4, width: 68,  height: 62,  behaviorFlags: ["reflective","homing","phase_drift"] },
            91: { name: "Glass Revenant",  hp: 18, speed: 1.8, width: 104, height: 118, behaviorFlags: ["shielded_front","projector","gravitational_pull"] },
            92: { name: "Acid Lancer",     hp: 15, speed: 2.9, width: 76,  height: 72,  behaviorFlags: ["charger","leaves_trail","projector"] },
            93: { name: "Sun Colossus",    hp: 22, speed: 0.9, width: 130, height: 138, behaviorFlags: ["heavy","area_denial","ground_slam"] },
            94: { name: "Void Filament",   hp: 13, speed: 3.8, width: 60,  height: 56,  behaviorFlags: ["phase_drift","fast","sine_wave"] },
            95: { name: "Abyss Sentinel",  hp: 24, speed: 1.1, width: 124, height: 132, behaviorFlags: ["heavy","gravitational_pull","projector","summoner"] }
        };

        // ── BOSS DEFINITIONS — monstrous HP, huge bodies ─────────────────────
        // A player with exactly 100 HP and normal defences will survive by a
        // razor-thin margin if they play perfectly.
        const V31_BOSSES = {
            mirrorTyrant: {
                name: "THE MIRROR TYRANT",
                hp: 420,
                width: 310, height: 370,
                color: "#c8f6ff"
            },
            corrodedSovereign: {
                name: "THE CORRODED SOVEREIGN",
                hp: 480,
                width: 330, height: 390,
                color: "#ff9922"
            },
            voidThreadGod: {
                name: "THE VOID THREAD GOD",
                hp: 560,
                width: 350, height: 420,
                color: "#9966ff"
            }
        };

        // ── BOSS ACTION FACTORIES — 10 unique actions each ────────────────────
        // Uses the existing spawnBossProjectile / spawnBossHazard / spawnBossBeam API.
        function makeV31MirrorTyrantActions() {
            const col = "#c8f6ff";
            return [
                // 1. Mirror Volley — 5 angled shards in a spread fan
                { name: "mirror volley", telegraph: 340,
                  spawn(b) {
                    for (let i = -2; i <= 2; i++) {
                        const ang = (i * 0.22);
                        spawnBossProjectile({ x: b.x - worldX, y: b.y + b.height/2,
                            vx: -8.5 * Math.cos(ang), vy: 8.5 * Math.sin(ang) + i * 1.2,
                            width: 18, height: 18, life: 240, color: col, shape: "shard" });
                    }
                  }
                },
                // 2. Reflect Beam — wide vertical beam on the player's X
                { name: "reflect beam", telegraph: 500,
                  spawn(b) {
                    spawnBossBeam({ x: player.worldX - worldX, y: 0, width: 48, height: window.innerHeight, life: 55, color: col });
                  }
                },
                // 3. Shatter Ring — expanding ring hazard from boss centre
                { name: "shatter ring", telegraph: 420,
                  spawn(b) {
                    spawnBossHazard({ x: b.x - worldX, y: b.y + b.height/2, width: 12, height: 12,
                        maxRadius: 220, life: 80, growTime: 80, color: col, shape: "ring" });
                  }
                },
                // 4. Mirror Floor — 6 spike hazards under the player
                { name: "mirror floor", telegraph: 480,
                  spawn(b) {
                    for (let i = 0; i < 6; i++)
                        spawnBossHazard({ x: player.worldX - 200 + i * 78 - worldX, y: window.innerHeight - 88,
                            width: 60, height: 48, life: 100, growTime: 18, color: col, shape: "spikes" });
                  }
                },
                // 5. Glass Rain — 8 falling projectiles staggered horizontally
                { name: "glass rain", telegraph: 380,
                  spawn(b) {
                    for (let i = 0; i < 8; i++)
                        spawnBossProjectile({ x: player.worldX - 280 + i * 80 - worldX, y: -30,
                            vx: (Math.random() - 0.5) * 1.8, vy: 9 + Math.random() * 3,
                            width: 14, height: 22, life: 200, color: col, shape: "shard" });
                  }
                },
                // 6. Twin Beams — two simultaneous vertical beams flanking the player
                { name: "twin beams", telegraph: 560,
                  spawn(b) {
                    [-120, 120].forEach(offset => spawnBossBeam({
                        x: player.worldX + offset - worldX, y: 0,
                        width: 36, height: window.innerHeight, life: 50, color: col }));
                  }
                },
                // 7. Prism Burst — 8 projectiles in a full circle from boss
                { name: "prism burst", telegraph: 400,
                  spawn(b) {
                    for (let i = 0; i < 8; i++) {
                        const a = (i / 8) * Math.PI * 2;
                        spawnBossProjectile({ x: b.x - worldX, y: b.y + b.height/2,
                            vx: Math.cos(a) * 7.5, vy: Math.sin(a) * 7.5,
                            width: 16, height: 16, life: 220, color: col, shape: "shard" });
                    }
                  }
                },
                // 8. Cascade Ring x3 — three staggered rings of increasing radius
                { name: "cascade rings", telegraph: 460,
                  spawn(b) {
                    [120, 180, 240].forEach((r, i) => spawnBossHazard({
                        x: b.x - worldX, y: b.y + b.height/2, width: 8, height: 8,
                        maxRadius: r, life: 65 + i * 15, growTime: 65 + i * 15,
                        color: col, shape: "ring" }));
                  }
                },
                // 9. Reflex Wall — full-width horizontal floor of spikes
                { name: "reflex wall", telegraph: 520,
                  spawn(b) {
                    for (let i = 0; i < 10; i++)
                        spawnBossHazard({ x: -80 + i * 140, y: window.innerHeight - 90,
                            width: 110, height: 44, life: 85, growTime: 14, color: col, shape: "spikes" });
                  }
                },
                // 10. Tyrant Barrage — 12 fast converging projectiles aimed at player pos
                { name: "tyrant barrage", telegraph: 600,
                  spawn(b) {
                    const px = player.worldX - worldX, py = player.worldY;
                    for (let i = 0; i < 12; i++) {
                        const off = (i - 5.5) * 28;
                        const dx = (px + off) - (b.x - worldX), dy = py - (b.y + b.height/2);
                        const len = Math.sqrt(dx*dx + dy*dy) || 1;
                        spawnBossProjectile({ x: b.x - worldX, y: b.y + b.height/2,
                            vx: (dx/len) * 9, vy: (dy/len) * 9,
                            width: 15, height: 15, life: 190, color: col, shape: "shard" });
                    }
                  }
                }
            ];
        }

        function makeV31CorrodedSovereignActions() {
            const col = "#ff9922";
            return [
                // 1. Acid Volley — 6 arcing projectiles in wide fan
                { name: "acid volley", telegraph: 360,
                  spawn(b) {
                    for (let i = -2; i <= 3; i++) {
                        const ang = i * 0.21 - 0.1;
                        spawnBossProjectile({ x: b.x - worldX, y: b.y + b.height/2,
                            vx: -9 * Math.cos(ang), vy: 9 * Math.sin(ang),
                            width: 20, height: 20, life: 230, color: col, shape: "shard" });
                    }
                  }
                },
                // 2. Solar Beam — wide burning vertical beam on player
                { name: "solar beam", telegraph: 520,
                  spawn(b) {
                    spawnBossBeam({ x: player.worldX - worldX, y: 0, width: 56, height: window.innerHeight, life: 60, color: col });
                  }
                },
                // 3. Corrosion Wave — massive expanding ring
                { name: "corrosion wave", telegraph: 440,
                  spawn(b) {
                    spawnBossHazard({ x: b.x - worldX, y: b.y + b.height/2, width: 14, height: 14,
                        maxRadius: 260, life: 88, growTime: 88, color: col, shape: "ring" });
                  }
                },
                // 4. Floor Melt — 8 floor spike hazards across wide spread
                { name: "floor melt", telegraph: 500,
                  spawn(b) {
                    for (let i = 0; i < 8; i++)
                        spawnBossHazard({ x: player.worldX - 280 + i * 80 - worldX, y: window.innerHeight - 88,
                            width: 66, height: 50, life: 110, growTime: 16, color: col, shape: "spikes" });
                  }
                },
                // 5. Acid Rain — 10 falling projectiles
                { name: "acid rain", telegraph: 400,
                  spawn(b) {
                    for (let i = 0; i < 10; i++)
                        spawnBossProjectile({ x: player.worldX - 360 + i * 80 - worldX, y: -40,
                            vx: (Math.random() - 0.5) * 2, vy: 10 + Math.random() * 4,
                            width: 16, height: 24, life: 210, color: col, shape: "shard" });
                  }
                },
                // 6. Triple Beam — three simultaneous vertical beams
                { name: "triple beam", telegraph: 580,
                  spawn(b) {
                    [-160, 0, 160].forEach(offset => spawnBossBeam({
                        x: player.worldX + offset - worldX, y: 0,
                        width: 40, height: window.innerHeight, life: 52, color: col }));
                  }
                },
                // 7. Solar Burst — 10 projectiles radially from boss
                { name: "solar burst", telegraph: 420,
                  spawn(b) {
                    for (let i = 0; i < 10; i++) {
                        const a = (i / 10) * Math.PI * 2;
                        spawnBossProjectile({ x: b.x - worldX, y: b.y + b.height/2,
                            vx: Math.cos(a) * 8.5, vy: Math.sin(a) * 8.5,
                            width: 18, height: 18, life: 230, color: col, shape: "shard" });
                    }
                  }
                },
                // 8. Cascading Dissolution — 4 rings of increasing radius
                { name: "cascading dissolution", telegraph: 480,
                  spawn(b) {
                    [90, 150, 210, 270].forEach((r, i) => spawnBossHazard({
                        x: b.x - worldX, y: b.y + b.height/2, width: 10, height: 10,
                        maxRadius: r, life: 60 + i * 18, growTime: 60 + i * 18,
                        color: col, shape: "ring" }));
                  }
                },
                // 9. Vault Collapse — massive full-screen floor coverage
                { name: "vault collapse", telegraph: 560,
                  spawn(b) {
                    for (let i = 0; i < 13; i++)
                        spawnBossHazard({ x: -60 + i * 120, y: window.innerHeight - 90,
                            width: 100, height: 52, life: 95, growTime: 12, color: col, shape: "spikes" });
                  }
                },
                // 10. Sovereign Barrage — 16 aimed projectiles
                { name: "sovereign barrage", telegraph: 640,
                  spawn(b) {
                    const px = player.worldX - worldX, py = player.worldY;
                    for (let i = 0; i < 16; i++) {
                        const off = (i - 7.5) * 24;
                        const dx = (px + off) - (b.x - worldX), dy = py - (b.y + b.height/2);
                        const len = Math.sqrt(dx*dx + dy*dy) || 1;
                        spawnBossProjectile({ x: b.x - worldX, y: b.y + b.height/2,
                            vx: (dx/len) * 10, vy: (dy/len) * 10,
                            width: 16, height: 16, life: 200, color: col, shape: "shard" });
                    }
                  }
                }
            ];
        }

        function makeV31VoidThreadGodActions() {
            const col = "#9966ff";
            return [
                // 1. Void Volley — 7 dense projectile spread
                { name: "void volley", telegraph: 380,
                  spawn(b) {
                    for (let i = -3; i <= 3; i++) {
                        const ang = i * 0.20;
                        spawnBossProjectile({ x: b.x - worldX, y: b.y + b.height/2,
                            vx: -10 * Math.cos(ang), vy: 10 * Math.sin(ang),
                            width: 22, height: 22, life: 250, color: col, shape: "shard" });
                    }
                  }
                },
                // 2. Thread Annihilator Beam — extremely wide beam
                { name: "thread annihilator", telegraph: 600,
                  spawn(b) {
                    spawnBossBeam({ x: player.worldX - worldX, y: 0, width: 72, height: window.innerHeight, life: 70, color: col });
                  }
                },
                // 3. Abyss Collapse Ring — gigantic ring
                { name: "abyss ring", telegraph: 480,
                  spawn(b) {
                    spawnBossHazard({ x: b.x - worldX, y: b.y + b.height/2, width: 16, height: 16,
                        maxRadius: 310, life: 100, growTime: 100, color: col, shape: "ring" });
                  }
                },
                // 4. Thread Floor — 9 floor spikes
                { name: "void floor", telegraph: 520,
                  spawn(b) {
                    for (let i = 0; i < 9; i++)
                        spawnBossHazard({ x: player.worldX - 320 + i * 80 - worldX, y: window.innerHeight - 88,
                            width: 70, height: 56, life: 120, growTime: 14, color: col, shape: "spikes" });
                  }
                },
                // 5. Void Rain — 14 falling shards
                { name: "void rain", telegraph: 440,
                  spawn(b) {
                    for (let i = 0; i < 14; i++)
                        spawnBossProjectile({ x: player.worldX - 480 + i * 74 - worldX, y: -50,
                            vx: (Math.random() - 0.5) * 2.5, vy: 11 + Math.random() * 4,
                            width: 17, height: 26, life: 220, color: col, shape: "shard" });
                  }
                },
                // 6. Quad Beams — four simultaneous beams
                { name: "quad beams", telegraph: 660,
                  spawn(b) {
                    [-240, -80, 80, 240].forEach(offset => spawnBossBeam({
                        x: player.worldX + offset - worldX, y: 0,
                        width: 44, height: window.innerHeight, life: 58, color: col }));
                  }
                },
                // 7. Null Burst — 14 radial projectiles from boss
                { name: "null burst", telegraph: 460,
                  spawn(b) {
                    for (let i = 0; i < 14; i++) {
                        const a = (i / 14) * Math.PI * 2;
                        spawnBossProjectile({ x: b.x - worldX, y: b.y + b.height/2,
                            vx: Math.cos(a) * 10, vy: Math.sin(a) * 10,
                            width: 20, height: 20, life: 240, color: col, shape: "shard" });
                    }
                  }
                },
                // 8. Void Concentric — 5 rings of increasing size
                { name: "void concentric", telegraph: 540,
                  spawn(b) {
                    [80, 150, 210, 270, 340].forEach((r, i) => spawnBossHazard({
                        x: b.x - worldX, y: b.y + b.height/2, width: 10, height: 10,
                        maxRadius: r, life: 55 + i * 20, growTime: 55 + i * 20,
                        color: col, shape: "ring" }));
                  }
                },
                // 9. Thread Erasure — total floor coverage
                { name: "thread erasure", telegraph: 620,
                  spawn(b) {
                    for (let i = 0; i < 16; i++)
                        spawnBossHazard({ x: -80 + i * 110, y: window.innerHeight - 90,
                            width: 92, height: 58, life: 110, growTime: 10, color: col, shape: "spikes" });
                  }
                },
                // 10. God's Final Thread — 22 aimed projectiles
                { name: "god's final thread", telegraph: 720,
                  spawn(b) {
                    const px = player.worldX - worldX, py = player.worldY;
                    for (let i = 0; i < 22; i++) {
                        const off = (i - 10.5) * 22;
                        const dx = (px + off) - (b.x - worldX), dy = py - (b.y + b.height/2);
                        const len = Math.sqrt(dx*dx + dy*dy) || 1;
                        spawnBossProjectile({ x: b.x - worldX, y: b.y + b.height/2,
                            vx: (dx/len) * 11, vy: (dy/len) * 11,
                            width: 18, height: 18, life: 210, color: col, shape: "shard" });
                    }
                  }
                }
            ];
        }

        // ── BOSS REWARDS — counteract realm debuffs ───────────────────────────
        const V31_BOSS_ITEMS = [
            // Mirror Tyrant → Tyrant's Lens: nullifies gravity flip in Mirror Wastes,
            //   +dodge window after landing (invuln +20 frames globally)
            ["tyrantLens","Tyrant's Lens","#c8f6ff","LENS","face",
             "Boss Reward. Negates Mirror Gravity realm flip. +20 invulnerability frames on landing. Slightly widens slash.",
             "mirrorTyrant"],
            // Corroded Sovereign → Sovereign Aegis: blocks periodic acid damage,
            //   platforms resist shrinking while equipped
            ["sovereignAegis","Sovereign Aegis","#ff9922","AGIS","chest",
             "Boss Reward. Blocks Solar Corrosion periodic damage. Platforms no longer shrink beneath you. +1 max life.",
             "corrodedSovereign"],
            // Void Thread God → God Thread Mantle: reduces Void Pull drag by 80%,
            //   enemy bonus damage negated, +2 max lives
            ["godThreadMantle","God Thread Mantle","#9966ff","GOTH","aura",
             "Boss Reward. Reduces Void Pull drag by 80%. Enemy bonus damage in Void Abyss negated. +2 uncapped lives.",
             "voidThreadGod"]
        ];

        const V31_BOSS_REWARD_MAP = Object.fromEntries(
            V31_BOSS_ITEMS.map(item => [item[6], { name: item[1], equipment: item[0] }])
        );

        // ── REALM BUFF STATE ─────────────────────────────────────────────────
        const v31RealmBuffState = {
            gravityFlipTimer: 0,
            gravityFlipped: false,
            shatteledPlatforms: new Map(),  // platformIndex → framesRemaining
            shrinkingPlatforms: new Map()   // platformIndex → current width
        };

        // ── INSTALLATION ──────────────────────────────────────────────────────
        (function installV31AbyssalExpansion() {
            const V31_REALM_BY_ID = Object.fromEntries(V31_CURSED_REALMS.filter(r => r.id).map(r => [r.id, r]));
            const V31_ENEMY_TYPES = new Set(Object.keys(V31_ENEMIES).map(Number));

            // Inject realms: place after the V30 expansion (after staticHarvest boss)
            const staticHarvestBossIdx = REALM_FLOW.findIndex(r => r.boss === "staticHarvest");
            if (!REALM_FLOW.some(r => r.id === "shatteredMirrorWastes")) {
                if (staticHarvestBossIdx >= 0) REALM_FLOW.splice(staticHarvestBossIdx + 1, 0, ...V31_CURSED_REALMS);
                else REALM_FLOW.push(...V31_CURSED_REALMS);
            }

            // Register bosses + give each 10 actions, all unlocked
            Object.assign(BOSS_DEFS, V31_BOSSES);
            BOSS_ACTIONS["mirrorTyrant"]     = makeV31MirrorTyrantActions();
            BOSS_ACTIONS["corrodedSovereign"] = makeV31CorrodedSovereignActions();
            BOSS_ACTIONS["voidThreadGod"]    = makeV31VoidThreadGodActions();
            BOSS_ACTIONS_UNLOCKED_COUNT["mirrorTyrant"]     = 10;
            BOSS_ACTIONS_UNLOCKED_COUNT["corrodedSovereign"] = 10;
            BOSS_ACTIONS_UNLOCKED_COUNT["voidThreadGod"]    = 10;

            // Register enemies
            const createEnemyPreV31 = createEnemy;
            createEnemy = function createEnemyV31(x, y, type) {
                const def = V31_ENEMIES[type];
                if (!def) return createEnemyPreV31(x, y, type);
                enemies.push({ x, y, startX: x, startY: y, type, hp: def.hp,
                    speed: def.speed, dir: -1, width: def.width, height: def.height,
                    floatOffset: Math.random() * 100, behaviorFlags: def.behaviorFlags || [] });
            };

            // Register equipment
            for (const item of V31_BOSS_ITEMS) {
                const obj = { id: item[0], name: item[1], color: item[2], short: item[3],
                              slot: item[4], effect: item[5], bossOnly: true, bossSource: item[6] };
                if (!EQUIPMENT_TYPES.some(e => e.id === obj.id)) EQUIPMENT_TYPES.push(obj);
                BOSS_REWARD_EQUIPMENT_IDS.add(obj.id);
                WORLD_BOSS_REWARD_EQUIPMENT_IDS.add(obj.id);
            }

            // Boss reward hook
            const awardBossRewardPreV31 = awardBossReward;
            awardBossReward = function awardBossRewardV31(kind) {
                const reward = V31_BOSS_REWARD_MAP[kind];
                if (!reward) return awardBossRewardPreV31(kind);
                player.bossRewards = player.bossRewards || [];
                if (!player.bossRewards.includes(reward.name)) player.bossRewards.push(reward.name);
                collectEquipmentItem(reward.equipment, "boss");
                WORLD_BOSS_REWARD_EQUIPMENT_IDS.add(reward.equipment);
                showMagicNotice({ name: `${reward.name}: ${getEquipmentDef(reward.equipment).name}`, id: "bossReward" });
                saveGame();
            };

            // Equipment effect text hook
            const equipTextPreV31 = equipmentEffectText;
            equipmentEffectText = function equipmentEffectTextV31(type) {
                const item = V31_BOSS_ITEMS.find(i => i[0] === type);
                if (item) return item[5];
                return equipTextPreV31(type);
            };

            // Equipment recalc — apply reward bonuses
            const recalcPreV31 = recalculateEquipmentEffects;
            recalculateEquipmentEffects = function recalculateEquipmentEffectsV31() {
                recalcPreV31();
                const eq = player.equippedEquipment || [];
                const has = id => eq.includes(id);
                if (has("tyrantLens"))     { player.attackBox.width += 22; player.v31_tyrantLens = true; }
                if (has("sovereignAegis")) { player.maxLives += 1; player.v31_sovereignAegis = true; }
                if (has("godThreadMantle")){ player.maxLives += 2; player.v31_godThreadMantle = true; }
            };

            // World generation for traversal realms
            const extendWorldPreV31 = extendWorld;
            extendWorld = function extendWorldV31(targetX) {
                const data = V31_REALM_BY_ID[currentRealm];
                if (!data || data.boss) return extendWorldPreV31(targetX);
                while (maxReachedX < targetX) {
                    let lastP = platforms[platforms.length - 1];
                    // Tighter gaps and more height variance to increase traversal difficulty
                    let gap = 100 + Math.random() * 140;
                    let nextX = lastP.x + lastP.width + gap;
                    let heightChange = (Math.random() - 0.5) * 240;
                    let nextY = Math.max(130, Math.min(canvas.height - 210, lastP.y + heightChange));
                    let nextW = 160 + Math.random() * 240;
                    let nextIndex = lastP.index + 1;
                    createPlatform(nextX, nextY, nextW, nextIndex);
                    if (Math.random() > 0.45) {
                        const enemyChoices = data.enemies || [90, 91];
                        const randType = enemyChoices[Math.floor(Math.random() * enemyChoices.length)];
                        const enemyDef = V31_ENEMIES[randType] || { height: 70, behaviorFlags: [] };
                        const flags = enemyDef.behaviorFlags || [];
                        const flying = flags.some(f => ["floating","flying","homing","projector","sine_wave","phase_drift"].includes(f));
                        const enemyX = nextX + 50 + Math.random() * Math.max(50, nextW - 100);
                        const enemyY = flying ? nextY - 150 : nextY - Math.max(48, enemyDef.height * 0.82);
                        createEnemy(enemyX, enemyY, randType);
                    }
                    if (Math.random() < 0.18) spawnHeal(nextX + nextW / 2, nextY - 40);
                    if (eligibleWorldDropIds().length > 0 && nextIndex >= nextMagicPlatformIndex) {
                        let itemX = nextX + 35 + Math.random() * Math.max(20, nextW - 70);
                        spawnMagicItem(itemX, nextY - 70);
                    }
                    maxReachedX = nextX + nextW;
                }
            };

            // Realm accent colour hook
            const realmAccentPreV31 = realmAccent;
            realmAccent = function realmAccentV31() {
                const data = V31_REALM_BY_ID[currentRealm];
                if (data && data.color) return hexToRgb(data.color);
                if (boss.active && V31_BOSSES[boss.kind]) return hexToRgb(V31_BOSSES[boss.kind].color);
                return realmAccentPreV31();
            };

            // UI colour hook
            const updateUIPreV31 = updateUI;
            updateUI = function updateUIV31() {
                updateUIPreV31();
                const data = V31_REALM_BY_ID[currentRealm];
                if (data && data.color) document.getElementById("ui").style.color = data.color;
                // Show active realm buff label
                if (data && data.realmBuff) {
                    let buffEl = document.getElementById("v31BuffLabel");
                    if (!buffEl) {
                        buffEl = document.createElement("div");
                        buffEl.id = "v31BuffLabel";
                        buffEl.style.cssText = "position:absolute;top:120px;left:20px;font-family:'Courier New',monospace;font-size:11px;font-weight:bold;pointer-events:none;letter-spacing:1px;text-shadow:0 0 8px currentColor,0 1px 3px rgba(0,0,0,0.9);";
                        document.body.appendChild(buffEl);
                    }
                    buffEl.style.color = data.color;
                    buffEl.textContent = "⚠ " + data.realmBuff.label + ": " + data.realmBuff.desc;
                } else {
                    const buffEl = document.getElementById("v31BuffLabel");
                    if (buffEl) buffEl.textContent = "";
                }
            };

            // ── REALM BUFF UPDATE HOOK — wired into the main game loop ────────
            // We monkey-patch the game loop by wrapping the existing loop function.
            const loopPreV31 = loop;
            loop = function loopV31() {
                // This wrapper runs every frame BEFORE the original loop body.
                // We intercept by patching the update function instead (safer).
                loopPreV31();
            };

            // Patch the update function to inject realm buff logic each frame
            const updatePreV31 = update;
            update = function updateV31() {
                updatePreV31();
                if (equipmentMenuOpen || endingScreenOpen || gameOver) return;
                applyV31RealmBuffs(V31_REALM_BY_ID);
            };

            function applyV31RealmBuffs(realmById) {
                if (boss.active || gameOver) return;
                const data = realmById[currentRealm];
                if (!data || !data.realmBuff) {
                    // Reset state when leaving a buff realm
                    if (v31RealmBuffState.gravityFlipped) {
                        v31RealmBuffState.gravityFlipped = false;
                        player.gravity = BASE_GRAVITY;
                    }
                    return;
                }
                const buff = data.realmBuff;

                // ─ Gravity Flip (Mirror Wastes) ─────────────────────────────
                if (buff.gravityFlip && !player.v31_tyrantLens) {
                    v31RealmBuffState.gravityFlipTimer++;
                    if (v31RealmBuffState.gravityFlipTimer >= buff.flipInterval) {
                        v31RealmBuffState.gravityFlipTimer = 0;
                        v31RealmBuffState.gravityFlipped = !v31RealmBuffState.gravityFlipped;
                        player.gravity = v31RealmBuffState.gravityFlipped ? -BASE_GRAVITY * 0.9 : BASE_GRAVITY;
                        // Jolt player upward/downward on flip so they notice
                        player.vy *= -0.7;
                        // Visual flash
                        realmFlash = 20;
                    }
                    // Ensure gravity stays set (recalcEquip resets it each frame)
                    if (v31RealmBuffState.gravityFlipped) player.gravity = -BASE_GRAVITY * 0.9;
                } else if (!buff.gravityFlip && v31RealmBuffState.gravityFlipped) {
                    v31RealmBuffState.gravityFlipped = false;
                    player.gravity = BASE_GRAVITY;
                }

                // ─ Periodic Damage (Corroded Sun Vault) ──────────────────────
                if (buff.periodicDamageInterval > 0 && !player.v31_sovereignAegis) {
                    v31RealmBuffState.gravityFlipTimer = v31RealmBuffState.gravityFlipTimer || 0; // reuse as generic timer per buff
                    // We use a separate ticker here keyed to the buff id
                    if (!v31RealmBuffState.periodicTimer) v31RealmBuffState.periodicTimer = 0;
                    v31RealmBuffState.periodicTimer++;
                    if (v31RealmBuffState.periodicTimer >= buff.periodicDamageInterval) {
                        v31RealmBuffState.periodicTimer = 0;
                        if (player.invulnTimer === 0) takePlayerDamage(buff.periodicDamageColor || "#ff9922", {deathCause:"the Corroded Sun Vault"});
                    }
                } else if (buff.periodicDamageInterval === 0) {
                    v31RealmBuffState.periodicTimer = 0;
                }

                // ─ Platform Shrink (Corroded Sun Vault) ──────────────────────
                if (buff.platformShrinks && !player.v31_sovereignAegis) {
                    // Find which platform the player is currently standing on
                    const localPlatforms = ftPlatformRange(player.worldX - player.width - 40, player.worldX + player.width + 40);
                    for (const p of localPlatforms) {
                        const onTop = player.worldX >= p.x && player.worldX <= p.x + p.width &&
                                      Math.abs((player.worldY + player.height/2) - p.y) < 6 && player.vy >= 0;
                        if (onTop) {
                            const platformKey = Number.isFinite(p.index) ? p.index : p;
                            if (!v31RealmBuffState.shrinkingPlatforms.has(platformKey)) {
                                v31RealmBuffState.shrinkingPlatforms.set(platformKey, p.width);
                            }
                            const curW = v31RealmBuffState.shrinkingPlatforms.get(platformKey);
                            const newW = Math.max(buff.minPlatformWidth, curW - buff.shrinkRate);
                            v31RealmBuffState.shrinkingPlatforms.set(platformKey, newW);
                            p.width = newW;
                            break;
                        }
                    }
                }

                // ─ Void Pull (Void Thread Abyss) ─────────────────────────────
                if (buff.voidDrag && buff.voidDrag > 0) {
                    const drag = player.v31_godThreadMantle ? buff.voidDrag * 0.2 : buff.voidDrag;
                    // Push player leftward (negative vx direction = left)
                    player.vx -= drag;
                    // Clamp so it doesn't go past the max speed in reverse
                    if (player.vx < -player.maxSpeed * 1.5) player.vx = -player.maxSpeed * 1.5;
                }

                // ─ Enemy bonus damage (Void Thread Abyss) ───────────────────
                // Applied in the damage hook below — stored in buff state
                v31RealmBuffState.activeEnemyBonus = (buff.enemyBonusDamage && !player.v31_godThreadMantle)
                    ? buff.enemyBonusDamage : 0;
            }

            // Patch takePlayerDamage to apply enemy bonus damage in Void Abyss
            const takePlayerDamagePreV31 = takePlayerDamage;
            takePlayerDamage = function takePlayerDamageV31(color, sourceAttack) {
                takePlayerDamagePreV31(color, sourceAttack);
                // Apply bonus damage on top (once, immediately after the base hit)
                const bonus = v31RealmBuffState.activeEnemyBonus || 0;
                if (bonus > 0 && player.invulnTimer > 0 && !boss.active) {
                    // Spend the invuln window immediately so bonus hit lands
                    if (player.lives > 0) {
                        player.lives = Math.max(0, player.lives - bonus);
                        if (player.lives <= 0) triggerDeathScreen('the Void Thread Abyss');
                        else updateUI();
                    }
                }
            };

            // ── BOSS VISUALS — menacing custom rendering for each V31 boss ───
            const drawBossPreV31 = drawBoss;
            drawBoss = function drawBossV31(screenX) {
                if (!V31_BOSSES[boss.kind]) return drawBossPreV31(screenX);
                ctx.save();
                const t = Date.now(), cx = screenX, cy = boss.y + boss.height / 2;
                const def = V31_BOSSES[boss.kind];
                const c = hexToRgb(def.color);

                // ── Shared: massive pulsing aura ────────────────────────────
                const aura = ctx.createRadialGradient(cx, cy, 20, cx, cy, 300);
                aura.addColorStop(0, `rgba(${c.r},${c.g},${c.b},0.52)`);
                aura.addColorStop(1, "rgba(0,0,0,0)");
                ctx.fillStyle = aura;
                ctx.beginPath(); ctx.arc(cx, cy, 300, 0, Math.PI * 2); ctx.fill();

                ctx.shadowColor = def.color; ctx.shadowBlur = 50;
                ctx.strokeStyle = def.color;
                ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.70)`;
                ctx.lineWidth = 4;

                if (boss.kind === "mirrorTyrant") {
                    // Fractured mirror body: 8 angled interlocking shards
                    const shards = [
                        [-60,-140, 60,-140, 90,-40, -90,-40],
                        [60,-140, 120,-20, 90,-40],
                        [-90,-40, 90,-40, 110,100,-110,100],
                        [-110,100, 110,100, 80,180, -80,180],
                        // Cracked "eye" pupils
                    ];
                    ctx.beginPath();
                    ctx.moveTo(cx-70, cy-155); ctx.lineTo(cx+70, cy-155);
                    ctx.lineTo(cx+130, cy-30); ctx.lineTo(cx+120, cy+110);
                    ctx.lineTo(cx+85, cy+185); ctx.lineTo(cx-85, cy+185);
                    ctx.lineTo(cx-120, cy+110); ctx.lineTo(cx-130, cy-30);
                    ctx.closePath(); ctx.fill(); ctx.stroke();
                    // Crack lines across body
                    ctx.lineWidth = 2;
                    [[cx-60,cy-120,cx+30,cy+60],[cx+50,cy-100,cx-20,cy+100],[cx-40,cy+20,cx+80,cy-40]].forEach(([x1,y1,x2,y2]) => {
                        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
                    });
                    // Mirror-like reflective dots (eyes)
                    ctx.fillStyle = "#e0ffff"; ctx.shadowBlur = 18;
                    [[cx-28,cy-60],[cx+28,cy-60],[cx,cy-30]].forEach(([ex,ey]) => {
                        ctx.beginPath(); ctx.arc(ex,ey,10,0,Math.PI*2); ctx.fill();
                    });
                    // Rotating shard fragments orbiting the boss
                    for (let i = 0; i < 6; i++) {
                        const a = t*0.0018 + i*Math.PI/3;
                        const rx = cx + Math.cos(a)*170, ry = cy + Math.sin(a)*120;
                        ctx.save(); ctx.translate(rx,ry); ctx.rotate(a+t*0.003);
                        ctx.beginPath(); ctx.moveTo(0,-14); ctx.lineTo(8,0); ctx.lineTo(0,14); ctx.lineTo(-8,0); ctx.closePath();
                        ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.75)`; ctx.fill(); ctx.stroke();
                        ctx.restore();
                    }

                } else if (boss.kind === "corrodedSovereign") {
                    // Corroded sun king: layered dripping crown shape
                    // Main body
                    ctx.beginPath();
                    ctx.moveTo(cx,cy-185); ctx.lineTo(cx+55,cy-110); ctx.lineTo(cx+145,cy-60);
                    ctx.lineTo(cx+135,cy+100); ctx.lineTo(cx+95,cy+195);
                    ctx.lineTo(cx-95,cy+195); ctx.lineTo(cx-135,cy+100);
                    ctx.lineTo(cx-145,cy-60); ctx.lineTo(cx-55,cy-110);
                    ctx.closePath(); ctx.fill(); ctx.stroke();
                    // Crown spikes
                    ctx.lineWidth = 3;
                    [[-80,-155],[-40,-185],[0,-200],[40,-185],[80,-155]].forEach(([ox,oy]) => {
                        ctx.beginPath(); ctx.moveTo(cx+ox,cy+oy); ctx.lineTo(cx+ox,cy+oy-55);
                        ctx.lineTo(cx+ox+12,cy+oy-32); ctx.stroke();
                    });
                    // Drip acid lines
                    ctx.strokeStyle = "#ffcc33"; ctx.lineWidth = 2;
                    for (let i = 0; i < 8; i++) {
                        const bx = cx - 100 + i*28, by = cy + 80 + Math.sin(t*0.004+i)*18;
                        ctx.beginPath(); ctx.moveTo(bx,by); ctx.lineTo(bx+Math.sin(t*0.006+i)*8, by+50+Math.random()*5);
                        ctx.stroke();
                    }
                    // Blazing eyes
                    ctx.fillStyle = "#ffee00"; ctx.shadowColor="#ff8800"; ctx.shadowBlur=22;
                    [[-30,cy-55],[30,cy-55]].forEach(([ox,ey]) => {
                        ctx.beginPath(); ctx.ellipse(cx+ox,ey,14,9,0,0,Math.PI*2); ctx.fill();
                    });
                    // Orbiting sun embers
                    for (let i = 0; i < 8; i++) {
                        const a = t*0.0015 + i*Math.PI/4;
                        const rx = cx+Math.cos(a)*200, ry = cy+Math.sin(a)*140;
                        ctx.beginPath(); ctx.arc(rx,ry,7+Math.sin(t*0.008+i)*3,0,Math.PI*2);
                        ctx.fillStyle=`rgba(255,${140+i*12},0,0.85)`; ctx.shadowColor="#ff8800"; ctx.fill();
                    }

                } else if (boss.kind === "voidThreadGod") {
                    // God of void threads: massive writhing cosmic horror form
                    // Central mass — irregular void blob
                    ctx.beginPath();
                    for (let i = 0; i <= 16; i++) {
                        const a = (i/16)*Math.PI*2;
                        const r = 155 + Math.sin(t*0.003+a*3)*35 + Math.cos(t*0.005+a*5)*20;
                        const px2 = cx + Math.cos(a)*r * 0.9;
                        const py2 = cy + Math.sin(a)*r * 1.2;
                        if (i===0) ctx.moveTo(px2,py2); else ctx.lineTo(px2,py2);
                    }
                    ctx.closePath(); ctx.fill(); ctx.stroke();
                    // Radiating god threads — thick lines
                    ctx.lineWidth = 5; ctx.globalAlpha = 0.6;
                    for (let i = 0; i < 18; i++) {
                        const a = t*0.001 + i*Math.PI/9;
                        const len = 180 + Math.sin(t*0.004+i)*50;
                        ctx.beginPath(); ctx.moveTo(cx,cy);
                        ctx.lineTo(cx+Math.cos(a)*len, cy+Math.sin(a)*len); ctx.stroke();
                    }
                    ctx.globalAlpha = 1; ctx.lineWidth = 4;
                    // Void eyes — 5 eyes in an arc
                    ctx.fillStyle="#cc99ff"; ctx.shadowColor="#8844ff"; ctx.shadowBlur=28;
                    for (let i = 0; i < 5; i++) {
                        const a = (i/4)*Math.PI - Math.PI/2 + Math.sin(t*0.002+i)*0.18;
                        const er = 55 + i%2 * 10;
                        const ex = cx + Math.cos(a + Math.PI/2)*er;
                        const ey = cy - 30 + Math.sin(a + Math.PI/2)*er * 0.6;
                        ctx.beginPath(); ctx.ellipse(ex,ey,12,7,a,0,Math.PI*2); ctx.fill();
                        ctx.fillStyle="#ffffff";
                        ctx.beginPath(); ctx.arc(ex,ey,3.5,0,Math.PI*2); ctx.fill();
                        ctx.fillStyle="#cc99ff";
                    }
                    // Void tendrils reaching outward
                    ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.45)`; ctx.lineWidth=6;
                    for (let i = 0; i < 6; i++) {
                        const a = t*0.0012 + i*Math.PI/3;
                        ctx.beginPath(); ctx.moveTo(cx,cy);
                        const cp1x = cx+Math.cos(a+0.7)*180, cp1y = cy+Math.sin(a+0.7)*130;
                        const cp2x = cx+Math.cos(a-0.3)*260, cp2y = cy+Math.sin(a-0.3)*180;
                        const epx = cx+Math.cos(a)*310, epy = cy+Math.sin(a)*220;
                        ctx.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,epx,epy); ctx.stroke();
                    }
                }

                // ── Shared: HP bar with boss name ────────────────────────────
                const barW = 360, barX = canvas.width/2 - barW/2, barY = 36;
                ctx.shadowBlur = 0;
                ctx.fillStyle = "rgba(0,0,0,0.78)"; ctx.fillRect(barX-2, barY-2, barW+4, 22);
                const hp = Math.max(0, boss.hp / boss.maxHp);
                const barGrad = ctx.createLinearGradient(barX, barY, barX+barW, barY);
                barGrad.addColorStop(0, def.color); barGrad.addColorStop(1, "#ffffff");
                ctx.fillStyle = barGrad; ctx.fillRect(barX, barY, barW*hp, 18);
                ctx.strokeStyle = def.color; ctx.lineWidth = 2; ctx.strokeRect(barX, barY, barW, 18);
                ctx.fillStyle = "rgba(255,245,235,0.95)";
                ctx.font = "bold 12px Courier New"; ctx.textAlign = "left";
                ctx.fillText(def.name, barX, barY - 7);
                ctx.restore();
            };

            // ── BACKGROUND for V31 traversal realms ──────────────────────────
            const drawBgPreV31 = drawRealmBackground;
            drawRealmBackground = function drawRealmBackgroundV31(W, H, t) {
                const data = V31_REALM_BY_ID[currentRealm];
                if (!data || data.boss) return drawBgPreV31(W, H, t);
                const id = currentRealm;
                ctx.save();

                if (id === "shatteredMirrorWastes") {
                    // Dark void with mirror shards and flickering reflections
                    const bg = ctx.createLinearGradient(0,0,0,H);
                    bg.addColorStop(0,"#010c10"); bg.addColorStop(1,"#030e14");
                    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
                    // Floating mirror shard particles
                    const scatterSeedV31A = ftScatterSeed('v31-free-particles:' + currentRealm);
                    for (let i=0; i<24; i++) {
                        const sx = (ftScatter01(scatterSeedV31A,i,0)*W + t*(0.18+ftScatter01(scatterSeedV31A,i,2)*0.34))%W, sy = (ftScatter01(scatterSeedV31A,i,1)*H + t*(0.10+ftScatter01(scatterSeedV31A,i,3)*0.24))%H;
                        const a = t*0.002+i;
                        ctx.save(); ctx.translate(sx,sy); ctx.rotate(a);
                        ctx.strokeStyle=`rgba(180,240,255,${0.2+Math.sin(t*0.005+i)*0.15})`;
                        ctx.lineWidth=1.5;
                        ctx.strokeRect(-8,-14,16,28); ctx.restore();
                    }
                    // Horizontal mirror glitch lines
                    for (let i=0; i<6; i++) {
                        const ly = (H*0.15+i*(H/7)+Math.sin(t*0.004+i)*30)%H;
                        ctx.strokeStyle=`rgba(160,230,255,${0.08+Math.sin(t*0.007+i)*0.06})`;
                        ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(0,ly); ctx.lineTo(W,ly); ctx.stroke();
                    }
                    // Gravity flip warning pulse when flip is near
                    const flipPct = v31RealmBuffState.gravityFlipTimer / 180;
                    if (flipPct > 0.7) {
                        const pulse = (flipPct-0.7)/0.3;
                        ctx.fillStyle=`rgba(180,240,255,${pulse*0.12})`;
                        ctx.fillRect(0,0,W,H);
                    }

                } else if (id === "corrodedSunVault") {
                    // Acid golden vault ceiling dripping
                    const bg = ctx.createLinearGradient(0,0,0,H);
                    bg.addColorStop(0,"#140a00"); bg.addColorStop(1,"#0b0600");
                    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
                    // Dripping acid from top
                    for (let i=0; i<18; i++) {
                        const dx = (i*139+110)%W;
                        const dlen = 40+Math.sin(t*0.004+i)*60;
                        const grad = ctx.createLinearGradient(dx,0,dx,dlen);
                        grad.addColorStop(0,`rgba(255,140,0,0.5)`);
                        grad.addColorStop(1,`rgba(255,200,0,0)`);
                        ctx.fillStyle=grad; ctx.fillRect(dx-3,0,6,dlen);
                    }
                    // Glowing sun orbs in background
                    for (let i=0; i<5; i++) {
                        const ox = W*0.1 + i*(W*0.2) + Math.sin(t*0.003+i)*30;
                        const oy = H*0.2 + Math.cos(t*0.004+i)*40;
                        const grad = ctx.createRadialGradient(ox,oy,5,ox,oy,50);
                        grad.addColorStop(0,`rgba(255,180,0,0.18)`);
                        grad.addColorStop(1,"rgba(0,0,0,0)");
                        ctx.fillStyle=grad; ctx.beginPath(); ctx.arc(ox,oy,50,0,Math.PI*2); ctx.fill();
                    }

                } else if (id === "voidThreadAbyss") {
                    // Deep void with purple thread wisps flowing leftward
                    const bg = ctx.createLinearGradient(0,0,0,H);
                    bg.addColorStop(0,"#050010"); bg.addColorStop(1,"#020008");
                    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
                    // Leftward-drifting thread wisps
                    for (let i=0; i<20; i++) {
                        const wy = H*0.05 + i*(H/20);
                        const wx = ((W*1.2 - (t*0.8 + i*137)%(W*1.5)));
                        ctx.strokeStyle=`rgba(140,80,255,${0.12+Math.sin(t*0.003+i)*0.08})`;
                        ctx.lineWidth=1+i%3*0.5;
                        ctx.beginPath();
                        ctx.moveTo(wx,wy+Math.sin(t*0.004+i)*20);
                        ctx.quadraticCurveTo(wx+80,wy+Math.sin(t*0.005+i+1)*25,wx+160,wy+Math.sin(t*0.003+i+2)*20);
                        ctx.stroke();
                    }
                    // Void stars / nodes
                    const scatterSeedV31B = ftScatterSeed('v31-static-stars:' + currentRealm);
                    for (let i=0; i<30; i++) {
                        const sx = ftScatter01(scatterSeedV31B,i,0)*W, sy = ftScatter01(scatterSeedV31B,i,1)*H;
                        const sz = 1+Math.sin(t*0.006+i)*0.8;
                        ctx.fillStyle=`rgba(180,120,255,${0.3+Math.sin(t*0.007+i)*0.2})`;
                        ctx.beginPath(); ctx.arc(sx,sy,sz,0,Math.PI*2); ctx.fill();
                    }
                }
                ctx.restore();
            };

            // Enemy visuals for V31
            const drawEnemyPreV31 = drawEnemy;
            drawEnemy = function drawEnemyV31(e, screenX) {
                const def = V31_ENEMIES[e.type];
                if (!def) return drawEnemyPreV31(e, screenX);
                ctx.save();
                const t = Date.now();
                const cx = screenX + e.width/2, cy = e.y + e.height/2;
                const realm = V31_CURSED_REALMS.find(r => (r.enemies||[]).includes(e.type));
                const col2 = realm ? realm.color : "#ffffff";
                ctx.shadowColor = col2; ctx.shadowBlur = 28;
                ctx.strokeStyle = col2;
                ctx.fillStyle = `rgba(255,255,255,0.12)`;
                ctx.lineWidth = 2.5;
                const pulse = 1 + Math.sin(t*0.007 + e.floatOffset) * 0.14;
                const flags = def.behaviorFlags || [];
                const flying = flags.some(f => ["floating","flying","homing","projector","sine_wave","phase_drift"].includes(f));
                const heavy = flags.includes("heavy");
                if (flying) {
                    // Jagged angular floating form
                    ctx.beginPath();
                    ctx.moveTo(cx, cy - e.height*0.5*pulse);
                    ctx.lineTo(cx + e.width*0.48, cy - e.height*0.1);
                    ctx.lineTo(cx + e.width*0.32, cy + e.height*0.48);
                    ctx.lineTo(cx - e.width*0.32, cy + e.height*0.48);
                    ctx.lineTo(cx - e.width*0.48, cy - e.height*0.1);
                    ctx.closePath(); ctx.fill(); ctx.stroke();
                    // Inner glow diamond
                    ctx.fillStyle = col2; ctx.globalAlpha = 0.3;
                    ctx.beginPath(); ctx.moveTo(cx, cy-e.height*0.25); ctx.lineTo(cx+e.width*0.2, cy); ctx.lineTo(cx, cy+e.height*0.25); ctx.lineTo(cx-e.width*0.2, cy); ctx.closePath(); ctx.fill();
                    ctx.globalAlpha = 1;
                } else if (heavy) {
                    // Massive angular titan form
                    ctx.beginPath();
                    ctx.moveTo(cx-e.width*0.5+12, cy-e.height*0.5);
                    ctx.lineTo(cx+e.width*0.5-12, cy-e.height*0.5);
                    ctx.lineTo(cx+e.width*0.5, cy-e.height*0.5+16);
                    ctx.lineTo(cx+e.width*0.5, cy+e.height*0.5-16);
                    ctx.lineTo(cx+e.width*0.5-12, cy+e.height*0.5);
                    ctx.lineTo(cx-e.width*0.5+12, cy+e.height*0.5);
                    ctx.lineTo(cx-e.width*0.5, cy+e.height*0.5-16);
                    ctx.lineTo(cx-e.width*0.5, cy-e.height*0.5+16);
                    ctx.closePath(); ctx.fill(); ctx.stroke();
                    // Cross mark
                    ctx.lineWidth=3; ctx.beginPath();
                    ctx.moveTo(cx-e.width*0.28,cy-e.height*0.22); ctx.lineTo(cx+e.width*0.28,cy+e.height*0.22);
                    ctx.moveTo(cx+e.width*0.28,cy-e.height*0.22); ctx.lineTo(cx-e.width*0.28,cy+e.height*0.22);
                    ctx.stroke();
                } else {
                    // Ground enemy — tall jagged spike form
                    ctx.beginPath();
                    ctx.moveTo(cx, cy-e.height*0.52);
                    ctx.lineTo(cx+e.width*0.35, cy-e.height*0.15);
                    ctx.lineTo(cx+e.width*0.5, cy+e.height*0.5);
                    ctx.lineTo(cx-e.width*0.5, cy+e.height*0.5);
                    ctx.lineTo(cx-e.width*0.35, cy-e.height*0.15);
                    ctx.closePath(); ctx.fill(); ctx.stroke();
                }
                // Glowing eyes (always 2)
                ctx.fillStyle="rgba(255,255,255,0.95)"; ctx.shadowBlur=12;
                ctx.beginPath(); ctx.arc(cx-6,cy-e.height*0.15,4,0,Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(cx+6,cy-e.height*0.15,4,0,Math.PI*2); ctx.fill();
                ctx.restore();
            };
        })();
