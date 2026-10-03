/* Faded Thread module: 09-expansion-v27.js | build 03 Oct 2026 */
// ─────────────────────────────────────────────────────────────────
        // ─────────────────────────────────────────────────────────────────
        const POST_FIRST_STITCH_REALMS_V27 = [{"id": "silverThreadFields", "name": "Silver Thread Fields", "unlockAfterBoss": "firstStitch", "order": 1, "target": 142, "enemies": [39, 40], "color": "#d8f2ff", "palette": {"background": "Moonlit silver grass, pale mist, long horizontal thread-lines.", "platforms": "White-silver cloth with glowing stitched rims.", "accent": "#d8f2ff"}, "endgame": true}, {"id": "loomCitadel", "name": "Loom Citadel", "unlockAfterRealm": "silverThreadFields", "order": 2, "target": 148, "enemies": [41, 42], "color": "#e6b86a", "palette": {"background": "Towering brass looms, vertical machinery shadows, gold dust.", "platforms": "Bronze woven plates wrapped in dark thread.", "accent": "#e6b86a"}, "endgame": true}, {"id": "bossSilverShears", "name": "The Silver Shears", "boss": "silverShears", "endgame": true}, {"id": "overseerArchive", "name": "Overseer Archive", "unlockAfterBoss": "silverShears", "order": 3, "target": 154, "enemies": [43, 44], "color": "#ffcf8a", "palette": {"background": "Endless filing towers, glowing inspection eyes, floating paper sigils.", "platforms": "Dark archive cloth edged with amber stamp seals.", "accent": "#ffcf8a"}, "endgame": true}, {"id": "threadFactory", "name": "Thread Factory", "unlockAfterRealm": "overseerArchive", "order": 4, "target": 160, "enemies": [45, 46], "color": "#ff8844", "palette": {"background": "Industrial thread engines, smoke vents, rotating spool silhouettes.", "platforms": "Oil-black conveyor cloth with orange-hot seams.", "accent": "#ff8844"}, "endgame": true}, {"id": "bossLoomOverseer", "name": "The Loom Overseer", "boss": "loomOverseer", "endgame": true}, {"id": "frayedDepths", "name": "Frayed Depths", "unlockAfterBoss": "loomOverseer", "order": 5, "target": 166, "enemies": [47, 48], "color": "#5edcff", "palette": {"background": "Deep ocean void, drifting torn ribbons, blue-black pressure haze.", "platforms": "Waterlogged cloth slabs with glowing barnacle stitches.", "accent": "#5edcff"}, "endgame": true}, {"id": "leviathanTrench", "name": "Leviathan Trench", "unlockAfterRealm": "frayedDepths", "order": 6, "target": 174, "enemies": [49, 50], "color": "#3fb8ff", "palette": {"background": "Massive serpent bones, abyssal bubbles, slow pulsing biolight.", "platforms": "Ribbed shell platforms wrapped in sea-thread.", "accent": "#3fb8ff"}, "endgame": true}, {"id": "bossFrayedLeviathan", "name": "The Frayed Leviathan", "boss": "frayedLeviathan", "endgame": true}, {"id": "velvetCourt", "name": "Velvet Court", "unlockAfterBoss": "frayedLeviathan", "order": 7, "target": 182, "enemies": [51, 52], "color": "#d74488", "palette": {"background": "Royal velvet halls, curtain shadows, red-gold chandeliers.", "platforms": "Plush burgundy cloth with gold trim.", "accent": "#d74488"}, "endgame": true}, {"id": "monarchSpire", "name": "Monarch Spire", "unlockAfterRealm": "velvetCourt", "order": 8, "target": 190, "enemies": [53, 54], "color": "#b46bff", "palette": {"background": "High palace spires, floating crowns, storm-lit purple sky.", "platforms": "Regal violet platforms stitched with crown symbols.", "accent": "#b46bff"}, "endgame": true}, {"id": "bossVelvetSovereign", "name": "The Velvet Sovereign", "boss": "velvetSovereign", "endgame": true}, {"id": "infinityLoom", "name": "Infinity Loom", "unlockAfterBoss": "velvetSovereign", "order": 9, "target": 200, "enemies": [55, 56], "color": "#ffffff", "palette": {"background": "Recursive loom tunnels, infinite thread spirals, collapsing stars.", "platforms": "White void-cloth with shifting rainbow thread edges.", "accent": "#ffffff"}, "endgame": true}, {"id": "finalThread", "name": "The Final Thread", "unlockAfterRealm": "infinityLoom", "order": 10, "target": 215, "enemies": [57, 58], "color": "#fff1aa", "palette": {"background": "All realms bleeding together, broken skies, final woven horizon.", "platforms": "Living thread platforms glowing with every prior realm color.", "accent": "#fff1aa"}, "endgame": true}, {"id": "bossFinalWeaver", "name": "The Final Weaver", "boss": "finalWeaver", "endgame": true}];
        const SYSTEM_ENEMY_DATABASE_V27 = {"39": {"id": 39, "name": "Silver Skitter", "realm": "silverThreadFields", "hp": 7, "speed": 2.6, "width": 62, "height": 42, "behaviorFlags": ["charger", "ground_skimmer", "quick_turn"]}, "40": {"id": 40, "name": "Moonspool Wisp", "realm": "silverThreadFields", "hp": 6, "speed": 2.2, "width": 54, "height": 54, "behaviorFlags": ["homing", "floating", "phase_drift"]}, "41": {"id": 41, "name": "Loom Guard", "realm": "loomCitadel", "hp": 10, "speed": 1.15, "width": 86, "height": 104, "behaviorFlags": ["shielded_front", "slow_patrol", "counter_stance"]}, "42": {"id": 42, "name": "Brass Shuttle", "realm": "loomCitadel", "hp": 7, "speed": 3.1, "width": 88, "height": 34, "behaviorFlags": ["dash_lane", "projector", "horizontal_burst"]}, "43": {"id": 43, "name": "Archivist Eye", "realm": "overseerArchive", "hp": 8, "speed": 1.8, "width": 64, "height": 64, "behaviorFlags": ["projector", "tracking_beam", "floating"]}, "44": {"id": 44, "name": "Stamped Husk", "realm": "overseerArchive", "hp": 11, "speed": 1.05, "width": 78, "height": 98, "behaviorFlags": ["shielded_front", "summoner", "slow_patrol"]}, "45": {"id": 45, "name": "Spool Saw", "realm": "threadFactory", "hp": 9, "speed": 2.7, "width": 70, "height": 70, "behaviorFlags": ["charger", "spinning_hazard", "wall_rebound"]}, "46": {"id": 46, "name": "Oil Threader", "realm": "threadFactory", "hp": 8, "speed": 2.0, "width": 76, "height": 52, "behaviorFlags": ["leaves_trail", "slippery_zone", "patrol"]}, "47": {"id": 47, "name": "Drowned Needlefish", "realm": "frayedDepths", "hp": 7, "speed": 3.4, "width": 94, "height": 32, "behaviorFlags": ["fast_swimmer", "dash_lane", "sine_wave"]}, "48": {"id": 48, "name": "Pressure Bloom", "realm": "frayedDepths", "hp": 12, "speed": 0.7, "width": 92, "height": 92, "behaviorFlags": ["area_denial", "pulse_explosion", "stationary"]}, "49": {"id": 49, "name": "Bone Eel", "realm": "leviathanTrench", "hp": 10, "speed": 2.9, "width": 110, "height": 38, "behaviorFlags": ["segmented", "homing", "sine_wave"]}, "50": {"id": 50, "name": "Trench Puller", "realm": "leviathanTrench", "hp": 13, "speed": 1.2, "width": 96, "height": 88, "behaviorFlags": ["gravitational_pull", "heavy", "slow_patrol"]}, "51": {"id": 51, "name": "Velvet Duelist", "realm": "velvetCourt", "hp": 9, "speed": 2.8, "width": 60, "height": 82, "behaviorFlags": ["parry", "dash_counter", "elite_ground"]}, "52": {"id": 52, "name": "Curtain Phantom", "realm": "velvetCourt", "hp": 8, "speed": 2.1, "width": 66, "height": 78, "behaviorFlags": ["teleport", "ambush", "floating"]}, "53": {"id": 53, "name": "Crown Moth", "realm": "monarchSpire", "hp": 8, "speed": 2.6, "width": 72, "height": 58, "behaviorFlags": ["flying", "projector", "spiral_shot"]}, "54": {"id": 54, "name": "Royal Sentinel", "realm": "monarchSpire", "hp": 14, "speed": 1.0, "width": 92, "height": 116, "behaviorFlags": ["shielded_front", "guard_zone", "heavy"]}, "55": {"id": 55, "name": "Infinity Knot", "realm": "infinityLoom", "hp": 11, "speed": 1.9, "width": 78, "height": 78, "behaviorFlags": ["recursive_clone", "phase_drift", "homing"]}, "56": {"id": 56, "name": "Looped Cutter", "realm": "infinityLoom", "hp": 10, "speed": 3.0, "width": 88, "height": 44, "behaviorFlags": ["boomerang_path", "charger", "return_dash"]}, "57": {"id": 57, "name": "Final Stitchling", "realm": "finalThread", "hp": 12, "speed": 2.4, "width": 68, "height": 86, "behaviorFlags": ["adaptive_ai", "copies_player_y", "elite"]}, "58": {"id": 58, "name": "Unmade Angel", "realm": "finalThread", "hp": 16, "speed": 1.7, "width": 104, "height": 128, "behaviorFlags": ["gravitational_pull", "projector", "shielded_front", "boss_minion"]}};
        const ADVANCED_ENDGAME_BOSSES_V27 = {"silverShears": {"name": "THE SILVER SHEARS", "hp": 48, "width": 190, "height": 245, "color": "#d8f2ff", "stateTimer": 0, "attackHitbox": {"width": 170, "height": 70}, "attackDimensions": {"slashWidth": 240, "slashHeight": 26, "chargeWidth": 190, "chargeHeight": 90, "denialRadius": 220}, "phases": [{"state": "telegraph_cross_cut", "duration": 70, "attackType": "telegraph", "dimensions": {"width": 240, "height": 26}, "warningColor": "#ffffff"}, {"state": "silver_shear_charge", "duration": 42, "attackType": "charge", "dimensions": {"width": 190, "height": 90}, "speed": 12}, {"state": "thread_snip_field", "duration": 150, "attackType": "area_denial", "dimensions": {"radius": 220, "strandCount": 8}}]}, "loomOverseer": {"name": "THE LOOM OVERSEER", "hp": 56, "width": 230, "height": 270, "color": "#e6b86a", "stateTimer": 0, "attackHitbox": {"width": 210, "height": 120}, "attackDimensions": {"beamWidth": 40, "beamHeight": 620, "teleportRadius": 360, "summonCount": 3}, "phases": [{"state": "inspection_beam_telegraph", "duration": 80, "attackType": "tracking_telegraph", "dimensions": {"width": 34, "height": 520}, "lockTime": 55}, {"state": "loom_laser_sweep", "duration": 115, "attackType": "sweeping_beam", "dimensions": {"width": 40, "height": 620}, "sweepSpeed": 5.5}, {"state": "spool_gate_reposition", "duration": 95, "attackType": "mobility", "dimensions": {"teleportRadius": 360, "summonCount": 3}}]}, "frayedLeviathan": {"name": "THE FRAYED LEVIATHAN", "hp": 64, "width": 280, "height": 150, "color": "#5edcff", "stateTimer": 0, "attackHitbox": {"width": 260, "height": 96}, "attackDimensions": {"lungeWidth": 320, "lungeHeight": 110, "currentBands": 5, "bandHeight": 44}, "phases": [{"state": "depth_roar_telegraph", "duration": 75, "attackType": "telegraph", "dimensions": {"radius": 260}, "warningColor": "#a8f6ff"}, {"state": "leviathan_lunge", "duration": 48, "attackType": "charge", "dimensions": {"width": 320, "height": 110}, "speed": 14}, {"state": "abyss_current", "duration": 160, "attackType": "area_denial", "dimensions": {"currentBands": 5, "bandHeight": 44, "pullStrength": 0.22}}]}, "velvetSovereign": {"name": "THE VELVET SOVEREIGN", "hp": 72, "width": 210, "height": 280, "color": "#d74488", "stateTimer": 0, "attackHitbox": {"width": 190, "height": 140}, "attackDimensions": {"coneWidth": 260, "coneHeight": 160, "dashWidth": 220, "dashHeight": 85, "cloneCount": 4}, "phases": [{"state": "royal_bow_telegraph", "duration": 65, "attackType": "telegraph", "dimensions": {"coneWidth": 260, "coneHeight": 160}, "warningColor": "#ff9ac8"}, {"state": "velvet_execution", "duration": 55, "attackType": "dash_combo", "dimensions": {"width": 220, "height": 85}, "slashCount": 3}, {"state": "curtain_vanish", "duration": 130, "attackType": "mobility", "dimensions": {"cloneCount": 4, "teleportRadius": 420}}]}, "finalWeaver": {"name": "THE FINAL WEAVER", "hp": 100, "width": 260, "height": 320, "color": "#ffffff", "stateTimer": 0, "attackHitbox": {"width": 240, "height": 180}, "attackDimensions": {"lineCount": 12, "lineWidth": 22, "zoneRadius": 90, "teleportCount": 5}, "phases": [{"state": "all_threads_telegraph", "duration": 90, "attackType": "multi_telegraph", "dimensions": {"lineCount": 12, "lineWidth": 22}, "warningColor": "#fff1aa"}, {"state": "realm_stitch_collapse", "duration": 145, "attackType": "area_denial", "dimensions": {"zones": 6, "zoneRadius": 90, "pulseInterval": 28}}, {"state": "weaver_warp_dance", "duration": 120, "attackType": "mobility", "dimensions": {"teleportCount": 5, "afterimageDamageRadius": 70}}]}};
        const ENDGAME_EQUIPMENT_ADDITIONS_V27 = [{"id": "shearGauntlets", "name": "Shear Gauntlets", "color": "#d8f2ff", "short": "SHEAR", "slot": "hand", "bossOnly": true, "bossSource": "silverShears", "effect": "Boss Reward. Downward pogo slashes deal bonus puncture damage and horizontal slashes cut through shielded_front enemies."}, {"id": "warpSpool", "name": "Warp Spool", "color": "#e6b86a", "short": "WARP", "slot": "orbit", "bossOnly": true, "bossSource": "loomOverseer", "effect": "Boss Reward. After using Sky Dash, briefly phase through projectiles and reappear with a small shockwave."}, {"id": "leviathanCarapace", "name": "Leviathan Carapace", "color": "#5edcff", "short": "SHELL", "slot": "chest", "bossOnly": true, "bossSource": "frayedLeviathan", "effect": "Boss Reward. Reduces knockback, weakens gravitational_pull effects and gives a chance to ignore heavy collision damage."}, {"id": "monarchCloak", "name": "Monarch Cloak", "color": "#d74488", "short": "ROYAL", "slot": "back", "bossOnly": true, "bossSource": "velvetSovereign", "effect": "Boss Reward. Dash leaves a damaging afterimage and enemy projectors briefly slow after you pass through them."}, {"id": "infinityThread", "name": "The Infinity Thread", "color": "#ffffff", "short": "INF", "slot": "aura", "bossOnly": true, "bossSource": "finalWeaver", "effect": "Final Boss Reward. Every 10 enemy kills permanently adds 1 uncapped life for the current run and increases slash range slightly."}, {"id": "spoolShield", "name": "Spool Shield", "color": "#9fe8ff", "short": "SHLD", "slot": "chest", "dropType": "anywhere", "effect": "Anywhere Drop. Grants a rotating shield that blocks one projectile or contact hit, then recharges after landing on a platform."}, {"id": "thimbleCap", "name": "Thimble Cap", "color": "#ccd6ff", "short": "CAP", "slot": "hat", "dropType": "anywhere", "effect": "Anywhere Drop. Reduces damage cooldown after taking a hit and slightly increases invulnerability time after respawn."}, {"id": "gildedNeedle", "name": "Gilded Needle", "color": "#ffd66e", "short": "GOLD", "slot": "hand", "dropType": "anywhere", "effect": "Anywhere Drop. Increases slash damage against bosses by 1 every third successful hit."}, {"id": "mercuryThread", "name": "Mercury Thread", "color": "#bffcff", "short": "MERC", "slot": "trail", "dropType": "anywhere", "effect": "Anywhere Drop. Increases acceleration, improves air control and makes direction changes feel sharper."}, {"id": "serratedBlade", "name": "Serrated Blade", "color": "#ff7777", "short": "SAW", "slot": "hand", "dropType": "anywhere", "effect": "Anywhere Drop. Slashes apply bleed. Bleeding enemies take delayed bonus damage after being hit."}, {"id": "glassPendant", "name": "Glass Pendant", "color": "#d7fbff", "short": "GLASS", "slot": "face", "dropType": "anywhere", "effect": "Anywhere Drop. Reflects the first projectile that hits you after landing. Reflected projectiles damage enemies."}, {"id": "echoCrest", "name": "Echo Crest", "color": "#a7f0ff", "short": "ECHO", "slot": "hat", "dropType": "anywhere", "effect": "Anywhere Drop. Creates a second smaller echo slash shortly after your main attack."}, {"id": "vampiricEye", "name": "Vampiric Eye", "color": "#ff4f88", "short": "VAMP", "slot": "face", "dropType": "anywhere", "effect": "Anywhere Drop. Every 8 enemy kills heals 1 uncapped life. Boss hits count as 2 kill charges."}, {"id": "heavyWeightAnchor", "name": "Heavy Weight Anchor", "color": "#7da8ff", "short": "ANCH", "slot": "chest", "dropType": "anywhere", "effect": "Anywhere Drop. Slows falling during downward attacks, strengthens pogo control and reduces enemy knockback effects."}, {"id": "prismaticWeaver", "name": "Prismatic Weaver", "color": "#ffb8ff", "short": "PRISM", "slot": "orbit", "dropType": "anywhere", "effect": "Anywhere Drop. Cycles through small elemental bonuses: speed, slash size, score boost and guard recharge."}];
        const ENDGAME_BOSS_REWARD_MAP_V27 = {"silverShears": {"name": "Shear Gauntlets", "equipment": "shearGauntlets"}, "loomOverseer": {"name": "Warp Spool", "equipment": "warpSpool"}, "frayedLeviathan": {"name": "Leviathan Carapace", "equipment": "leviathanCarapace"}, "velvetSovereign": {"name": "Monarch Cloak", "equipment": "monarchCloak"}, "finalWeaver": {"name": "The Infinity Thread", "equipment": "infinityThread"}};

        (function installV27Expansion() {
            const firstStitchIndex = REALM_FLOW.findIndex(r => r.id === "boss3" || r.boss === "firstStitch");
            if (!REALM_FLOW.some(r => r.id === "silverThreadFields")) {
                if (firstStitchIndex >= 0) REALM_FLOW.splice(firstStitchIndex + 1, 0, ...POST_FIRST_STITCH_REALMS_V27);
                else REALM_FLOW.push(...POST_FIRST_STITCH_REALMS_V27);
            }
            Object.assign(BOSS_DEFS, ADVANCED_ENDGAME_BOSSES_V27);
            for (const item of ENDGAME_EQUIPMENT_ADDITIONS_V27) {
                if (!EQUIPMENT_TYPES.some(existing => existing.id === item.id)) EQUIPMENT_TYPES.push(item);
                if (item.bossOnly) { BOSS_REWARD_EQUIPMENT_IDS.add(item.id); WORLD_BOSS_REWARD_EQUIPMENT_IDS.add(item.id); }
            }
        })();

        const V27_REALM_BY_ID = Object.fromEntries(POST_FIRST_STITCH_REALMS_V27.filter(r => r.id).map(r => [r.id, r]));
        const V27_ENEMY_TYPES = new Set(Object.keys(SYSTEM_ENEMY_DATABASE_V27).map(Number));

        const createEnemyPreV27 = createEnemy;
        createEnemy = function createEnemyV27(x, y, type) {
            const def = SYSTEM_ENEMY_DATABASE_V27[type];
            if (!def) return createEnemyPreV27(x, y, type);
            enemies.push({ x, y, startX: x, startY: y, type, name: def.name, hp: def.hp, speed: def.speed, dir: -1, width: def.width, height: def.height, behaviorFlags: def.behaviorFlags, floatOffset: Math.random() * 100 });
        };

        const realmAccentPreV27 = realmAccent;
        realmAccent = function realmAccentV27() {
            const data = V27_REALM_BY_ID[currentRealm];
            if (data && data.color) return hexToRgb(data.color);
            if (boss.active && BOSS_DEFS[boss.kind] && BOSS_DEFS[boss.kind].color) return hexToRgb(BOSS_DEFS[boss.kind].color);
            return realmAccentPreV27();
        };

        const updateUIPreV27 = updateUI;
        updateUI = function updateUIV27() {
            updateUIPreV27();
            const data = V27_REALM_BY_ID[currentRealm];
            if (data && data.color) document.getElementById("ui").style.color = data.color;
        };

        const extendWorldPreV27 = extendWorld;
        extendWorld = function extendWorldV27(targetX) {
            if (!V27_REALM_BY_ID[currentRealm] || V27_REALM_BY_ID[currentRealm].boss) return extendWorldPreV27(targetX);
            while (maxReachedX < targetX) {
                let lastP = platforms[platforms.length - 1];
                let gap = 120 + Math.random() * 130;
                let nextX = lastP.x + lastP.width + gap;
                let heightChange = (Math.random() - 0.5) * 200;
                let nextY = Math.max(150, Math.min(canvas.height - 220, lastP.y + heightChange));
                let nextW = 200 + Math.random() * 250;
                let nextIndex = lastP.index + 1;
                createPlatform(nextX, nextY, nextW, nextIndex);
                if (Math.random() > 0.55) {
                    const enemyChoices = V27_REALM_BY_ID[currentRealm].enemies || [39, 40];
                    const randType = enemyChoices[Math.floor(Math.random() * enemyChoices.length)];
                    const enemyDef = SYSTEM_ENEMY_DATABASE_V27[randType];
                    const enemyX = nextX + 50 + Math.random() * Math.max(50, nextW - 100);
                    const flying = enemyDef.behaviorFlags.some(flag => ["floating","flying","homing","projector","sine_wave","phase_drift"].includes(flag));
                    const enemyY = flying ? nextY - 140 : nextY - Math.max(40, enemyDef.height * 0.85);
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

        const drawRealmBackgroundPreV27 = drawRealmBackground;
        drawRealmBackground = function drawRealmBackgroundV27(W, H, t) {
            const data = V27_REALM_BY_ID[currentRealm];
            if (!data || data.boss) return drawRealmBackgroundPreV27(W, H, t);
            // Each post-first-stitch non-boss realm gets a hand-crafted background
            const id = currentRealm;
            const c = hexToRgb(data.color);
            const rgb = `${c.r},${c.g},${c.b}`;
            const bg = ctx.createLinearGradient(0, 0, 0, H);

            if (id === 'silverThreadFields') {
                // Silver silk plains under a low aurora veil
                bg.addColorStop(0, '#0b1020'); bg.addColorStop(0.55, '#151c2e'); bg.addColorStop(1, '#040610');
                ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
                // Aurora ribbon
                for (let ai = 0; ai < 5; ai++) {
                    const aHue = (ai * 55 + t * 0.014) % 360;
                    const al = 0.07 + Math.sin(t * 0.003 + ai) * 0.04;
                    ctx.fillStyle = `hsla(${aHue},80%,75%,${al})`;
                    ctx.beginPath(); ctx.ellipse(W * 0.5 - worldX * 0.03, H * (0.1 + ai * 0.09), W * 0.65 + Math.sin(t * 0.002 + ai) * 80, 22 + ai * 5, 0, 0, Math.PI * 2); ctx.fill();
                }
                // Silver thread lines across ground
                for (let i = 0; i < W + 60; i += 50) {
                    const x = ((i - worldX * 0.12) % (W + 100) + W + 100) % (W + 100) - 50;
                    const al = 0.16 + Math.sin(t * 0.003 + i) * 0.08;
                    ctx.strokeStyle = `rgba(${rgb},${al})`; ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(x, H * 0.72); ctx.bezierCurveTo(x + 28, H * 0.62, x - 22, H * 0.55, x + 8, H * 0.45); ctx.stroke();
                }
                // Floating dust motes
                for (let di = 0; di < 20; di++) {
                    const dx = ((di * 127 - worldX * 0.16) % (W + 70) + W + 70) % (W + 70) - 35;
                    const dy = H * 0.1 + (di * 71) % (H * 0.75) + Math.sin(t * 0.003 + di) * 14;
                    const dal = 0.25 + Math.sin(t * 0.005 + di) * 0.2;
                    ctx.fillStyle = `rgba(${rgb},${dal})`;
                    ctx.beginPath(); ctx.arc(dx, dy, 1.5 + di % 2, 0, Math.PI * 2); ctx.fill();
                }

            } else if (id === 'loomCitadel') {
                // Mechanical loom fortress: gear-lattice walls and thread conduit pipes
                bg.addColorStop(0, '#0c0d1e'); bg.addColorStop(0.55, '#141628'); bg.addColorStop(1, '#04040a');
                ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
                // Thread conduit pipes (horizontal)
                for (let pi = 0; pi < 4; pi++) {
                    const py = H * (0.22 + pi * 0.18);
                    ctx.strokeStyle = `rgba(${rgb},0.15)`; ctx.lineWidth = 8 - pi;
                    ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(W, py); ctx.stroke();
                    // Pipe joints
                    for (let ji = 0; ji < W; ji += 80) {
                        const jx = ((ji - worldX * 0.25) % (W + 90) + W + 90) % (W + 90) - 40;
                        ctx.fillStyle = `rgba(${rgb},0.2)`;
                        ctx.beginPath(); ctx.arc(jx, py, 5, 0, Math.PI * 2); ctx.fill();
                    }
                }
                // Gear lattice (background)
                for (let gi = 0; gi < 6; gi++) {
                    const gx = ((gi * 200 - worldX * 0.1) % (W + 240) + W + 240) % (W + 240) - 100;
                    const gy = H * (0.18 + gi * 0.12);
                    ctx.save(); ctx.translate(gx, gy); ctx.rotate(t * 0.0007 * (gi % 2 ? 1 : -1));
                    ctx.strokeStyle = `rgba(${rgb},0.10)`; ctx.lineWidth = 2;
                    ctx.beginPath(); ctx.arc(0, 0, 30, 0, Math.PI * 2); ctx.stroke();
                    for (let tooth = 0; tooth < 10; tooth++) {
                        const ta = tooth * Math.PI / 5;
                        ctx.beginPath(); ctx.moveTo(Math.cos(ta) * 28, Math.sin(ta) * 28); ctx.lineTo(Math.cos(ta) * 38, Math.sin(ta) * 38); ctx.stroke();
                    }
                    ctx.restore();
                }
                // Weaving thread beams
                for (let bi = 0; bi < W + 50; bi += 70) {
                    const bx = ((bi - worldX * 0.28) % (W + 100) + W + 100) % (W + 100) - 50;
                    ctx.strokeStyle = `rgba(${rgb},0.12)`; ctx.lineWidth = 1.5;
                    ctx.beginPath(); ctx.moveTo(bx, 0); ctx.lineTo(bx + 30 + Math.sin(t * 0.002 + bi) * 18, H); ctx.stroke();
                }

            } else if (id === 'overseerArchive') {
                // Towering data archive with scrolling rune columns and scanning beams
                bg.addColorStop(0, '#0a0410'); bg.addColorStop(0.55, '#120618'); bg.addColorStop(1, '#040108');
                ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
                // Rune column streams (downward scrolling text-like marks)
                for (let ci = 0; ci < W + 60; ci += 48) {
                    const cx2 = ((ci - worldX * 0.1) % (W + 100) + W + 100) % (W + 100) - 50;
                    for (let ri = 0; ri < 9; ri++) {
                        const ry = (ri * 55 + t * 0.018) % (H + 30) - 15;
                        const ral = 0.18 + Math.sin(t * 0.005 + ri + ci) * 0.1;
                        ctx.fillStyle = `rgba(${rgb},${ral})`;
                        ctx.font = '9px Courier New'; ctx.textAlign = 'center';
                        ctx.fillText(['✦','◈','⬡','◎','⊛','✧','◇','⬢','◉'][ri % 9], cx2, ry);
                    }
                }
                ctx.textAlign = 'left';
                // Scanner beams
                const scanX = ((t * 0.045) % (W + 100));
                ctx.strokeStyle = `rgba(${rgb},0.18)`; ctx.lineWidth = 3;
                ctx.beginPath(); ctx.moveTo(scanX, 0); ctx.lineTo(scanX, H); ctx.stroke();
                const scanGrad = ctx.createLinearGradient(scanX - 40, 0, scanX, 0);
                scanGrad.addColorStop(0, 'rgba(0,0,0,0)'); scanGrad.addColorStop(1, `rgba(${rgb},0.06)`);
                ctx.fillStyle = scanGrad; ctx.fillRect(scanX - 40, 0, 40, H);

            } else if (id === 'threadFactory') {
                // Industrial thread-spinning factory with rotating spindle silhouettes
                bg.addColorStop(0, '#0f0a02'); bg.addColorStop(0.55, '#1c1403'); bg.addColorStop(1, '#060400');
                ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
                // Spinning spindles
                const threadFactorySpindleSeed = ftScatterSeed('threadFactory-spindles');
                for (let si = 0; si < 7; si++) {
                    const sx0 = ftScatter01(threadFactorySpindleSeed, si, 0) * (W + 220) - 110;
                    const sx = ((sx0 - worldX * 0.16 + 110) % (W + 220) + W + 220) % (W + 220) - 110;
                    const sy = H * (0.18 + ftScatter01(threadFactorySpindleSeed, si, 1) * 0.64);
                    ctx.save(); ctx.translate(sx, sy); ctx.rotate(t * 0.002 + ftScatter01(threadFactorySpindleSeed, si, 2) * Math.PI * 2);
                    ctx.strokeStyle = `rgba(${rgb},0.12)`; ctx.lineWidth = 1.5;
                    for (let arm = 0; arm < 6; arm++) {
                        const aa = arm * Math.PI / 3;
                        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(aa) * 28, Math.sin(aa) * 28); ctx.stroke();
                        ctx.beginPath(); ctx.ellipse(Math.cos(aa) * 28, Math.sin(aa) * 28, 5, 8, aa, 0, Math.PI * 2); ctx.stroke();
                    }
                    ctx.restore();
                }
                // Thread streams flowing rightward
                for (let ti = 0; ti < 8; ti++) {
                    const ty = H * (0.15 + ti * 0.1);
                    const al = 0.12 + Math.sin(t * 0.003 + ti) * 0.06;
                    ctx.strokeStyle = `rgba(${rgb},${al})`; ctx.lineWidth = 1;
                    ctx.beginPath();
                    for (let x = 0; x <= W; x += 30) {
                        const wy = ty + Math.sin((x + worldX * 0.2) * 0.03 + t * 0.004 + ti) * 8;
                        x === 0 ? ctx.moveTo(x, wy) : ctx.lineTo(x, wy);
                    }
                    ctx.stroke();
                }

            } else {
                // Generic V27 realm: tinted gradient + gently drifting thread wisps
                bg.addColorStop(0, `rgba(${Math.max(0, c.r - 70)},${Math.max(0, c.g - 70)},${Math.max(0, c.b - 70)},1)`);
                bg.addColorStop(0.55, `rgba(${Math.max(0, c.r - 115)},${Math.max(0, c.g - 115)},${Math.max(0, c.b - 100)},1)`);
                bg.addColorStop(1, "#03030a");
                ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
                const genericRealmWispSeed = ftScatterSeed('generic-v27-realm:' + id);
                for (let i = 0; i < 14; i++) {
                    const x0 = ftScatter01(genericRealmWispSeed, i, 0) * (W + 120) - 60;
                    const x = ((x0 - worldX * 0.13 + 60) % (W + 120) + W + 120) % (W + 120) - 60;
                    const y = ftScatter01(genericRealmWispSeed, i, 1) * H;
                    ctx.strokeStyle = `rgba(${rgb},0.18)`;
                    ctx.lineWidth = 1.5;
                    ctx.beginPath(); ctx.moveTo(x, 0); ctx.bezierCurveTo(x + 50, H * 0.25, x - 40, H * 0.7, x + 20, H); ctx.stroke();
                    ctx.fillStyle = `rgba(${rgb},0.16)`;
                    ctx.beginPath(); ctx.arc(x + Math.sin(t * 0.002 + ftScatter01(genericRealmWispSeed, i, 2) * Math.PI * 2) * 30, y, 2 + (i % 4), 0, Math.PI * 2); ctx.fill();
                }
            }
        };

        const drawEnemyPreV27 = drawEnemy;
        drawEnemy = function drawEnemyV27(e, screenX) {
            if (!V27_ENEMY_TYPES.has(e.type)) return drawEnemyPreV27(e, screenX);
            const def = SYSTEM_ENEMY_DATABASE_V27[e.type];
            const data = V27_REALM_BY_ID[def.realm] || { color: "#ffffff" };
            const c = hexToRgb(data.color || "#ffffff");
            const t = Date.now();
            const cx = screenX + e.width / 2;
            const cy = e.y + e.height / 2;
            const flags = e.behaviorFlags || [];
            const rgb = `${c.r},${c.g},${c.b}`;
            ctx.save();
            ctx.shadowColor = data.color || "#ffffff";
            ctx.shadowBlur = 20;
            ctx.strokeStyle = `rgba(${rgb},0.95)`;
            ctx.fillStyle = `rgba(${rgb},0.62)`;
            ctx.lineWidth = 2;

            // ── Per-type bespoke visuals ─────────────────────────────────────
            const type = e.type;

            if (flags.includes("gravitational_pull")) {
                // Spinning gravity vortex: concentric ring fragments + dark core
                const spin = t * 0.004 + e.floatOffset;
                for (let ri = 0; ri < 3; ri++) {
                    const r = 10 + ri * 12;
                    const segments = 6 + ri * 2;
                    for (let s = 0; s < segments; s++) {
                        const a1 = spin + (s / segments) * Math.PI * 2;
                        const a2 = spin + ((s + 0.6) / segments) * Math.PI * 2;
                        ctx.beginPath();
                        ctx.arc(cx, cy, r, a1, a2);
                        ctx.strokeStyle = `rgba(${rgb},${0.9 - ri * 0.2})`;
                        ctx.lineWidth = 3 - ri * 0.6;
                        ctx.stroke();
                    }
                }
                // Dark gravity-well core with radial gradient
                const gCore = ctx.createRadialGradient(cx, cy, 2, cx, cy, 12);
                gCore.addColorStop(0, `rgba(0,0,0,0.95)`);
                gCore.addColorStop(1, `rgba(${rgb},0.6)`);
                ctx.fillStyle = gCore;
                ctx.beginPath(); ctx.arc(cx, cy, 12, 0, Math.PI * 2); ctx.fill();
                // Eye
                ctx.fillStyle = `rgba(${rgb},0.95)`;
                ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.fill();

            } else if (flags.includes("phase_drift")) {
                // Ghostly drifting silhouette: layered translucent teardrop with trailing wisps
                const drift = Math.sin(t * 0.003 + e.floatOffset) * 10;
                const gradG = ctx.createLinearGradient(cx, cy - e.height * 0.5, cx, cy + e.height * 0.5);
                gradG.addColorStop(0, `rgba(${rgb},0.85)`);
                gradG.addColorStop(1, `rgba(${rgb},0.12)`);
                ctx.fillStyle = gradG;
                // Teardrop body
                ctx.beginPath();
                ctx.moveTo(cx, cy - e.height * 0.42);
                ctx.bezierCurveTo(cx + e.width * 0.44, cy - e.height * 0.1, cx + e.width * 0.36, cy + e.height * 0.3, cx, cy + e.height * 0.48 + drift);
                ctx.bezierCurveTo(cx - e.width * 0.36, cy + e.height * 0.3, cx - e.width * 0.44, cy - e.height * 0.1, cx, cy - e.height * 0.42);
                ctx.closePath(); ctx.fill(); ctx.stroke();
                // Wisp trails
                for (let w = 0; w < 3; w++) {
                    const wy = cy + e.height * 0.35 + drift + w * 9;
                    ctx.beginPath();
                    ctx.moveTo(cx - w * 7 + 3, wy);
                    ctx.quadraticCurveTo(cx + Math.sin(t * 0.004 + w) * 14, wy + 12 + w * 5, cx - w * 5, wy + 22 + w * 6);
                    ctx.strokeStyle = `rgba(${rgb},${0.4 - w * 0.12})`;
                    ctx.lineWidth = 2 - w * 0.4;
                    ctx.stroke();
                }
                // Eyes
                ctx.fillStyle = "rgba(255,255,255,0.9)";
                ctx.beginPath(); ctx.ellipse(cx - 5, cy - 4, 3, 4, 0, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.ellipse(cx + 5, cy - 4, 3, 4, 0, 0, Math.PI * 2); ctx.fill();

            } else if (flags.includes("homing")) {
                // Arrow-tipped homing dart with trailing energy streaks
                const angle = Math.atan2(player.worldY - e.y, player.worldX - e.x);
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(angle);
                // Body
                const dg = ctx.createLinearGradient(-e.width * 0.5, 0, e.width * 0.5, 0);
                dg.addColorStop(0, `rgba(${rgb},0.2)`);
                dg.addColorStop(0.6, `rgba(${rgb},0.85)`);
                dg.addColorStop(1, `rgba(255,255,255,0.95)`);
                ctx.fillStyle = dg;
                ctx.strokeStyle = `rgba(${rgb},0.9)`;
                ctx.beginPath();
                ctx.moveTo(e.width * 0.5, 0);
                ctx.lineTo(e.width * 0.1, -e.height * 0.28);
                ctx.lineTo(-e.width * 0.45, -e.height * 0.18);
                ctx.lineTo(-e.width * 0.5, 0);
                ctx.lineTo(-e.width * 0.45, e.height * 0.18);
                ctx.lineTo(e.width * 0.1, e.height * 0.28);
                ctx.closePath(); ctx.fill(); ctx.stroke();
                // Fin tabs
                ctx.fillStyle = `rgba(${rgb},0.6)`;
                ctx.beginPath(); ctx.moveTo(-e.width * 0.35, 0); ctx.lineTo(-e.width * 0.55, -e.height * 0.38); ctx.lineTo(-e.width * 0.18, -e.height * 0.18); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(-e.width * 0.35, 0); ctx.lineTo(-e.width * 0.55, e.height * 0.38); ctx.lineTo(-e.width * 0.18, e.height * 0.18); ctx.closePath(); ctx.fill();
                ctx.restore();
                // Eye dot
                ctx.fillStyle = "rgba(255,255,255,0.95)";
                ctx.beginPath(); ctx.arc(cx + Math.cos(angle) * e.width * 0.2, cy + Math.sin(angle) * e.width * 0.2, 3, 0, Math.PI * 2); ctx.fill();

            } else if (flags.includes("charger")) {
                // Charging ramming construct: armored wedge with crackle aura
                const lean = e.dir * 0.22;
                ctx.save(); ctx.translate(cx, cy); ctx.rotate(lean);
                const cg = ctx.createLinearGradient(0, -e.height * 0.5, 0, e.height * 0.5);
                cg.addColorStop(0, `rgba(${rgb},0.9)`);
                cg.addColorStop(1, `rgba(${rgb},0.35)`);
                ctx.fillStyle = cg;
                // Wedge hull
                ctx.beginPath();
                ctx.moveTo(e.dir * e.width * 0.52, 0);
                ctx.lineTo(e.dir * e.width * 0.1, -e.height * 0.46);
                ctx.lineTo(-e.dir * e.width * 0.48, -e.height * 0.38);
                ctx.lineTo(-e.dir * e.width * 0.48, e.height * 0.38);
                ctx.lineTo(e.dir * e.width * 0.1, e.height * 0.46);
                ctx.closePath(); ctx.fill(); ctx.stroke();
                // Armor plate lines
                ctx.strokeStyle = `rgba(255,255,255,0.35)`;
                ctx.lineWidth = 1.5;
                for (let p = 1; p < 3; p++) {
                    ctx.beginPath();
                    ctx.moveTo(-e.dir * e.width * 0.1, -e.height * (0.35 - p * 0.1));
                    ctx.lineTo(-e.dir * e.width * 0.4, -e.height * (0.28 - p * 0.08));
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(-e.dir * e.width * 0.1, e.height * (0.35 - p * 0.1));
                    ctx.lineTo(-e.dir * e.width * 0.4, e.height * (0.28 - p * 0.08));
                    ctx.stroke();
                }
                // Eye visor
                ctx.fillStyle = `rgba(255,255,255,0.9)`;
                ctx.beginPath(); ctx.ellipse(e.dir * e.width * 0.16, 0, 5, 3, 0, 0, Math.PI * 2); ctx.fill();
                ctx.restore();
                // Speed crackle if charging
                if (Math.abs(player.worldX - e.x) < 260) {
                    for (let sp = 0; sp < 4; sp++) {
                        const sa = t * 0.008 + sp * 1.5;
                        ctx.strokeStyle = `rgba(${rgb},${0.3 + sp * 0.08})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(cx - e.dir * e.width * 0.4, cy - 8 + sp * 5);
                        ctx.lineTo(cx - e.dir * (e.width * 0.4 + 18 + Math.sin(sa) * 6), cy - 8 + sp * 5);
                        ctx.stroke();
                    }
                }

            } else if (flags.includes("shielded_front") || flags.includes("heavy")) {
                // Armored guardian: boxy with front shield glyph and layered plates
                const sg = ctx.createLinearGradient(cx, cy - e.height * 0.5, cx, cy + e.height * 0.5);
                sg.addColorStop(0, `rgba(${rgb},0.85)`);
                sg.addColorStop(1, `rgba(${rgb},0.4)`);
                ctx.fillStyle = sg;
                ctx.beginPath(); ctx.roundRect(cx - e.width * 0.46, cy - e.height * 0.46, e.width * 0.92, e.height * 0.92, 10); ctx.fill(); ctx.stroke();
                // Horizontal plate rivets
                ctx.strokeStyle = `rgba(255,255,255,0.4)`;
                ctx.lineWidth = 1.5;
                for (let row = -1; row <= 1; row++) {
                    ctx.beginPath();
                    ctx.moveTo(cx - e.width * 0.38, cy + row * e.height * 0.22);
                    ctx.lineTo(cx + e.width * 0.38, cy + row * e.height * 0.22);
                    ctx.stroke();
                }
                // Shield emblem cross
                ctx.strokeStyle = `rgba(255,255,255,0.7)`;
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(cx, cy - e.height * 0.28); ctx.lineTo(cx, cy + e.height * 0.28);
                ctx.moveTo(cx - e.width * 0.28, cy); ctx.lineTo(cx + e.width * 0.28, cy);
                ctx.stroke();
                // Eye pair
                ctx.fillStyle = "rgba(255,255,255,0.88)";
                ctx.beginPath(); ctx.arc(cx - 6, cy - e.height * 0.12, 4, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(cx + 6, cy - e.height * 0.12, 4, 0, Math.PI * 2); ctx.fill();

            } else if (flags.includes("flying") || flags.includes("floating") || flags.includes("sine_wave")) {
                // Floating wisp/jellyfish: pulsing bell body with trailing tentacles
                const pulse = 1 + Math.sin(t * 0.007 + e.floatOffset) * 0.12;
                const fg = ctx.createRadialGradient(cx, cy - e.height * 0.12, 2, cx, cy, e.width * 0.5 * pulse);
                fg.addColorStop(0, `rgba(255,255,255,0.7)`);
                fg.addColorStop(0.4, `rgba(${rgb},0.7)`);
                fg.addColorStop(1, `rgba(${rgb},0.1)`);
                ctx.fillStyle = fg;
                // Bell
                ctx.beginPath();
                ctx.moveTo(cx - e.width * 0.48 * pulse, cy);
                ctx.bezierCurveTo(cx - e.width * 0.48 * pulse, cy - e.height * 0.52 * pulse, cx + e.width * 0.48 * pulse, cy - e.height * 0.52 * pulse, cx + e.width * 0.48 * pulse, cy);
                ctx.quadraticCurveTo(cx, cy + e.height * 0.22 * pulse, cx, cy);
                ctx.closePath(); ctx.fill(); ctx.stroke();
                // Fringe tentacles
                for (let tn = 0; tn < 5; tn++) {
                    const tx = cx - e.width * 0.36 + tn * (e.width * 0.18);
                    const swayAmt = Math.sin(t * 0.006 + tn * 1.3 + e.floatOffset) * 8;
                    ctx.beginPath();
                    ctx.moveTo(tx, cy + 2);
                    ctx.quadraticCurveTo(tx + swayAmt, cy + e.height * 0.38, tx + swayAmt * 0.5, cy + e.height * 0.6);
                    ctx.strokeStyle = `rgba(${rgb},${0.65 - tn * 0.08})`;
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }
                // Eyes (two dots inside bell)
                ctx.fillStyle = "rgba(255,255,255,0.9)";
                ctx.beginPath(); ctx.arc(cx - 5, cy - e.height * 0.22, 2.5, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(cx + 5, cy - e.height * 0.22, 2.5, 0, Math.PI * 2); ctx.fill();

            } else if (flags.includes("projector")) {
                // Turret: mechanical orb on a bracket, with a rotating barrel
                const barrelAngle = Math.atan2(player.worldY - cy, player.worldX - cx);
                const og = ctx.createRadialGradient(cx, cy, 3, cx, cy, e.width * 0.46);
                og.addColorStop(0, `rgba(${rgb},0.9)`);
                og.addColorStop(1, `rgba(${rgb},0.3)`);
                ctx.fillStyle = og;
                // Orb body
                ctx.beginPath(); ctx.arc(cx, cy, e.width * 0.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                // Mounting bracket
                ctx.strokeStyle = `rgba(${rgb},0.7)`;
                ctx.lineWidth = 4;
                ctx.beginPath(); ctx.moveTo(cx - e.width * 0.18, cy + e.width * 0.36); ctx.lineTo(cx + e.width * 0.18, cy + e.width * 0.36); ctx.stroke();
                // Barrel
                ctx.save(); ctx.translate(cx, cy); ctx.rotate(barrelAngle);
                const barrelGrad = ctx.createLinearGradient(0, -3, e.width * 0.55, 3);
                barrelGrad.addColorStop(0, `rgba(${rgb},0.9)`);
                barrelGrad.addColorStop(1, `rgba(255,255,255,0.7)`);
                ctx.fillStyle = barrelGrad;
                ctx.beginPath(); ctx.rect(e.width * 0.36, -3, e.width * 0.22, 6); ctx.fill();
                ctx.restore();
                // Lens eye
                ctx.fillStyle = "rgba(255,255,255,0.95)";
                ctx.beginPath(); ctx.arc(cx + Math.cos(barrelAngle) * e.width * 0.15, cy + Math.sin(barrelAngle) * e.width * 0.15, 4, 0, Math.PI * 2); ctx.fill();

            } else {
                // Default: 8-pointed star with gradient fill + orbit ring
                const rot = t * 0.0025 + e.floatOffset;
                const defG = ctx.createRadialGradient(cx, cy, 2, cx, cy, e.width * 0.5);
                defG.addColorStop(0, `rgba(255,255,255,0.8)`);
                defG.addColorStop(0.5, `rgba(${rgb},0.8)`);
                defG.addColorStop(1, `rgba(${rgb},0.2)`);
                ctx.fillStyle = defG;
                ctx.beginPath();
                for (let i = 0; i < 8; i++) {
                    const a = rot + i * Math.PI / 4;
                    const r = i % 2 ? Math.max(e.width, e.height) * 0.22 : Math.max(e.width, e.height) * 0.46;
                    const px = cx + Math.cos(a) * r;
                    const py = cy + Math.sin(a) * r;
                    i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
                }
                ctx.closePath(); ctx.fill(); ctx.stroke();
                // Orbit ring
                ctx.strokeStyle = `rgba(${rgb},0.35)`;
                ctx.lineWidth = 1;
                ctx.beginPath(); ctx.arc(cx, cy, Math.max(e.width, e.height) * 0.55, 0, Math.PI * 2); ctx.stroke();
                // Eyes
                ctx.fillStyle = "rgba(255,255,255,0.9)";
                ctx.beginPath(); ctx.arc(cx - 5, cy - 3, 2.5, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(cx + 5, cy - 3, 2.5, 0, Math.PI * 2); ctx.fill();
            }

            ctx.restore();
        };

        const updatePreV27 = update;
        update = function updateV27() {
            updatePreV27();
            if (equipmentMenuOpen || endingScreenOpen || gameOver) return;
            for (const e of enemies) {
                if (e && Number.isFinite(e.x) && Math.abs(e.x - player.worldX) > Math.max(canvas.width || 960, 480) + 1400) continue;
                if (!V27_ENEMY_TYPES.has(e.type)) continue;
                const flags = e.behaviorFlags || [];
                if (flags.includes("gravitational_pull")) {
                    const dx = (e.x + e.width / 2) - player.worldX;
                    const dy = (e.y + e.height / 2) - player.worldY;
                    const dist = Math.max(80, Math.hypot(dx, dy));
                    if (dist < 360) { player.vx += (dx / dist) * 0.035; player.vy += (dy / dist) * 0.018; }
                }
                if (flags.includes("homing")) { e.x += Math.sign(player.worldX - e.x) * e.speed * 0.25; e.y += Math.sign(player.worldY - e.y) * e.speed * 0.18; }
                if (flags.includes("phase_drift")) e.y += Math.sin(Date.now() * 0.004 + e.floatOffset) * 0.9;
                if (flags.includes("charger") && Math.abs(player.worldX - e.x) < 260) e.x += Math.sign(player.worldX - e.x) * e.speed * 0.45;
                clampEnemyToPlatform(e);
            }
            // ── Prismatic Weaver: cycle through four timed bonuses ──
            if (player.prismaticWeaver) {
                player.prismaticTimer = (player.prismaticTimer || 0) + 1;
                if (player.prismaticTimer >= 150) { // switch phase every 2.5 s @ 60fps
                    player.prismaticTimer = 0;
                    player.prismaticIndex = ((player.prismaticIndex || 0) + 1) % 4;
                }
                const pi = player.prismaticIndex || 0;
                // phase 0: speed burst
                if (pi === 0) player.maxSpeed = Math.max(player.maxSpeed, 6.4);
                // phase 1: wider slash
                if (pi === 1) player.attackBox.width = Math.max(player.attackBox.width, 150);
                // phase 2: score boost active
                player.scoreBoost = (pi === 2);
                // phase 3: guard recharge pulse (rearms guardCharge once per phase)
                if (pi === 3 && !player._prismaticPhase3Armed) { player.guardChargeReady = true; player._prismaticPhase3Armed = true; }
                if (pi !== 3) player._prismaticPhase3Armed = false;
            }

            // ── Warp Spool: tick phase window down; during phase window, projectiles pass through ──
            if (player.warpPhaseTimer > 0) {
                player.warpPhaseTimer--;
                // Projectile phase-through is handled at the bossAttack hit site
            }

            // ── Monarch Cloak: tick & age afterimages; spawn one when dashing ──
            if (player.monarchCloak) {
                player.monarchAfterimages = player.monarchAfterimages || [];
                // Afterimages are spawned when the dash fires (see skyDash hook below).
                // Age them out here.
                for (let ai = player.monarchAfterimages.length - 1; ai >= 0; ai--) {
                    player.monarchAfterimages[ai].life--;
                    if (player.monarchAfterimages[ai].life <= 0) player.monarchAfterimages.splice(ai, 1);
                }
            }

            // ── Serrated Blade: tick bleed timers and apply delayed damage ──
            if (player.serratedBlade && player.bleedTargets && player.bleedTargets.size > 0) {
                for (const [eid, bleed] of player.bleedTargets) {
                    bleed.timer--;
                    if (bleed.timer <= 0) {
                        // find the enemy by id in enemies array and deal bleed damage
                        const be = enemies.find(e => e._bleedId === eid);
                        if (be) {
                            be.hp -= 1;
                            addParticles(be.x + be.width / 2 - worldX, be.y, '#ff7777');
                            if (be.hp <= 0) {
                                const bi = enemies.indexOf(be);
                                if (bi !== -1) {
                                    enemies.splice(bi, 1);
                                    score += player.shadowCoin ? 175 : 100;
                                    updateUI();
                                }
                            }
                        }
                        player.bleedTargets.delete(eid);
                    }
                }
            }

            // ── Echo Crest: tick queued echo slashes and fire when ready ──
            if (player.echoCrest && player.echoSlashQueue && player.echoSlashQueue.length > 0) {
                for (let qi = player.echoSlashQueue.length - 1; qi >= 0; qi--) {
                    player.echoSlashQueue[qi].delay--;
                    if (player.echoSlashQueue[qi].delay <= 0) {
                        // Fire a smaller version of the stored slash
                        const q = player.echoSlashQueue[qi];
                        player.echoSlashQueue.splice(qi, 1);
                        // Check enemies with a reduced box
                        const echoW = Math.floor(player.attackBox.width * 0.6);
                        const echoH = Math.floor(player.attackBox.height * 0.6);
                        for (let ei = enemies.length - 1; ei >= 0; ei--) {
                            const e = enemies[ei];
                            const ax = q.wx - echoW / 2, ay = q.wy - echoH / 2;
                            if (e.x + e.width > ax && e.x < ax + echoW && e.y + e.height > ay && e.y < ay + echoH) {
                                e.hp -= 1;
                                addParticles(e.x + e.width / 2 - worldX, e.y, '#a7f0ff');
                                if (e.hp <= 0) {
                                    onEnemyKilled(ei);
                                    if (ei < enemies.length && enemies[ei] && enemies[ei]._bleedId === e._bleedId) {
                                        enemies.splice(ei, 1);
                                        score += 100; updateUI();
                                    }
                                }
                            }
                        }
                        // Also hit boss if active (echo deals 0.5 dmg rounded = 1 every 2)
                        if (boss.active) {
                            boss.hp -= 0.5;
                            if (boss.hp <= 0) finishBossDefeat(boss.kind);
                        }
                    }
                }
            }

            // ── Heavy Weight Anchor: slow fall on downward attack ──
            if (player.heavyWeightAnchor && player.attackDir === "down" && player.isAttacking && player.vy > 2) {
                player.vy = Math.min(player.vy, 3.5); // cap fall speed during downward pogo attempt
            }
        };

        const equipmentEffectTextPreV27 = equipmentEffectText;
        equipmentEffectText = function equipmentEffectTextV27(type) {
            const def = ENDGAME_EQUIPMENT_ADDITIONS_V27.find(item => item.id === type);
            if (def) return def.effect;
            return equipmentEffectTextPreV27(type);
        };

        const recalculateEquipmentEffectsPreV27 = recalculateEquipmentEffects;
        recalculateEquipmentEffects = function recalculateEquipmentEffectsV27() {
            recalculateEquipmentEffectsPreV27();
            const equipped = player.equippedEquipment || [];
            player.shearGauntlets    = equipped.includes("shearGauntlets");
            player.warpSpool         = equipped.includes("warpSpool");
            player.leviathanCarapace = equipped.includes("leviathanCarapace");
            player.monarchCloak      = equipped.includes("monarchCloak");
            player.infinityThread    = equipped.includes("infinityThread");
            player.spoolShield       = equipped.includes("spoolShield");
            player.thimbleCap        = equipped.includes("thimbleCap");
            player.gildedNeedle      = equipped.includes("gildedNeedle");
            player.mercuryThread     = equipped.includes("mercuryThread");
            player.serratedBlade     = equipped.includes("serratedBlade");
            player.glassPendant      = equipped.includes("glassPendant");
            player.echoCrest         = equipped.includes("echoCrest");
            player.vampiricEye       = equipped.includes("vampiricEye");
            player.heavyWeightAnchor = equipped.includes("heavyWeightAnchor");
            player.prismaticWeaver   = equipped.includes("prismaticWeaver");

            // ── Shear Gauntlets: wider pogo hitbox; pierce flag set at hit site ──
            if (player.shearGauntlets) player.attackBox.width += 30;

            // ── Warp Spool: skyDash unlocked; phase window tracked via player.warpPhaseTimer ──
            if (player.warpSpool) {
                player.skyDash = true;
                if (player.warpPhaseTimer === undefined) player.warpPhaseTimer = 0;
            } else {
                player.warpPhaseTimer = 0;
            }

            // ── Leviathan Carapace: passive guard + reduced fall speed ──
            if (player.leviathanCarapace) {
                player.crystalGuard = true;
                player.maxFallSpeed = Math.max(6.4, player.maxFallSpeed - 0.7);
            }

            // ── Monarch Cloak: skyDash + afterimage list init ──
            if (player.monarchCloak) {
                player.skyDash = true;
                player.maxSpeed += 0.5;
                if (!player.monarchAfterimages) player.monarchAfterimages = [];
            } else {
                player.monarchAfterimages = [];
            }

            // ── Infinity Thread: attack range bonus + kill counter init ──
            if (player.infinityThread) {
                player.attackBox.width  += 35;
                player.attackBox.height += 35;
                if (player.infinityKillCount === undefined) player.infinityKillCount = 0;
            } else {
                player.infinityKillCount = 0;
            }

            // ── Spool Shield: recharge-on-land block ──
            if (player.spoolShield) { player.guardShield = true; }

            // ── Thimble Cap: post-hit cooldown reduction + respawn bonus ──
            if (player.thimbleCap) {
                player.thimbleCapCooldownReduction = 40;
                player.thimbleCapRespawnBonus = 70;
            } else {
                player.thimbleCapCooldownReduction = 0;
                player.thimbleCapRespawnBonus = 0;
            }

            // ── Gilded Needle: boss hit combo counter (every 3rd hit +1 dmg) ──
            if (player.gildedNeedle) {
                player.attackBox.width += 20;
                if (player.gildedNeedleHits === undefined) player.gildedNeedleHits = 0;
            } else {
                player.gildedNeedleHits = 0;
            }

            // ── Mercury Thread: movement tuning ──
            if (player.mercuryThread) {
                player.maxSpeed    += 1.1;
                player.acceleration += 0.1;
                player.friction = Math.max(player.friction, 0.95);
            }

            // ── Serrated Blade: bleed list init ──
            if (player.serratedBlade) {
                player.attackBox.width += 25;
                if (!player.bleedTargets) player.bleedTargets = new Map();
            } else {
                player.bleedTargets = new Map();
            }

            // ── Glass Pendant: reflect first post-land projectile ──
            if (player.glassPendant) {
                if (player.glassPendantReady === undefined) player.glassPendantReady = false;
            } else {
                player.glassPendantReady = false;
            }

            // ── Echo Crest: echo slash delay list ──
            if (player.echoCrest) {
                player.echoShell = true;
                player.attackBox.width += 25;
                if (!player.echoSlashQueue) player.echoSlashQueue = [];
            } else {
                player.echoSlashQueue = [];
            }

            // ── Vampiric Eye: kill charge counter ──
            if (player.vampiricEye) {
                if (player.vampiricKillCharge === undefined) player.vampiricKillCharge = 0;
            } else {
                player.vampiricKillCharge = 0;
            }

            // ── Heavy Weight Anchor: reduced fall speed base; downward slow handled at physics site ──
            if (player.heavyWeightAnchor) player.maxFallSpeed = Math.max(6.1, player.maxFallSpeed - 1.0);

            // ── Prismatic Weaver: cycle index init ──
            if (player.prismaticWeaver) {
                if (player.prismaticIndex === undefined) player.prismaticIndex = 0;
                if (player.prismaticTimer  === undefined) player.prismaticTimer  = 0;
            } else {
                player.prismaticIndex = 0;
                player.prismaticTimer = 0;
            }

            player.attackRange = Math.max(player.attackBox.width, player.attackBox.height) / 2;
        };

        // ── v29: centralised enemy-kill side-effects ──────────────────────
        // Called whenever an enemy hp drop causes death, BEFORE splice.
        // Index ei is still valid at call time.
        function onEnemyKilled(ei) {
            const e = enemies[ei];

            // Infinity Thread: every 10 kills grants +1 life
            if (player.infinityThread) {
                player.infinityKillCount = (player.infinityKillCount || 0) + 1;
                if (player.infinityKillCount >= 10) {
                    player.infinityKillCount = 0;
                    player.lives++;
                    showMagicNotice({ name: "Infinity Thread: +1 Life", id: "infinityLife" });
                    updateUI();
                }
            }

            // Vampiric Eye: every 8 kill-charges heals 1 life; boss hits count 2
            if (player.vampiricEye) {
                player.vampiricKillCharge = (player.vampiricKillCharge || 0) + 1;
                if (player.vampiricKillCharge >= 8) {
                    player.vampiricKillCharge = 0;
                    healPlayer(1);
                    showMagicNotice({ name: "Vampiric Eye: Drain Heal", id: "vampHeal" });
                }
            }

            // Serrated Blade: clean up bleed entry if enemy dies before timer
            if (player.serratedBlade && player.bleedTargets && e && e._bleedId !== undefined) {
                player.bleedTargets.delete(e._bleedId);
            }
        }
        awardBossReward = function awardBossRewardV27(kind) {
            const reward = ENDGAME_BOSS_REWARD_MAP_V27[kind];
            if (!reward) return awardBossRewardPreV27(kind);
            player.bossRewards = player.bossRewards || [];
            if (!player.bossRewards.includes(reward.name)) player.bossRewards.push(reward.name);
            collectEquipmentItem(reward.equipment, "boss");
            WORLD_BOSS_REWARD_EQUIPMENT_IDS.add(reward.equipment);
            showMagicNotice({ name: `${reward.name}: ${getEquipmentDef(reward.equipment).name}`, id: "bossReward" });
            saveGame();
        };

        const drawBossPreV27 = drawBoss;
        drawBoss = function drawBossV27(screenX) {
            if (!ADVANCED_ENDGAME_BOSSES_V27[boss.kind]) return drawBossPreV27(screenX);
            ctx.save();
            const t = Date.now(), cx = screenX, cy = boss.y + boss.height / 2;
            const def = BOSS_DEFS[boss.kind], c = hexToRgb(def.color);
            const aura = ctx.createRadialGradient(cx, cy, 10, cx, cy, 180);
            aura.addColorStop(0, `rgba(${c.r},${c.g},${c.b},0.38)`); aura.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = aura; ctx.beginPath(); ctx.arc(cx, cy, 180, 0, Math.PI * 2); ctx.fill();
            ctx.shadowColor = def.color; ctx.shadowBlur = 28; ctx.strokeStyle = def.color; ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.72)`; ctx.lineWidth = 3;
            if (boss.kind === "silverShears") { for (let i = -1; i <= 1; i += 2) { ctx.beginPath(); ctx.ellipse(cx + i * 28, cy, 24, 105, i * 0.45 + Math.sin(t * 0.002) * 0.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); } ctx.strokeStyle = "#ffffff"; ctx.beginPath(); ctx.moveTo(cx - 80, cy - 70); ctx.lineTo(cx + 80, cy + 70); ctx.moveTo(cx + 80, cy - 70); ctx.lineTo(cx - 80, cy + 70); ctx.stroke(); }
            else if (boss.kind === "loomOverseer") { ctx.beginPath(); ctx.roundRect(cx - 82, cy - 120, 164, 240, 24); ctx.fill(); ctx.stroke(); for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(cx + i * 24, cy - 140); ctx.lineTo(cx + i * 12, cy + 140); ctx.stroke(); } ctx.fillStyle = "#fff4c8"; ctx.beginPath(); ctx.arc(cx, cy - 35, 18, 0, Math.PI * 2); ctx.fill(); }
            else if (boss.kind === "frayedLeviathan") { for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.ellipse(cx - i * 38, cy + Math.sin(t * 0.004 + i) * 25, 55 - i * 3, 34, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); } ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(cx + 42, cy - 8, 7, 0, Math.PI * 2); ctx.fill(); }
            else if (boss.kind === "velvetSovereign") { ctx.beginPath(); ctx.moveTo(cx, cy - 130); ctx.lineTo(cx + 75, cy - 35); ctx.lineTo(cx + 48, cy + 125); ctx.lineTo(cx - 48, cy + 125); ctx.lineTo(cx - 75, cy - 35); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.strokeStyle = "#ffd6e8"; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(cx, cy, 42 + i * 18, t * 0.002 + i, t * 0.002 + i + Math.PI); ctx.stroke(); } }
            else if (boss.kind === "finalWeaver") { for (let i = 0; i < 12; i++) { const a = t * 0.002 + i * Math.PI / 6; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * 145, cy + Math.sin(a) * 110); ctx.stroke(); } ctx.beginPath(); ctx.ellipse(cx, cy, 72, 125, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(cx, cy - 25, 14, 0, Math.PI * 2); ctx.fill(); }
            const w = 290, x = canvas.width / 2 - w / 2, y = 36;
            ctx.shadowBlur = 0; ctx.fillStyle = "rgba(0,0,0,0.72)"; ctx.fillRect(x - 2, y - 2, w + 4, 20);
            const f = Math.max(0, boss.hp / boss.maxHp), g = ctx.createLinearGradient(x, y, x + w, y);
            g.addColorStop(0, def.color); g.addColorStop(1, "#ffffff"); ctx.fillStyle = g; ctx.fillRect(x, y, w * f, 16); ctx.strokeStyle = def.color; ctx.strokeRect(x, y, w, 16);
            ctx.fillStyle = "rgba(255,245,235,0.9)"; ctx.font = "bold 11px Courier New"; ctx.fillText(boss.name, x, y - 6);
            ctx.restore();
        };
