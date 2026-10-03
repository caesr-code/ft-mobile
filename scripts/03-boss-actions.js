/* Faded Thread module: 03-boss-actions.js | build 03 Oct 2026 */
// ──────────────────────────────────────────────────────────────────
        // Every main-roster boss (needle → firstStitch) gets its own unique
        // action list, themed to its identity. Action *count* follows a
        // progressive curve: the first two bosses have 1 action, then the
        // count rises the further into the game the boss appears, capping at
        // 4 for the late-game roster. Actions fire on a timer alongside the
        // boss's existing hover/charge/return movement — they don't replace
        // it, they layer extra attacks on top of it.
        //
        // Every action is a plain object:
        //   { name, telegraph, spawn(b) }
        // - telegraph: ms of wind-up (plays playTelegraphSound, boss flashes)
        //   before spawn() runs.
        // - spawn(b): pushes one or more entries into bossAttacks[]. Each
        //   entry is later updated/drawn/collided generically (see the
        //   update()/draw() integration below) based on its `kind`:
        //     'projectile' — moves by vx/vy, deals damage on player contact
        //     'hazard'     — stationary or growing zone, damages on overlap
        //                    for its lifetime
        //     'beam'       — a thin rectangle that telegraphs then deals
        //                    damage for a short active window
        // ──────────────────────────────────────────────────────────────────

        function spawnBossProjectile(opts) {
            bossAttacks.push(Object.assign({
                kind: 'projectile',
                x: 0, y: 0, vx: 0, vy: 0,
                width: 16, height: 16,
                life: 240,
                color: '#ffffff',
                shape: 'orb'
            }, opts));
            playProjectileLaunch();
        }

        function spawnBossHazard(opts) {
            bossAttacks.push(Object.assign({
                kind: 'hazard',
                x: 0, y: 0,
                width: 60, height: 60,
                life: 90,
                growTime: 20,
                color: '#ffffff',
                shape: 'zone'
            }, opts));
            playHazardTrigger();
        }

        function spawnBossBeam(opts) {
            bossAttacks.push(Object.assign({
                kind: 'beam',
                x: 0, y: 0,
                width: 24, height: 600,
                life: 50,
                color: '#ffffff'
            }, opts));
            playHazardTrigger();
        }

        // Each action entry: { name, telegraph, spawn(b) }. `b` is the live
        // boss object, so spawn() can read boss.x/boss.y/player position.
        const BOSS_ACTIONS = {
            // ── 1 ACTION — opening bosses ────────────────────────────────
            needle: [
                {
                    name: "Eye Thread",
                    telegraph: 380,
                    spawn(b) {
                        // A single fast needle-thin projectile straight at the player's
                        // current height — the very first attack the player ever sees.
                        const dir = player.worldX < b.x ? -1 : 1;
                        spawnBossProjectile({
                            x: b.x - worldX, y: b.y + b.height / 2,
                            vx: dir * -7.5, vy: 0,
                            width: 26, height: 6,
                            life: 200, color: '#ff3300', shape: 'needle'
                        });
                    }
                }
            ],
            weaver: [
                {
                    name: "Crown Lash",
                    telegraph: 420,
                    spawn(b) {
                        // Three thread-whips drop from above in a horizontal spread
                        // around the player's last known position — a simple
                        // read-and-dodge pattern.
                        const baseX = player.worldX;
                        for (let i = -1; i <= 1; i++) {
                            spawnBossHazard({
                                x: baseX + i * 70 - worldX, y: 0,
                                width: 24, height: 2000,
                                life: 50, growTime: 26,
                                color: '#ffaa33', shape: 'thread'
                            });
                        }
                    }
                }
            ],

            // ── 2 ACTIONS — early endgame ────────────────────────────────
            firstStitch: [
                {
                    name: "Unraveling Pulse",
                    telegraph: 400,
                    spawn(b) {
                        // Slow expanding white ring from the boss's center.
                        spawnBossHazard({
                            x: b.x - worldX, y: b.y + b.height / 2,
                            width: 10, height: 10, maxRadius: 160,
                            life: 70, growTime: 70,
                            color: '#ffffff', shape: 'ring'
                        });
                    }
                },
                {
                    name: "First Stitch Volley",
                    telegraph: 360,
                    spawn(b) {
                        // Fan of 3 needle projectiles.
                        for (let a = -0.35; a <= 0.35; a += 0.35) {
                            spawnBossProjectile({
                                x: b.x - worldX, y: b.y + b.height / 2,
                                vx: -7 * Math.cos(a), vy: 7 * Math.sin(a),
                                width: 22, height: 6, life: 200,
                                color: '#ffffff', shape: 'needle'
                            });
                        }
                    }
                }
            ],
            gearSaint: [
                {
                    name: "Cog Barrage",
                    telegraph: 360,
                    spawn(b) {
                        // Spinning gear projectiles, mid-arc trajectory.
                        for (let i = 0; i < 2; i++) {
                            spawnBossProjectile({
                                x: b.x - worldX, y: b.y + 30 + i * 60,
                                vx: -6.4, vy: (i - 0.5) * 1.2,
                                width: 22, height: 22, life: 220,
                                color: '#aab8ff', shape: 'gear', spin: 0
                            });
                        }
                    }
                },
                {
                    name: "Grinding Floor",
                    telegraph: 460,
                    spawn(b) {
                        // A line of floor hazards the player must jump over.
                        const startX = player.worldX - 120;
                        for (let i = 0; i < 3; i++) {
                            spawnBossHazard({
                                x: startX + i * 80 - worldX, y: window.innerHeight - 90,
                                width: 60, height: 40, life: 80, growTime: 18,
                                color: '#aab8ff', shape: 'spikes'
                            });
                        }
                    }
                }
            ],
            thornMother: [
                {
                    name: "Bramble Burst",
                    telegraph: 380,
                    spawn(b) {
                        // Radial burst of 5 thorn projectiles.
                        for (let i = 0; i < 5; i++) {
                            const a = (i / 5) * Math.PI * 2;
                            spawnBossProjectile({
                                x: b.x - worldX, y: b.y + b.height / 2,
                                vx: Math.cos(a) * 5.2, vy: Math.sin(a) * 5.2,
                                width: 14, height: 14, life: 180,
                                color: '#88ff66', shape: 'thorn'
                            });
                        }
                    }
                },
                {
                    name: "Root Snare",
                    telegraph: 500,
                    spawn(b) {
                        // Growing root hazard directly under the player.
                        spawnBossHazard({
                            x: player.worldX - worldX, y: window.innerHeight - 110,
                            width: 50, height: 70, life: 100, growTime: 30,
                            color: '#55cc33', shape: 'roots'
                        });
                    }
                }
            ],
            drownedStar: [
                {
                    name: "Tide Shards",
                    telegraph: 360,
                    spawn(b) {
                        for (let i = 0; i < 3; i++) {
                            spawnBossProjectile({
                                x: b.x - worldX, y: b.y + 20 + i * 50,
                                vx: -6.0, vy: Math.sin(i) * 1.5,
                                width: 16, height: 16, life: 220,
                                color: '#66e6ff', shape: 'orb'
                            });
                        }
                    }
                },
                {
                    name: "Rising Flood",
                    telegraph: 520,
                    spawn(b) {
                        // Floor-wide rising-water hazard — forces the player upward.
                        spawnBossHazard({
                            x: worldX - 40, y: window.innerHeight - 60, width: canvas.width + 80, height: 50,
                            life: 110, growTime: 35, screenLocked: true,
                            color: '#3fa8ff', shape: 'water'
                        });
                    }
                }
            ],

            // ── 3 ACTIONS — mid endgame ───────────────────────────────────
            prismRegent: [
                {
                    name: "Refracted Spray",
                    telegraph: 340,
                    spawn(b) {
                        for (let a = -0.5; a <= 0.5; a += 0.25) {
                            spawnBossProjectile({
                                x: b.x - worldX, y: b.y + b.height / 2,
                                vx: -6.6 * Math.cos(a), vy: 6.6 * Math.sin(a),
                                width: 14, height: 14, life: 200,
                                color: '#ff9dff', shape: 'shard'
                            });
                        }
                    }
                },
                {
                    name: "Mirror Beam",
                    telegraph: 480,
                    spawn(b) {
                        spawnBossBeam({
                            x: player.worldX - worldX, y: 0,
                            width: 34, height: window.innerHeight,
                            life: 40, color: '#ff9dff'
                        });
                    }
                },
                {
                    name: "Prism Field",
                    telegraph: 420,
                    spawn(b) {
                        spawnBossHazard({
                            x: b.x - worldX, y: b.y - 40, width: 10, height: 10,
                            maxRadius: 140, life: 60, growTime: 60,
                            color: '#ffd1ff', shape: 'ring'
                        });
                    }
                }
            ],
            ashSeraph: [
                {
                    name: "Cinder Rain",
                    telegraph: 400,
                    spawn(b) {
                        for (let i = 0; i < 4; i++) {
                            spawnBossProjectile({
                                x: player.worldX - worldX + (i - 1.5) * 60, y: -20,
                                vx: 0, vy: 5.0, width: 14, height: 18,
                                life: 200, color: '#ff7a44', shape: 'ember'
                            });
                        }
                    }
                },
                {
                    name: "Wing Sweep",
                    telegraph: 380,
                    spawn(b) {
                        const dir = player.worldX < b.x ? -1 : 1;
                        spawnBossProjectile({
                            x: b.x - worldX, y: b.y + b.height / 2,
                            vx: dir * -8.2, vy: 0, width: 70, height: 24,
                            life: 160, color: '#ffae6f', shape: 'wing'
                        });
                    }
                },
                {
                    name: "Ash Floor",
                    telegraph: 460,
                    spawn(b) {
                        spawnBossHazard({
                            x: player.worldX - worldX - 50, y: window.innerHeight - 90,
                            width: 100, height: 50, life: 90, growTime: 25,
                            color: '#ff5522', shape: 'flame'
                        });
                    }
                }
            ],
            silkJudge: [
                {
                    name: "Verdict Threads",
                    telegraph: 420,
                    spawn(b) {
                        for (let i = -2; i <= 2; i++) {
                            spawnBossHazard({
                                x: player.worldX + i * 60 - worldX, y: 0,
                                width: 16, height: 2000, life: 55, growTime: 20,
                                color: '#d7d8ff', shape: 'thread'
                            });
                        }
                    }
                },
                {
                    name: "Binding Tether",
                    telegraph: 500,
                    spawn(b) {
                        // A slow homing-ish projectile that drifts toward the
                        // player's position at spawn time (not true homing —
                        // it locks direction once, staying readable/dodgeable).
                        const dx = player.worldX - b.x, dy = player.worldY - (b.y + b.height / 2);
                        const len = Math.max(1, Math.hypot(dx, dy));
                        spawnBossProjectile({
                            x: b.x - worldX, y: b.y + b.height / 2,
                            vx: (dx / len) * 4.2, vy: (dy / len) * 4.2,
                            width: 18, height: 18, life: 240,
                            color: '#bdbaff', shape: 'tether'
                        });
                    }
                },
                {
                    name: "Silk Cage",
                    telegraph: 440,
                    spawn(b) {
                        spawnBossHazard({
                            x: player.worldX - worldX, y: player.worldY - 80,
                            width: 12, height: 12, maxRadius: 90,
                            life: 55, growTime: 55,
                            color: '#e8e6ff', shape: 'ring'
                        });
                    }
                }
            ],
            hollowCrown: [
                {
                    name: "Crown Shards",
                    telegraph: 360,
                    spawn(b) {
                        for (let i = 0; i < 5; i++) {
                            const a = (i / 5) * Math.PI * 2;
                            spawnBossProjectile({
                                x: b.x - worldX, y: b.y + b.height / 2,
                                vx: Math.cos(a) * 5.6, vy: Math.sin(a) * 5.6,
                                width: 16, height: 16, life: 190,
                                color: '#b45cff', shape: 'shard'
                            });
                        }
                    }
                },
                {
                    name: "Hollow Pillar",
                    telegraph: 480,
                    spawn(b) {
                        spawnBossBeam({
                            x: player.worldX - worldX, y: 0,
                            width: 46, height: window.innerHeight,
                            life: 45, color: '#9a3fff'
                        });
                    }
                },
                {
                    name: "Void Wake",
                    telegraph: 500,
                    spawn(b) {
                        spawnBossHazard({
                            x: b.x - worldX, y: window.innerHeight - 90,
                            width: 120, height: 50, life: 100, growTime: 30,
                            color: '#5c1f8f', shape: 'roots'
                        });
                    }
                }
            ],
            neonWarden: [
                {
                    name: "Grid Pulse",
                    telegraph: 340,
                    spawn(b) {
                        for (let i = 0; i < 4; i++) {
                            spawnBossProjectile({
                                x: b.x - worldX, y: b.y + 30 + i * 50,
                                vx: -7.4, vy: 0, width: 18, height: 8,
                                life: 200, color: '#55ffcc', shape: 'needle'
                            });
                        }
                    }
                },
                {
                    name: "Neon Fence",
                    telegraph: 460,
                    spawn(b) {
                        for (let i = -1; i <= 1; i++) {
                            spawnBossBeam({
                                x: player.worldX + i * 90 - worldX, y: 0,
                                width: 20, height: window.innerHeight,
                                life: 42, color: '#55ffcc'
                            });
                        }
                    }
                },
                {
                    name: "Warden Trap",
                    telegraph: 420,
                    spawn(b) {
                        spawnBossHazard({
                            x: player.worldX - worldX, y: player.worldY,
                            width: 10, height: 10, maxRadius: 110,
                            life: 50, growTime: 50,
                            color: '#9bffe6', shape: 'ring'
                        });
                    }
                }
            ],
            clockAbyss: [
                {
                    name: "Pendulum Shards",
                    telegraph: 360,
                    spawn(b) {
                        for (let i = -1; i <= 1; i += 2) {
                            spawnBossProjectile({
                                x: b.x - worldX, y: b.y + b.height / 2,
                                vx: -6.5, vy: i * 3.5, width: 16, height: 16,
                                life: 220, color: '#ffc85c', shape: 'orb'
                            });
                        }
                    }
                },
                {
                    name: "Frozen Floor",
                    telegraph: 500,
                    spawn(b) {
                        // Field hazard that visually "freezes" a zone — a
                        // time-based obstacle the player must clear before it
                        // expires.
                        spawnBossHazard({
                            x: player.worldX - worldX - 70, y: window.innerHeight - 130,
                            width: 140, height: 90, life: 130, growTime: 20,
                            color: '#a8e6ff', shape: 'frost'
                        });
                    }
                },
                {
                    name: "Rewind Bolt",
                    telegraph: 420,
                    spawn(b) {
                        const dir = player.worldX < b.x ? -1 : 1;
                        spawnBossProjectile({
                            x: b.x - worldX, y: b.y + b.height / 2,
                            vx: dir * -5.5, vy: 0, width: 30, height: 30,
                            life: 240, color: '#ffe6a8', shape: 'clock'
                        });
                    }
                }
            ],

            // ── 4 ACTIONS — late endgame, final stretch ───────────────────
            shatteredChoir: [
                {
                    name: "Discord Volley",
                    telegraph: 320,
                    spawn(b) {
                        for (let a = -0.6; a <= 0.6; a += 0.3) {
                            spawnBossProjectile({
                                x: b.x - worldX, y: b.y + b.height / 2,
                                vx: -6.8 * Math.cos(a), vy: 6.8 * Math.sin(a),
                                width: 14, height: 14, life: 200,
                                color: '#d7fbff', shape: 'shard'
                            });
                        }
                    }
                },
                {
                    name: "Choir Wall",
                    telegraph: 460,
                    spawn(b) {
                        for (let i = -1; i <= 1; i++) {
                            spawnBossBeam({
                                x: player.worldX + i * 70 - worldX, y: 0,
                                width: 18, height: window.innerHeight,
                                life: 38, color: '#d7fbff'
                            });
                        }
                    }
                },
                {
                    name: "Resonance Field",
                    telegraph: 440,
                    spawn(b) {
                        spawnBossHazard({
                            x: b.x - worldX, y: b.y + b.height / 2, width: 10, height: 10,
                            maxRadius: 150, life: 65, growTime: 65,
                            color: '#eafdff', shape: 'ring'
                        });
                    }
                },
                {
                    name: "Shatter Floor",
                    telegraph: 480,
                    spawn(b) {
                        const startX = player.worldX - 130;
                        for (let i = 0; i < 4; i++) {
                            spawnBossHazard({
                                x: startX + i * 70 - worldX, y: window.innerHeight - 90,
                                width: 50, height: 40, life: 90, growTime: 16,
                                color: '#bfeaff', shape: 'spikes'
                            });
                        }
                    }
                }
            ],
            crimsonArchbishop: [
                {
                    name: "Sermon of Blades",
                    telegraph: 320,
                    spawn(b) {
                        for (let i = 0; i < 5; i++) {
                            const a = (i / 5) * Math.PI * 2;
                            spawnBossProjectile({
                                x: b.x - worldX, y: b.y + b.height / 2,
                                vx: Math.cos(a) * 5.8, vy: Math.sin(a) * 5.8,
                                width: 14, height: 14, life: 190,
                                color: '#ff3355', shape: 'shard'
                            });
                        }
                    }
                },
                {
                    name: "Crimson Beam",
                    telegraph: 440,
                    spawn(b) {
                        spawnBossBeam({
                            x: player.worldX - worldX, y: 0,
                            width: 38, height: window.innerHeight,
                            life: 42, color: '#ff3355'
                        });
                    }
                },
                {
                    name: "Blood Pool",
                    telegraph: 460,
                    spawn(b) {
                        spawnBossHazard({
                            x: player.worldX - worldX - 60, y: window.innerHeight - 90,
                            width: 120, height: 50, life: 110, growTime: 26,
                            color: '#a8001f', shape: 'flame'
                        });
                    }
                },
                {
                    name: "Excommunicate",
                    telegraph: 400,
                    spawn(b) {
                        const dx = player.worldX - b.x, dy = player.worldY - (b.y + b.height / 2);
                        const len = Math.max(1, Math.hypot(dx, dy));
                        spawnBossProjectile({
                            x: b.x - worldX, y: b.y + b.height / 2,
                            vx: (dx / len) * 5.0, vy: (dy / len) * 5.0,
                            width: 22, height: 22, life: 240,
                            color: '#ff7088', shape: 'tether'
                        });
                    }
                }
            ],
            shadowMerchant: [
                {
                    name: "Coin Toss",
                    telegraph: 320,
                    spawn(b) {
                        for (let i = 0; i < 3; i++) {
                            spawnBossProjectile({
                                x: b.x - worldX, y: b.y + 20 + i * 60,
                                vx: -7.0, vy: 0, width: 14, height: 14,
                                life: 210, color: '#7a45ff', shape: 'orb'
                            });
                        }
                    }
                },
                {
                    name: "Vanishing Trick",
                    telegraph: 460,
                    spawn(b) {
                        // Boss "teleports" — a quick reposition plus a burst
                        // of projectiles fired from the new spot.
                        boss.x = player.worldX + (Math.random() < 0.5 ? -260 : 260);
                        for (let a = -0.4; a <= 0.4; a += 0.4) {
                            spawnBossProjectile({
                                x: boss.x - worldX, y: boss.y + boss.height / 2,
                                vx: -6.4 * Math.cos(a), vy: 6.4 * Math.sin(a),
                                width: 14, height: 14, life: 200,
                                color: '#9a6bff', shape: 'shard'
                            });
                        }
                    }
                },
                {
                    name: "Bad Bargain",
                    telegraph: 440,
                    spawn(b) {
                        spawnBossHazard({
                            x: player.worldX - worldX, y: player.worldY,
                            width: 10, height: 10, maxRadius: 130,
                            life: 60, growTime: 60,
                            color: '#b89bff', shape: 'ring'
                        });
                    }
                },
                {
                    name: "Shadow Toll",
                    telegraph: 480,
                    spawn(b) {
                        spawnBossHazard({
                            x: player.worldX - worldX - 70, y: window.innerHeight - 130,
                            width: 140, height: 90, life: 100, growTime: 22,
                            color: '#3a1a66', shape: 'roots'
                        });
                    }
                }
            ],
            auroraKnight: [
                {
                    name: "Lance Volley",
                    telegraph: 300,
                    spawn(b) {
                        const dir = player.worldX < b.x ? -1 : 1;
                        for (let i = 0; i < 3; i++) {
                            spawnBossProjectile({
                                x: b.x - worldX, y: b.y + 20 + i * 50,
                                vx: dir * -8.0, vy: 0, width: 28, height: 8,
                                life: 180, color: '#76ffd8', shape: 'needle'
                            });
                        }
                    }
                },
                {
                    name: "Aurora Wall",
                    telegraph: 440,
                    spawn(b) {
                        for (let i = -1; i <= 1; i++) {
                            spawnBossBeam({
                                x: player.worldX + i * 80 - worldX, y: 0,
                                width: 22, height: window.innerHeight,
                                life: 40, color: '#76ffd8'
                            });
                        }
                    }
                },
                {
                    name: "Charge Stance",
                    telegraph: 420,
                    spawn(b) {
                        // Boss does a fast horizontal charge across the screen
                        // independent of the normal hover/charge cycle.
                        boss.state = 'charge';
                        boss.timer = 0;
                    }
                },
                {
                    name: "Borealis Field",
                    telegraph: 460,
                    spawn(b) {
                        spawnBossHazard({
                            x: b.x - worldX, y: b.y + b.height / 2, width: 10, height: 10,
                            maxRadius: 150, life: 60, growTime: 60,
                            color: '#c8fff0', shape: 'ring'
                        });
                    }
                }
            ],
            marrowQueen: [
                {
                    name: "Bone Shower",
                    telegraph: 300,
                    spawn(b) {
                        for (let i = 0; i < 4; i++) {
                            spawnBossProjectile({
                                x: player.worldX - worldX + (i - 1.5) * 60, y: -20,
                                vx: 0, vy: 5.4, width: 12, height: 22,
                                life: 200, color: '#ffe3cf', shape: 'ember'
                            });
                        }
                    }
                },
                {
                    name: "Marrow Spikes",
                    telegraph: 460,
                    spawn(b) {
                        const startX = player.worldX - 140;
                        for (let i = 0; i < 4; i++) {
                            spawnBossHazard({
                                x: startX + i * 80 - worldX, y: window.innerHeight - 90,
                                width: 55, height: 45, life: 95, growTime: 16,
                                color: '#ffd9b8', shape: 'spikes'
                            });
                        }
                    }
                },
                {
                    name: "Queen's Wail",
                    telegraph: 440,
                    spawn(b) {
                        spawnBossHazard({
                            x: b.x - worldX, y: b.y + b.height / 2, width: 10, height: 10,
                            maxRadius: 160, life: 70, growTime: 70,
                            color: '#fff0e0', shape: 'ring'
                        });
                    }
                },
                {
                    name: "Marrow Tether",
                    telegraph: 400,
                    spawn(b) {
                        const dx = player.worldX - b.x, dy = player.worldY - (b.y + b.height / 2);
                        const len = Math.max(1, Math.hypot(dx, dy));
                        spawnBossProjectile({
                            x: b.x - worldX, y: b.y + b.height / 2,
                            vx: (dx / len) * 4.6, vy: (dy / len) * 4.6,
                            width: 20, height: 20, life: 240,
                            color: '#ffb88c', shape: 'tether'
                        });
                    }
                }
            ],
            starlitRelic: [
                {
                    name: "Star Cascade",
                    telegraph: 300,
                    spawn(b) {
                        for (let i = 0; i < 5; i++) {
                            const a = (i / 5) * Math.PI * 2;
                            spawnBossProjectile({
                                x: b.x - worldX, y: b.y + b.height / 2,
                                vx: Math.cos(a) * 6.0, vy: Math.sin(a) * 6.0,
                                width: 14, height: 14, life: 200,
                                color: '#fff6a8', shape: 'shard'
                            });
                        }
                    }
                },
                {
                    name: "Relic Beam",
                    telegraph: 420,
                    spawn(b) {
                        spawnBossBeam({
                            x: player.worldX - worldX, y: 0,
                            width: 40, height: window.innerHeight,
                            life: 44, color: '#fff6a8'
                        });
                    }
                },
                {
                    name: "Constellation Field",
                    telegraph: 460,
                    spawn(b) {
                        spawnBossHazard({
                            x: b.x - worldX, y: b.y + b.height / 2, width: 10, height: 10,
                            maxRadius: 170, life: 75, growTime: 75,
                            color: '#fffbe0', shape: 'ring'
                        });
                    }
                },
                {
                    name: "Relic Floor",
                    telegraph: 480,
                    spawn(b) {
                        const startX = player.worldX - 140;
                        for (let i = 0; i < 4; i++) {
                            spawnBossHazard({
                                x: startX + i * 75 - worldX, y: window.innerHeight - 90,
                                width: 55, height: 45, life: 100, growTime: 18,
                                color: '#fff0a0', shape: 'spikes'
                            });
                        }
                    }
                }
            ]
        };

        // How many of a boss's actions are unlocked, by kind — implements
        // the progressive curve (1 → 2 → 3 → 4) requested for the main
        // 18-boss roster. Bosses not listed (the 5 advanced post-game
        // bosses) use BOSS_ACTIONS_ADVANCED_COUNT below instead.
        const BOSS_ACTIONS_UNLOCKED_COUNT = {
            needle: 1, weaver: 1,
            firstStitch: 2, gearSaint: 2, thornMother: 2, drownedStar: 2,
            prismRegent: 3, ashSeraph: 3, silkJudge: 3, hollowCrown: 3, neonWarden: 3, clockAbyss: 3,
            shatteredChoir: 4, crimsonArchbishop: 4, shadowMerchant: 4, auroraKnight: 4, marrowQueen: 4, starlitRelic: 4
        };

        // For the 5 advanced post-game bosses, the brief was to mix-and-match
        // their *existing* phases data rather than author new bespoke
        // actions. This adapter turns each boss's `phases[]` (already
        // defined in ADVANCED_ENDGAME_BOSSES_V27 below) into 5 generic
        // actions by attackType, reusing the same telegraph/spawn shape as
        // BOSS_ACTIONS above so both systems share one execution path.
        function buildAdvancedActionsFromPhases(def) {
            if (!def || !def.phases) return [];
            const phases = def.phases;
            const actions = [];
            phases.forEach((p, idx) => {
                actions.push({
                    name: p.state,
                    telegraph: Math.max(280, Math.min(900, (p.duration || 60) * 6)),
                    spawn(b) {
                        const dims = p.dimensions || {};
                        switch (p.attackType) {
                            case 'telegraph':
                            case 'multi_telegraph': {
                                const count = dims.lineCount || dims.strandCount || 1;
                                for (let i = 0; i < Math.min(count, 6); i++) {
                                    const ang = (i / Math.min(count, 6)) * Math.PI * 2;
                                    spawnBossProjectile({
                                        x: b.x - worldX, y: b.y + b.height / 2,
                                        vx: Math.cos(ang) * 5.4, vy: Math.sin(ang) * 5.4,
                                        width: dims.lineWidth ? Math.min(dims.lineWidth, 24) : 14,
                                        height: 14, life: 200,
                                        color: def.color, shape: 'shard'
                                    });
                                }
                                break;
                            }
                            case 'tracking_telegraph': {
                                spawnBossBeam({
                                    x: player.worldX - worldX, y: 0,
                                    width: dims.width || 34, height: dims.height || window.innerHeight,
                                    life: 50, color: def.color
                                });
                                break;
                            }
                            case 'charge': {
                                boss.state = 'charge';
                                boss.timer = 0;
                                break;
                            }
                            case 'sweeping_beam': {
                                spawnBossBeam({
                                    x: player.worldX - worldX, y: 0,
                                    width: dims.width || 40, height: dims.height || window.innerHeight,
                                    life: 60, color: def.color
                                });
                                break;
                            }
                            case 'area_denial': {
                                spawnBossHazard({
                                    x: b.x - worldX, y: b.y + b.height / 2,
                                    width: 10, height: 10,
                                    maxRadius: dims.radius || dims.zoneRadius || 140,
                                    life: 80, growTime: 80,
                                    color: def.color, shape: 'ring'
                                });
                                break;
                            }
                            case 'dash_combo': {
                                const dir = player.worldX < b.x ? -1 : 1;
                                for (let i = 0; i < (dims.slashCount || 2); i++) {
                                    spawnBossProjectile({
                                        x: b.x - worldX, y: b.y + b.height / 2 + (i - 1) * 30,
                                        vx: dir * -7.4, vy: 0,
                                        width: dims.width ? Math.min(dims.width, 60) : 40,
                                        height: 16, life: 160,
                                        color: def.color, shape: 'wing'
                                    });
                                }
                                break;
                            }
                            case 'mobility': {
                                boss.x = player.worldX + (Math.random() < 0.5 ? -280 : 280);
                                spawnBossHazard({
                                    x: boss.x - worldX, y: boss.y + boss.height / 2,
                                    width: 10, height: 10, maxRadius: 90,
                                    life: 40, growTime: 40,
                                    color: def.color, shape: 'ring'
                                });
                                break;
                            }
                            default: {
                                spawnBossHazard({
                                    x: player.worldX - worldX, y: window.innerHeight - 110,
                                    width: 70, height: 60, life: 90, growTime: 24,
                                    color: def.color, shape: 'spikes'
                                });
                            }
                        }
                    }
                });
            });
            // Guarantee exactly 5 mixed actions as requested, cycling phases
            // if the source data has fewer than 5 (most have 3).
            while (actions.length > 0 && actions.length < 5) actions.push(actions[actions.length % phases.length]);
            return actions.slice(0, 5);
        }

        function startBoss(kind) {
            const def = BOSS_DEFS[kind] || BOSS_DEFS.needle;
            boss.active = true;
            boss.kind = kind;
            boss.name = def.name;
            boss.width = def.width;
            boss.height = def.height;
            boss.hp = def.hp;
            boss.maxHp = def.hp;
            boss.phase = 1;
            boss.state = 'hover';
            boss.timer = 0;
            boss.x = player.worldX + canvas.width / 2;
            boss.y = 300;
            enemies = [];
            bossAttacks = [];
            boss.actionCooldown = 150;
            boss.telegraphTimer = 0;
            boss.pendingActionIndex = -1;
            boss.advancedPhaseIndex = 0;
            boss.advancedPhaseTimer = 0;
            if (player.brokenTiara) healPlayer(1);
            setBgThemeIntensified(true);
            updateUI();
        }
