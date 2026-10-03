/* Faded Thread module: 04-entities-equipment-input.js | build 03 Oct 2026 */
let platforms = [];
        let enemies = [];

        // ── GROUND-PATROL PLATFORM ANCHORING (bugfix) ──────────────────────
        // Ground enemies used to patrol a fixed pixel distance from their spawn
        // point regardless of how wide the platform under them actually was,
        // so on narrow platforms they'd walk straight off the edge and hang
        // in mid-air. This finds the real platform each enemy spawned on and
        // clamps/turns them at the actual edges instead of a magic number.
        function enemyHomePlatform(e) {
            if (e._platform !== undefined) return e._platform;
            let best = null, bestDist = Infinity;
            const cx = e.startX + e.width / 2;
            const footY = e.startY + e.height;
            // Only inspect platforms close to this enemy. Historical platforms
            // elsewhere in the run remain dormant and cost nothing here.
            const candidatePlatforms = typeof ftPlatformRange === 'function'
                ? ftPlatformRange(cx - 160, cx + 160)
                : platforms;
            for (const p of candidatePlatforms) {
                if (cx >= p.x - 4 && cx <= p.x + p.width + 4) {
                    const d = Math.abs(p.y - footY);
                    if (d < bestDist) { bestDist = d; best = p; }
                }
            }
            e._platform = best;
            return best;
        }
        function clampEnemyToPlatform(e) {
            const flags = e.behaviorFlags || [];
            const isAirborne = [4, 7, 12, 13, 25, 29].includes(e.type) ||
                flags.some(f => ["floating", "flying", "homing", "phase_drift", "sine_wave", "fast_swimmer"].includes(f));
            if (isAirborne) return;
            const plat = enemyHomePlatform(e);
            if (!plat) return;
            const minX = plat.x + 4;
            const maxX = plat.x + plat.width - e.width - 4;
            if (maxX <= minX) return;
            if (e.x < minX) { e.x = minX; e.dir = 1; }
            else if (e.x > maxX) { e.x = maxX; e.dir = -1; }
        }
        let particles = [];
        let heals = [];
        let magicItems = [];
        let cosmeticItems = [];
        let bossAttacks = []; // v28: active boss action entities (projectiles, hazards, beams, telegraphs)
        let magicSpawnQueue = [];
        let nextMagicPlatformIndex = 0;
        let onHomeScreen = true;
        let equipmentMenuOpen = false;
        let activeSaveSlot = null;
        const MAX_SAVE_SLOTS = 6;
        const SAVE_PREFIX = "faded_thread_save_v5_";

        const EQUIPMENT_TYPES = [
            { id: "sovereignsDoubt", name: "The Sovereign's Doubt", color: "#cc44ff", short: "DOUBT", slot: "orbit", bossOnly: true, hiddenEcho: true, effect: "A rare echo, sometimes left behind when a boss falls. Does nothing on its own." },
            { id: "widowEcho", name: "Widow's Echo Charm", color: "#6b2cff", short: "ECHO2", slot: "back", bossOnly: true, hiddenEcho: true, effect: "A rare echo, sometimes left behind when a boss falls. Does nothing on its own." },
            { id: "ember", name: "Ember Thread", color: "#ff8844", short: "EMBER", slot: "aura" },
            { id: "swift", name: "Swift Spool", color: "#55ddff", short: "SPEED", slot: "trail" },
            { id: "guard", name: "Guarding Button", color: "#88ff99", short: "GUARD", slot: "chest" },
            { id: "reach", name: "Long Stitch", color: "#ffd966", short: "REACH", slot: "hand" },
            { id: "moon", name: "Moon Needle", color: "#dd99ff", short: "WINGS", slot: "hat" },
            { id: "mirror", name: "Mirror Patch", color: "#bdf7ff", short: "MIRROR", slot: "chest" },
            { id: "gear", name: "Gear Charm", color: "#aab8ff", short: "GEAR", slot: "hand" },
            { id: "thorn", name: "Thorn Stitch", color: "#8dff66", short: "THORN", slot: "trail" },
            { id: "tide", name: "Tide Pearl", color: "#66e6ff", short: "TIDE", slot: "face" },
            { id: "rift", name: "Rift Thread", color: "#b46bff", short: "RIFT", slot: "hand", endgameOnly: true },
            { id: "clock", name: "Clockwork Stitch", color: "#ffd37a", short: "CLOCK", slot: "face", endgameOnly: true },
            { id: "bell", name: "Soul Bell", color: "#f3f0aa", short: "BELL", slot: "orbit", endgameOnly: true },
            { id: "ribbon", name: "Sky Ribbon", color: "#8be9ff", short: "DASH", slot: "back", endgameOnly: true },
            { id: "thorns", name: "Thorn Thread", color: "#9cff6e", short: "THORN", slot: "chest", endgameOnly: true },
            { id: "echo", name: "Echo Shell", color: "#a7f0ff", short: "ECHO", slot: "orbit", endgameOnly: true },
            { id: "ash", name: "Ash Feather", color: "#ff9a5c", short: "ASH", slot: "back", endgameOnly: true },
            { id: "silk", name: "Silk Seal", color: "#e8e6ff", short: "SEAL", slot: "trail", endgameOnly: true },
            { id: "crownShard", name: "Crown Shard", color: "#d56bff", short: "CROWN", slot: "hat", endgameOnly: true },
            { id: "sunSpool", name: "Sun Spool", color: "#ffe36e", short: "SUN", slot: "orbit", endgameOnly: true },
            { id: "voidBell", name: "Void Bell", color: "#9b6bff", short: "VOID", slot: "orbit", endgameOnly: true },
            { id: "needleBoots", name: "Needle Boots", color: "#c9ffd8", short: "POGO", slot: "feet", endgameOnly: true },
            { id: "cometThread", name: "Comet Thread", color: "#7dffea", short: "COMET", slot: "trail", endgameOnly: true },
            { id: "anchorPearl", name: "Anchor Pearl", color: "#8cc7ff", short: "ANCHR", slot: "chest", endgameOnly: true },
            { id: "prismHeart", name: "Prism Heart", color: "#d7fbff", short: "PRISM", slot: "chest", endgameOnly: true },
            { id: "cathedralBell", name: "Cathedral Bell", color: "#ff3355", short: "BELL", slot: "orbit", endgameOnly: true },
            { id: "shadowCoin", name: "Shadow Coin", color: "#7a45ff", short: "COIN", slot: "orbit", endgameOnly: true },
            { id: "auroraPin", name: "Aurora Pin", color: "#76ffd8", short: "AUR", slot: "hat", endgameOnly: true },
            { id: "marrowCharm", name: "Marrow Charm", color: "#ffe3cf", short: "BONE", slot: "chest", endgameOnly: true },
            { id: "relicStar", name: "Relic Star", color: "#fff6a8", short: "STAR", slot: "hand", endgameOnly: true },
            { id: "threadCrown", name: "Thread Crown", color: "#ffe680", short: "CROWN", slot: "hat", effect: "+10% score from enemies." },
            { id: "weaverHelm", name: "Weaver Helm", color: "#d7c0ff", short: "HELM", slot: "hat", effect: "+20 slash width." },
            { id: "hollowMask", name: "Hollow Mask", color: "#c8d0ff", short: "MASK", slot: "face", effect: "Start each life with longer invulnerability." },
            { id: "starHalo", name: "Star Halo", color: "#fff2a8", short: "HALO", slot: "hat", effect: "+1 maximum carried life on pickup and small score boost." },
            { id: "wizardHat", name: "Wizard Hat", color: "#9b7cff", short: "WIZ", slot: "hat", effect: "Arcane Focus. Final swing length is increased by 10% after every other slash bonus is calculated. Enemy kills award 12% more score." },
            { id: "brokenTiara", name: "Broken Tiara", color: "#ffb7e8", short: "TIARA", slot: "hat", effect: "+1 life when entering a boss realm." },
            { id: "royalCape", name: "Royal Cape", color: "#ff8d8d", short: "CAPE", slot: "back", effect: "+0.7 movement speed." },
            { id: "threadWings", name: "Thread Wings", color: "#bdf7ff", short: "BACK", slot: "back", effect: "Slightly safer falling. Wings remain visual only." },
            { id: "crystalMantle", name: "Crystal Mantle", color: "#a6f7ff", short: "GEM", slot: "back", effect: "Chance to ignore damage." },
            { id: "cosmicCloak", name: "Cosmic Cloak", color: "#b68cff", short: "CLOAK", slot: "back", effect: "Unlocks Sky Dash while equipped." },
            { id: "goldenEye", name: "Golden Eye", color: "#ffd966", short: "EYE", slot: "face", effect: "+15 attack height." },
            { id: "voidEye", name: "Void Eye", color: "#c266ff", short: "VOID", slot: "face", effect: "Rift slash effect while equipped." },
            { id: "clockEye", name: "Clock Eye", color: "#ffd37a", short: "TIME", slot: "face", effect: "Longer invulnerability after being hit." },
            { id: "starEye", name: "Star Eye", color: "#fff4b8", short: "STAR", slot: "face", effect: "+10% enemy score." },
            { id: "jesusBoots", name: "Jesus Boots", color: "#fff9d6", short: "WALK", slot: "feet", effect: "Walk safely on the floor and danger water below — it no longer costs a life.", bossOnly: true, bossSource: "firstStitch" }
        ];
        // never appear in the "Anywhere Drops" / global world random item pool.
        // The set below also covers any other equipment that ends up tagged as a
        // boss reward via awardBossReward(), so the global pool can be filtered
        // against it from a single source of truth.
        const BOSS_REWARD_EQUIPMENT_IDS = new Set(
            EQUIPMENT_TYPES.filter(item => item.bossOnly).map(item => item.id)
        );
        // Heavy rarity penalty for any item that *is* allowed to appear in the
        // global pool but is still classified as a boss-tier reward elsewhere
        // (kept distinct from BOSS_REWARD_EQUIPMENT_IDS, which are fully excluded).
        const WORLD_DROP_BOSS_RARITY_CHANCE = 0.02; // 2% chance vs. standard items
        // reward" for world-drop rarity purposes, even though (unlike Jesus Boots)
        // these aren't fully excluded from the Anywhere Drops pool. Pre-seeded here
        // so the filter is correct from the very first drop roll of a session;
        // awardBossReward() also adds to this set defensively in case its mapping
        // is extended later.
        const WORLD_BOSS_REWARD_EQUIPMENT_IDS = new Set([
            "starHalo", "royalCape", "clockEye", "crystalMantle", "cosmicCloak",
            "goldenEye", "ash", "silk", "crownShard", "cometThread", "anchorPearl",
            "prismHeart", "cathedralBell", "shadowCoin", "auroraPin", "marrowCharm",
            "relicStar", "threadCrown"
        ]);
        // Back-compat aliases: some older code/save paths refer to these names.
        const MAGIC_ITEM_TYPES = EQUIPMENT_TYPES;
        const COSMETIC_ITEM_TYPES = EQUIPMENT_TYPES;

        const EQUIPMENT_LIMIT = 7;
        function allEquipmentDefs() { return EQUIPMENT_TYPES; }
        function getEquipmentDef(type) { return EQUIPMENT_TYPES.find(item => item.id === type) || EQUIPMENT_TYPES[0]; }
        function getCosmeticDef(type) { return EQUIPMENT_TYPES.find(item => item.id === type) || EQUIPMENT_TYPES[0]; }

        window.addEventListener('keydown', (e) => {
            if (window.ftEnhancedControlsActive) return;
            const key = e.key.toLowerCase();
            keys[key] = true;
            // Unlocking here (on any keypress) guarantees the audio engine is
            // ready well before the player's first attack/action.
            ensureAudioContext();

            if ((key === 'delete' || key === 'backspace') && !onHomeScreen) {
                e.preventDefault();
                saveGame();
                showHomeScreen();
                return;
            }
            if (onHomeScreen) return;
            if (key === 'y') {
                e.preventDefault();
                toggleEquipmentMenu();
                return;
            }
            if (equipmentMenuOpen) return;
            
            if (key === 'r' && gameOver) resetGame();
            
            // Trigger Attack with Direction Check
            if (key === 'x' && !player.isAttacking && !gameOver) {
                triggerAttack();
            }
            if ((key === 'shift' || key === ' ') && !gameOver && player.skyDash && player.dashReady) {
                player.vx = player.facing * Math.max(9, player.maxSpeed + 3);
                player.dashReady = false;
                addParticles(player.worldX - worldX, player.worldY, '#8be9ff');

                // Warp Spool: open a phase window for 40 frames after dash
                if (player.warpSpool) {
                    player.warpPhaseTimer = 40;
                }

                // Monarch Cloak: spawn a damaging afterimage at dash-start position
                if (player.monarchCloak) {
                    player.monarchAfterimages = player.monarchAfterimages || [];
                    player.monarchAfterimages.push({
                        wx: player.worldX, wy: player.worldY,
                        facing: player.facing, life: 45, maxLife: 45
                    });
                }
            }

            // Flappy Bird Impulse
            if ((key === 'w' || key === 'arrowup') && jumpKeyReleased && !gameOver) {
                player.vy = player.flapForce;
                player.flapAnim = 18;
                playFlapSound();
                jumpKeyReleased = false; 
            }
        });

        window.addEventListener('keyup', (e) => {
            if (window.ftEnhancedControlsActive) return;
            const key = e.key.toLowerCase();
            keys[key] = false;
            
            if (key === 'w' || key === 'arrowup') {
                jumpKeyReleased = true; 
            }
        });

        function triggerAttack() {
            player.isAttacking = true;
            player.attackTimer = 18; 

            // Check keys to determine final directional logic
            if (keys['w'] || keys['arrowup']) {
                player.attackDir = "up";
            } else if (keys['s'] || keys['arrowdown']) {
                player.attackDir = "down";
            } else {
                player.attackDir = "horizontal";
            }

            playSlashSound();
        }

        function advanceRealm(fromSkip = false) {
            // Platform indices are global across the whole run. Preserve the
            // last platform reached when changing realms, including boss
            // realms, so the next realm cannot mistake old platforms for new
            // progression or an already-reached music boundary.
            const boundaryPlatformIndex = highestPlatformTouchedIndex;
            const idx = realmIndex(currentRealm);
            const next = REALM_FLOW[idx + 1];
            if (!next) {
                const endless = ENDLESS_REALMS[endlessRealmPointer % ENDLESS_REALMS.length];
                endlessRealmPointer++;
                currentRealm = endless.id;
                realmProgress = 0;
                targetProgress = endless.target + Math.min(40, endgameLoops * 4);
                highestPlatformTouchedIndex = boundaryPlatformIndex;
                boss.active = false;
                bossAttacks = [];
                setBgThemeIntensified(false);
                realmFlash = 40;
                updateUI();
                addParticles(player.worldX - worldX, player.worldY, accentHex());
                return;
            }
            currentRealm = next.id;
            realmProgress = 0;
            targetProgress = next.target || 0;
            highestPlatformTouchedIndex = boundaryPlatformIndex;
            if (next.endgame) endgameUnlocked = true;
            if (fromSkip) score += next.endgame ? 15000 : 5000;
            if (next.boss) startBoss(next.boss); else { boss.active = false; bossAttacks = []; setBgThemeIntensified(false); }
            realmFlash = 40;
            updateUI();
            addParticles(player.worldX - worldX, player.worldY, accentHex());
        }

        function triggerSceneSkip() { /* Scene skipping deliberately disabled. */ }



        // ── ENDINGS ──────────────────────────────────────────────────────
        // Defeating the Eclipse Sovereign used to just dump the player into
        // endless mode forever with no ending screen at all — that was the
        // "impossible to reach ending" bug. Now it always shows an ending.
        // If the player quietly collected every standard item AND both rare
        // hidden echo drops before that fight, they get the secret ending
        // instead of the normal one.
        const HIDDEN_ECHO_IDS = ["sovereignsDoubt", "widowEcho"];
        let endingScreenOpen = false;

        function rollHiddenEchoDrop() {
            player.collectedEquipment = player.collectedEquipment || [];
            for (const id of HIDDEN_ECHO_IDS) {
                if (player.collectedEquipment.includes(id)) continue;
                if (Math.random() < 0.05) { // 5% per boss kill, per uncollected echo
                    collectEquipmentItem(id, "boss");
                }
            }
        }

        function secretEndingConditionMet() {
            player.collectedEquipment = player.collectedEquipment || [];
            const hasBothEchoes = HIDDEN_ECHO_IDS.every(id => player.collectedEquipment.includes(id));
            if (!hasBothEchoes) return false;
            const standardItems = EQUIPMENT_TYPES.filter(e => !e.hiddenEcho);
            return standardItems.every(e => player.collectedEquipment.includes(e.id));
        }

        function advanceRealmPostEnding() {
            const boundaryPlatformIndex = highestPlatformTouchedIndex;
            const endless = ENDLESS_REALMS[endlessRealmPointer % ENDLESS_REALMS.length];
            endlessRealmPointer++;
            currentRealm = endless.id;
            realmProgress = 0;
            targetProgress = endless.target + Math.min(40, endgameLoops * 4);
            highestPlatformTouchedIndex = boundaryPlatformIndex;
            boss.active = false;
            bossAttacks = [];
            setBgThemeIntensified(false);
            realmFlash = 40;
            updateUI();
        }

        function triggerFinalEnding(kind) {
            endingScreenOpen = true;
            boss.active = false;
            bossAttacks = [];
            setBgThemeIntensified(false);
            player.endingsUnlocked = player.endingsUnlocked || [];
            if (!player.endingsUnlocked.includes(kind)) player.endingsUnlocked.push(kind);
            saveGame();

            const isSecret = kind === "secret";
            const old = document.getElementById('v32EndingOverlay');
            if (old) old.remove();
            const overlay = document.createElement('div');
            overlay.id = 'v32EndingOverlay';
            overlay.style.cssText = "position:fixed;inset:0;z-index:99999;display:flex;flex-direction:column;" +
                "align-items:center;justify-content:center;text-align:center;padding:40px;" +
                "font-family:inherit;color:#e8dcff;background:" +
                (isSecret
                    ? "radial-gradient(circle at 50% 40%, #2a0a3a 0%, #050208 75%)"
                    : "radial-gradient(circle at 50% 40%, #1a0a2e 0%, #050208 75%)") + ";";
            const title = isSecret ? "HOW COULD YOU" : "THE THREAD ENDS";
            const titleColor = isSecret ? "#cc44ff" : "#e6b86a";
            const sub = isSecret
                ? "You emptied every realm before you ever raised your blade here — every thread, every echo, all of it kept. And still you finished what you started. Nothing you found along the way changes what this was."
                : "The Sovereign falls, and the last thread with it. The world you wove through goes quiet behind you.";
            overlay.innerHTML =
                '<div style="font-size:' + (isSecret ? "50px" : "42px") + ';letter-spacing:4px;font-weight:700;' +
                'color:' + titleColor + ';text-shadow:0 0 30px ' + titleColor + ';margin-bottom:22px;">' + title + '</div>' +
                '<div style="max-width:600px;font-size:16px;line-height:1.6;opacity:0.85;margin-bottom:32px;">' + sub + '</div>' +
                '<div style="font-size:12px;letter-spacing:1px;opacity:0.5;margin-bottom:26px;">' +
                (isSecret ? "SECRET ENDING UNLOCKED" : "ENDING UNLOCKED") + " · SCORE " + score + '</div>' +
                '<button id="v32EndingContinueBtn" style="padding:14px 30px;font-size:14px;letter-spacing:1px;' +
                'background:transparent;border:2px solid ' + titleColor + ';color:inherit;cursor:pointer;border-radius:4px;">' +
                'CONTINUE INTO THE ENDLESS LOOM</button>';
            document.body.appendChild(overlay);
            document.getElementById('v32EndingContinueBtn').onclick = function () {
                overlay.remove();
                endingScreenOpen = false;
                advanceRealmPostEnding();
            };
        }
        // from stalling if a reward/save/UI action throws during boss death, and it
        // guarantees exactly one realm advance after any boss reaches 0 HP.
        let bossDefeatInProgress = false;
        function finishBossDefeat(defeatedBossKind) {
            if (bossDefeatInProgress) return;
            bossDefeatInProgress = true;
            const realmBeforeDefeat = currentRealm;
            try {
                boss.hp = 0;
                boss.active = false;
                bossAttacks = [];
                boss.telegraphTimer = 0;
                boss.pendingActionIndex = -1;
                setBgThemeIntensified(false);
                playBossDefeatFanfare();
                score += defeatedBossKind === "needle" ? 5000 : defeatedBossKind === "weaver" ? 12000 : 25000;
                try {
                    awardBossReward(defeatedBossKind);
                } catch (rewardErr) {
                    console.error("Boss reward failed but realm progression will continue:", rewardErr);
                }
                try {
                    rollHiddenEchoDrop();
                } catch (echoErr) {
                    console.error("Hidden echo drop roll failed:", echoErr);
                }
                if (defeatedBossKind === "firstStitch" || realmBeforeDefeat === "boss3") {
                    endgameUnlocked = true;
                    endgameLoops++;
                }
                if (defeatedBossKind === "eclipseSovereign") {
                    triggerFinalEnding(secretEndingConditionMet() ? "secret" : "normal");
                    bossDefeatInProgress = false;
                    return;
                }
                try {
                    advanceRealm(false);
                    // Boss rewards save while the defeated boss realm is still
                    // current. Save again after the realm advance so a reload
                    // resumes in the realm the player actually reached.
                    if (typeof window.ftRecoverRealmAfterBoss === 'function') {
                        window.ftRecoverRealmAfterBoss();
                    }
                    saveGame();
                } catch (advanceErr) {
                    console.error("Boss realm advance failed, applying fallback:", advanceErr);
                    const idx = REALM_FLOW.findIndex(r => r.id === realmBeforeDefeat);
                    if (idx >= 0 && REALM_FLOW[idx + 1]) {
                        const reachedPlatformIndex = platforms.length
                            ? Math.max(...platforms.filter(p => p && Number.isFinite(p.index) && p.x <= player.worldX + Math.max(40, player.width || 40)).map(p => p.index), -1)
                            : -1;
                        currentRealm = REALM_FLOW[idx + 1].id;
                        realmProgress = 0;
                        targetProgress = REALM_FLOW[idx + 1].target || 0;
                        highestPlatformTouchedIndex = Math.max(highestPlatformTouchedIndex, reachedPlatformIndex);
                        if (REALM_FLOW[idx + 1].boss) startBoss(REALM_FLOW[idx + 1].boss);
                    }
                    updateUI();
                    if (typeof window.ftRecoverRealmAfterBoss === 'function') {
                        window.ftRecoverRealmAfterBoss();
                    }
                    saveGame();
                }
            } finally {
                bossDefeatInProgress = false;
            }
        }
