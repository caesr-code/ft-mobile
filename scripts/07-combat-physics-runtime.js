/* Faded Thread module: 07-combat-physics-runtime.js | build 03 Oct 2026 */
function reapplyKeptUpgradeEffects(keptMagic, keptCosmetics) {
            player.collectedMagic = [...keptMagic];
            player.cosmetics = JSON.parse(JSON.stringify(keptCosmetics || {}));
            player.magicAura = keptMagic.length ? keptMagic[keptMagic.length - 1] : null;
            player.maxSpeed = 5.7;
            player.acceleration = 0.46;
            player.friction = 0.92;
            player.flapForce = BASE_FLAP_FORCE;
            player.gravity = BASE_GRAVITY;
            player.maxFallSpeed = 8;
            player.attackBox = { width: 110, height: 110 };
            player.wingStyle = "normal";
            player.slashStyle = "normal";
            for (const type of keptMagic) {
                if (type === "swift") {
                    player.maxSpeed += 1.6;
                    player.acceleration += 0.12;
                    player.friction = 0.95;
                } else if (type === "guard") {
                    player.maxFallSpeed = Math.max(6.2, player.maxFallSpeed - 1.5);
                    player.guardShield = true;
                } else if (type === "reach") {
                    player.attackBox.width += 55;
                    player.attackBox.height += 40;
                    player.reachSlash = true;
                } else if (type === "moon") {
                    player.wingStyle = "moon";
                    player.slashStyle = "moon";
                    player.attackBox.width += 35;
                    player.attackBox.height += 35;
                } else if (type === "mirror") {
                    player.attackBox.width += 20;
                } else if (type === "gear") {
                    player.maxSpeed += 0.8;
                    player.attackBox.height += 25;
                } else if (type === "thorn") {
                    player.attackBox.width += 45;
                    player.maxFallSpeed = Math.max(6.8, player.maxFallSpeed - 0.7);
                } else if (type === "tide") {
                    player.friction = Math.max(player.friction, 0.94);
                } else if (type === "rift") {
                    player.riftSlash = true; player.attackBox.width += 35;
                } else if (type === "clock") {
                    player.clockSlow = true;
                } else if (type === "bell") {
                    player.soulBell = true;
                } else if (type === "ribbon") {
                    player.skyDash = true; player.cosmetics.skyRibbon = true;
                } else if (type === "thorns") {
                    player.thornAura = true; player.attackBox.width += 25;
                }
            }
            // back-compat; recalculateEquipmentEffects is the primary path).
            player.attackRange = Math.max(player.attackBox.width, player.attackBox.height) / 2;
        }


        function equippedHeartBonus() {
            const bonuses = {
                ember: 2,
                starHalo: 1,
                crownShard: 1,
                prismHeart: 1
            };
            return (player.equippedEquipment || []).reduce((total, id) => total + (bonuses[id] || 0), 0);
        }

        function resetRespawnHealth() {
            player.lives = 3 + equippedHeartBonus();
            if (!Number.isFinite(player.lives)) player.lives = 3;
        }

        function respawnKeepingUpgrades(keepEndgameScore) {
            const keptEquipment = [...(player.collectedEquipment || [])];
            const keptEquipped = [...(player.equippedEquipment || [])];
            const keptRewards = [...(player.bossRewards || [])];
            const keptSoulFragments = player.soulFragments || 0;
            const keptScore = keepEndgameScore ? score : 0;
            const keptLoops = keepEndgameScore ? endgameLoops + 1 : endgameLoops;
            resetGame();
            score = keptScore;
            if (keepEndgameScore) {
                endgameUnlocked = true;
                endgameLoops = keptLoops;
                currentRealm = "sadness";
                targetProgress = realmData().target;
            }
            player.collectedEquipment = keptEquipment;
            player.equippedEquipment = keptEquipped.slice(0, EQUIPMENT_LIMIT);
            player.collectedMagic = [...keptEquipment];
            player.collectedCosmetics = [...keptEquipment];
            player.bossRewards = keptRewards;
            player.soulFragments = keptSoulFragments;
            recalculateEquipmentEffects();
            resetRespawnHealth();
            // player.lives reset handled by resetRespawnHealth();
            player.invulnTimer = (player.hollowMask ? 220 : 150) + (player.thimbleCapRespawnBonus || 0);
            gameOver = false;
            showMagicNotice({ name: keepEndgameScore ? "THREAD RESTART" : "THREAD REPAIRED", id: "threadRestart" });
            updateUI();
            saveGame();
        }


        function awardBossReward(kind) {
            player.bossRewards = player.bossRewards || [];
            const rewards = {
                needle: { name: "Needle Fragment", equipment: "starHalo" },
                weaver: { name: "Eternal Wing Core", equipment: "royalCape" },
                gearSaint: { name: "Crown of Hours", equipment: "clockEye" },
                thornMother: { name: "Thornheart Mantle", equipment: "crystalMantle" },
                drownedStar: { name: "Celestial Cloak", equipment: "cosmicCloak" },
                prismRegent: { name: "Prism Sigil", equipment: "goldenEye" },
                ashSeraph: { name: "Ashen Feather", equipment: "ash" },
                silkJudge: { name: "Judgement Seal", equipment: "silk" },
                hollowCrown: { name: "Crown Relic", equipment: "crownShard" },
                neonWarden: { name: "Neon Comet", equipment: "cometThread" },
                clockAbyss: { name: "Abyss Anchor", equipment: "anchorPearl" },
                shatteredChoir: { name: "Prism Heart", equipment: "prismHeart" },
                crimsonArchbishop: { name: "Cathedral Bell", equipment: "cathedralBell" },
                shadowMerchant: { name: "Merchant Coin", equipment: "shadowCoin" },
                auroraKnight: { name: "Aurora Pin", equipment: "auroraPin" },
                marrowQueen: { name: "Marrow Charm", equipment: "marrowCharm" },
                starlitRelic: { name: "Relic Star", equipment: "relicStar" },
                firstStitch: { name: "Infinite Thread", equipment: "threadCrown" }
            };
            const reward = rewards[kind] || rewards.needle;
            if (!player.bossRewards.includes(reward.name)) player.bossRewards.push(reward.name);
            collectEquipmentItem(reward.equipment, "boss");
            if (kind === "firstStitch") { endgameLoops++; score += 10000; }
            // first referenced, so the world drop pool's rarity filter (see
            // shuffleMagicQueue/spawnMagicItem) stays in sync with this table even
            // if awardBossReward's mapping is edited later.
            WORLD_BOSS_REWARD_EQUIPMENT_IDS.add(reward.equipment);
            showMagicNotice({ name: `${reward.name}: ${getEquipmentDef(reward.equipment).name}`, id: "bossReward" });
            // defeating The First Stitch. It is fully excluded from the global
            // "Anywhere Drops" pool (see BOSS_REWARD_EQUIPMENT_IDS /
            // shuffleMagicQueue) and can ONLY be obtained here.
            if (kind === "firstStitch" && !(player.collectedEquipment || []).includes("jesusBoots")) {
                collectEquipmentItem("jesusBoots", "boss");
                showMagicNotice({ name: "The First Stitch's Relic: Jesus Boots", id: "bossReward" });
            }

            saveGame();
        }

        function blockDamageWithEquipment(color) {
            if (player.guardShield && player.guardChargeReady) {
                player.guardChargeReady = false;
                player.invulnTimer = 90;
                addParticles(player.worldX - worldX, player.worldY, color || '#88ff99');
                return true;
            }
            if (player.crystalGuard && Math.random() < 0.25) {
                player.invulnTimer = 120;
                addParticles(player.worldX - worldX, player.worldY, '#a6f7ff');
                return true;
            }
            if (player.prismHeart && Math.random() < 0.18) {
                player.invulnTimer = 100;
                addParticles(player.worldX - worldX, player.worldY, '#d7fbff');
                return true;
            }
            return false;
        }

        function ftEnemyDisplayName(e) {
            if (!e) return 'an enemy';
            if (e.name) return e.name;
            const dbs = [
                (typeof SYSTEM_ENEMY_DATABASE_V27 !== 'undefined' ? SYSTEM_ENEMY_DATABASE_V27 : null),
                (typeof TRUE_V30_ENEMIES !== 'undefined' ? TRUE_V30_ENEMIES : null),
                (typeof V31_ENEMIES !== 'undefined' ? V31_ENEMIES : null),
                (typeof V32_ENEMIES !== 'undefined' ? V32_ENEMIES : null)
            ];
            for (const db of dbs) {
                const def = db && db[e.type];
                if (def && def.name) return def.name;
            }
            const legacyNames = {
                0:'Threadling',1:'Needle Crawler',2:'Hollow Chaser',3:'Spool Guard',4:'Moth Wisp',5:'Stitch Walker',6:'Ash Husk',7:'Drift Wisp',8:'Garden Crawler',9:'Thorn Walker',10:'Nightmare Husk',11:'Garden Stalker',12:'Floating Eye',13:'Thread Wraith',14:'Thorn Sentinel',15:'Loom Drone',16:'Machine Husk',17:'Clockwork Crawler',18:'Thorn Beast',19:'Loom Sentinel',20:'Machine Stalker',21:'Mirror Husk',22:'Garden Wraith',23:'Nightmare Sentinel',24:'Chasing Shade',25:'Flying Shade',26:'Patrol Husk',27:'Hunter Thread',28:'Pursuer',29:'Floating Hunter',30:'Heavy Patrol',31:'Void Husk',32:'Rift Crawler',33:'Thread Hunter',34:'Armoured Walker',35:'Echo Husk',36:'Glass Crawler',37:'Silk Stalker',38:'Frayed Husk'
            };
            return legacyNames[e.type] || `Enemy ${e.type}`;
        }

        function takePlayerDamage(color, sourceAttack) {
            // Glass Pendant: reflect the first projectile after landing — no damage taken
            if (player.glassPendant && player.glassPendantReady && sourceAttack && sourceAttack.kind === 'projectile') {
                player.glassPendantReady = false;
                // Fire the reflected projectile back toward the source direction
                const reflectVx = -(sourceAttack.vx || (player.facing * 4));
                const reflectVy = (sourceAttack.vy || 0) * -0.5;
                const rpx = player.worldX - worldX;
                const rpy = player.worldY;
                bossAttacks.push({
                    kind: 'projectile', x: rpx, y: rpy,
                    width: (sourceAttack.width || 10), height: (sourceAttack.height || 10),
                    vx: reflectVx * 1.4, vy: reflectVy,
                    color: '#d7fbff', isReflected: true, life: 80
                });
                addParticles(rpx, rpy, '#d7fbff');
                player.invulnTimer = 25; // brief window so the reflected shot doesn't re-hit the player
                return;
            }
            if (blockDamageWithEquipment(color)) return;
            player.lives--;
            // Thimble Cap: shorten post-hit invuln cooldown (makes the player vulnerable again sooner but avoids long stun)
            const baseInvuln = (player.clockSlow || player.clockEye) ? 180 : 120;
            player.invulnTimer = Math.max(40, baseInvuln - (player.thimbleCapCooldownReduction || 0));
            playPlayerHurtSound();
            checkHeartCharmBreaks();
            updateUI();
            if (player.lives <= 0) triggerDeathScreen(sourceAttack?.deathCause || (sourceAttack ? ((boss && boss.active) ? `${BOSS_TYPES[boss.kind]?.name || 'The boss'} attack` : 'a projectile') : ((boss && boss.active) ? (BOSS_TYPES[boss.kind]?.name || 'the boss') : 'an enemy')));
        }

        // Performance: all generated platforms stay permanently stored so the
        // player can backtrack across the entire run, but off-screen platforms are
        // dormant. A lightweight spatial chunk index wakes only platforms close to
        // the player/camera instead of scanning the full platform history.
        //
        // The index is incremental: newly generated platforms are indexed once.
        // If a save/load/reset replaces the platforms array, it rebuilds lazily on
        // the next query. Platform width effects only shrink platforms, so stale
        // extra chunk membership is harmless and never hides a platform.
        const FT_PLATFORM_CHUNK_SIZE = 1024;
        let ftPlatformChunkSource = null;
        let ftPlatformChunkIndexedLength = 0;
        let ftPlatformChunks = new Map();

        function ftResetPlatformChunks() {
            ftPlatformChunkSource = platforms;
            ftPlatformChunkIndexedLength = 0;
            ftPlatformChunks = new Map();
        }

        function ftIndexPlatformIntoChunks(p) {
            if (!p || !Number.isFinite(p.x) || !Number.isFinite(p.width)) return;
            const first = Math.floor(p.x / FT_PLATFORM_CHUNK_SIZE);
            const last = Math.floor((p.x + Math.max(0, p.width)) / FT_PLATFORM_CHUNK_SIZE);
            for (let c = first; c <= last; c++) {
                let bucket = ftPlatformChunks.get(c);
                if (!bucket) ftPlatformChunks.set(c, bucket = []);
                bucket.push(p);
            }
        }

        function ftEnsurePlatformChunks() {
            const list = Array.isArray(platforms) ? platforms : [];
            if (ftPlatformChunkSource !== list || ftPlatformChunkIndexedLength > list.length) {
                ftResetPlatformChunks();
            }
            while (ftPlatformChunkIndexedLength < list.length) {
                ftIndexPlatformIntoChunks(list[ftPlatformChunkIndexedLength++]);
            }
        }

        function ftPlatformRange(minX, maxX) {
            if (maxX < minX) { const swap = minX; minX = maxX; maxX = swap; }
            ftEnsurePlatformChunks();
            const first = Math.floor(minX / FT_PLATFORM_CHUNK_SIZE);
            const last = Math.floor(maxX / FT_PLATFORM_CHUNK_SIZE);
            const out = [];
            const seen = new Set();
            for (let c = first; c <= last; c++) {
                const bucket = ftPlatformChunks.get(c);
                if (!bucket) continue;
                for (const q of bucket) {
                    if (!q || seen.has(q)) continue;
                    seen.add(q);
                    if (q.x <= maxX && q.x + q.width >= minX) out.push(q);
                }
            }
            return out;
        }

        // Realm progression / transition systems sometimes need platforms by
        // global platform index rather than by position. This avoids filter()+
        // sort() over the entire run every frame.
        function ftPlatformsAfterIndex(beforeIndex, limit = Infinity) {
            const list = Array.isArray(platforms) ? platforms : [];
            let lo = 0, hi = list.length;
            while (lo < hi) {
                const mid = (lo + hi) >> 1;
                const idx = Number.isFinite(list[mid] && list[mid].index) ? list[mid].index : -Infinity;
                if (idx <= beforeIndex) lo = mid + 1; else hi = mid;
            }
            const out = [];
            for (let i = lo; i < list.length && out.length < limit; i++) {
                const p = list[i];
                if (!p || p.hidden || !Number.isFinite(p.index) || p.index < 0 || p.index <= beforeIndex) continue;
                out.push(p);
            }
            return out;
        }

        function update() {
            if (equipmentMenuOpen) return;
            if (endingScreenOpen) return;
            if (gameOver) return;

            if (player.invulnTimer > 0) player.invulnTimer--;
            if (player.flapAnim > 0) player.flapAnim--;

            const movementSpeedCap = window.ftDashBurstActive
                ? Math.max(player.maxSpeed, window.ftDashBurstCap || player.maxSpeed)
                : player.maxSpeed;
            if (keys['a'] || keys['arrowleft']) {
                    player.vx -= player.acceleration;
                    if (player.vx < -movementSpeedCap) player.vx = -movementSpeedCap;
                    player.facing = -1;
                } else if (keys['d'] || keys['arrowright']) {
                    player.vx += player.acceleration;
                    if (player.vx > movementSpeedCap) player.vx = movementSpeedCap;
                    player.facing = 1;
                } else if (!window.ftDashBurstActive) {
                    player.vx *= player.friction;
                    if (Math.abs(player.vx) < 0.05) player.vx = 0;
                }
                player.worldX += player.vx;

            player.vy += player.gravity;
            if (player.vy > player.maxFallSpeed) player.vy = player.maxFallSpeed;
            player.worldY += player.vy;

            if (player.worldY - player.height/2 < 0) {
                player.worldY = player.height/2;
                player.vy = 0;
            }

            let floorLevel = canvas.height - 40;

            const nearbyPlatforms = ftPlatformRange(
                player.worldX - player.width / 2 - 80,
                player.worldX + player.width / 2 + 80
            );
            for (let p of nearbyPlatforms) {
                if (player.worldX + player.width/2 > p.x && 
                    player.worldX - player.width/2 < p.x + p.width) {
                    
                    if (player.worldY + player.height/2 >= p.y && 
                        player.worldY - player.height/2 < p.y && 
                        player.vy >= 0) {
                        player.worldY = p.y - player.height/2;
                        player.vy = 0;
                        player.dashReady = true;
                        player.guardChargeReady = true;
                        // Glass Pendant: arm the reflect on every clean landing
                        if (player.glassPendant) player.glassPendantReady = true;
                        
                        player.lastSafeX = player.worldX;
                        player.lastSafeY = p.y - player.height/2;
                    }

                    if (!boss.active && targetProgress > 0 && p.index > highestPlatformTouchedIndex) {
                        highestPlatformTouchedIndex = p.index;
                        realmProgress++;
                        score += 50;

                        if (realmProgress >= targetProgress) {
                            advanceRealm(false);
                        } else {
                            updateUI();
                        }
                    }
                }
            }

            if (player.jesusBoots && player.worldY + player.height/2 >= floorLevel) {
                player.worldY = floorLevel - player.height/2;
                player.vy = 0;
                player.dashReady = true;
                player.guardChargeReady = true;
                player.lastSafeX = player.worldX;
                player.lastSafeY = floorLevel - player.height/2;
            } else if (player.worldY + player.height/2 >= floorLevel) {
                player.worldX = player.lastSafeX;
                player.worldY = player.lastSafeY - 40;
                player.vx = 0; 
                player.vy = 0;
                player.lives--;
                player.invulnTimer = 120;
                checkHeartCharmBreaks();
                updateUI();
                addParticles(player.worldX - worldX, player.worldY, '#ffffff');
                if (player.lives <= 0) {
                    triggerDeathScreen('the abyss');
                }
            }

            if (player.isAttacking) {
                player.attackTimer--;
                if (player.attackTimer <= 0) player.isAttacking = false;
            }

            if (!boss.active) {
                worldX = player.worldX - canvas.width / 2;
                extendWorld(player.worldX + canvas.width + 500);
            } else {
                // During boss: scroll normally and keep extending platforms
                worldX = player.worldX - canvas.width / 2;
                extendWorld(player.worldX + canvas.width + 500);
            }

            for (let i = heals.length - 1; i >= 0; i--) {
                let h = heals[i];
                if (Math.abs(player.worldX - h.x) < player.width && Math.abs(player.worldY - h.y) < player.height) {
                    healPlayer(player.sunSpool ? 2 : 1); 
                    addParticles(h.x - worldX, h.y, '#22cc88');
                    playPickupChime(1);
                    heals.splice(i, 1);
                    updateUI();
                }
            }

            for (let i = magicItems.length - 1; i >= 0; i--) {
                let item = magicItems[i];
                if ((player.collectedEquipment || []).includes(item.type)) { magicItems.splice(i, 1); continue; }
                if (Math.abs(player.worldX - item.x) < player.width && Math.abs(player.worldY - item.y) < player.height) {
                    applyMagicItem(item.type);
                    magicItems.splice(i, 1);
                }
            }

            for (let i = cosmeticItems.length - 1; i >= 0; i--) {
                let item = cosmeticItems[i];
                if ((player.collectedEquipment || []).includes(item.type)) { cosmeticItems.splice(i, 1); continue; }
                if (Math.abs(player.worldX - item.x) < player.width && Math.abs(player.worldY - item.y) < player.height) {
                    applyCosmeticItem(item.type);
                    cosmeticItems.splice(i, 1);
                }
            }

            if (boss.active) {
                if (boss.state === 'hover') {
                    boss.targetY = player.worldY - boss.height/4;
                    boss.y += (boss.targetY - boss.y) * 0.04;
                    let idealX = worldX + canvas.width - 150;
                    boss.x += (idealX - boss.x) * 0.05;
                    
                    boss.timer++;
                    if (boss.timer > 220) {
                        boss.state = 'charge';
                        boss.timer = 0;
                    }
                } else if (boss.state === 'charge') {
                    boss.x -= 7; 
                    if (boss.x < worldX - 100) {
                        boss.state = 'return';
                    }
                } else if (boss.state === 'return') {
                    let returnX = worldX + canvas.width + 200;
                    boss.x += 4;
                    if (boss.x >= returnX) {
                        boss.state = 'hover';
                    }
                }

                // ── v28: boss action system tick ───────────────────────────
                // Independent of the hover/charge/return movement above:
                // counts down a cooldown, then telegraphs (visual+audio
                // wind-up) before actually spawning the chosen action's
                // attack entities. Action pool size follows the progressive
                // unlock curve; advanced post-game bosses pull from their
                // phases-derived action list instead.
                {
                    const advancedDef = ADVANCED_ENDGAME_BOSSES_V27 && ADVANCED_ENDGAME_BOSSES_V27[boss.kind];
                    const actionList = advancedDef
                        ? (advancedDef._mixedActions || (advancedDef._mixedActions = buildAdvancedActionsFromPhases(advancedDef)))
                        : BOSS_ACTIONS[boss.kind];
                    const unlockedCount = advancedDef ? 5 : (BOSS_ACTIONS_UNLOCKED_COUNT[boss.kind] || 0);

                    if (actionList && unlockedCount > 0) {
                        if (boss.telegraphTimer > 0) {
                            boss.telegraphTimer -= (1000 / 60);
                            if (boss.telegraphTimer <= 0 && boss.pendingActionIndex >= 0) {
                                const action = actionList[boss.pendingActionIndex];
                                if (action) action.spawn(boss);
                                boss.pendingActionIndex = -1;
                                boss.actionCooldown = 130 + Math.floor(Math.random() * 60);
                            }
                        } else if (boss.actionCooldown > 0) {
                            boss.actionCooldown--;
                        } else {
                            const idx = Math.floor(Math.random() * Math.min(unlockedCount, actionList.length));
                            const action = actionList[idx];
                            if (action) {
                                boss.pendingActionIndex = idx;
                                boss.telegraphTimer = action.telegraph;
                                playTelegraphSound();
                            } else {
                                boss.actionCooldown = 90;
                            }
                        }
                    }
                }

                // Hit processing using directional bounds
                if (player.isAttacking && player.attackTimer === 14) {
                    if (checkAttackCollision(boss.x, boss.y, boss.width, boss.height)) {
                        tryPogoBounce(boss.x, boss.y, boss.width, boss.height);

                        // Gilded Needle: every 3rd boss hit deals +1 bonus damage
                        let bossDmg = player.riftSlash ? 2 : 1;
                        if (player.gildedNeedle) {
                            player.gildedNeedleHits = (player.gildedNeedleHits || 0) + 1;
                            if (player.gildedNeedleHits % 3 === 0) {
                                bossDmg += 1;
                                addParticles(boss.x - worldX, player.worldY, '#ffd66e');
                            }
                        }

                        // Vampiric Eye: boss hit counts as 2 kill charges
                        if (player.vampiricEye) {
                            player.vampiricKillCharge = (player.vampiricKillCharge || 0) + 2;
                            if (player.vampiricKillCharge >= 8) {
                                player.vampiricKillCharge = 0;
                                healPlayer(1);
                                showMagicNotice({ name: "Vampiric Eye: Drain Heal", id: "vampHeal" });
                            }
                        }

                        boss.hp -= bossDmg;
                        addParticles(boss.x - worldX, player.worldY, player.riftSlash ? '#b46bff' : '#ff3333');
                        playBossHitSound();
                        if (boss.hp <= 0) {
                            finishBossDefeat(boss.kind);
                        }
                    }
                }

                if (player.invulnTimer === 0 &&
                    player.worldX < boss.x + boss.width && player.worldX + player.width > boss.x &&
                    player.worldY < boss.y + boss.height && player.worldY + player.height > boss.y) {
                    
                    takePlayerDamage('#88ff99', {deathCause: boss.name || (BOSS_TYPES[boss.kind]?.name) || 'the boss'});
                }
            }

            // ── v28: boss action entities — movement, growth, lifetime, and
            // player collision. Runs whenever entries exist so in-flight
            // attacks resolve cleanly even in the single frame a fight ends.
            //
            // IMPORTANT: takePlayerDamage() can, on lethal hits, cascade into
            // respawnKeepingUpgrades() -> resetGame(), which reassigns the
            // *global* bossAttacks binding to a brand-new array. If that
            // happens mid-loop, continuing to index the old snapshot would
            // either operate on stale/discarded entities or (if we re-read
            // the global each time) silently shift onto the new empty array
            // and read past its bounds. We snapshot the array reference once
            // and bail out of the whole loop the instant a reset is detected.
            const liveBossAttacks = bossAttacks;
            for (let i = liveBossAttacks.length - 1; i >= 0; i--) {
                if (bossAttacks !== liveBossAttacks) break; // a reset swapped the array out from under us
                const a = liveBossAttacks[i];
                if (!a) continue;
                a.life--;
                if (a.kind === 'projectile') {
                    a.x += a.vx || 0;
                    a.y += a.vy || 0;
                    if (a.spin !== undefined) a.spin += 0.12;
                } else if (a.kind === 'hazard' && a.shape === 'ring') {
                    a._t = (a._t || 0) + 1;
                    a.radius = Math.min(a.maxRadius || 100, (a._t / Math.max(1, a.growTime)) * (a.maxRadius || 100));
                } else if (a.kind === 'hazard') {
                    a._t = (a._t || 0) + 1;
                    a.growFactor = Math.min(1, a._t / Math.max(1, a.growTime));
                }

                if (a.life <= 0) { liveBossAttacks.splice(i, 1); continue; }

                // Player collision — boss attacks bypass the boss-contact
                // damage path above and use takePlayerDamage directly so
                // they respect the same invuln/equipment-block rules.
                if (player.invulnTimer === 0) {
                    // Warp Spool: phase through all projectiles during the post-dash window
                    if (player.warpPhaseTimer > 0 && a.kind === 'projectile') {
                        // skip — player is phasing
                    } else {
                    const px = player.worldX - worldX, py = player.worldY;
                    let hit = false;
                    if (a.kind === 'hazard' && a.shape === 'ring') {
                        const dx = px - a.x, dy = py - a.y;
                        const r = a.radius || 0;
                        hit = r > 4 && Math.hypot(dx, dy) < r && Math.hypot(dx, dy) > Math.max(0, r - 22);
                    } else if (a.kind === 'hazard') {
                        const gf = a.growFactor !== undefined ? a.growFactor : 1;
                        const w = a.width * gf, h = a.height * gf;
                        hit = px + player.width / 2 > a.x - w / 2 && px - player.width / 2 < a.x + w / 2 &&
                              py + player.height / 2 > a.y - h / 2 && py - player.height / 2 < a.y + h / 2;
                    } else {
                        // projectile or beam — simple centered AABB
                        hit = px + player.width / 2 > a.x - a.width / 2 && px - player.width / 2 < a.x + a.width / 2 &&
                              py + player.height / 2 > a.y - a.height / 2 && py - player.height / 2 < a.y + a.height / 2;
                    }
                    if (hit) {
                        takePlayerDamage(a.color || '#ff3333', a);
                        if (bossAttacks !== liveBossAttacks) break; // takePlayerDamage triggered a reset
                        addParticles(px, py, a.color || '#ff3333');
                        if (a.kind === 'projectile') { liveBossAttacks.splice(i, 1); continue; }
                    }
                    } // end warpSpool else
                }
                // Check reflected projectile lifetime and enemy collisions
                if (a.isReflected) {
                    a.life = (a.life || 1) - 1;
                    if (a.life <= 0) { liveBossAttacks.splice(i, 1); continue; }
                    for (let ei = enemies.length - 1; ei >= 0; ei--) {
                        const e = enemies[ei];
                        const esx = e.x - worldX;
                        if (a.x + a.width / 2 > esx && a.x - a.width / 2 < esx + e.width &&
                            a.y + a.height / 2 > e.y && a.y - a.height / 2 < e.y + e.height) {
                            damageEnemy(ei, 2);
                            liveBossAttacks.splice(i, 1);
                            addParticles(a.x, a.y, '#d7fbff');
                            break;
                        }
                    }
                }
            }

            // ── Monarch Cloak: afterimage damages enemies and briefly slows projectors ──
            if (player.monarchCloak && player.monarchAfterimages && player.monarchAfterimages.length > 0) {
                for (const img of player.monarchAfterimages) {
                    // Damage enemies in contact with afterimage position
                    for (let ei = enemies.length - 1; ei >= 0; ei--) {
                        const e = enemies[ei];
                        if (e && Number.isFinite(e.x) && Math.abs(e.x - player.worldX) > Math.max(canvas.width || 960, 480) + 1400) continue;
                        if (Math.abs(img.wx - (e.x + e.width/2)) < 40 && Math.abs(img.wy - (e.y + e.height/2)) < 40) {
                            if (!img._hitEnemies) img._hitEnemies = new Set();
                            if (!img._hitEnemies.has(ei)) {
                                img._hitEnemies.add(ei);
                                e.hp -= 1;
                                addParticles(img.wx - worldX, img.wy, '#d74488');
                                // Slow projector-type enemies
                                if ((e.behaviorFlags || []).includes("projector")) {
                                    e._projectorSlow = 90; // frames of slow
                                }
                                if (e.hp <= 0) {
                                    onEnemyKilled(ei);
                                    enemies.splice(ei, 1);
                                    score += 100; updateUI();
                                }
                            }
                        }
                    }
                }
            }

            for (let i = enemies.length - 1; i >= 0; i--) {
                let e = enemies[i];
                // Enemies generated far ahead stay stored but dormant. This avoids
                // deleting future encounters while also preventing their AI from
                // consuming frame time before the player can possibly meet them.
                if (e && Number.isFinite(e.x) && Math.abs(e.x - player.worldX) > Math.max(canvas.width || 960, 480) + 1400) continue;
                // Tick monarch cloak projector slow
                if (e._projectorSlow > 0) e._projectorSlow--;
                const effectiveSpeed = (e._projectorSlow > 0) ? e.speed * 0.3 : e.speed;
                if (e.type === 2 || e.type === 11 || e.type === 12 || e.type === 24 || e.type === 27 || e.type === 28 || e.type === 33) {
                    if (player.worldX < e.x) e.x -= effectiveSpeed; else e.x += effectiveSpeed;
                    if (e.type === 12) e.y = e.startY + Math.sin(Date.now() * 0.005 + e.floatOffset) * 45;
                    clampEnemyToPlatform(e);
                } else if (e.type === 4 || e.type === 7 || e.type === 13 || e.type === 25 || e.type === 29) {
                    e.x += effectiveSpeed * e.dir;
                    e.y = e.startY + Math.sin(Date.now() * 0.006 + e.floatOffset) * 55;
                    if (Math.abs(e.x - e.startX) > 190) e.dir *= -1;
                } else if (e.type === 5 || e.type === 8 || e.type === 9 || e.type === 10 || e.type === 14 || e.type === 26 || e.type === 30 || e.type === 34) {
                    e.x += effectiveSpeed * e.dir;
                    if (Math.abs(e.x - e.startX) > (e.type === 14 ? 70 : 100)) e.dir *= -1;
                    clampEnemyToPlatform(e);
                } else {
                    e.x += effectiveSpeed * e.dir;
                    if (Math.abs(e.x - e.startX) > 160) e.dir *= -1;
                    clampEnemyToPlatform(e);
                }

                // Process enemy kills using the custom directional boundaries calculation
                if (player.isAttacking && player.attackTimer >= 14) {
                    if (checkAttackCollision(e.x, e.y, e.width, e.height)) {
                        // Shear Gauntlets: pierce shielded_front enemies on horizontal slash
                        const isShielded = (e.behaviorFlags || []).includes("shielded_front");
                        const skipShield = player.shearGauntlets && player.attackDir === "horizontal" && isShielded;
                        if (!isShielded || skipShield) {
                            tryPogoBounce(e.x, e.y, e.width, e.height);
                            // Shear Gauntlets: pogo downward slash deals +1 bonus damage
                            const pogoBonus = (player.shearGauntlets && player.attackDir === "down") ? 1 : 0;
                            // Gilded Needle: every 3rd boss hit +1 (tracked separately at boss site)
                            const dmg = (player.riftSlash ? 2 : 1) + pogoBonus;
                            e.hp -= dmg;
                            addParticles(e.x + e.width/2 - worldX, e.y + e.height/2, player.riftSlash ? '#b46bff' : '#444444');

                            // Serrated Blade: apply bleed on hit
                            if (player.serratedBlade) {
                                if (e._bleedId === undefined) e._bleedId = Math.random();
                                player.bleedTargets = player.bleedTargets || new Map();
                                player.bleedTargets.set(e._bleedId, { timer: 90 }); // fires after 1.5 s
                            }

                            // Echo Crest: queue a delayed echo slash at the hit position
                            if (player.echoCrest) {
                                player.echoSlashQueue = player.echoSlashQueue || [];
                                player.echoSlashQueue.push({ wx: e.x + e.width / 2, wy: e.y + e.height / 2, delay: 18 });
                            }

                            if (e.hp <= 0) {
                                onEnemyKilled(i);
                                if (player.soulBell && Math.random() < 0.45) {
                                    player.soulFragments = (player.soulFragments || 0) + 1;
                                    if (player.soulFragments >= (player.voidBell ? 7 : 10)) { player.soulFragments = 0; healPlayer(player.sunSpool ? 2 : 1); showMagicNotice({ name: "Soul Bell Life", id: "soulLife" }); }
                                }
                                enemies.splice(i, 1); score += player.shadowCoin ? 175 : (player.ashFeather ? 150 : (player.scoreBoost ? 125 : 100));
                                if (player.cathedralBell) {
                                    player.cathedralKills = (player.cathedralKills || 0) + 1;
                                    if (player.cathedralKills >= 25) { player.cathedralKills = 0; healPlayer(1); showMagicNotice({ name: "Cathedral Bell Heal", id: "cathedralBell" }); }
                                }
                                updateUI(); continue;
                            }
                        }
                    }
                }
                // from the existing attack-driven tryPogoBounce() above — it fires
                // purely from passive AABB contact while falling, with no attack
                // input required, and only when Needle Boots are equipped.
                //
                // Conditions, all required:
                //   1) player is falling (vy > 0)
                //   2) the bottom edge of the player's AABB touches the top edge
                //      of the enemy's AABB (i.e. a standard "stomp" contact)
                //   3) "Needle Boots" are equipped (player.needleBoots)
                // On success: bounce upward, clear flap/dash limitations, and deal
                // 1.5x scaled puncture damage to the enemy instead of the player
                // taking damage. If any condition fails, fall through to the
                // standard player-takes-damage AABB check below.
                const playerLeft = player.worldX - player.width / 2;
                const playerRight = player.worldX + player.width / 2;
                const playerTop = player.worldY - player.height / 2;
                const playerBottomEdge = player.worldY + player.height / 2;
                const enemyLeft = e.x;
                const enemyRight = e.x + e.width;
                const enemyTop = e.y;
                const enemyBottom = e.y + e.height;

                const aabbOverlap = playerRight > enemyLeft && playerLeft < enemyRight &&
                                     playerBottomEdge > enemyTop && playerTop < enemyBottom;
                // "Bottom of player touches top of enemy": allow a small forgiving
                // tolerance band so the bounce reliably triggers on a falling stomp
                // rather than requiring pixel-perfect alignment.
                const bottomMeetsTop = playerBottomEdge >= enemyTop && playerBottomEdge <= enemyTop + 18;

                let autoPogoTriggered = false;
                if (player.invulnTimer === 0 && player.vy > 0 && player.needleBoots && aabbOverlap && bottomMeetsTop) {
                    autoPogoTriggered = true;

                    // Upward bounce — reset any horizontal/vertical "flap" limitations
                    // so the player can immediately flap/dash again after bouncing.
                    player.vy = -6.5;
                    player.flapAnim = 18;
                    jumpKeyReleased = true;
                    player.dashReady = true;
                    player.guardChargeReady = true;

                    // 1.5x scaling attack damage dealt as puncture damage, independent
                    // of whether the player was mid-attack.
                    const puncturePerHit = (player.riftSlash ? 2 : 1) * 1.5;
                    e.hp -= puncturePerHit;
                    addParticles(e.x + e.width/2 - worldX, e.y, '#c9ffd8');
                    playNeedlePuncture();

                    if (e.hp <= 0) {
                        onEnemyKilled(i);
                        if (player.soulBell && Math.random() < 0.45) {
                            player.soulFragments = (player.soulFragments || 0) + 1;
                            if (player.soulFragments >= (player.voidBell ? 7 : 10)) { player.soulFragments = 0; healPlayer(player.sunSpool ? 2 : 1); showMagicNotice({ name: "Soul Bell Life", id: "soulLife" }); }
                        }
                        enemies.splice(i, 1); score += player.shadowCoin ? 175 : (player.ashFeather ? 150 : (player.scoreBoost ? 125 : 100));
                        if (player.cathedralBell) {
                            player.cathedralKills = (player.cathedralKills || 0) + 1;
                            if (player.cathedralKills >= 25) { player.cathedralKills = 0; healPlayer(1); showMagicNotice({ name: "Cathedral Bell Heal", id: "cathedralBell" }); }
                        }
                        updateUI(); continue;
                    }
                }

                if (!autoPogoTriggered && player.invulnTimer === 0 &&
                    Math.abs(player.worldX - (e.x + e.width/2)) < (player.width/2 + e.width/2) &&
                    Math.abs(player.worldY - (e.y + e.height/2)) < (player.height/2 + e.height/2)) {
                    if (player.thornAura) {
                        e.hp -= 1;
                        addParticles(e.x + e.width/2 - worldX, e.y + e.height/2, '#9cff6e');
                        if (e.hp <= 0) { enemies.splice(i, 1); score += 100; updateUI(); continue; }
                    }
                    takePlayerDamage('#88ff99', {deathCause: ftEnemyDisplayName(e)});
                }
            }

            // Keep every generated platform for the entire run. Platforms define
            // the permanent route through all completed realms, so deleting old
            // platforms made long-distance backtracking impossible. Temporary
            // combat entities can still be retired behind the camera to keep the
            // update loop lightweight.
            // Late-run cleanup must NOT allocate four replacement arrays every frame.
            // That caused steady garbage-collector pressure once a run passed 30 platforms,
            // which is why FPS could suddenly collapse around Prism Court and remain bad in
            // every realm afterwards. Retire old transient entities in-place once per second.
            window.ftTransientCleanupFrame = (window.ftTransientCleanupFrame || 0) + 1;
            if (platforms.length > 30 && window.ftTransientCleanupFrame >= 60) {
                window.ftTransientCleanupFrame = 0;
                const retireBehind = (list) => {
                    for (let j = list.length - 1; j >= 0; j--) {
                        const entity = list[j];
                        if (!entity || entity.x - worldX <= -1200) list.splice(j, 1);
                    }
                };
                // Preserve enemies and pickups for true backtracking. Their AI and
                // rendering are dormant outside the active zone instead of deleting them.
            }

            for(let i = particles.length - 1; i >= 0; i--) {
                let p = particles[i]; p.x += p.vx; p.y += p.vy; p.alpha -= 0.02;
                if(p.alpha <= 0) particles.splice(i, 1);
            }
        }
