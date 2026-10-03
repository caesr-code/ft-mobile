/* Faded Thread module: 02-world-realm-player-data.js | build 03 Oct 2026 */
// Game State Variables
        let worldX = 0; 
        let score = 0;
        let gameOver = false;
        let maxReachedX = 0;
        let realmFlash = 0; // flash effect on realm transition

        // Progression Mechanics
        let currentRealm = "meadow"; // meadow, hollow, sadness, hell, space, storm, void, boss1, fractured, celestial, boss2, boss3
        let realmProgress = 0;
        let targetProgress = 24;
        let endgameUnlocked = false;
        let endgameLoops = 0;
        let endlessRealmPointer = 0;
        const BASE_FLAP_FORCE = -8.2;
        const BASE_GRAVITY = 0.35;
        const ENDLESS_REALMS = [
            { id: "corruptedHeaven", name: "Corrupted Heaven", target: 72, enemies: [11, 12, 14, 16], color: "#ffd6ff" },
            { id: "crystalWastes", name: "Crystal Wastes", target: 76, enemies: [9, 12, 13, 17], color: "#bdf7ff" },
            { id: "nightmareGarden", name: "Nightmare Garden", target: 80, enemies: [8, 10, 11, 14, 18], color: "#d8ff9d" },
            { id: "machineLoom", name: "Machine Loom", target: 84, enemies: [15, 16, 19, 20], color: "#d4d4ff" },
            { id: "endlessOcean", name: "Endless Ocean", target: 88, enemies: [13, 17, 18, 21], color: "#9de8ff" }
        ];
        const REALM_FLOW = [
            { id: "meadow", name: "Forgotten Meadow", target: 24 },
            { id: "hollow", name: "Echoing Hollow", target: 28 },
            { id: "sadness", name: "Faded Sadness", target: 30 },
            { id: "hell", name: "Crimson Mourning", target: 50 },
            { id: "space", name: "Cosmic Desolation", target: 70 },
            { id: "storm", name: "Threadstorm Spire", target: 55 },
            { id: "void", name: "The Hollow Loom", target: 60 },
            { id: "boss1", name: "The Needle's Eye", boss: "needle" },
            { id: "fractured", name: "Fractured Eternity", target: 65, endgame: true },
            { id: "celestial", name: "Celestial Loom", target: 75, endgame: true },
            { id: "boss2", name: "The Weaver King", boss: "weaver", endgame: true },
            { id: "machineLoom", name: "Machine Loom", target: 72, endgame: true },
            { id: "boss4", name: "The Gear Saint", boss: "gearSaint", endgame: true },
            { id: "garden", name: "Nightmare Garden", target: 78, endgame: true },
            { id: "boss5", name: "The Thorn Mother", boss: "thornMother", endgame: true },
            { id: "ocean", name: "Endless Ocean", target: 82, endgame: true },
            { id: "boss6", name: "The Drowned Star", boss: "drownedStar", endgame: true },
            { id: "glassSanctum", name: "Glass Sanctum", target: 86, endgame: true },
            { id: "ashLibrary", name: "Ash Library", target: 90, endgame: true },
            { id: "silkGraveyard", name: "Silk Graveyard", target: 94, endgame: true },
            { id: "prismCourt", name: "Prism Court", target: 98, endgame: true },
            { id: "boss7", name: "The Prism Regent", boss: "prismRegent", endgame: true },
            { id: "echoForge", name: "Echo Forge", target: 104, endgame: true },
            { id: "boss8", name: "The Ash Seraph", boss: "ashSeraph", endgame: true },
            { id: "cinderVeil", name: "Cinder Veil", target: 92, endgame: true },
            { id: "boss9", name: "The Silk Judge", boss: "silkJudge", endgame: true },
            { id: "boss10", name: "The Hollow Crown", boss: "hollowCrown", endgame: true },
            { id: "neonOrchard", name: "Neon Orchard", target: 108, endgame: true },
            { id: "clockworkAbyss", name: "Clockwork Abyss", target: 112, endgame: true },
            { id: "boss11", name: "The Neon Warden", boss: "neonWarden", endgame: true },
            { id: "boss12", name: "The Clock Abyss", boss: "clockAbyss", endgame: true },
            { id: "glassCitadel", name: "Glass Citadel", target: 116, endgame: true },
            { id: "bloodMoonCathedral", name: "Blood Moon Cathedral", target: 120, endgame: true },
            { id: "boss13", name: "The Shattered Choir", boss: "shatteredChoir", endgame: true },
            { id: "boss14", name: "The Crimson Archbishop", boss: "crimsonArchbishop", endgame: true },

            { id: "shadowBazaar", name: "Shadow Bazaar", target: 124, endgame: true },
            { id: "auroraBridge", name: "Aurora Bridge", target: 128, endgame: true },
            { id: "marrowLabyrinth", name: "Marrow Labyrinth", target: 132, endgame: true },
            { id: "starlitReliquary", name: "Starlit Reliquary", target: 136, endgame: true },
            { id: "boss15", name: "The Shadow Merchant", boss: "shadowMerchant", endgame: true },
            { id: "boss16", name: "The Aurora Knight", boss: "auroraKnight", endgame: true },
            { id: "boss17", name: "The Marrow Queen", boss: "marrowQueen", endgame: true },
            { id: "boss18", name: "The Starlit Relic", boss: "starlitRelic", endgame: true },
            { id: "boss3", name: "The First Stitch", boss: "firstStitch", endgame: true }
        ];
        function realmIndex(id = currentRealm) { return REALM_FLOW.findIndex(r => r.id === id); }
        function realmData(id = currentRealm) {
            const baseIndex = realmIndex(id);
            if (baseIndex >= 0) return REALM_FLOW[baseIndex];
            const endless = ENDLESS_REALMS.find(r => r.id === id);
            return endless || REALM_FLOW[0];
        }
        let highestPlatformTouchedIndex = -1;

        const keys = {};
        let jumpKeyReleased = true; 

        const player = {
            worldX: 100,
            worldY: 300,
            width: 40,
            height: 50,
            vx: 0, 
            vy: 0,
            maxSpeed: 5.7,
            acceleration: 0.46, 
            friction: 0.92,      
            flapForce: -8.2,     
            gravity: 0.35,       
            maxFallSpeed: 8,     
            lives: 3,
            facing: 1, 
            isAttacking: false,
            attackTimer: 0,
            attackDir: "horizontal", // "horizontal", "up", "down"
            attackBox: { width: 110, height: 110 },
            // so the on-screen slash arc maps directly to the real attack hitbox.
            attackRange: 55,
            invulnTimer: 0,
            lastSafeX: 100,
            lastSafeY: 300,
            flapAnim: 0,
            magicAura: null,
            wingStyle: "normal",
            slashStyle: "normal",
            collectedMagic: [],
            bossRewards: [],
            collectedCosmetics: [],
            collectedEquipment: [],
            equippedEquipment: [],
            soulFragments: 0,
            dashReady: true,
            slowMoTimer: 0
        };

        // Boss Definition
        const boss = {
            active: false,
            kind: 'needle',
            name: "THE NEEDLE'S EYE",
            x: 0,
            y: 300,
            width: 40,
            height: 160,
            hp: 5,
            maxHp: 5,
            phase: 1,
            state: 'hover', 
            timer: 0,
            speed: 4,
            targetY: 300,
            // actions; telegraphTimer counts down during a wind-up before an
            // action fires; activeActionIndex/activeAdvancedPhaseIndex track
            // which action/phase is queued or currently telegraphing.
            actionCooldown: 140,
            telegraphTimer: 0,
            pendingActionIndex: -1,
            advancedPhaseIndex: 0,
            advancedPhaseTimer: 0,
            advancedLockedX: 0,
            advancedLockedY: 0
        };
        const BOSS_DEFS = {
            needle: { name: "THE NEEDLE'S EYE", hp: 5, width: 40, height: 160, color: '#ff3300' },
            weaver: { name: "THE WEAVER KING", hp: 15, width: 95, height: 190, color: '#ffaa33' },
            gearSaint: { name: "THE GEAR SAINT", hp: 18, width: 120, height: 190, color: '#aab8ff' },
            thornMother: { name: "THE THORN MOTHER", hp: 20, width: 150, height: 210, color: '#88ff66' },
            drownedStar: { name: "THE DROWNED STAR", hp: 22, width: 150, height: 210, color: '#66e6ff' },
            prismRegent: { name: "THE PRISM REGENT", hp: 24, width: 145, height: 220, color: '#ff9dff' },
            ashSeraph: { name: "THE ASH SERAPH", hp: 26, width: 150, height: 220, color: '#ff7a44' },
            silkJudge: { name: "THE SILK JUDGE", hp: 27, width: 155, height: 225, color: '#d7d8ff' },
            hollowCrown: { name: "THE HOLLOW CROWN", hp: 30, width: 170, height: 235, color: '#b45cff' },
            neonWarden: { name: "THE NEON WARDEN", hp: 31, width: 165, height: 225, color: '#55ffcc' },
            clockAbyss: { name: "THE CLOCK ABYSS", hp: 32, width: 175, height: 240, color: '#ffc85c' },
            shatteredChoir: { name: "THE SHATTERED CHOIR", hp: 34, width: 180, height: 245, color: '#d7fbff' },
            crimsonArchbishop: { name: "THE CRIMSON ARCHBISHOP", hp: 36, width: 185, height: 250, color: '#ff3355' },

            shadowMerchant: { name: "THE SHADOW MERCHANT", hp: 38, width: 180, height: 245, color: '#7a45ff' },
            auroraKnight: { name: "THE AURORA KNIGHT", hp: 40, width: 190, height: 255, color: '#76ffd8' },
            marrowQueen: { name: "THE MARROW QUEEN", hp: 42, width: 195, height: 260, color: '#ffe3cf' },
            starlitRelic: { name: "THE STARLIT RELIC", hp: 44, width: 200, height: 265, color: '#fff6a8' },
            firstStitch: { name: "THE FIRST STITCH", hp: 28, width: 130, height: 230, color: '#ffffff' }
        };
