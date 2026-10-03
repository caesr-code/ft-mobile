/* Faded Thread module: 12-expansion-v32.js | build 03 Oct 2026 */
//─────────────────────────────────────────────────────────────────// V32 ECLIPSE THRONE EXPANSION
// Adds the Eclipse Throne realm (target 120) with five brutal traversal debuffs,
// a unique animated eclipse background, the Eclipse Sovereign boss (800 HP,
// 20 unique actions), and the overpowered Eclipse Crown reward.
// Insert this entire block immediately before the final lines:
//   resetGame(); showHomeScreen(); loop();
// ─────────────────────────────────────────────────────────────────

// ── REALM DEFINITION ──────────────────────────────────────────────────
const V32_ECLIPSE_REALMS = [
    {
        id: "eclipseThrone",
        name: "Eclipse Throne",
        target: 120,
        enemies: [96, 97],
        color: "#1a0a2e",
        endgame: true,
        realmBuff: {
            id: "eclipseThroneDebuffs",
            label: "ECLIPSE JUDGEMENT",
            desc: "Five Curses: Dim Gravity, Shadow Drain, Platform Fading, Eclipse Pull, Curse of Fragility.",
            // Debuff 1: Dim Gravity — gravity is 1.4x stronger
            dimGravity: true,
            gravityMultiplier: 1.4,
            // Debuff 2: Shadow Drain — lose 1 HP every 5 seconds (300 frames)
            shadowDrain: true,
            drainInterval: 300,
            drainColor: "#6b2cff",
            // Debuff 3: Platform Fading — platforms slowly vanish while stood on
            platformFades: true,
            fadeRate: 0.4,
            minFadeWidth: 20,
            // Debuff 4: Eclipse Pull — constant downward drag
            eclipsePull: true,
            pullStrength: 0.3,
            // Debuff 5: Curse of Fragility — invulnerability window after hits is halved
            fragilityCurse: true,
            invulnMultiplier: 0.5
        }
    },
    {
        id: "bossV32_1",
        name: "The Eclipse Sovereign",
        boss: "eclipseSovereign",
        endgame: true
    }
];

// ── ENEMIES ──────────────────────────────────────────────────────────
const V32_ENEMIES = {
    96: { name: "Eclipse Sentinel", hp: 20, speed: 2.6, width: 100, height: 110, behaviorFlags: ["heavy","projector","gravitational_pull","summoner"] },
    97: { name: "Shadow Weaver",   hp: 16, speed: 3.6, width: 70,  height: 66,  behaviorFlags: ["phase_drift","fast","sine_wave","homing"] }
};

// ── BOSS DEFINITION ──────────────────────────────────────────────────
const V32_BOSSES = {
    eclipseSovereign: {
        name: "THE ECLIPSE SOVEREIGN",
        hp: 800,
        width: 380,
        height: 440,
        color: "#1a0a2e"
    }
};

