/* Faded Thread module: 05-world-generation-platforms.js | build 03 Oct 2026 */
function createPlatform(x, y, width, index) {
            platforms.push({ x, y, width, height: 25, index });
        }

        function createEnemy(x, y, type) {
            let hp = 1, speed = 1.5, width = 35, height = 35;
            const defs = {
                1:[1,2.5,35,35], 2:[1,3.5,35,35], 3:[2,1,35,35], 4:[2,2.2,42,42], 5:[3,1.3,48,48],
                6:[1,1.1,24,22], 7:[1,2.9,36,28], 8:[2,1.5,34,48],
                9:[3,1.4,46,56], 10:[4,1.1,54,64], 11:[2,3.2,42,42], 12:[3,2.4,45,45], 13:[3,2.9,76,28], 14:[6,0.8,80,90],
                15:[3,1.8,52,52], 16:[4,2.0,48,48], 17:[3,2.7,70,34], 18:[5,1.2,58,70], 19:[4,2.1,58,46], 20:[7,0.75,86,92], 21:[4,2.4,64,40], 22:[5,1.7,70,70], 23:[8,0.9,96,105],
                24:[4,2.2,58,58], 25:[5,1.6,82,46], 26:[6,1.1,72,88], 27:[7,2.0,66,66],
                28:[5,2.4,62,62], 29:[6,1.35,92,54], 30:[8,0.95,88,102],
                31:[6,2.8,72,60], 32:[9,1.05,100,110],
                33:[5,2.5,74,74], 34:[10,1.0,104,116],
                35:[7,2.3,76,76], 36:[8,1.9,88,62], 37:[11,0.9,110,120], 38:[9,2.2,86,86]
            };
            if (defs[type]) [hp, speed, width, height] = defs[type];
            enemies.push({ x, y, startX: x, startY: y, type, hp, speed, dir: -1, width, height, floatOffset: Math.random() * 100 });
        }

        function spawnHeal(x, y) {
            heals.push({ x, y, width: 20, height: 25, bounceOffset: Math.random() * 100 });
        }

        function shuffleMagicQueue() {
            // spawn at any level/realm, not just after endgame is unlocked.
            // bossOnly (e.g. Jesus Boots, which is a guaranteed exclusive reward
            // for defeating The First Stitch — see awardBossReward). Items that
            // are still eligible for the world pool but are also handed out as a
            // boss reward elsewhere get a heavy rarity penalty instead of a flat
            // exclusion, via weightForWorldDrop() / weightedWorldDropPick() below.
            //
            // Note: this just recomputes nextMagicPlatformIndex pacing now.
            // The actual candidate set is computed fresh on every spawn roll in
            // spawnMagicItem() (see eligibleWorldDropIds()) so that each roll is
            // an independent weighted draw — rare (boss-reward-flagged) items
            // stay rare on every single roll instead of being "used up" out of a
            // shuffled deck the first time they're drawn.
            nextMagicPlatformIndex = 4 + Math.floor(Math.random() * 5);
        }
        // (WORLD_BOSS_REWARD_EQUIPMENT_IDS) are heavily penalized so they have
        // only a WORLD_DROP_BOSS_RARITY_CHANCE (2%) relative likelihood of being
        // the one drawn compared to a standard item, on any given drop roll.
        function weightForWorldDrop(id) {
            return WORLD_BOSS_REWARD_EQUIPMENT_IDS.has(id) ? WORLD_DROP_BOSS_RARITY_CHANCE : 1;
        }

        // The set of item ids currently eligible to spawn from the global
        // "Anywhere Drops" pool: not yet owned, not bossOnly (fully excluded —
        // e.g. Jesus Boots), and not already sitting uncollected in the world
        // (so we don't flood the level with duplicates of the same item).
        function eligibleWorldDropIds() {
            const owned = player.collectedEquipment || [];
            const alreadyInWorld = new Set((magicItems || []).map(item => item.type));
            return MAGIC_ITEM_TYPES
                .filter(item => !owned.includes(item.id) && !BOSS_REWARD_EQUIPMENT_IDS.has(item.id) && !alreadyInWorld.has(item.id))
                .map(item => item.id);
        }

        // Independent weighted random pick across the full candidate pool — this
        // is what actually makes boss-reward-flagged items land at ~2% relative
        // frequency on every single roll, rather than merely being shuffled
        // toward the back of a without-replacement queue (which would still
        // guarantee them eventually, erasing the rarity effect over time).
        function weightedWorldDropPick(ids) {
            let totalWeight = 0;
            for (const id of ids) totalWeight += weightForWorldDrop(id);
            if (totalWeight <= 0) return ids[0];
            let r = Math.random() * totalWeight;
            for (const id of ids) {
                r -= weightForWorldDrop(id);
                if (r <= 0) return id;
            }
            return ids[ids.length - 1];
        }

        function spawnMagicItem(x, y) {
            const eligible = eligibleWorldDropIds();
            if (eligible.length === 0) return; // everything obtainable is owned or already in the world

            const type = weightedWorldDropPick(eligible);
            magicItems.push({ x, y, type, width: 28, height: 28, bounceOffset: Math.random() * 100 });
            nextMagicPlatformIndex += 10 + Math.floor(Math.random() * 12);
        }

        // Cosmetic-only spawning has been merged into spawnMagicItem — every
        // piece of equipment (30 former "magic" items + 13 former "cosmetic"
        // items) now spawns from one unified pool with both a gameplay effect
        // and a visual. cosmeticItems/applyCosmeticItem remain wired for
        // backward save compatibility but nothing spawns into that array anymore.

        function resetGame() {
            worldX = 0;
            score = 0;
            maxReachedX = 300;
            gameOver = false;
            realmProgress = 0;
            targetProgress = 24;
            currentRealm = "meadow";
            endgameUnlocked = false;
            endgameLoops = 0;
            highestPlatformTouchedIndex = 0;

            player.worldX = 100;
            player.worldY = window.innerHeight - 300;
            player.vx = 0;
            player.vy = 0;
            player.lives = 3;
            player.maxLives = 3;
            player.heartCharmCooldowns = {};
            player.guardChargeReady = true;
            player.maxSpeed = 5;
            player.flapForce = BASE_FLAP_FORCE;
            player.gravity = BASE_GRAVITY;
            player.attackBox = { width: 110, height: 110 };
            player.attackRange = 55; // synced again below by recalculateEquipmentEffects()
            player.invulnTimer = 0;
            player.flapAnim = 0;
            player.magicAura = null;
            player.wingStyle = "normal";
            player.slashStyle = "normal";
            player.collectedMagic = [];
            player.bossRewards = [];
            player.collectedCosmetics = [];
            player.collectedEquipment = [];
            player.equippedEquipment = [];
            player.soulFragments = 0;
            player.dashReady = true;
            player.slowMoTimer = 0;
            player.cosmetics = {};
            player.lastSafeX = 100;
            player.lastSafeY = window.innerHeight - 300;
            recalculateEquipmentEffects();
            setBgThemeIntensified(false);
            bossAttacks = [];

            boss.active = false;
            boss.hp = 5;
            boss.maxHp = 5;
            boss.kind = 'needle';
            boss.name = "THE NEEDLE'S EYE";
            boss.width = 40;
            boss.height = 160;
            boss.phase = 1;
            boss.state = 'hover';

            platforms = [];
            enemies = [];
            particles = [];
            heals = [];
            magicItems = [];
            cosmeticItems = [];
            shuffleMagicQueue();

            document.getElementById('game-over').style.display = 'none';
            updateUI();

            createPlatform(0, window.innerHeight - 250, 600, 0);
            createPlatform(750, window.innerHeight - 300, 400, 1);
            
            extendWorld(2000);
        }

        function updateUI() {
            document.getElementById('score').innerText = score;
            document.getElementById('lives').innerText = Number.isFinite(player.lives) ? Math.floor(player.lives) : 3;
            document.getElementById('progress').innerText = realmProgress;
            document.getElementById('target').innerText = boss.active ? "BOSS" : targetProgress;
            let data = realmData();
            let realmName = data.name || "Forgotten Meadow";
            let uiColor = "#cfe6d0";
            if (currentRealm === "hollow") uiColor = "#b9bbff";
            if (currentRealm === "sadness") uiColor = "#aabbd8";
            if (currentRealm === "hell") uiColor = "#ffaaaa";
            if (currentRealm === "space") uiColor = "#aaaaff";
            if (currentRealm === "storm") uiColor = "#aaffff";
            if (currentRealm === "void") uiColor = "#ddaaff";
            if (currentRealm === "fractured") uiColor = "#ffe0aa";
            if (currentRealm === "celestial") uiColor = "#fff1aa";
            if (currentRealm === "glassSanctum") uiColor = "#d2f5ff";
            if (currentRealm === "ashLibrary") uiColor = "#ffb58f";
            if (currentRealm === "cinderVeil") uiColor = "#ffc2ad";
            if (currentRealm === "silkGraveyard") uiColor = "#dddfff";
            if (currentRealm === "prismCourt") uiColor = "#ffb8ff";
            if (currentRealm === "echoForge") uiColor = "#ffc29a";
            if (currentRealm === "shadowBazaar") uiColor = "#b99aff";
            if (currentRealm === "auroraBridge") uiColor = "#aaffee";
            if (currentRealm === "marrowLabyrinth") uiColor = "#ffe3cf";
            if (currentRealm === "starlitReliquary") uiColor = "#fff6a8";
            const endlessData = ENDLESS_REALMS.find(r => r.id === currentRealm);
            if (endlessData) uiColor = endlessData.color;
            if (boss.active) realmName += " (BOSS)";
            document.getElementById('realm').innerText = realmName;
            document.getElementById('ui').style.color = uiColor;
        }

        function extendWorld(targetX) {

            while (maxReachedX < targetX) {
                let lastP = platforms[platforms.length - 1];
                let gap = 120 + Math.random() * 130;
                let nextX = lastP.x + lastP.width + gap;
                let heightChange = (Math.random() - 0.5) * 200;
                let nextY = Math.max(150, Math.min(canvas.height - 220, lastP.y + heightChange));
                let nextW = 200 + Math.random() * 250;
                let nextIndex = lastP.index + 1;
                
                createPlatform(nextX, nextY, nextW, nextIndex);

                if (Math.random() > 0.65) {
                    let enemyChoices = [1, 2, 3];
                    if (currentRealm === "meadow") enemyChoices = [6, 6, 1];
                    if (currentRealm === "hollow") enemyChoices = [7, 8, 2];
                    if (currentRealm === "storm") enemyChoices = [1, 2, 3, 4];
                    if (currentRealm === "void") enemyChoices = [2, 3, 4, 5];
                    if (currentRealm === "fractured") enemyChoices = [9, 10, 11];
                    if (currentRealm === "celestial") enemyChoices = [12, 13, 14];
                    if (currentRealm === "machineLoom") enemyChoices = [15, 16, 19, 20];
                    if (currentRealm === "garden") enemyChoices = [18, 19, 22, 23];
                    if (currentRealm === "ocean") enemyChoices = [13, 17, 21, 22];
                    if (currentRealm === "glassSanctum") enemyChoices = [16, 24, 25];
                    if (currentRealm === "ashLibrary") enemyChoices = [19, 24, 26];
                    if (currentRealm === "cinderVeil") enemyChoices = [19, 25, 26, 27];
                    if (currentRealm === "silkGraveyard") enemyChoices = [18, 25, 26, 27];
                    if (currentRealm === "prismCourt") enemyChoices = [24, 25, 26, 27];
                    if (currentRealm === "echoForge") enemyChoices = [28, 29, 30, 24, 26];
                    if (currentRealm === "neonOrchard") enemyChoices = [31, 24, 25, 28];
                    if (currentRealm === "clockworkAbyss") enemyChoices = [32, 30, 29, 20];
                    if (currentRealm === "glassCitadel") enemyChoices = [33, 24, 25, 16];
                    if (currentRealm === "bloodMoonCathedral") enemyChoices = [34, 31, 30, 23];
                    if (currentRealm === "shadowBazaar") enemyChoices = [35, 33, 29, 24];
                    if (currentRealm === "auroraBridge") enemyChoices = [36, 31, 25, 28];
                    if (currentRealm === "marrowLabyrinth") enemyChoices = [37, 34, 30, 23];
                    if (currentRealm === "starlitReliquary") enemyChoices = [38, 36, 33, 22];
                    const endlessData = ENDLESS_REALMS.find(r => r.id === currentRealm);
                    if (endlessData) enemyChoices = endlessData.enemies;
                    let randType = enemyChoices[Math.floor(Math.random() * enemyChoices.length)];
                    let enemyX = nextX + 50 + Math.random() * (nextW - 100);
                    let flyingTypes = [2, 4, 7, 11, 12, 13, 16, 17, 19, 21, 22, 24, 25, 27, 28, 29, 31, 33, 35, 36, 38];
                    let enemyY = flyingTypes.includes(randType) ? nextY - 140 : nextY - 35;
                    if ([5, 9, 10, 14, 18, 20, 23, 26, 30, 32, 34, 37].includes(randType)) enemyY = nextY - 75;
                    createEnemy(enemyX, enemyY, randType);
                }

                if (Math.random() < 0.15) {
                    spawnHeal(nextX + nextW / 2, nextY - 40);
                }

                if (eligibleWorldDropIds().length > 0 && nextIndex >= nextMagicPlatformIndex) {
                    let itemX = nextX + 35 + Math.random() * Math.max(20, nextW - 70);
                    spawnMagicItem(itemX, nextY - 70);
                }

                maxReachedX = nextX + nextW;
            }
        }

        // ── VISUAL HELPERS ──────────────────────────────────────────────
        function hexToRgb(hex) {
            let h = hex.replace('#', '');
            if (h.length === 3) h = h.split('').map(c => c + c).join('');
            const num = parseInt(h, 16);
            return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
        }
        function realmAccent() {
            if (currentRealm === "meadow")  return { r:160, g:230, b:170 };
            if (currentRealm === "hollow")  return { r:170, g:170, b:255 };
            if (currentRealm === "sadness") return { r:180, g:210, b:255 };
            if (currentRealm === "hell")    return { r:255, g:60,  b:20  };
            if (currentRealm === "space")   return { r:140, g:80,  b:255 };
            if (currentRealm === "storm")   return { r:80,  g:230, b:255 };
            if (currentRealm === "void")    return { r:210, g:110, b:255 };
            if (currentRealm === "fractured") return { r:255, g:200, b:120 };
            if (currentRealm === "celestial") return { r:255, g:240, b:140 };
            if (currentRealm === "machineLoom") return { r:170, g:184, b:255 };
            if (currentRealm === "garden") return { r:150, g:255, b:100 };
            if (currentRealm === "ocean") return { r:100, g:230, b:255 };
            if (currentRealm === "shadowBazaar") return { r:122, g:69, b:255 };
            if (currentRealm === "auroraBridge") return { r:118, g:255, b:216 };
            if (currentRealm === "marrowLabyrinth") return { r:255, g:227, b:207 };
            if (currentRealm === "starlitReliquary") return { r:255, g:246, b:168 };
            if (currentRealm === "glassSanctum") return { r:210, g:245, b:255 };
            if (currentRealm === "ashLibrary") return { r:255, g:150, b:95 };
            if (currentRealm === "cinderVeil") return { r:255, g:175, b:150 };
            if (currentRealm === "silkGraveyard") return { r:220, g:220, b:245 };
            if (currentRealm === "prismCourt") return { r:255, g:140, b:255 };
            if (currentRealm === "echoForge") return { r:255, g:180, b:110 };
            if (currentRealm === "neonOrchard") return { r:90, g:255, b:210 };
            if (currentRealm === "clockworkAbyss") return { r:255, g:200, b:92 };
            if (currentRealm === "glassCitadel") return { r:215, g:251, b:255 };
            if (currentRealm === "bloodMoonCathedral") return { r:255, g:45, b:85 };
            if (boss.active && BOSS_DEFS[boss.kind] && BOSS_DEFS[boss.kind].color) return hexToRgb(BOSS_DEFS[boss.kind].color);
            return { r:255, g:80, b:80 };
        }
        function accentHex() {
            let c = realmAccent(); return `rgb(${c.r},${c.g},${c.b})`;
        }
        function accentRgba(a) {
            let c = realmAccent(); return `rgba(${c.r},${c.g},${c.b},${a})`;
        }

        function drawClothPlatform(p, screenX) {
            ctx.save();
            let t = Date.now() * 0.001;

            // Glow underneath
            let glowGrad = ctx.createLinearGradient(screenX, p.y - 10, screenX, p.y + p.height + 20);
            glowGrad.addColorStop(0, accentRgba(0.18));
            glowGrad.addColorStop(1, accentRgba(0));
            ctx.fillStyle = glowGrad;
            ctx.fillRect(screenX - 10, p.y - 10, p.width + 20, p.height + 30);

            // Cloth body
            let bodyGrad = ctx.createLinearGradient(screenX, p.y, screenX, p.y + p.height + 18);
            if (currentRealm === "sadness") {
                bodyGrad.addColorStop(0, '#e8eeff');
                bodyGrad.addColorStop(1, '#c8d0e8');
            } else if (currentRealm === "hell") {
                bodyGrad.addColorStop(0, '#5a1a1a');
                bodyGrad.addColorStop(1, '#2a0808');
            } else if (currentRealm === "storm") {
                bodyGrad.addColorStop(0, '#12394a');
                bodyGrad.addColorStop(1, '#06141b');
            } else if (currentRealm === "void") {
                bodyGrad.addColorStop(0, '#2d123d');
                bodyGrad.addColorStop(1, '#0b0412');
            } else {
                bodyGrad.addColorStop(0, '#2a2040');
                bodyGrad.addColorStop(1, '#120e22');
            }

            ctx.beginPath();
            ctx.moveTo(screenX, p.y);
            for (let i = 0; i <= p.width; i += 12) {
                let jitter = Math.sin((p.x + i) * 0.04 + t * 0.5) * 3;
                ctx.lineTo(screenX + i, p.y + jitter);
            }
            ctx.lineTo(screenX + p.width, p.y + p.height);
            for (let i = p.width; i >= 0; i -= 12) {
                let hang = Math.cos((p.x + i) * 0.08 + t * 0.3) * 10 + 12;
                ctx.lineTo(screenX + i, p.y + hang);
            }
            ctx.closePath();
            ctx.fillStyle = bodyGrad;
            ctx.fill();

            // Glowing top edge
            ctx.shadowColor = accentHex();
            ctx.shadowBlur = 12;
            ctx.strokeStyle = accentRgba(0.7);
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(screenX, p.y);
            for (let i = 0; i <= p.width; i += 12) {
                let jitter = Math.sin((p.x + i) * 0.04 + t * 0.5) * 3;
                ctx.lineTo(screenX + i, p.y + jitter);
            }
            ctx.stroke();

            // Tiny hanging thread dots
            ctx.shadowBlur = 0;
            ctx.fillStyle = accentRgba(0.5);
            for (let i = 10; i < p.width; i += 30) {
                let hang = Math.cos((p.x + i) * 0.08 + t * 0.3) * 10 + 14;
                ctx.beginPath();
                ctx.arc(screenX + i, p.y + hang, 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