// ── 20 UNIQUE BOSS ACTIONS ───────────────────────────────────────────
function makeV32EclipseSovereignActions() {
    const col = "#1a0a2e";
    const col2 = "#6b2cff";
    const col3 = "#cc44ff";
    return [
        // 1. Eclipse Volley — 7 projectile fan
        { name: "eclipse volley", telegraph: 380,
          spawn(b) {
            for (let i = -3; i <= 3; i++) {
                const ang = i * 0.19;
                spawnBossProjectile({ x: b.x - worldX, y: b.y + b.height/2,
                    vx: -9.5 * Math.cos(ang), vy: 9.5 * Math.sin(ang),
                    width: 20, height: 20, life: 250, color: col2, shape: "shard" });
            }
          }
        },
        // 2. Shadow Beam — wide vertical beam
        { name: "shadow beam", telegraph: 560,
          spawn(b) {
            spawnBossBeam({ x: player.worldX - worldX, y: 0, width: 60, height: window.innerHeight, life: 65, color: col2 });
          }
        },
        // 3. Eclipse Ring — massive expanding ring
        { name: "eclipse ring", telegraph: 460,
          spawn(b) {
            spawnBossHazard({ x: b.x - worldX, y: b.y + b.height/2, width: 16, height: 16,
                maxRadius: 280, life: 100, growTime: 100, color: col2, shape: "ring" });
          }
        },
        // 4. Throne Spikes — 10 floor hazards
        { name: "throne spikes", telegraph: 520,
          spawn(b) {
            for (let i = 0; i < 10; i++)
                spawnBossHazard({ x: player.worldX - 360 + i * 80 - worldX, y: window.innerHeight - 88,
                    width: 64, height: 52, life: 110, growTime: 14, color: col2, shape: "spikes" });
          }
        },
        // 5. Shadow Rain — 14 falling projectiles
        { name: "shadow rain", telegraph: 420,
          spawn(b) {
            for (let i = 0; i < 14; i++)
                spawnBossProjectile({ x: player.worldX - 480 + i * 74 - worldX, y: -50,
                    vx: (Math.random() - 0.5) * 2.5, vy: 11 + Math.random() * 4,
                    width: 18, height: 26, life: 220, color: col2, shape: "shard" });
          }
        },
        // 6. Pentabeam — five simultaneous beams
        { name: "pentabeam", telegraph: 680,
          spawn(b) {
            [-320, -160, 0, 160, 320].forEach(offset => spawnBossBeam({
                x: player.worldX + offset - worldX, y: 0,
                width: 44, height: window.innerHeight, life: 60, color: col2 }));
          }
        },
        // 7. Sovereign Burst — 16 radial projectiles
        { name: "sovereign burst", telegraph: 440,
          spawn(b) {
            for (let i = 0; i < 16; i++) {
                const a = (i / 16) * Math.PI * 2;
                spawnBossProjectile({ x: b.x - worldX, y: b.y + b.height/2,
                    vx: Math.cos(a) * 9, vy: Math.sin(a) * 9,
                    width: 20, height: 20, life: 240, color: col2, shape: "shard" });
            }
          }
        },
        // 8. Concentric Eclipse — 6 rings
        { name: "concentric eclipse", telegraph: 540,
          spawn(b) {
            [70, 130, 190, 250, 310, 370].forEach((r, i) => spawnBossHazard({
                x: b.x - worldX, y: b.y + b.height/2, width: 10, height: 10,
                maxRadius: r, life: 55 + i * 18, growTime: 55 + i * 18,
                color: col2, shape: "ring" }));
          }
        },
        // 9. Throne Erasure — full floor coverage
        { name: "throne erasure", telegraph: 620,
          spawn(b) {
            for (let i = 0; i < 18; i++)
                spawnBossHazard({ x: -80 + i * 100, y: window.innerHeight - 90,
                    width: 88, height: 56, life: 100, growTime: 10, color: col2, shape: "spikes" });
          }
        },
        // 10. Sovereign Barrage — 24 aimed projectiles
        { name: "sovereign barrage", telegraph: 700,
          spawn(b) {
            const px = player.worldX - worldX, py = player.worldY;
            for (let i = 0; i < 24; i++) {
                const off = (i - 11.5) * 20;
                const dx = (px + off) - (b.x - worldX), dy = py - (b.y + b.height/2);
                const len = Math.sqrt(dx*dx + dy*dy) || 1;
                spawnBossProjectile({ x: b.x - worldX, y: b.y + b.height/2,
                    vx: (dx/len) * 11, vy: (dy/len) * 11,
                    width: 18, height: 18, life: 210, color: col2, shape: "shard" });
            }
          }
        },
        // 11. Spiral Eclipse — 12 projectiles in a rotating spiral
        { name: "spiral eclipse", telegraph: 480,
          spawn(b) {
            for (let i = 0; i < 12; i++) {
                const a = (i / 12) * Math.PI * 2 + Date.now() * 0.001;
                spawnBossProjectile({ x: b.x - worldX, y: b.y + b.height/2,
                    vx: Math.cos(a) * 8.5, vy: Math.sin(a) * 8.5,
                    width: 16, height: 16, life: 230, color: col3, shape: "shard" });
            }
          }
        },
        // 12. Cross Beams — two diagonal-feeling beams (horizontal + vertical)
        { name: "cross beams", telegraph: 600,
          spawn(b) {
            spawnBossBeam({ x: player.worldX - worldX, y: 0, width: 50, height: window.innerHeight, life: 55, color: col3 });
            spawnBossBeam({ x: 0, y: player.worldY, width: window.innerWidth, height: 50, life: 55, color: col3 });
          }
        },
        // 13. Eclipse Cage — ring around player position
        { name: "eclipse cage", telegraph: 500,
          spawn(b) {
            spawnBossHazard({ x: player.worldX - worldX, y: player.worldY,
                width: 12, height: 12, maxRadius: 130,
                life: 60, growTime: 60, color: col3, shape: "ring" });
          }
        },
        // 14. Shadow Tether — homing-ish projectile
        { name: "shadow tether", telegraph: 420,
          spawn(b) {
            const dx = player.worldX - b.x, dy = player.worldY - (b.y + b.height/2);
            const len = Math.max(1, Math.hypot(dx, dy));
            spawnBossProjectile({ x: b.x - worldX, y: b.y + b.height/2,
                vx: (dx/len) * 5.5, vy: (dy/len) * 5.5,
                width: 24, height: 24, life: 260, color: col3, shape: "tether" });
          }
        },
        // 15. Twin Ring Pulse — two staggered rings
        { name: "twin ring pulse", telegraph: 440,
          spawn(b) {
            spawnBossHazard({ x: b.x - worldX, y: b.y + b.height/2, width: 10, height: 10,
                maxRadius: 160, life: 70, growTime: 70, color: col3, shape: "ring" });
            setTimeout(() => {
                if (boss.active) spawnBossHazard({ x: b.x - worldX, y: b.y + b.height/2, width: 10, height: 10,
                    maxRadius: 220, life: 70, growTime: 70, color: col3, shape: "ring" });
            }, 300);
          }
        },
        // 16. Eclipse Charge — boss charges across screen
        { name: "eclipse charge", telegraph: 400,
          spawn(b) {
            boss.state = 'charge';
            boss.timer = 0;
          }
        },
        // 17. Shadow Field — large area denial zone
        { name: "shadow field", telegraph: 500,
          spawn(b) {
            spawnBossHazard({ x: player.worldX - worldX - 80, y: window.innerHeight - 140,
                width: 160, height: 100, life: 130, growTime: 25,
                color: col3, shape: "flame" });
          }
        },
        // 18. Quake Volley — 8 projectiles in an upward arc
        { name: "quake volley", telegraph: 400,
          spawn(b) {
            for (let i = 0; i < 8; i++) {
                const a = -Math.PI/2 + (i - 3.5) * 0.22;
                spawnBossProjectile({ x: b.x - worldX, y: b.y + b.height/2,
                    vx: Math.cos(a) * 9, vy: Math.sin(a) * 9,
                    width: 18, height: 18, life: 220, color: col3, shape: "shard" });
            }
          }
        },
        // 19. Eclipse Nova — ring + radial burst combined
        { name: "eclipse nova", telegraph: 580,
          spawn(b) {
            spawnBossHazard({ x: b.x - worldX, y: b.y + b.height/2, width: 14, height: 14,
                maxRadius: 200, life: 80, growTime: 80, color: col3, shape: "ring" });
            for (let i = 0; i < 10; i++) {
                const a = (i / 10) * Math.PI * 2;
                spawnBossProjectile({ x: b.x - worldX, y: b.y + b.height/2,
                    vx: Math.cos(a) * 7.5, vy: Math.sin(a) * 7.5,
                    width: 16, height: 16, life: 200, color: col3, shape: "shard" });
            }
          }
        },
        // 20. Final Eclipse — massive beam + full floor + ring
        { name: "final eclipse", telegraph: 800,
          spawn(b) {
            spawnBossBeam({ x: player.worldX - worldX, y: 0, width: 80, height: window.innerHeight, life: 80, color: col });
            spawnBossHazard({ x: b.x - worldX, y: b.y + b.height/2, width: 18, height: 18,
                maxRadius: 350, life: 120, growTime: 120, color: col, shape: "ring" });
            for (let i = 0; i < 16; i++)
                spawnBossHazard({ x: -60 + i * 100, y: window.innerHeight - 90,
                    width: 84, height: 54, life: 90, growTime: 8, color: col, shape: "spikes" });
          }
        }
    ];
}

// ── BOSS REWARD: Eclipse Crown (overpowered) ─────────────────────────
const V32_BOSS_ITEMS = [
    ["eclipseCrown", "Eclipse Crown", "#cc44ff", "ECLIPSE", "hat",
     "Boss Reward. OVERPOWERED: +5 max lives, +50% slash range, +30% movement speed, " +
     "negates ALL Eclipse Throne debuffs, full invulnerability after hits (doubled), " +
     "double score from all sources, and all boss contact damage reduced by 50%.",
     "eclipseSovereign"]
];

const V32_BOSS_REWARD_MAP = Object.fromEntries(
    V32_BOSS_ITEMS.map(item => [item[6], { name: item[1], equipment: item[0] }])
);

// ── REALM BUFF STATE ──────────────────────────────────────────────────
const v32RealmBuffState = {
    drainTimer: 0,
    fadingPlatforms: new Map()
};

// ── INSTALLATION ──────────────────────────────────────────────────────
(function installV32EclipseThroneExpansion() {
    if (window.__fadedThreadV32Installed) return;
    window.__fadedThreadV32Installed = true;
    const V32_REALM_BY_ID = Object.fromEntries(V32_ECLIPSE_REALMS.filter(r => r.id).map(r => [r.id, r]));
    const V32_ENEMY_TYPES = new Set(Object.keys(V32_ENEMIES).map(Number));

    // Inject realms after the V31 expansion (after voidThreadGod boss)
    const voidThreadGodBossIdx = REALM_FLOW.findIndex(r => r.boss === "voidThreadGod");
    if (!REALM_FLOW.some(r => r.id === "eclipseThrone")) {
        if (voidThreadGodBossIdx >= 0) REALM_FLOW.splice(voidThreadGodBossIdx + 1, 0, ...V32_ECLIPSE_REALMS);
        else REALM_FLOW.push(...V32_ECLIPSE_REALMS);
    }

    // Register boss
    Object.assign(BOSS_DEFS, V32_BOSSES);
    BOSS_ACTIONS["eclipseSovereign"] = makeV32EclipseSovereignActions();
    BOSS_ACTIONS_UNLOCKED_COUNT["eclipseSovereign"] = 20;

    // Register enemies
    const createEnemyPreV32 = createEnemy;
    createEnemy = function createEnemyV32(x, y, type) {
        const def = V32_ENEMIES[type];
        if (!def) return createEnemyPreV32(x, y, type);
        enemies.push({ x, y, startX: x, startY: y, type, hp: def.hp,
            speed: def.speed, dir: -1, width: def.width, height: def.height,
            floatOffset: Math.random() * 100, behaviorFlags: def.behaviorFlags || [] });
    };

    // Register equipment
    for (const item of V32_BOSS_ITEMS) {
        const obj = { id: item[0], name: item[1], color: item[2], short: item[3],
                      slot: item[4], effect: item[5], bossOnly: true, bossSource: item[6] };
        if (!EQUIPMENT_TYPES.some(e => e.id === obj.id)) EQUIPMENT_TYPES.push(obj);
        BOSS_REWARD_EQUIPMENT_IDS.add(obj.id);
        WORLD_BOSS_REWARD_EQUIPMENT_IDS.add(obj.id);
    }

    // Boss reward hook
    const awardBossRewardPreV32 = awardBossReward;
    awardBossReward = function awardBossRewardV32(kind) {
        const reward = V32_BOSS_REWARD_MAP[kind];
        if (!reward) return awardBossRewardPreV32(kind);
        player.bossRewards = player.bossRewards || [];
        if (!player.bossRewards.includes(reward.name)) player.bossRewards.push(reward.name);
        collectEquipmentItem(reward.equipment, "boss");
        WORLD_BOSS_REWARD_EQUIPMENT_IDS.add(reward.equipment);
        showMagicNotice({ name: `${reward.name}: ${getEquipmentDef(reward.equipment).name}`, id: "bossReward" });
        saveGame();
    };

    // Equipment effect text hook
    const equipTextPreV32 = equipmentEffectText;
    equipmentEffectText = function equipmentEffectTextV32(type) {
        const item = V32_BOSS_ITEMS.find(i => i[0] === type);
        if (item) return item[5];
        return equipTextPreV32(type);
    };

    // Equipment recalc — apply Eclipse Crown overpowered bonuses
    const recalcPreV32 = recalculateEquipmentEffects;
    recalculateEquipmentEffects = function recalculateEquipmentEffectsV32() {
        recalcPreV32();
        const eq = player.equippedEquipment || [];
        if (eq.includes("eclipseCrown")) {
            player.v32_eclipseCrown = true;
            // +5 max lives
            player.maxLives += 5;
            // +50% slash range
            player.attackBox.width = Math.floor(player.attackBox.width * 1.5);
            player.attackBox.height = Math.floor(player.attackBox.height * 1.5);
            // +30% movement speed
            player.maxSpeed *= 1.3;
            player.acceleration *= 1.3;
            // Double score flag
            player.v32_doubleScore = true;
            // Boss damage reduction flag
            player.v32_bossDamageReduction = true;
        } else {
            player.v32_eclipseCrown = false;
            player.v32_doubleScore = false;
            player.v32_bossDamageReduction = false;
        }
        player.attackRange = Math.max(player.attackBox.width, player.attackBox.height) / 2;
    };

    // World generation for Eclipse Throne realm
    const extendWorldPreV32 = extendWorld;
    extendWorld = function extendWorldV32(targetX) {
        const data = V32_REALM_BY_ID[currentRealm];
        if (!data || data.boss) return extendWorldPreV32(targetX);
        while (maxReachedX < targetX) {
            let lastP = platforms[platforms.length - 1];
            let gap = 110 + Math.random() * 130;
            let nextX = lastP.x + lastP.width + gap;
            let heightChange = (Math.random() - 0.5) * 220;
            let nextY = Math.max(140, Math.min(canvas.height - 210, lastP.y + heightChange));
            let nextW = 180 + Math.random() * 240;
            let nextIndex = lastP.index + 1;
            createPlatform(nextX, nextY, nextW, nextIndex);
            if (Math.random() > 0.48) {
                const enemyChoices = data.enemies || [96, 97];
                const randType = enemyChoices[Math.floor(Math.random() * enemyChoices.length)];
                const enemyDef = V32_ENEMIES[randType] || { height: 80, behaviorFlags: [] };
                const flags = enemyDef.behaviorFlags || [];
                const flying = flags.some(f => ["floating","flying","homing","projector","sine_wave","phase_drift"].includes(f));
                const enemyX = nextX + 50 + Math.random() * Math.max(50, nextW - 100);
                const enemyY = flying ? nextY - 150 : nextY - Math.max(50, enemyDef.height * 0.82);
                createEnemy(enemyX, enemyY, randType);
            }
            if (Math.random() < 0.16) spawnHeal(nextX + nextW / 2, nextY - 40);
            if (eligibleWorldDropIds().length > 0 && nextIndex >= nextMagicPlatformIndex) {
                let itemX = nextX + 35 + Math.random() * Math.max(20, nextW - 70);
                spawnMagicItem(itemX, nextY - 70);
            }
            maxReachedX = nextX + nextW;
        }
    };

    // Realm accent colour
    const realmAccentPreV32 = realmAccent;
    realmAccent = function realmAccentV32() {
        const data = V32_REALM_BY_ID[currentRealm];
        if (data && data.color) return hexToRgb(data.color);
        if (boss.active && V32_BOSSES[boss.kind]) return hexToRgb(V32_BOSSES[boss.kind].color);
        return realmAccentPreV32();
    };

    // UI colour + buff label
    const updateUIPreV32 = updateUI;
    updateUI = function updateUIV32() {
        updateUIPreV32();
        const data = V32_REALM_BY_ID[currentRealm];
        if (data && data.color) document.getElementById("ui").style.color = data.color;
        if (data && data.realmBuff) {
            let buffEl = document.getElementById("v32BuffLabel");
            if (!buffEl) {
                buffEl = document.createElement("div");
                buffEl.id = "v32BuffLabel";
                buffEl.style.cssText = "position:absolute;top:145px;left:20px;font-family:'Courier New',monospace;font-size:11px;font-weight:bold;pointer-events:none;letter-spacing:1px;text-shadow:0 0 8px currentColor,0 1px 3px rgba(0,0,0,0.9);max-width:500px;line-height:1.4;";
                document.body.appendChild(buffEl);
            }
            buffEl.style.color = "#cc44ff";
            buffEl.textContent = "⚠ " + data.realmBuff.label + ": " + data.realmBuff.desc;
        } else {
            const buffEl = document.getElementById("v32BuffLabel");
            if (buffEl) buffEl.textContent = "";
        }
    };

    // ── REALM BUFF UPDATE HOOK ──────────────────────────────────────────
    const updatePreV32 = update;
    update = function updateV32() {
        updatePreV32();
        if (equipmentMenuOpen || endingScreenOpen || gameOver) return;
        applyV32RealmBuffs(V32_REALM_BY_ID);
    };

    function applyV32RealmBuffs(realmById) {
        if (boss.active || gameOver) return;
        const data = realmById[currentRealm];
        if (!data || !data.realmBuff) {
            v32RealmBuffState.drainTimer = 0;
            v32RealmBuffState.fadingPlatforms.clear();
            return;
        }
        const buff = data.realmBuff;
        const hasCrown = player.v32_eclipseCrown;

        // Debuff 1: Dim Gravity — gravity1.4x stronger
        if (buff.dimGravity && !hasCrown) {
            player.gravity = BASE_GRAVITY * buff.gravityMultiplier;
        }

        // Debuff 2: Shadow Drain — lose 1 HP every 5 seconds
        if (buff.shadowDrain && !hasCrown) {
            v32RealmBuffState.drainTimer++;
            if (v32RealmBuffState.drainTimer >= buff.drainInterval) {
                v32RealmBuffState.drainTimer = 0;
                if (player.invulnTimer === 0) takePlayerDamage(buff.drainColor, {deathCause:"Shadow Drain"});
            }
        }

        // Debuff 3: Platform Fading — platforms shrink while stood on
        if (buff.platformFades && !hasCrown) {
            const localPlatforms = ftPlatformRange(player.worldX - player.width - 40, player.worldX + player.width + 40);
            for (const p of localPlatforms) {
                const onTop = player.worldX >= p.x && player.worldX <= p.x + p.width &&
                              Math.abs((player.worldY + player.height/2) - p.y) < 6 && player.vy >= 0;
                if (onTop) {
                    const platformKey = Number.isFinite(p.index) ? p.index : p;
                    if (!v32RealmBuffState.fadingPlatforms.has(platformKey)) {
                        v32RealmBuffState.fadingPlatforms.set(platformKey, p.width);
                    }
                    const curW = v32RealmBuffState.fadingPlatforms.get(platformKey);
                    const newW = Math.max(buff.minFadeWidth, curW - buff.fadeRate);
                    v32RealmBuffState.fadingPlatforms.set(platformKey, newW);
                    p.width = newW;
                    break;
                }
            }
        }

        // Debuff 4: Eclipse Pull — constant downward drag
        if (buff.eclipsePull && !hasCrown) {
            player.vy += buff.pullStrength;
        }

        // Debuff 5: Curse of Fragility — invuln window halved
        // Applied in the takePlayerDamage hook below
        v32RealmBuffState.fragilityActive = buff.fragilityCurse && !hasCrown;
    }

    // Patch takePlayerDamage for fragility curse and Eclipse Crown boss damage reduction
    const takePlayerDamagePreV32 = takePlayerDamage;
    takePlayerDamage = function takePlayerDamageV32(color, sourceAttack) {
        // Eclipse Crown: reduce boss contact damage by 50%
        if (player.v32_bossDamageReduction && boss.active && player.invulnTimer === 0) {
            // 50% chance to negate boss contact damage entirely
            if (Math.random() < 0.5) {
                player.invulnTimer = 60;
                addParticles(player.worldX - worldX, player.worldY, '#cc44ff');
                return;
            }
        }
        takePlayerDamagePreV32(color, sourceAttack);
        // Fragility curse: halve the invuln window that was just set
        if (v32RealmBuffState.fragilityActive && player.invulnTimer > 20) {
            player.invulnTimer = Math.floor(player.invulnTimer * 0.5);
        }
        // Eclipse Crown: double invuln after hit
        if (player.v32_eclipseCrown && player.invulnTimer > 0) {
            player.invulnTimer = Math.floor(player.invulnTimer * 2);
        }
    };

    // ── ECLIPSE CROWN: double score hook ────────────────────────────────
    const addScoreOrig = null; // score is a global; we patch at kill/progress sites
    // We hook into updateUI to apply a score multiplier display, and patch
    // the score increment by wrapping update to detect score gains.
    // Simpler: patch onEnemyKilled and the platform progress score.
    const onEnemyKilledPreV32 = onEnemyKilled;
    onEnemyKilled = function onEnemyKilledV32(ei) {
        onEnemyKilledPreV32(ei);
        if (player.v32_doubleScore) {
            score += 100; // bonus score matching the base kill score
            updateUI();
        }
    };

    // ── BOSS VISUALS — Eclipse Sovereign ─────────────────────────────────
    const drawBossPreV32 = drawBoss;
    drawBoss = function drawBossV32(screenX) {
        if (!V32_BOSSES[boss.kind]) return drawBossPreV32(screenX);
        ctx.save();
        const t = Date.now(), cx = screenX, cy = boss.y + boss.height / 2;
        const def = V32_BOSSES[boss.kind];
        const c = hexToRgb(def.color);

        // Massive pulsing aura
        const aura = ctx.createRadialGradient(cx, cy, 20, cx, cy, 350);
        aura.addColorStop(0, `rgba(${c.r},${c.g},${c.b},0.55)`);
        aura.addColorStop(0.5, `rgba(107,44,255,0.25)`);
        aura.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = aura;
        ctx.beginPath(); ctx.arc(cx, cy, 350, 0, Math.PI * 2); ctx.fill();

        ctx.shadowColor = "#6b2cff"; ctx.shadowBlur = 50;
        ctx.strokeStyle = "#6b2cff";
        ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.85)`;
        ctx.lineWidth = 4;

        // Eclipse corona — the boss is a massive dark circle with a glowing ring
        const coronaR = 160 + Math.sin(t * 0.002) * 15;
        // Outer glow ring
        ctx.strokeStyle = "#cc44ff"; ctx.lineWidth = 8;
        ctx.beginPath(); ctx.arc(cx, cy, coronaR + 20, 0, Math.PI * 2); ctx.stroke();
        ctx.lineWidth = 4;

        // Dark eclipse body
        const bodyGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, coronaR);
        bodyGrad.addColorStop(0, "#0a0210");
        bodyGrad.addColorStop(0.6, "#1a0a2e");
        bodyGrad.addColorStop(1, "#2a1040");
        ctx.fillStyle = bodyGrad;
        ctx.beginPath(); ctx.arc(cx, cy, coronaR, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#6b2cff"; ctx.stroke();

        // Radiating shadow threads
        ctx.lineWidth = 5; ctx.globalAlpha = 0.5;
        for (let i = 0; i < 20; i++) {
            const a = t * 0.0008 + i * Math.PI / 10;
            const len = 200 + Math.sin(t * 0.004 + i) * 60;
            ctx.beginPath(); ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(a) * len, cy + Math.sin(a) * len); ctx.stroke();
        }
        ctx.globalAlpha = 1; ctx.lineWidth = 4;

        // Inner eclipse ring — the "crown"
        ctx.strokeStyle = "#cc44ff"; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.arc(cx, cy, coronaR * 0.65, t * 0.001, t * 0.001 + Math.PI * 1.5); ctx.stroke();

        // Seven glowing eyes arranged in an arc
        ctx.fillStyle = "#cc44ff"; ctx.shadowColor = "#cc44ff"; ctx.shadowBlur = 25;
        for (let i = 0; i < 7; i++) {
            const a = (i / 6) * Math.PI - Math.PI/2 + Math.sin(t * 0.002 + i) * 0.1;
            const er = coronaR * 0.45;
            const ex = cx + Math.cos(a) * er;
            const ey = cy + Math.sin(a) * er;
            ctx.beginPath(); ctx.ellipse(ex, ey, 10, 6, a, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = "#ffffff";
            ctx.beginPath(); ctx.arc(ex, ey, 3, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = "#cc44ff";
        }

        // Orbiting shadow shards
        for (let i = 0; i < 8; i++) {
            const a = t * 0.0015 + i * Math.PI / 4;
            const rx = cx + Math.cos(a) * (coronaR + 50);
            const ry = cy + Math.sin(a) * (coronaR + 50);
            ctx.save(); ctx.translate(rx, ry); ctx.rotate(a + t * 0.003);
            ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(10, 0); ctx.lineTo(0, 18); ctx.lineTo(-10, 0); ctx.closePath();
            ctx.fillStyle = `rgba(107,44,255,0.7)`; ctx.fill();
            ctx.strokeStyle = "#cc44ff"; ctx.stroke();
            ctx.restore();
        }

        // HP bar
        const barW = 400, barX = canvas.width/2 - barW/2, barY = 36;
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(0,0,0,0.82)"; ctx.fillRect(barX-2, barY-2, barW+4, 22);
        const hp = Math.max(0, boss.hp / boss.maxHp);
        const barGrad = ctx.createLinearGradient(barX, barY, barX+barW, barY);
        barGrad.addColorStop(0, "#6b2cff"); barGrad.addColorStop(0.5, "#cc44ff"); barGrad.addColorStop(1, "#ffffff");
        ctx.fillStyle = barGrad; ctx.fillRect(barX, barY, barW*hp, 18);
        ctx.strokeStyle = "#cc44ff"; ctx.lineWidth = 2; ctx.strokeRect(barX, barY, barW, 18);
        ctx.fillStyle = "rgba(255,245,235,0.95)";
        ctx.font = "bold 13px Courier New"; ctx.textAlign = "left";
        ctx.fillText(def.name, barX, barY - 7);
        ctx.restore();
    };

    // ── UNIQUE ANIMATED BACKGROUND for Eclipse Throne ───────────────────
    const drawBgPreV32 = drawRealmBackground;
    drawRealmBackground = function drawRealmBackgroundV32(W, H, t) {
        const data = V32_REALM_BY_ID[currentRealm];
        if (!data || data.boss) return drawBgPreV32(W, H, t);
        const id = currentRealm;
        ctx.save();

        if (id === "eclipseThrone") {
            // Deep void with a massive animated eclipse in the sky
            const bg = ctx.createLinearGradient(0, 0, 0, H);
            bg.addColorStop(0, "#0a0014");
            bg.addColorStop(0.4, "#150528");
            bg.addColorStop(1, "#020008");
            ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

            // Giant eclipse corona in the sky (animated)
            const eclipseX = W * 0.5 - worldX * 0.02;
            const eclipseY = H * 0.28;
            const eclipseR = 180 + Math.sin(t * 0.001) * 10;

            // Outer corona glow
            const coronaGrad = ctx.createRadialGradient(eclipseX, eclipseY, eclipseR * 0.8, eclipseX, eclipseY, eclipseR * 2);
            coronaGrad.addColorStop(0, "rgba(107,44,255,0.18)");
            coronaGrad.addColorStop(0.5, "rgba(204,68,255,0.08)");
            coronaGrad.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = coronaGrad;
            ctx.beginPath(); ctx.arc(eclipseX, eclipseY, eclipseR * 2, 0, Math.PI * 2); ctx.fill();

            // Eclipse ring (glowing)
            ctx.strokeStyle = `rgba(204,68,255,${0.4 + Math.sin(t * 0.003) * 0.2})`;
            ctx.lineWidth = 4;
            ctx.shadowColor = "#cc44ff"; ctx.shadowBlur = 30;
            ctx.beginPath(); ctx.arc(eclipseX, eclipseY, eclipseR, 0, Math.PI * 2); ctx.stroke();

            // Dark moon disc
            ctx.shadowBlur = 0;
            const moonGrad = ctx.createRadialGradient(eclipseX, eclipseY, 5, eclipseX, eclipseY, eclipseR * 0.85);
            moonGrad.addColorStop(0, "#1a0a2e");
            moonGrad.addColorStop(1, "#0a0014");
            ctx.fillStyle = moonGrad;
            ctx.beginPath(); ctx.arc(eclipseX, eclipseY, eclipseR * 0.85, 0, Math.PI * 2); ctx.fill();

            // Radiating shadow threads from the eclipse
            ctx.strokeStyle = "rgba(107,44,255,0.15)"; ctx.lineWidth = 2;
            for (let i = 0; i < 24; i++) {
                const a = t * 0.0005 + i * Math.PI / 12;
                const len = eclipseR + 40 + Math.sin(t * 0.003 + i) * 30;
                ctx.beginPath();
                ctx.moveTo(eclipseX + Math.cos(a) * eclipseR, eclipseY + Math.sin(a) * eclipseR);
                ctx.lineTo(eclipseX + Math.cos(a) * (eclipseR + len), eclipseY + Math.sin(a) * (eclipseR + len));
                ctx.stroke();
            }

            // Drifting shadow particles
            const eclipseParticleSeed = ftScatterSeed('eclipse-throne-shadow-particles');
            for (let i = 0; i < 30; i++) {
                const sx = ((ftScatter01(eclipseParticleSeed,i,0)*(W+100) + t * (0.12+ftScatter01(eclipseParticleSeed,i,2)*0.26)) % (W + 100)) - 50;
                const sy = ((ftScatter01(eclipseParticleSeed,i,1)*(H+100) + t * (0.08+ftScatter01(eclipseParticleSeed,i,3)*0.22)) % (H + 100)) - 50;
                const sz = 1.5 + Math.sin(t * 0.005 + ftScatter01(eclipseParticleSeed,i,4)*Math.PI*2) * 1;
                ctx.fillStyle = `rgba(107,44,255,${0.2 + Math.sin(t * 0.004 + i) * 0.15})`;
                ctx.beginPath(); ctx.arc(sx, sy, sz, 0, Math.PI * 2); ctx.fill();
            }

            // Throne silhouette at the bottom — towering spires
            ctx.fillStyle = "rgba(10,0,20,0.7)";
            for (let si = 0; si < W + 100; si += 120) {
                const sx = ((si - worldX * 0.15) % (W + 200) + W + 200) % (W + 200) - 80;
                const spireH = 120 + (si % 3) * 60;
                ctx.beginPath();
                ctx.moveTo(sx, H);
                ctx.lineTo(sx + 30, H - spireH);
                ctx.lineTo(sx + 50, H - spireH - 20);
                ctx.lineTo(sx + 70, H - spireH);
                ctx.lineTo(sx + 100, H);
                ctx.closePath(); ctx.fill();
                // Glowing windows
                ctx.fillStyle = `rgba(204,68,255,${0.3 + Math.sin(t * 0.006 + si) * 0.2})`;
                for (let wi = 0; wi < 3; wi++) {
                    ctx.beginPath(); ctx.arc(sx + 50, H - spireH * 0.3 - wi * 25, 3, 0, Math.PI * 2); ctx.fill();
                }
                ctx.fillStyle = "rgba(10,0,20,0.7)";
            }

            // Curfew: fading light bars from the eclipse
            for (let i = 0; i < 5; i++) {
                const ly = eclipseY + eclipseR + i * 30 + Math.sin(t * 0.002 + i) * 10;
                ctx.strokeStyle = `rgba(107,44,255,${0.06 - i * 0.01})`;
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(0, ly); ctx.lineTo(W, ly); ctx.stroke();
            }
        }
        ctx.restore();
    };

    // Enemy visuals for V32
    const drawEnemyPreV32 = drawEnemy;
    drawEnemy = function drawEnemyV32(e, screenX) {
        const def = V32_ENEMIES[e.type];
        if (!def) return drawEnemyPreV32(e, screenX);
        ctx.save();
        const t = Date.now();
        const cx = screenX + e.width/2, cy = e.y + e.height/2;
        const col2 = "#6b2cff";
        ctx.shadowColor = col2; ctx.shadowBlur = 28;
        ctx.strokeStyle = col2;
        ctx.fillStyle = "rgba(20,5,40,0.6)";
        ctx.lineWidth = 2.5;
        const pulse = 1 + Math.sin(t*0.007 + e.floatOffset) * 0.14;
        const flags = def.behaviorFlags || [];
        const flying = flags.some(f => ["floating","flying","homing","projector","sine_wave","phase_drift"].includes(f));
        const heavy = flags.includes("heavy");
        if (flying) {
            ctx.beginPath();
            ctx.moveTo(cx, cy - e.height*0.5*pulse);
            ctx.lineTo(cx + e.width*0.48, cy);
            ctx.lineTo(cx, cy + e.height*0.5*pulse);
            ctx.lineTo(cx - e.width*0.48, cy);
            ctx.closePath(); ctx.fill(); ctx.stroke();
            ctx.fillStyle = `rgba(204,68,255,0.4)`;
            ctx.beginPath(); ctx.arc(cx, cy, e.width*0.2, 0, Math.PI*2); ctx.fill();
        } else if (heavy) {
            ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(cx - e.width*0.45, cy - e.height*0.45, e.width*0.9, e.height*0.9, 12); else ctx.rect(cx - e.width*0.45, cy - e.height*0.45, e.width*0.9, e.height*0.9); ctx.fill(); ctx.stroke();
            ctx.strokeStyle = "#cc44ff"; ctx.lineWidth = 2;
            for (let i = -1; i <= 1; i++) {
                ctx.beginPath(); ctx.arc(cx, cy + i*20, 8, 0, Math.PI*2); ctx.stroke();
            }
        } else {
            ctx.beginPath();
            ctx.moveTo(cx, cy - e.height*0.5);
            ctx.lineTo(cx + e.width*0.45, cy + e.height*0.3);
            ctx.lineTo(cx, cy + e.height*0.5);
            ctx.lineTo(cx - e.width*0.45, cy + e.height*0.3);
            ctx.closePath(); ctx.fill(); ctx.stroke();
        }
        ctx.fillStyle = "rgba(255,255,255,0.95)"; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.arc(cx-6, cy-e.height*0.12, 4, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx+6, cy-e.height*0.12, 4, 0, Math.PI*2); ctx.fill();
        ctx.restore();
    };
})();
