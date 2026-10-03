/* Faded Thread module: 06-rendering-player-enemies.js | build 03 Oct 2026 */
function drawGhost(x, y, facing, attacking, invuln) {
            if (invuln > 0 && Math.floor(invuln / 4) % 2 === 0) return;

            ctx.save();
            let tilt = player.vy * 0.06;
            let t = Date.now();
            let waveSpeed = t * 0.015;
            let waveOffset = Math.sin(waveSpeed) * 7;
            let dragX = -player.vx * 2.5;

            ctx.translate(x, y);
            ctx.rotate(tilt);
            if (facing === -1) ctx.scale(-1, 1);

            // Outer aura glow (realm-colored)
            let aura = ctx.createRadialGradient(0, -18, 5, 0, -18, 42);
            aura.addColorStop(0, player.magicAura ? accentRgba(0.34) : accentRgba(0.22));
            aura.addColorStop(1, accentRgba(0));
            ctx.fillStyle = aura;
            ctx.beginPath();
            ctx.ellipse(0, -10, 38, 44, 0, 0, Math.PI * 2);
            ctx.fill();

            // Wing flap animation shown when the player jumps/flaps. Original small stub wings.
            if (player.flapAnim > 0) {
                let flap = player.flapAnim / 18;
                let wingAlpha = 0.22 + flap * 0.55;
                let wingLift = Math.sin((1 - flap) * Math.PI) * 18;
                ctx.save();
                ctx.globalAlpha = wingAlpha;
                ctx.shadowColor = accentHex();
                ctx.shadowBlur = 14;
                ctx.fillStyle = player.wingStyle === "moon" ? 'rgba(235,210,255,0.70)' : 'rgba(255,255,255,0.55)';
                ctx.strokeStyle = player.wingStyle === "moon" ? 'rgba(230,150,255,0.92)' : accentRgba(0.75);
                ctx.lineWidth = 1.5;

                ctx.beginPath();
                ctx.moveTo(-12, -26);
                ctx.bezierCurveTo(-42, -45 - wingLift, -52, -10 - wingLift, -18, -4);
                ctx.bezierCurveTo(-34, -12 - wingLift, -30, -24 - wingLift, -12, -26);
                ctx.fill();
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(12, -26);
                ctx.bezierCurveTo(42, -45 - wingLift, 52, -10 - wingLift, 18, -4);
                ctx.bezierCurveTo(34, -12 - wingLift, 30, -24 - wingLift, 12, -26);
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            }

            // Ghost body path
            function ghostPath() {
                ctx.beginPath();
                ctx.moveTo(-16, -20);
                ctx.bezierCurveTo(-16, -48, 16, -48, 16, -20);
                ctx.lineTo(18 + dragX, 10);
                ctx.bezierCurveTo(10 + dragX, 24 + waveOffset, 0 + dragX, 15 + waveOffset, -6 + dragX, 24 - waveOffset);
                ctx.lineTo(-14 + dragX, 10);
                ctx.closePath();
            }

            // Shadow / depth layer
            ctx.save();
            ctx.translate(3, 5);
            ghostPath();
            ctx.fillStyle = 'rgba(0,0,0,0.18)';
            ctx.fill();
            ctx.restore();

            // Main body with gradient
            ghostPath();
            let bodyGrad = ctx.createLinearGradient(-16, -48, 18, 26);
            bodyGrad.addColorStop(0, 'rgba(255,255,255,0.98)');
            bodyGrad.addColorStop(0.5, 'rgba(235,240,255,0.92)');
            if (player.magicAura) {
                const auraDef = getEquipmentDef(player.magicAura);
                const ac = hexToRgb(auraDef.color);
                bodyGrad.addColorStop(1, `rgba(${ac.r},${ac.g},${ac.b},0.82)`);
            } else {
                bodyGrad.addColorStop(1, 'rgba(200,215,255,0.80)');
            }
            ctx.fillStyle = bodyGrad;
            ctx.shadowColor = accentHex();
            ctx.shadowBlur = 18;
            ctx.fill();

            // Edge stroke
            ghostPath();
            ctx.strokeStyle = accentRgba(0.4);
            ctx.lineWidth = 1.5;
            ctx.shadowBlur = 0;
            ctx.stroke();

            // Inner highlight shimmer
            ctx.beginPath();
            ctx.ellipse(-3, -30, 5, 9, -0.3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,0.55)';
            ctx.fill();

            // Mixable magic clothing pieces.
            const gear = player.cosmetics || {};
            if (gear.ember) {
                ctx.shadowColor = '#ff8844'; ctx.shadowBlur = 12;
                ctx.fillStyle = 'rgba(255,120,45,0.92)';
                ctx.beginPath(); ctx.arc(-13, -15, 7, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(15, -12, 6, 0, Math.PI*2); ctx.fill();
                ctx.strokeStyle = 'rgba(255,210,120,0.95)'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(-18, -7); ctx.quadraticCurveTo(0, 2, 20, -5); ctx.stroke();
            }

            // ── TRAIL slot: swift, thorn, silk, cometThread ──────────────
            if (gear.swift) {
                ctx.shadowColor = '#55ddff'; ctx.shadowBlur = 10;
                ctx.strokeStyle = 'rgba(85,221,255,0.95)'; ctx.lineWidth = 3;
                ctx.beginPath(); ctx.moveTo(-22, -2); ctx.lineTo(-40, 10); ctx.moveTo(21, -2); ctx.lineTo(42, 8); ctx.stroke();
                ctx.fillStyle = 'rgba(190,250,255,0.9)'; ctx.beginPath(); ctx.arc(0, 14, 5, 0, Math.PI*2); ctx.fill();
            }
            if (gear.thorn) {
                ctx.shadowColor = '#8dff66'; ctx.shadowBlur = 10; ctx.strokeStyle = 'rgba(141,255,102,0.85)'; ctx.lineWidth = 2;
                for (let i = -1; i <= 1; i += 2) { ctx.beginPath(); ctx.moveTo(i*16, 6); ctx.lineTo(i*26, 0); ctx.moveTo(i*16, 6); ctx.lineTo(i*22, 14); ctx.stroke(); }
            }
            if (gear.silk) {
                ctx.shadowColor = '#e8e6ff'; ctx.shadowBlur = 10; ctx.strokeStyle = 'rgba(232,230,255,0.65)'; ctx.lineWidth = 1.5;
                for (let i = -2; i <= 2; i++) { let sway = Math.sin(t*.004+i)*5; ctx.beginPath(); ctx.moveTo(i*7, 16); ctx.quadraticCurveTo(i*7+sway, 30, i*5, 40); ctx.stroke(); }
            }
            if (gear.cometThread) {
                ctx.shadowColor = '#7dffea'; ctx.shadowBlur = 12; ctx.strokeStyle = 'rgba(125,255,234,0.8)'; ctx.lineWidth = 2;
                for (let i = 0; i < 3; i++) { let off = i * 7 + (t*0.02 % 7); ctx.beginPath(); ctx.moveTo(-16-off, -6+i*4); ctx.lineTo(-30-off, -2+i*4); ctx.stroke(); }
            }

            // ── CHEST slot: guard, mirror, thorns, anchorPearl, prismHeart, marrowCharm ──
            if (gear.guard) {
                ctx.shadowColor = '#88ff99'; ctx.shadowBlur = 12;
                ctx.strokeStyle = 'rgba(136,255,153,0.95)'; ctx.lineWidth = 3;
                ctx.beginPath(); ctx.moveTo(-18, -40); ctx.lineTo(18, -40); ctx.lineTo(14, -30); ctx.lineTo(-14, -30); ctx.closePath(); ctx.stroke();
                ctx.fillStyle = 'rgba(136,255,153,0.2)'; ctx.fill();
            }
            if (gear.mirror) {
                ctx.shadowColor = '#bdf7ff'; ctx.shadowBlur = 10; ctx.strokeStyle = 'rgba(189,247,255,0.8)'; ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.moveTo(-10,-2); ctx.lineTo(10,-2); ctx.moveTo(-10,4); ctx.lineTo(10,4); ctx.stroke();
            }
            if (gear.thorns) {
                ctx.shadowColor = '#9cff6e'; ctx.shadowBlur = 12; ctx.fillStyle = 'rgba(156,255,110,0.7)';
                for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i*9, -2); ctx.lineTo(i*9-3, -10); ctx.lineTo(i*9+3, -10); ctx.closePath(); ctx.fill(); }
            }
            if (gear.anchorPearl) {
                ctx.shadowColor = '#8cc7ff'; ctx.shadowBlur = 12; ctx.fillStyle = 'rgba(140,199,255,0.85)';
                ctx.beginPath(); ctx.arc(0, 12, 6, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle='rgba(220,240,255,0.8)'; ctx.lineWidth=1.5; ctx.stroke();
            }
            if (gear.prismHeart) {
                ctx.shadowColor = '#d7fbff'; ctx.shadowBlur = 14;
                ctx.fillStyle = `hsla(${(t*0.1)%360},80%,80%,0.85)`;
                ctx.beginPath(); ctx.moveTo(0,-6); ctx.lineTo(7,2); ctx.lineTo(0,10); ctx.lineTo(-7,2); ctx.closePath(); ctx.fill();
            }
            if (gear.marrowCharm) {
                ctx.shadowColor = '#ffe3cf'; ctx.shadowBlur = 10; ctx.strokeStyle = 'rgba(255,227,207,0.9)'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(-8,4); ctx.lineTo(8,4); ctx.moveTo(0,-2); ctx.lineTo(0,10); ctx.stroke();
            }

            // ── HAND slot: reach, gear, rift, relicStar ───────────────────
            if (gear.reach) {
                ctx.shadowColor = '#ffd966'; ctx.shadowBlur = 14;
                ctx.strokeStyle = 'rgba(255,217,102,0.95)'; ctx.lineWidth = 2.5;
                ctx.beginPath(); ctx.moveTo(18, -18); ctx.lineTo(35, -27); ctx.lineTo(45, -18); ctx.lineTo(31, -10); ctx.closePath(); ctx.stroke();
            }
            if (gear.gear) {
                ctx.shadowColor = '#aab8ff'; ctx.shadowBlur = 10; ctx.strokeStyle = 'rgba(170,184,255,0.85)'; ctx.lineWidth = 2;
                ctx.save(); ctx.translate(24,-14); ctx.rotate(t*.003);
                for (let i=0;i<6;i++){let a=i*Math.PI/3;ctx.beginPath();ctx.moveTo(Math.cos(a)*5,Math.sin(a)*5);ctx.lineTo(Math.cos(a)*9,Math.sin(a)*9);ctx.stroke();}
                ctx.restore();
            }
            if (gear.rift) {
                ctx.shadowColor = '#b46bff'; ctx.shadowBlur = 14; ctx.strokeStyle = 'rgba(180,107,255,0.85)'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(20,-22); ctx.lineTo(38,-30); ctx.moveTo(24,-12); ctx.lineTo(42,-18); ctx.stroke();
            }
            if (gear.relicStar) {
                ctx.shadowColor = '#fff6a8'; ctx.shadowBlur = 14; ctx.fillStyle = 'rgba(255,246,168,0.9)';
                for (let i=0;i<4;i++){let a=i*Math.PI/2+t*.003;ctx.beginPath();ctx.arc(30+Math.cos(a)*6,-18+Math.sin(a)*6,2,0,Math.PI*2);ctx.fill();}
            }

            // ── HAT slot: moon, crownShard, auroraPin, threadCrown, weaverHelm, starHalo, brokenTiara ──
            if (gear.moon) {
                ctx.shadowColor = '#dd99ff'; ctx.shadowBlur = 16;
                ctx.strokeStyle = 'rgba(221,153,255,0.95)'; ctx.lineWidth = 3;
                ctx.beginPath(); ctx.arc(0, -50, 12, Math.PI*0.25, Math.PI*1.75); ctx.stroke();
                ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.beginPath(); ctx.arc(7, -54, 2.5, 0, Math.PI*2); ctx.fill();
            }
            // of sharing one halo-arc shape with only color swapped.
            if (gear.threadCrown) {
                ctx.shadowColor = '#ffe680'; ctx.shadowBlur = 12; ctx.strokeStyle = 'rgba(255,230,128,0.95)'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(-13, -41); ctx.lineTo(-13, -50); ctx.lineTo(-6, -41); ctx.lineTo(0, -54); ctx.lineTo(6, -41); ctx.lineTo(13, -50); ctx.lineTo(13, -41); ctx.stroke();
                ctx.fillStyle = 'rgba(255,230,128,0.25)';
                ctx.beginPath(); ctx.moveTo(-13, -41); ctx.lineTo(13, -41); ctx.lineTo(13, -36); ctx.lineTo(-13, -36); ctx.closePath(); ctx.fill();
            }
            if (gear.weaverHelm) {
                ctx.shadowColor = '#d7c0ff'; ctx.shadowBlur = 12; ctx.fillStyle = 'rgba(215,192,255,0.5)';
                ctx.beginPath(); ctx.ellipse(0, -44, 15, 10, 0, Math.PI, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = 'rgba(235,220,255,0.9)'; ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.ellipse(0, -44, 15, 10, 0, Math.PI, Math.PI * 2); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(-15, -44); ctx.lineTo(-19, -36); ctx.moveTo(15, -44); ctx.lineTo(19, -36); ctx.stroke();
            }
            if (gear.starHalo) {
                ctx.shadowColor = '#fff2a8'; ctx.shadowBlur = 14; ctx.strokeStyle = 'rgba(255,242,168,0.95)'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.arc(0, -50, 16, 0, Math.PI * 2); ctx.stroke();
                for (let i = 0; i < 8; i++) {
                    const a = (i / 8) * Math.PI * 2 + t * 0.0012;
                    ctx.fillStyle = 'rgba(255,250,210,0.9)';
                    ctx.beginPath(); ctx.arc(Math.cos(a) * 16, -50 + Math.sin(a) * 16, 1.4, 0, Math.PI * 2); ctx.fill();
                }
            }
            if (gear.brokenTiara) {
                ctx.shadowColor = '#ffb7e8'; ctx.shadowBlur = 12; ctx.strokeStyle = 'rgba(255,183,232,0.95)'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(-13, -41); ctx.lineTo(-6, -52); ctx.lineTo(-1, -44);
                ctx.moveTo(4, -46); ctx.lineTo(7, -53); ctx.lineTo(14, -41); ctx.stroke();
                ctx.fillStyle = 'rgba(255,183,232,0.7)';
                ctx.beginPath(); ctx.arc(1, -45, 1.6, 0, Math.PI * 2); ctx.fill();
            }
            if (gear.crownShard) {
                ctx.shadowColor = '#d56bff'; ctx.shadowBlur = 12; ctx.fillStyle = 'rgba(213,107,255,0.85)';
                ctx.beginPath(); ctx.moveTo(-5,-44); ctx.lineTo(0,-56); ctx.lineTo(5,-44); ctx.closePath(); ctx.fill();
            }
            if (gear.auroraPin) {
                ctx.shadowColor = '#76ffd8'; ctx.shadowBlur = 12; ctx.fillStyle = 'rgba(118,255,216,0.9)';
                ctx.beginPath(); ctx.arc(9, -47, 3.5, 0, Math.PI*2); ctx.fill();
            }

            // ── FACE slot: tide, clock, hollowMask, goldenEye, voidEye, clockEye, starEye ──
            // recolored dot, so all four read as visually different at a glance.
            if (gear.goldenEye) {
                ctx.shadowColor = '#ffd966'; ctx.shadowBlur = 12; ctx.fillStyle = 'rgba(255,217,102,0.95)';
                ctx.beginPath(); ctx.arc(8, -24, 6, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = 'rgba(255,240,170,0.9)'; ctx.lineWidth = 1.5;
                for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; ctx.beginPath(); ctx.moveTo(8 + Math.cos(a) * 7, -24 + Math.sin(a) * 7); ctx.lineTo(8 + Math.cos(a) * 11, -24 + Math.sin(a) * 11); ctx.stroke(); }
            }
            if (gear.voidEye) {
                ctx.shadowColor = '#c266ff'; ctx.shadowBlur = 14; ctx.fillStyle = 'rgba(40,10,60,0.9)';
                ctx.beginPath(); ctx.arc(8, -24, 7, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = 'rgba(194,102,255,0.95)'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.arc(8, -24, 7, t * 0.003, t * 0.003 + Math.PI * 1.3); ctx.stroke();
                ctx.fillStyle = 'rgba(194,102,255,0.9)'; ctx.beginPath(); ctx.arc(8, -24, 2, 0, Math.PI * 2); ctx.fill();
            }
            if (gear.clockEye) {
                ctx.shadowColor = '#ffd37a'; ctx.shadowBlur = 12; ctx.strokeStyle = 'rgba(255,211,122,0.95)'; ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.arc(8, -24, 6.5, 0, Math.PI * 2); ctx.stroke();
                const a1 = t * 0.004, a2 = t * 0.0006;
                ctx.beginPath(); ctx.moveTo(8, -24); ctx.lineTo(8 + Math.cos(a1) * 4.5, -24 + Math.sin(a1) * 4.5); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(8, -24); ctx.lineTo(8 + Math.cos(a2) * 3, -24 + Math.sin(a2) * 3); ctx.stroke();
            }
            if (gear.starEye) {
                ctx.shadowColor = '#fff4b8'; ctx.shadowBlur = 14; ctx.fillStyle = 'rgba(255,244,184,0.95)';
                const spikes = 5, r1 = 7, r2 = 3;
                ctx.beginPath();
                for (let i = 0; i < spikes * 2; i++) {
                    const r = i % 2 === 0 ? r1 : r2;
                    const a = (i / (spikes * 2)) * Math.PI * 2 + t * 0.0015;
                    ctx.lineTo(8 + Math.cos(a) * r, -24 + Math.sin(a) * r);
                }
                ctx.closePath(); ctx.fill();
            }
            if (gear.tide) {
                ctx.shadowColor = '#66e6ff'; ctx.shadowBlur = 10; ctx.strokeStyle = 'rgba(102,230,255,0.8)'; ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.arc(-5, -24, 5, 0, Math.PI*2); ctx.stroke();
            }
            if (gear.clock) {
                ctx.shadowColor = '#ffd37a'; ctx.shadowBlur = 10; ctx.strokeStyle = 'rgba(255,211,122,0.85)'; ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.arc(-7, -24, 5, 0, Math.PI*2); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(-7,-24); ctx.lineTo(-7+Math.cos(t*.006)*4,-24+Math.sin(t*.006)*4); ctx.stroke();
            }
            if (gear.hollowMask) {
                ctx.shadowColor = '#c8d0ff'; ctx.shadowBlur = 10; ctx.strokeStyle = 'rgba(200,208,255,0.6)'; ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.moveTo(-12,-30); ctx.lineTo(16,-30); ctx.lineTo(13,-18); ctx.lineTo(-9,-18); ctx.closePath(); ctx.stroke();
            }

            // ── ORBIT slot: lantern, bell, echo, sunSpool, voidBell, cathedralBell, shadowCoin ──
            if (gear.lantern) {
                ctx.shadowColor = '#c7f6ff'; ctx.shadowBlur = 15; ctx.strokeStyle = '#c7f6ff'; ctx.fillStyle = 'rgba(199,246,255,0.65)';
                ctx.beginPath(); ctx.arc(-32, -30 + Math.sin(t*0.004)*4, 7, 0, Math.PI*2); ctx.fill(); ctx.stroke();
            }
            if (gear.bell) {
                ctx.shadowColor = '#f3f0aa'; ctx.shadowBlur = 12; ctx.fillStyle = 'rgba(243,240,170,0.8)';
                let a = t*.002; ctx.beginPath(); ctx.arc(Math.cos(a)*34, -20+Math.sin(a)*10, 4, 0, Math.PI*2); ctx.fill();
            }
            if (gear.echo) {
                ctx.shadowColor = '#a7f0ff'; ctx.shadowBlur = 10; ctx.strokeStyle = 'rgba(167,240,255,0.7)'; ctx.lineWidth = 1.5;
                let a = -t*.0025; ctx.beginPath(); ctx.arc(Math.cos(a)*30, -16+Math.sin(a)*9, 5, 0, Math.PI*2); ctx.stroke();
            }
            if (gear.sunSpool) {
                ctx.shadowColor = '#ffe36e'; ctx.shadowBlur = 14; ctx.fillStyle = 'rgba(255,227,110,0.85)';
                let a = t*.0018; ctx.beginPath(); ctx.arc(Math.cos(a)*28, -24+Math.sin(a)*8, 4, 0, Math.PI*2); ctx.fill();
            }
            if (gear.voidBell) {
                ctx.shadowColor = '#9b6bff'; ctx.shadowBlur = 12; ctx.fillStyle = 'rgba(155,107,255,0.8)';
                let a = t*.0022+Math.PI; ctx.beginPath(); ctx.arc(Math.cos(a)*30, -18+Math.sin(a)*9, 4, 0, Math.PI*2); ctx.fill();
            }
            if (gear.cathedralBell) {
                ctx.shadowColor = '#ff3355'; ctx.shadowBlur = 14; ctx.fillStyle = 'rgba(255,51,85,0.8)';
                let a = -t*.0016; ctx.beginPath(); ctx.arc(Math.cos(a)*33, -22+Math.sin(a)*10, 5, 0, Math.PI*2); ctx.fill();
            }
            if (gear.shadowCoin) {
                ctx.shadowColor = '#7a45ff'; ctx.shadowBlur = 12; ctx.strokeStyle = 'rgba(122,69,255,0.85)'; ctx.lineWidth = 1.5;
                let a = t*.0028; ctx.beginPath(); ctx.arc(Math.cos(a)*26, -14+Math.sin(a)*7, 4, 0, Math.PI*2); ctx.stroke();
            }

            // ── BACK slot: ribbon, ash, royalCape, threadWings, crystalMantle, cosmicCloak ──
            // (cape / feathered wings / faceted crystal / starry cloak)
            // instead of sharing one generic cloak triangle.
            if (gear.royalCape) {
                ctx.shadowColor = '#ff8d8d'; ctx.shadowBlur = 10; ctx.fillStyle = 'rgba(255,90,90,0.4)';
                ctx.beginPath(); ctx.moveTo(-14, -18); ctx.quadraticCurveTo(-32, 8, -22, 34); ctx.lineTo(0, 26); ctx.lineTo(22, 34); ctx.quadraticCurveTo(32, 8, 14, -18); ctx.closePath(); ctx.fill();
                ctx.strokeStyle = 'rgba(255,210,170,0.7)'; ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.moveTo(-14, -18); ctx.lineTo(0, 26); ctx.lineTo(14, -18); ctx.stroke();
            }
            if (gear.threadWings) {
                ctx.shadowColor = '#bdf7ff'; ctx.shadowBlur = 12; ctx.strokeStyle = 'rgba(189,247,255,0.85)'; ctx.lineWidth = 1.5;
                ctx.fillStyle = 'rgba(189,247,255,0.22)';
                for (let side = -1; side <= 1; side += 2) {
                    ctx.beginPath();
                    ctx.moveTo(side * 6, -8);
                    ctx.quadraticCurveTo(side * 30, -18, side * 38, 6);
                    ctx.quadraticCurveTo(side * 26, 16, side * 6, 14);
                    ctx.closePath(); ctx.fill(); ctx.stroke();
                    for (let f = 1; f <= 3; f++) {
                        ctx.beginPath(); ctx.moveTo(side * (6 + f * 9), -6 + f * 4); ctx.lineTo(side * (10 + f * 9), 8 + f * 2); ctx.stroke();
                    }
                }
            }
            if (gear.crystalMantle) {
                ctx.shadowColor = '#a6f7ff'; ctx.shadowBlur = 14;
                for (let i = -1; i <= 1; i++) {
                    const fx = i * 16, fy = -10 + Math.abs(i) * 6;
                    ctx.fillStyle = `rgba(166,247,255,${0.5 - Math.abs(i) * 0.1})`;
                    ctx.strokeStyle = 'rgba(220,255,255,0.85)'; ctx.lineWidth = 1.2;
                    ctx.beginPath(); ctx.moveTo(fx, fy - 14); ctx.lineTo(fx + 9, fy); ctx.lineTo(fx, fy + 20); ctx.lineTo(fx - 9, fy); ctx.closePath();
                    ctx.fill(); ctx.stroke();
                }
            }
            if (gear.cosmicCloak) {
                ctx.shadowColor = '#b68cff'; ctx.shadowBlur = 12; ctx.fillStyle = 'rgba(40,15,70,0.55)';
                ctx.beginPath(); ctx.moveTo(-14, -18); ctx.lineTo(-30, 22); ctx.lineTo(0, 34); ctx.lineTo(30, 22); ctx.lineTo(14, -18); ctx.closePath(); ctx.fill();
                ctx.fillStyle = 'rgba(230,210,255,0.9)';
                for (let i = 0; i < 6; i++) {
                    const sx = -20 + (i * 8) + Math.sin(t * 0.002 + i) * 2;
                    const sy = -6 + (i % 3) * 12;
                    ctx.beginPath(); ctx.arc(sx, sy, 1.1, 0, Math.PI * 2); ctx.fill();
                }
            }
            if (gear.skyRibbon) {
                ctx.shadowColor = '#8be9ff'; ctx.shadowBlur = 10; ctx.strokeStyle = 'rgba(139,233,255,0.75)'; ctx.lineWidth = 3;
                ctx.beginPath(); ctx.moveTo(-12, 5); ctx.bezierCurveTo(-34, 16, -28, 34, -55, 30); ctx.stroke();
            }
            if (gear.ash) {
                ctx.shadowColor = '#ff9a5c'; ctx.shadowBlur = 12; ctx.fillStyle = 'rgba(255,154,92,0.55)';
                for (let i=0;i<4;i++){let ey=12-((t*.03+i*17)%24);ctx.globalAlpha=Math.max(0,1-((t*.03+i*17)%24)/24);ctx.beginPath();ctx.arc(-20+i*4,ey,2,0,Math.PI*2);ctx.fill();}
                ctx.globalAlpha=1;
            }

            // ── FEET slot: needleBoots ─────────────────────────────────
            if (gear.needleBoots) {
                ctx.shadowColor = '#c9ffd8'; ctx.shadowBlur = 10; ctx.strokeStyle = 'rgba(201,255,216,0.85)'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(-10,22); ctx.lineTo(-10,30); ctx.moveTo(10,22); ctx.lineTo(10,30); ctx.stroke();
            }
            if (gear.jesusBoots) {
                ctx.shadowColor = '#fff9d6'; ctx.shadowBlur = 12; ctx.strokeStyle = 'rgba(255,249,214,0.9)'; ctx.lineWidth = 2.5;
                ctx.beginPath(); ctx.moveTo(-13,26); ctx.lineTo(-3,26); ctx.moveTo(3,26); ctx.lineTo(13,26); ctx.stroke();
                ctx.fillStyle = 'rgba(255,249,214,0.55)';
                ctx.beginPath(); ctx.ellipse(-8,28,7,3,0,0,Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.ellipse(8,28,7,3,0,0,Math.PI*2); ctx.fill();
            }

            // Eyes — expressive
            ctx.fillStyle = accentRgba(0.9);
            ctx.shadowColor = accentHex();
            ctx.shadowBlur = 8;
            ctx.beginPath(); ctx.ellipse(3, -24, 3.5, 4, 0, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(13, -24, 3.5, 4, 0, 0, Math.PI * 2); ctx.fill();
            // Eye shine
            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            ctx.shadowBlur = 0;
            ctx.beginPath(); ctx.arc(4.5, -25.5, 1.2, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(14.5, -25.5, 1.2, 0, Math.PI*2); ctx.fill();

            // A cone-shaped sword sweep formed entirely from layered motion-blur exposures.
            if (attacking) {
                const range = Math.max(48, player.attackRange || 55);
                const timer01 = Math.max(0, Math.min(1, player.attackTimer / 18));
                // Complete almost all of the visible swing in the opening frames,
                // then let the remaining attack time only fade the blur away.
                const elapsed01 = 1 - timer01;
                const swing01 = Math.min(1, elapsed01 * 2.85);
                const fade01 = Math.max(0, 1 - Math.max(0, elapsed01 - 0.42) / 0.58);
                const slashColor = player.slashStyle === "moon" ? '#e68cff' : currentRealm === "hell" ? '#ff5b2d' : currentRealm === "space" ? '#a66cff' : accentHex();
                let ox = 14, oy = -12, axis = 0;
                if (player.attackDir === 'up') { ox = 0; oy = -18; axis = -Math.PI / 2; }
                else if (player.attackDir === 'down') { ox = 0; oy = 18; axis = Math.PI / 2; }
                const radius = range + 22;
                const coneSpan = Math.min(1.72, 1.08 + range / 410);
                const sweepAngle = -0.94 + (1 - Math.pow(1 - swing01, 3.2)) * 1.88;
                // Eight broad exposures create the cone while keeping attacks cheap to draw.
                const trailCount = 8;
                ctx.save(); ctx.translate(ox, oy); ctx.rotate(axis); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
                for (let i = trailCount - 1; i >= 0; i--) {
                    const n = i / (trailCount - 1), exposure = 1 - n, a = sweepAngle - n * coneSpan;
                    const outerR = radius * (0.72 + exposure * 0.28), startR = 15 + n * 9, bend = 0.18 + n * 0.13;
                    const x0 = Math.cos(a - bend) * startR, y0 = Math.sin(a - bend) * startR;
                    const qx = Math.cos(a - bend * 0.42) * outerR * 0.54, qy = Math.sin(a - bend * 0.42) * outerR * 0.54;
                    const x1 = Math.cos(a) * outerR, y1 = Math.sin(a) * outerR;
                    const alpha = (0.045 + exposure * 0.19) * fade01;
                    ctx.globalAlpha = alpha * 2.75;
                    ctx.strokeStyle = slashColor;
                    ctx.lineWidth = 2.6 + exposure * (9.5 + range * .022);
                    // Only the leading exposures glow strongly; this avoids the expensive
                    // full-cone blur that previously dropped the frame rate.
                    ctx.shadowColor = slashColor;
                    ctx.shadowBlur = i < 3 ? 15 + exposure * 12 : 0;
                    ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo(qx,qy,x1,y1);ctx.stroke();
                }
                ctx.globalAlpha=1;
                for(let i=0;i<4;i++){
                    const n=(i+.5)/4,a=sweepAngle-coneSpan*n,rr=radius*(.84+.14*Math.sin(n*Math.PI));
                    ctx.globalAlpha=fade01;
                    ctx.strokeStyle=`rgba(255,255,255,${.045+(1-n)*.09})`; ctx.lineWidth=1+(1-n)*1.5; ctx.shadowColor=slashColor;ctx.shadowBlur=5;
                    ctx.beginPath();ctx.moveTo(Math.cos(a-.12)*22,Math.sin(a-.12)*22);ctx.quadraticCurveTo(Math.cos(a-.05)*rr*.56,Math.sin(a-.05)*rr*.56,Math.cos(a)*rr,Math.sin(a)*rr);ctx.stroke();
                }
                const a=sweepAngle,rr=radius+4,x0=Math.cos(a-.15)*19,y0=Math.sin(a-.15)*19,x1=Math.cos(a)*rr,y1=Math.sin(a)*rr;
                const lead=ctx.createLinearGradient(x0,y0,x1,y1);lead.addColorStop(0,'rgba(255,255,255,0)');lead.addColorStop(.58,slashColor);lead.addColorStop(1,'rgba(255,255,255,.98)');
                ctx.globalAlpha=fade01;ctx.strokeStyle=lead;ctx.lineWidth=Math.max(3.4,5+range*.018);ctx.shadowColor=slashColor;ctx.shadowBlur=16;ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo(Math.cos(a-.055)*rr*.54,Math.sin(a-.055)*rr*.54,x1,y1);ctx.stroke();
                ctx.restore();
            }
            drawEquippedCosmetics();
            ctx.restore();
        }

        // Generic per-item cosmetic layer. Every EQUIPMENT_TYPES entry (base
        // items, all boss rewards across every expansion, and future ones) gets
        // a real visible marker on the player automatically, driven off its
        // `slot` field and `color` — no per-item hardcoding needed, so nothing
        // can ship without a cosmetic again. Multiple items sharing a slot
        // stack outward instead of overlapping.
        function drawEquippedCosmetics() {
            const equipped = player.equippedEquipment || [];
            if (!equipped.length) return;
            const t = Date.now();
            const bySlot = {};
            for (const id of equipped) {
                const def = getEquipmentDef(id);
                const slot = def.slot || 'orbit';
                (bySlot[slot] = bySlot[slot] || []).push(def);
            }
            for (const slot in bySlot) {
                bySlot[slot].forEach((def, i) => {
                    const col = def.color;
                    ctx.save();
                    ctx.shadowColor = col; ctx.shadowBlur = 8; ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineWidth = 2;
                    if (slot === 'hat') {
                        ctx.beginPath(); ctx.moveTo(-6, -46 - i * 9); ctx.lineTo(0, -57 - i * 9); ctx.lineTo(6, -46 - i * 9); ctx.closePath(); ctx.fill(); ctx.stroke();
                    } else if (slot === 'face') {
                        ctx.beginPath(); ctx.moveTo(-9, -22 + i * 5); ctx.lineTo(9, -22 + i * 5); ctx.stroke();
                    } else if (slot === 'chest') {
                        ctx.beginPath(); ctx.arc(0, -2 + i * 10, 4, 0, Math.PI * 2); ctx.fill();
                    } else if (slot === 'hand') {
                        ctx.beginPath(); ctx.arc(16, 6, 5 + i * 4, 0, Math.PI * 2); ctx.stroke();
                    } else if (slot === 'back') {
                        ctx.globalAlpha = 0.6;
                        ctx.beginPath(); ctx.moveTo(-14, -20 - i * 4); ctx.quadraticCurveTo(-34 - i * 7, 0, -14, 22 + i * 4); ctx.quadraticCurveTo(-20, 0, -14, -20 - i * 4); ctx.fill();
                    } else if (slot === 'trail') {
                        ctx.globalAlpha = 0.65;
                        const dragX = -player.vx * (2 + i);
                        ctx.beginPath(); ctx.arc(dragX - 10 - i * 6, 10 + Math.sin(t * 0.01 + i) * 4, 3, 0, Math.PI * 2); ctx.fill();
                    } else if (slot === 'feet') {
                        ctx.globalAlpha = 0.7;
                        ctx.beginPath(); ctx.ellipse(0, 30, 10 - i * 2, 3, 0, 0, Math.PI * 2); ctx.fill();
                    } else { // orbit (default)
                        const a = t * 0.003 + i * (Math.PI * 2 / 3) + i;
                        const r = 34 + i * 6;
                        ctx.beginPath(); ctx.arc(Math.cos(a) * r, -14 + Math.sin(a) * (r * 0.6), 3.5, 0, Math.PI * 2); ctx.fill();
                    }
                    ctx.restore();
                });
            }
        }

        function drawEnemy(e, screenX) {

            ctx.save();
            let t = Date.now();
            let cx = screenX + e.width / 2;
            let cy = e.y + e.height / 2;
            if (e.type >= 1 && e.type <= 5) {
                let glow, core, ring;
                if (currentRealm === "hell")    { glow='rgba(255,40,0,0.35)';  core='#ff4422'; ring='rgba(255,100,30,0.9)'; }
                else if (currentRealm === "space") { glow='rgba(100,60,255,0.35)'; core='#7755ff'; ring='rgba(160,120,255,0.9)'; }
                else if (currentRealm === "storm") { glow='rgba(60,220,255,0.35)'; core='#55ddff'; ring='rgba(160,250,255,0.9)'; }
                else if (currentRealm === "void") { glow='rgba(180,60,255,0.35)'; core='#cc66ff'; ring='rgba(230,160,255,0.9)'; }
                else { glow='rgba(100,140,255,0.25)'; core='#8899cc'; ring='rgba(180,200,255,0.8)'; }

                if (e.type === 1) {
                    let pulse = 1 + Math.sin(t * 0.004 + e.floatOffset) * 0.15;
                    let aura = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28 * pulse);
                    aura.addColorStop(0, glow); aura.addColorStop(1, 'rgba(0,0,0,0)');
                    ctx.fillStyle = aura; ctx.beginPath(); ctx.arc(cx, cy, 28 * pulse, 0, Math.PI*2); ctx.fill();
                    ctx.shadowColor = ring; ctx.shadowBlur = 16;
                    ctx.strokeStyle = ring; ctx.lineWidth = 2;
                    for (let a = 0; a < Math.PI*2; a += Math.PI/4) {
                        let angle = a + t * 0.008;
                        ctx.beginPath();
                        ctx.moveTo(cx + Math.cos(angle) * 10, cy + Math.sin(angle) * 10);
                        ctx.lineTo(cx + Math.cos(angle) * 23 * pulse, cy + Math.sin(angle) * 23 * pulse);
                        ctx.stroke();
                    }
                    let radGrad = ctx.createRadialGradient(cx-4, cy-4, 1, cx, cy, 14);
                    radGrad.addColorStop(0, '#ffffff'); radGrad.addColorStop(0.4, core); radGrad.addColorStop(1, 'rgba(0,0,0,0.5)');
                    ctx.fillStyle = radGrad; ctx.shadowBlur = 20;
                    ctx.beginPath(); ctx.arc(cx, cy, 14 * pulse, 0, Math.PI*2); ctx.fill();
                } else if (e.type === 2) {
                    let bob = Math.sin(t * 0.003 + e.floatOffset) * 10;
                    let eyY = e.y + bob;
                    let halo = ctx.createRadialGradient(cx, eyY + 10, 2, cx, eyY + 10, 30);
                    halo.addColorStop(0, glow); halo.addColorStop(1, 'rgba(0,0,0,0)');
                    ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(cx, eyY + 10, 30, 0, Math.PI*2); ctx.fill();
                    ctx.shadowColor = ring; ctx.shadowBlur = 18;
                    ctx.fillStyle = core;
                    ctx.beginPath();
                    ctx.moveTo(cx - 14, eyY + 5);
                    ctx.bezierCurveTo(cx - 14, eyY - 20, cx + 14, eyY - 20, cx + 14, eyY + 5);
                    ctx.lineTo(cx + 12, eyY + 22);
                    let w2 = Math.sin(t * 0.01 + e.floatOffset) * 5;
                    ctx.bezierCurveTo(cx + 8, eyY + 30 + w2, cx, eyY + 24 + w2, cx - 4, eyY + 30 - w2);
                    ctx.lineTo(cx - 12, eyY + 22);
                    ctx.closePath();
                    ctx.fill();
                    ctx.strokeStyle = ring; ctx.lineWidth = 1.5; ctx.stroke();
                    ctx.fillStyle = '#fff'; ctx.shadowBlur = 6;
                    ctx.beginPath(); ctx.ellipse(cx - 4, eyY - 4, 3, 3.5, 0, 0, Math.PI*2); ctx.fill();
                    ctx.beginPath(); ctx.ellipse(cx + 5, eyY - 4, 3, 3.5, 0, 0, Math.PI*2); ctx.fill();
                } else if (e.type === 3) {
                    ctx.shadowColor = ring; ctx.shadowBlur = 20;
                    for (let i = 0; i < 3; i++) {
                        let rot = t * 0.005 * (i % 2 === 0 ? 1 : -1) + (i * Math.PI / 3);
                        let r = 10 + i * 6;
                        ctx.strokeStyle = i === 1 ? ring : core;
                        ctx.lineWidth = 2 - i * 0.3;
                        ctx.beginPath();
                        for (let a = 0; a < Math.PI*2; a += Math.PI/4) {
                            let px = cx + Math.cos(a + rot) * r;
                            let py = cy + Math.sin(a + rot) * r;
                            a === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                        }
                        ctx.closePath(); ctx.stroke();
                    }
                    let radGrad2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, 8);
                    radGrad2.addColorStop(0, '#ffffff'); radGrad2.addColorStop(1, core);
                    ctx.fillStyle = radGrad2;
                    ctx.beginPath(); ctx.arc(cx, cy, 8, 0, Math.PI*2); ctx.fill();
                } else if (e.type === 4) {
                    let wingBeat = Math.sin(t * 0.02 + e.floatOffset) * 10;
                    ctx.shadowColor = ring; ctx.shadowBlur = 18;
                    ctx.fillStyle = core;
                    ctx.beginPath();
                    ctx.moveTo(cx, cy - 10);
                    ctx.lineTo(cx - 28, cy - 4 - wingBeat);
                    ctx.lineTo(cx - 10, cy + 8);
                    ctx.lineTo(cx, cy + 14);
                    ctx.lineTo(cx + 10, cy + 8);
                    ctx.lineTo(cx + 28, cy - 4 - wingBeat);
                    ctx.closePath();
                    ctx.fill();
                    ctx.strokeStyle = ring; ctx.lineWidth = 1.5; ctx.stroke();
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath(); ctx.arc(cx - 5, cy - 2, 2.5, 0, Math.PI*2); ctx.fill();
                    ctx.beginPath(); ctx.arc(cx + 5, cy - 2, 2.5, 0, Math.PI*2); ctx.fill();
                } else if (e.type === 5) {
                    let pulse = 1 + Math.sin(t * 0.004 + e.floatOffset) * 0.08;
                    ctx.shadowColor = ring; ctx.shadowBlur = 22;
                    ctx.strokeStyle = ring; ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.arc(cx, cy, 20 * pulse, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.fillStyle = core;
                    ctx.beginPath();
                    ctx.moveTo(cx, cy - 24);
                    ctx.lineTo(cx + 22, cy);
                    ctx.lineTo(cx, cy + 24);
                    ctx.lineTo(cx - 22, cy);
                    ctx.closePath();
                    ctx.fill();
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI*2); ctx.fill();
                }
                ctx.restore();
                return;
            }

            let pulse = 1 + Math.sin(t * 0.005 + e.floatOffset) * 0.12;
            let palette = {
                1:['#8899cc','rgba(180,200,255,0.9)'], 2:['#8899cc','rgba(180,200,255,0.9)'], 3:['#8899cc','rgba(180,200,255,0.9)'],
                4:['#55ddff','rgba(160,250,255,0.95)'], 5:['#cc66ff','rgba(230,160,255,0.95)'], 6:['#9edfa8','rgba(220,255,225,0.95)'],
                7:['#8f8fff','rgba(210,210,255,0.95)'], 8:['#bba0cc','rgba(245,220,255,0.95)'], 9:['#77b8ff','rgba(200,230,255,0.95)'],
                10:['#7f879c','rgba(230,235,255,0.95)'], 11:['#c7a2ff','rgba(235,210,255,0.95)'], 12:['#ffc94a','rgba(255,240,160,0.95)'],
                13:['#ff8a2a','rgba(255,220,120,0.95)'], 14:['#8f4bd0','rgba(235,190,255,0.95)'], 15:['#aab8ff','rgba(230,235,255,0.95)'],
                16:['#bdf7ff','rgba(230,255,255,0.95)'], 17:['#66e6ff','rgba(200,250,255,0.95)'], 18:['#72d965','rgba(210,255,190,0.95)'],
                19:['#ff66aa','rgba(255,210,235,0.95)'], 20:['#8b8bff','rgba(225,225,255,0.95)'], 21:['#62d8ff','rgba(210,250,255,0.95)'],
                22:['#ffffff','rgba(220,250,255,0.95)'], 23:['#375020','rgba(190,255,150,0.95)'], 28:['#ff9a5c','rgba(255,220,170,0.95)'], 29:['#a7f0ff','rgba(220,255,255,0.95)'], 30:['#d56bff','rgba(240,200,255,0.95)'],
                24:['#d2f5ff','rgba(225,250,255,0.98)'], 25:['#ff9d72','rgba(255,220,190,0.95)'], 26:['#d6d0ff','rgba(235,232,255,0.95)'], 27:['#ff9dff','rgba(255,215,255,0.95)'], 31:['#55ffcc','rgba(180,255,235,0.95)'], 32:['#ffc85c','rgba(255,230,160,0.95)'],
                33:['#d7fbff','rgba(235,255,255,0.98)'], 34:['#7c0b22','rgba(255,100,130,0.95)']
            }[e.type] || ['#8899cc','rgba(180,200,255,0.9)'];
            let core = palette[0], ring = palette[1];
            ctx.shadowColor = ring; ctx.shadowBlur = 18; ctx.fillStyle = core; ctx.strokeStyle = ring; ctx.lineWidth = 2;
            function eye(x,y,r=3){ ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.fillStyle=core; }
            if (e.type === 1) {
                ctx.beginPath(); ctx.arc(cx, cy, 14*pulse, 0, Math.PI*2); ctx.fill(); ctx.stroke();
                for(let a=0;a<Math.PI*2;a+=Math.PI/4){ctx.beginPath();ctx.moveTo(cx+Math.cos(a+t*.008)*12,cy+Math.sin(a+t*.008)*12);ctx.lineTo(cx+Math.cos(a+t*.008)*24,cy+Math.sin(a+t*.008)*24);ctx.stroke();}
            } else if (e.type === 2 || e.type === 11) {
                let bob=Math.sin(t*.004+e.floatOffset)*8; for(let c=0;c<(e.type===11?3:1);c++){ctx.globalAlpha=c?0.25:0.9;let ox=(c-1)*10;ctx.beginPath();ctx.moveTo(cx-14+ox,cy-15+bob);ctx.bezierCurveTo(cx-14+ox,cy-35+bob,cx+14+ox,cy-35+bob,cx+14+ox,cy-15+bob);ctx.lineTo(cx+11+ox,cy+16+bob);ctx.lineTo(cx+ox,cy+6+bob);ctx.lineTo(cx-11+ox,cy+16+bob);ctx.closePath();ctx.fill();ctx.stroke();} ctx.globalAlpha=1; eye(cx-5,cy-10+bob,2.5); eye(cx+5,cy-10+bob,2.5);
            } else if ([4,7,16].includes(e.type)) {
                let beat=Math.sin(t*.018+e.floatOffset)*12; ctx.beginPath();ctx.moveTo(cx,cy-10);ctx.lineTo(cx-30,cy-beat);ctx.lineTo(cx-12,cy+8);ctx.lineTo(cx,cy+15);ctx.lineTo(cx+12,cy+8);ctx.lineTo(cx+30,cy-beat);ctx.closePath();ctx.fill();ctx.stroke();eye(cx-5,cy-2,2.3);eye(cx+5,cy-2,2.3);
            } else if (e.type === 3) {
                for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(cx,cy,12+i*7,8+i*5,t*.006*(i%2? -1:1),0,Math.PI*2);ctx.stroke();} ctx.beginPath();ctx.arc(cx,cy,8,0,Math.PI*2);ctx.fill();
            } else if (e.type === 5) {
                ctx.beginPath();ctx.moveTo(cx,cy-25);ctx.lineTo(cx+23,cy);ctx.lineTo(cx,cy+25);ctx.lineTo(cx-23,cy);ctx.closePath();ctx.fill();ctx.stroke();eye(cx,cy,6);
            } else if (e.type === 6) {
                ctx.beginPath();ctx.ellipse(cx,cy+5,16*pulse,9,0,0,Math.PI*2);ctx.fill();ctx.stroke();for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(cx+i*6,cy+10);ctx.lineTo(cx+i*8,cy+18);ctx.stroke();}eye(cx+6,cy+2,2.2);
            } else if (e.type === 8) {
                ctx.beginPath();ctx.roundRect(cx-14,cy-23,28,44,8);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(cx-11,cy-4);ctx.lineTo(cx+10,cy+9);ctx.stroke();eye(cx-5,cy-10,3);ctx.beginPath();ctx.arc(cx+6,cy-10,4,0,Math.PI*2);ctx.stroke();
            } else if (e.type === 9) {
                ctx.beginPath();ctx.arc(cx,cy-10,18*pulse,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(cx,cy-10);ctx.lineTo(cx,cy-23);ctx.moveTo(cx,cy-10);ctx.lineTo(cx+11,cy-5);ctx.stroke();ctx.beginPath();ctx.moveTo(cx-14,cy+8);ctx.lineTo(cx+14,cy+8);ctx.lineTo(cx+8,cy+27);ctx.lineTo(cx-8,cy+27);ctx.closePath();ctx.fill();ctx.stroke();
            } else if (e.type === 10) {
                ctx.beginPath();ctx.moveTo(cx,cy-31);ctx.lineTo(cx+20,cy-10);ctx.lineTo(cx+13,cy+29);ctx.lineTo(cx-13,cy+29);ctx.lineTo(cx-20,cy-10);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(cx-8,cy-20);ctx.lineTo(cx+4,cy+2);ctx.lineTo(cx-2,cy+9);ctx.lineTo(cx+9,cy+23);ctx.stroke();eye(cx-6,cy-13,2.5);eye(cx+6,cy-13,2.5);
            } else if (e.type === 12) {
                ctx.beginPath();for(let i=0;i<10;i++){let a=t*.004+i*Math.PI/5,r=i%2?9:24;let px=cx+Math.cos(a)*r,py=cy+Math.sin(a)*r;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();ctx.fill();ctx.stroke();eye(cx,cy,7);
            } else if (e.type === 13 || e.type === 17 || e.type === 21) {
                for(let i=0;i<6;i++){let sx=cx-35+i*14,sy=cy+Math.sin(t*.01+i+e.floatOffset)*8;ctx.beginPath();ctx.arc(sx,sy,10-i*.5,0,Math.PI*2);ctx.fill();ctx.stroke();}eye(cx+35,cy-3,2.4);
            } else if (e.type === 14 || e.type === 20 || e.type === 23) {
                ctx.beginPath();ctx.roundRect(cx-32,cy-42,64,80,14);ctx.fill();ctx.stroke();for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(cx-23,cy+i*11);ctx.lineTo(cx+23,cy-i*11);ctx.stroke();}eye(cx-9,cy-18,4);eye(cx+9,cy-18,4);
            } else if (e.type === 15) {
                for(let i=0;i<4;i++){ctx.beginPath();ctx.ellipse(cx,cy,24,10,t*.004+i*Math.PI/4,0,Math.PI*2);ctx.stroke();}ctx.beginPath();ctx.rect(cx-13,cy-13,26,26);ctx.fill();ctx.stroke();eye(cx,cy,5);
            } else if (e.type === 18) {
                ctx.beginPath();ctx.moveTo(cx,cy-34);ctx.bezierCurveTo(cx+28,cy-10,cx+20,cy+34,cx,cy+35);ctx.bezierCurveTo(cx-20,cy+34,cx-28,cy-10,cx,cy-34);ctx.fill();ctx.stroke();for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(cx,cy-5);ctx.lineTo(cx+i*14,cy+30);ctx.stroke();}eye(cx-6,cy-12,3);eye(cx+6,cy-12,3);
            } else if (e.type === 19) {
                let beat=Math.sin(t*.02+e.floatOffset)*14;ctx.beginPath();ctx.moveTo(cx,cy-16);ctx.lineTo(cx-28,cy+beat);ctx.lineTo(cx-8,cy+6);ctx.lineTo(cx,cy+18);ctx.lineTo(cx+8,cy+6);ctx.lineTo(cx+28,cy-beat);ctx.closePath();ctx.fill();ctx.stroke();eye(cx,cy-4,3);
            } else if (e.type === 22) {
                for(let i=0;i<5;i++){let a=t*.004+i*Math.PI*0.4;ctx.beginPath();ctx.arc(cx+Math.cos(a)*20,cy+Math.sin(a)*20,9,0,Math.PI*2);ctx.fill();ctx.stroke();}eye(cx,cy,5);
            } else if (e.type === 24) {
                for(let i=0;i<4;i++){let a=t*.006+i*Math.PI/2;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*8,cy+Math.sin(a)*8);ctx.lineTo(cx+Math.cos(a)*33,cy+Math.sin(a)*33);ctx.stroke();}
                ctx.beginPath();ctx.moveTo(cx,cy-28);ctx.lineTo(cx+25,cy);ctx.lineTo(cx,cy+28);ctx.lineTo(cx-25,cy);ctx.closePath();ctx.fill();ctx.stroke();eye(cx,cy,5);
            } else if (e.type === 25) {
                let sway=Math.sin(t*.01+e.floatOffset)*10;ctx.beginPath();ctx.ellipse(cx,cy,38,15+sway*.2,0,0,Math.PI*2);ctx.fill();ctx.stroke();
                for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(cx+i*14,cy+8);ctx.quadraticCurveTo(cx+i*12+sway,cy+28,cx+i*18,cy+42);ctx.stroke();}eye(cx+24,cy-3,3);
            } else if (e.type === 26) {
                ctx.beginPath();ctx.roundRect(cx-30,cy-40,60,78,12);ctx.fill();ctx.stroke();
                for(let i=0;i<6;i++){let yy=cy-30+i*13;ctx.beginPath();ctx.moveTo(cx-22,yy);ctx.lineTo(cx+22,yy+Math.sin(t*.008+i)*6);ctx.stroke();}eye(cx-9,cy-18,3.5);eye(cx+9,cy-18,3.5);
            } else if (e.type === 27) {
                for(let i=0;i<7;i++){let a=t*.006+i*Math.PI*2/7;ctx.beginPath();ctx.arc(cx+Math.cos(a)*25,cy+Math.sin(a)*25,7,0,Math.PI*2);ctx.fill();ctx.stroke();}
                ctx.beginPath();ctx.arc(cx,cy,14,0,Math.PI*2);ctx.fill();ctx.stroke();eye(cx,cy,4.5);
            } else if (e.type === 28) {
                for(let i=0;i<5;i++){let a=t*.008+i*Math.PI*2/5;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*36,cy+Math.sin(a)*36);ctx.stroke();}
                ctx.beginPath();ctx.arc(cx,cy,22*pulse,0,Math.PI*2);ctx.fill();ctx.stroke();eye(cx-6,cy-5,3);eye(cx+6,cy-5,3);
            } else if (e.type === 29) {
                let wave=Math.sin(t*.009+e.floatOffset)*12;ctx.beginPath();ctx.ellipse(cx,cy,42,18,0,0,Math.PI*2);ctx.fill();ctx.stroke();
                for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(cx+i*15,cy+12);ctx.bezierCurveTo(cx+i*13+wave,cy+28,cx+i*18-wave,cy+40,cx+i*16,cy+52);ctx.stroke();}eye(cx+27,cy-2,3.2);
            } else if (e.type === 30) {
                ctx.beginPath();ctx.roundRect(cx-36,cy-48,72,94,16);ctx.fill();ctx.stroke();
                ctx.strokeStyle='rgba(255,255,255,0.85)';for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(cx,cy-8,18+i*10,t*.004+i,Math.PI+t*.004+i);ctx.stroke();}eye(cx-12,cy-20,4);eye(cx+12,cy-20,4);
            } else if (e.type === 31) {
                let spin=t*.009+e.floatOffset;for(let i=0;i<6;i++){let a=spin+i*Math.PI/3;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*42,cy+Math.sin(a)*30);ctx.stroke();}
                ctx.beginPath();ctx.ellipse(cx,cy,28,22,spin*.3,0,Math.PI*2);ctx.fill();ctx.stroke();eye(cx-7,cy-4,3);eye(cx+7,cy-4,3);
            } else if (e.type === 32) {
                for(let i=0;i<8;i++){let a=t*.004+i*Math.PI/4;ctx.beginPath();ctx.arc(cx+Math.cos(a)*32,cy+Math.sin(a)*38,8,0,Math.PI*2);ctx.fill();ctx.stroke();}
                ctx.beginPath();ctx.roundRect(cx-38,cy-50,76,98,18);ctx.fill();ctx.stroke();ctx.strokeStyle='rgba(255,255,255,0.85)';for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(cx+i*12,cy-34);ctx.lineTo(cx-i*10,cy+36);ctx.stroke();}eye(cx-12,cy-20,4);eye(cx+12,cy-20,4);
            } else if (e.type === 33) {
                for(let i=0;i<6;i++){let a=t*.01+i*Math.PI/3;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*12,cy+Math.sin(a)*12);ctx.lineTo(cx+Math.cos(a)*42,cy+Math.sin(a)*42);ctx.stroke();}
                ctx.beginPath();ctx.moveTo(cx,cy-34);ctx.lineTo(cx+30,cy);ctx.lineTo(cx,cy+34);ctx.lineTo(cx-30,cy);ctx.closePath();ctx.fill();ctx.stroke();eye(cx,cy,5);
            } else if (e.type === 34) {
                ctx.beginPath();ctx.roundRect(cx-42,cy-54,84,108,18);ctx.fill();ctx.stroke();
                ctx.strokeStyle='rgba(255,190,200,0.95)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(cx-24,cy-20);ctx.lineTo(cx+24,cy+20);ctx.moveTo(cx+24,cy-20);ctx.lineTo(cx-24,cy+20);ctx.stroke();eye(cx-13,cy-28,4);eye(cx+13,cy-28,4);
            } else if (e.type === 35) {
                let spin=t*.008+e.floatOffset;for(let i=0;i<5;i++){let a=spin+i*Math.PI*0.4;ctx.beginPath();ctx.arc(cx+Math.cos(a)*28,cy+Math.sin(a)*22,9,0,Math.PI*2);ctx.fill();ctx.stroke();}
                ctx.beginPath();ctx.moveTo(cx,cy-32);ctx.lineTo(cx+28,cy-6);ctx.lineTo(cx+14,cy+30);ctx.lineTo(cx-18,cy+28);ctx.lineTo(cx-30,cy-8);ctx.closePath();ctx.fill();ctx.stroke();eye(cx-7,cy-6,3);eye(cx+8,cy-6,3);
            } else if (e.type === 36) {
                let beat=Math.sin(t*.018+e.floatOffset)*16;ctx.beginPath();ctx.moveTo(cx,cy-20);ctx.lineTo(cx-42,cy+beat);ctx.lineTo(cx-12,cy+8);ctx.lineTo(cx,cy+26);ctx.lineTo(cx+12,cy+8);ctx.lineTo(cx+42,cy-beat);ctx.closePath();ctx.fill();ctx.stroke();eye(cx-6,cy-6,3);eye(cx+6,cy-6,3);
            } else if (e.type === 37) {
                ctx.beginPath();ctx.roundRect(cx-44,cy-58,88,112,20);ctx.fill();ctx.stroke();ctx.strokeStyle='rgba(120,70,50,0.9)';ctx.lineWidth=3;for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(cx-30,cy+i*14);ctx.lineTo(cx+30,cy-i*10);ctx.stroke();}eye(cx-12,cy-26,4);eye(cx+12,cy-26,4);
            } else if (e.type === 38) {
                for(let i=0;i<8;i++){let a=t*.006+i*Math.PI/4;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*16,cy+Math.sin(a)*16);ctx.lineTo(cx+Math.cos(a)*46,cy+Math.sin(a)*46);ctx.stroke();}
                ctx.beginPath();ctx.arc(cx,cy,30,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='rgba(20,20,35,.7)';ctx.beginPath();ctx.arc(cx,cy,12,0,Math.PI*2);ctx.fill();eye(cx,cy,5);
            }
            ctx.restore();
            // Extra glow pass for newer enemies
            if (e.type >= 15) {
                ctx.save();
                ctx.globalAlpha = 0.18;
                ctx.fillStyle = ring || '#ffffff';
                ctx.beginPath();
                ctx.arc(cx, cy, Math.max(e.width, e.height) * 0.7, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        function drawHeal(h, screenX) {
            ctx.save();
            let t = Date.now();
            let bob = Math.sin(t * 0.004 + h.bounceOffset) * 6;
            let pulse = 0.85 + Math.sin(t * 0.006 + h.bounceOffset) * 0.15;
            let cx = screenX + h.width / 2;
            let cy = h.y + bob + h.height / 2;

            // Glow ring
            let glow = ctx.createRadialGradient(cx, cy, 2, cx, cy, 28 * pulse);
            glow.addColorStop(0, 'rgba(34,220,140,0.4)');
            glow.addColorStop(1, 'rgba(34,220,140,0)');
            ctx.fillStyle = glow;
            ctx.beginPath(); ctx.arc(cx, cy, 28 * pulse, 0, Math.PI*2); ctx.fill();

            ctx.shadowColor = '#22ee99'; ctx.shadowBlur = 20;

            // Cross shape
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(cx - 3, cy - 10, 6, 20); // vertical
            ctx.fillRect(cx - 10, cy - 3, 20, 6); // horizontal
            ctx.strokeStyle = '#22ee99';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(cx - 3, cy - 10, 6, 20);
            ctx.strokeRect(cx - 10, cy - 3, 20, 6);

            // Orbiting sparkle
            let sx = cx + Math.cos(t * 0.006) * 16;
            let sy = cy + Math.sin(t * 0.006) * 16;
            ctx.fillStyle = '#aaffdd';
            ctx.beginPath(); ctx.arc(sx, sy, 3, 0, Math.PI*2); ctx.fill();
            ctx.restore();
        }

        function getMagicItemDef(type) {
            return MAGIC_ITEM_TYPES.find(item => item.id === type) || MAGIC_ITEM_TYPES[0];
        }

        function drawMagicItem(item, screenX) {
            const def = getMagicItemDef(item.type);
            drawMagicLikeItem(item, screenX, def, false);
        }

        function drawCosmeticItem(item, screenX) {
            const def = getCosmeticDef(item.type);
            drawMagicLikeItem(item, screenX, def, true);
        }

        function drawMagicLikeItem(item, screenX, def, cosmeticOnly) {
            ctx.save();
            let t = Date.now();
            let bob = Math.sin(t * 0.004 + item.bounceOffset) * 7;
            let cx = screenX + item.width / 2;
            let cy = item.y + bob + item.height / 2;
            let pulse = 1 + Math.sin(t * 0.006 + item.bounceOffset) * 0.12;

            let glow = ctx.createRadialGradient(cx, cy, 1, cx, cy, 38 * pulse);
            glow.addColorStop(0, def.color.replace('#', 'rgba(') === def.color ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.4)');
            glow.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = glow;
            ctx.beginPath(); ctx.arc(cx, cy, 38 * pulse, 0, Math.PI * 2); ctx.fill();

            ctx.shadowColor = def.color;
            ctx.shadowBlur = 20;
            ctx.strokeStyle = def.color;
            ctx.fillStyle = 'rgba(255,255,255,0.92)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                let angle = t * 0.003 + i * Math.PI / 3;
                let r = i % 2 === 0 ? 14 * pulse : 7 * pulse;
                let px = cx + Math.cos(angle) * r;
                let py = cy + Math.sin(angle) * r;
                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.shadowBlur = 0;
            ctx.fillStyle = def.color;
            ctx.font = 'bold 8px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText(def.short, cx, cy + 3);
            ctx.restore();
        }


        function healPlayer(amount = 1) {
            player.lives = Math.max(1, Math.floor((player.lives || 1) + amount));
            updateUI();
        }

        function collectEquipmentItem(type, source = "pickup") {
            const def = getEquipmentDef(type);
            player.collectedEquipment = player.collectedEquipment || [];
            player.equippedEquipment = player.equippedEquipment || [];
            player.collectedMagic = player.collectedMagic || [];
            player.collectedCosmetics = player.collectedCosmetics || [];
            player.cosmetics = player.cosmetics || {};
            player.heartCharmCooldowns = player.heartCharmCooldowns || {};

            const alreadyOwned = player.collectedEquipment.includes(type);
            if (!alreadyOwned) {
                player.collectedEquipment.push(type);
                player.collectedMagic.push(type);
                player.collectedCosmetics.push(type);
                if (player.equippedEquipment.length < EQUIPMENT_LIMIT) player.equippedEquipment.push(type);
                score += source === "boss" ? 1000 : 300;
            }
            recalculateEquipmentEffects();
            if (!alreadyOwned && (player.equippedEquipment || []).includes(type) && heartCharmBonus(type) > 0) healPlayer(heartCharmBonus(type));
            showMagicNotice({ name: alreadyOwned ? def.name + " Already Owned" : def.name, id: type });
            addParticles(player.worldX - worldX, player.worldY, def.color);
            playPickupChime(alreadyOwned ? 0 : 1);
            renderEquipmentMenu();
            updateUI();
            saveGame();
        }

        function applyMagicItem(type) {
            collectEquipmentItem(type, "pickup");
        }

        function applyCosmeticItem(type) {
            collectEquipmentItem(type, "pickup");
        }

        function equipmentEffectText(type) {
            const def = getEquipmentDef(type);
            const effects = {
                ember: '+2 lives when equipped.',
                swift: 'Faster movement and acceleration.',
                guard: 'Safer falling and a guard shield.',
                reach: 'Much larger slash range.',
                moon: 'Moonlit slashes. Jump physics stay normal.',
                mirror: 'Slightly wider attack arc.',
                gear: 'More speed and taller attack hitbox.',
                thorn: 'Wider slash and safer fall speed.',
                tide: 'Smoother movement control.',
                lantern: 'Floating lantern and hidden reward sense.',
                rift: 'Double slash style and wider attacks.',
                clock: 'Longer safety window after damage.',
                bell: 'Enemies can drop soul fragments. 10 fragments gives +1 life.',
                ribbon: 'Enables one mid-air dash with your Dash control.',
                thorns: 'Touching enemies damages them first.',
                echo: 'Pogo attacks bounce higher and echo slash hits wider.',
                ash: 'Enemies burst into ash on defeat and give extra score.',
                silk: 'Slower falling and smoother air control.',
                crownShard: '+1 maximum life while equipped with the same cooldown rule.',
                sunSpool: 'Heals restore 2 lives instead of 1.',
                voidBell: 'Soul fragments need only 7 instead of 10.',
                needleBoots: 'Pogo bounce becomes stronger.',
                cometThread: 'Movement is faster and Sky Dash travels 18% farther.',
                anchorPearl: 'Heavier control, but taking damage grants a longer safety window.',
                prismHeart: '+1 maximum life while equipped. Occasionally reflects damage.',
                cathedralBell: 'Every 25 enemy kills restores 1 life.',
                shadowCoin: 'Kills award more score while equipped.',
                auroraPin: 'Pogo bounces higher and falling is safer.',
                marrowCharm: 'Gain +2 uncapped lives while equipped.',
                relicStar: '+Attack range and enemy score.',
                threadCrown: '+10% score from enemies.',
                weaverHelm: '+20 slash width.',
                hollowMask: 'Longer invulnerability after respawn.',
                starHalo: '+1 max life on pickup, plus a small score boost.',
                brokenTiara: '+1 life when entering boss realms.',
                royalCape: '+0.7 movement speed.',
                threadWings: 'Slightly safer falling.',
                crystalMantle: 'Chance to ignore damage.',
                cosmicCloak: 'Unlocks Sky Dash while equipped.',
                goldenEye: '+15 attack height.',
                voidEye: 'Rift slash effect while equipped.',
                clockEye: 'Longer invulnerability after being hit.',
                starEye: '+10% enemy score.',
                jesusBoots: 'Walk safely on floor and danger water.'
            };
            return effects[type] || def.effect || 'Equipment upgrade.';
        }


        const HEART_CHARM_BONUS = { ember: 2, starHalo: 1, crownShard: 1, prismHeart: 1, marrowCharm: 2 };
        const HEART_CHARM_COOLDOWN_MS = 50000;
        function heartCharmBonus(id) { return HEART_CHARM_BONUS[id] || 0; }
        function heartCharmCooldownRemaining(id) {
            player.heartCharmCooldowns = player.heartCharmCooldowns || {};
            const until = player.heartCharmCooldowns[id] || 0;
            return Math.max(0, until - Date.now());
        }
        function isHeartCharmOnCooldown(id) { return heartCharmCooldownRemaining(id) > 0; }
        function maxLivesWithoutCharm(id) {
            const equipped = player.equippedEquipment || [];
            let total = 3;
            for (const item of equipped) {
                if (item !== id) total += heartCharmBonus(item);
            }
            return Math.max(3, total);
        }
        function breakHeartCharm(id) {
            if (!(player.equippedEquipment || []).includes(id)) return;
            player.equippedEquipment = player.equippedEquipment.filter(item => item !== id);
            player.heartCharmCooldowns = player.heartCharmCooldowns || {};
            player.heartCharmCooldowns[id] = Date.now() + HEART_CHARM_COOLDOWN_MS;
            recalculateEquipmentEffects();
            showMagicNotice({ name: getEquipmentDef(id).name + ' Exhausted', id: 'heartCooldown' });
            renderEquipmentMenu();
            saveGame();
        }
        function checkHeartCharmBreaks() {
            const equippedHeartCharms = (player.equippedEquipment || []).filter(id => heartCharmBonus(id) > 0);
            for (const id of equippedHeartCharms) {
                if (player.lives <= maxLivesWithoutCharm(id)) breakHeartCharm(id);
            }
            updateUI();
        }

        function recalculateEquipmentEffects() {
            player.collectedEquipment = player.collectedEquipment || [];
            player.equippedEquipment = (player.equippedEquipment || []).filter(id => player.collectedEquipment.includes(id)).slice(0, EQUIPMENT_LIMIT);
            player.cosmetics = {};
            player.magicAura = null;
            player.maxSpeed = 5.7;
            player.acceleration = 0.46;
            player.friction = 0.92;
            player.flapForce = BASE_FLAP_FORCE;
            player.gravity = BASE_GRAVITY;
            player.maxFallSpeed = 8;
            player.attackBox = { width: 110, height: 110 };
            player.wingStyle = 'normal';
            player.slashStyle = 'normal';
            player.emberBurst = false;
            player.guardShield = false;
            player.reachSlash = false;
            player.riftSlash = false;
            player.clockSlow = false;
            player.soulBell = false;
            player.skyDash = false;
            player.thornAura = false;
            player.scoreBoost = false;
            player.crystalGuard = false;
            player.echoShell = false;
            player.ashFeather = false;
            player.silkSeal = false;
            player.sunSpool = false;
            player.voidBell = false;
            player.needleBoots = false;
            player.cometThread = false;
            player.anchorPearl = false;
            player.prismHeart = false;
            player.cathedralBell = false;
            player.shadowCoin = false;
            player.auroraPin = false;
            player.marrowCharm = false;
            player.relicStar = false;
            player.cathedralKills = player.cathedralKills || 0;
            player.maxLives = 3;
            player.hollowMask = false;
            player.starHalo = false;
            player.brokenTiara = false;
            player.jesusBoots = false;

            for (const type of player.equippedEquipment) {
                player.cosmetics[type] = true;
                const def = getEquipmentDef(type);
                if (MAGIC_ITEM_TYPES.some(item => item.id === type)) player.magicAura = type;
                if (type === 'ember') { player.emberBurst = true; player.maxLives += 2; }
                else if (type === 'swift') { player.maxSpeed += 1.6; player.acceleration += 0.12; player.friction = 0.95; }
                else if (type === 'guard') { player.maxFallSpeed = Math.max(6.2, player.maxFallSpeed - 1.5); player.guardShield = true; }
                else if (type === 'reach') { player.attackBox.width += 55; player.attackBox.height += 40; player.reachSlash = true; }
                else if (type === 'moon') { player.wingStyle = 'moon'; player.slashStyle = 'moon'; player.attackBox.width += 35; player.attackBox.height += 35; }
                else if (type === 'mirror') { player.attackBox.width += 20; }
                else if (type === 'gear') { player.maxSpeed += 0.8; player.attackBox.height += 25; }
                else if (type === 'thorn') { player.attackBox.width += 45; player.maxFallSpeed = Math.max(6.8, player.maxFallSpeed - 0.7); }
                else if (type === 'tide') { player.friction = Math.max(player.friction, 0.94); }
                else if (type === 'rift') { player.riftSlash = true; player.attackBox.width += 35; }
                else if (type === 'clock') { player.clockSlow = true; }
                else if (type === 'bell') { player.soulBell = true; }
                else if (type === 'ribbon') { player.skyDash = true; player.cosmetics.skyRibbon = true; }
                else if (type === 'thorns') { player.thornAura = true; player.attackBox.width += 25; }
                else if (type === 'echo') { player.echoShell = true; player.attackBox.width += 25; }
                else if (type === 'ash') { player.ashFeather = true; }
                else if (type === 'silk') { player.silkSeal = true; player.maxFallSpeed = Math.max(6.4, player.maxFallSpeed - 1.2); player.friction = Math.max(player.friction, 0.945); }
                else if (type === 'crownShard') { player.maxLives += 1; }
                else if (type === 'sunSpool') { player.sunSpool = true; }
                else if (type === 'voidBell') { player.voidBell = true; }
                else if (type === 'needleBoots') { player.needleBoots = true; }
                else if (type === 'cometThread') { player.cometThread = true; player.maxSpeed += 1.0; player.acceleration += 0.08; }
                else if (type === 'anchorPearl') { player.anchorPearl = true; player.maxFallSpeed = Math.max(6.9, player.maxFallSpeed - 0.6); }
                else if (type === 'prismHeart') { player.prismHeart = true; player.maxLives += 1; }
                else if (type === 'cathedralBell') { player.cathedralBell = true; }
                else if (type === 'shadowCoin') { player.shadowCoin = true; }
                else if (type === 'auroraPin') { player.auroraPin = true; player.maxFallSpeed = Math.max(6.7, player.maxFallSpeed - 0.5); }
                else if (type === 'marrowCharm') { player.marrowCharm = true; player.maxLives += 2; }
                else if (type === 'relicStar') { player.relicStar = true; player.attackBox.width += 25; player.attackBox.height += 20; player.scoreBoost = true; }
                else if (type === 'threadCrown') { player.scoreBoost = true; }
                else if (type === 'weaverHelm') { player.attackBox.width += 20; }
                else if (type === 'hollowMask') { player.hollowMask = true; }
                else if (type === 'starHalo') { player.starHalo = true; player.maxLives += 1; }
                else if (type === 'brokenTiara') { player.brokenTiara = true; }
                else if (type === 'royalCape') { player.maxSpeed += 0.7; }
                else if (type === 'threadWings') { player.maxFallSpeed = Math.max(7.2, player.maxFallSpeed - 0.5); }
                else if (type === 'crystalMantle') { player.crystalGuard = true; }
                else if (type === 'cosmicCloak') { player.skyDash = true; }
                else if (type === 'goldenEye') { player.attackBox.height += 15; }
                else if (type === 'voidEye') { player.riftSlash = true; player.attackBox.width += 18; }
                else if (type === 'clockEye') { player.clockSlow = true; }
                else if (type === 'starEye') { player.scoreBoost = true; }
                else if (type === 'jesusBoots') { player.jesusBoots = true; }
            }
            player.maxLives = Infinity;
            if (!player.lives || player.lives < 1) player.lives = 1;
            // hitbox so drawGhost's arc always maps directly to backend mechanics,
            // even as equipment grows/shrinks attackBox above.
            player.attackRange = Math.max(player.attackBox.width, player.attackBox.height) / 2;
        }

        function toggleEquipmentMenu() {
            equipmentMenuOpen = !equipmentMenuOpen;
            const menu = document.getElementById('equipment-menu');
            if (menu) menu.classList.toggle('show', equipmentMenuOpen);
            renderEquipmentMenu();
        }

        function renderEquipmentMenu() {
            const grid = document.getElementById('equipment-grid');
            const line = document.getElementById('equipment-equipped-line');
            if (!grid || !line) return;
            const panel = grid.closest('.equipment-panel');
            const scrollTop = panel ? panel.scrollTop : 0;
            const owned = player.collectedEquipment || [];
            const equipped = player.equippedEquipment || [];
            line.innerText = `Equipped ${equipped.length} / ${EQUIPMENT_LIMIT}`;
            if (owned.length === 0) {
                grid.innerHTML = '<div class="equipment-card">No equipment collected yet.</div>';
                if (panel) panel.scrollTop = scrollTop;
                return;
            }
            grid.innerHTML = owned.map(id => {
                const def = getEquipmentDef(id);
                const isEquipped = equipped.includes(id);
                const cooldownMs = heartCharmCooldownRemaining(id);
                const cooldownText = cooldownMs > 0 ? `<div class="equipment-effect">Cooling down: ${Math.ceil(cooldownMs / 1000)}s</div>` : '';
                const disabled = !isEquipped && (equipped.length >= EQUIPMENT_LIMIT || cooldownMs > 0);
                return `<div class="equipment-card ${isEquipped ? 'equipped' : ''}">
                    <div class="equipment-name" style="color:${def.color}">${def.name}</div>
                    <div class="equipment-effect">${equipmentEffectText(id)}</div>
                    ${cooldownText}
                    <button ${disabled ? 'disabled' : ''} onclick="toggleEquipment('${id}')">${isEquipped ? 'UNEQUIP' : cooldownMs > 0 ? 'COOLDOWN' : disabled ? EQUIPMENT_LIMIT + ' EQUIPPED' : 'EQUIP'}</button>
                </div>`;
            }).join('');
            if (panel) panel.scrollTop = scrollTop;
        }

        function toggleEquipment(id) {
            player.equippedEquipment = player.equippedEquipment || [];
            player.heartCharmCooldowns = player.heartCharmCooldowns || {};
            const wasEquipped = player.equippedEquipment.includes(id);
            const bonus = heartCharmBonus(id);
            if (wasEquipped) {
                player.equippedEquipment = player.equippedEquipment.filter(item => item !== id);
                if (bonus > 0) player.lives = Math.max(1, (player.lives || 1) - bonus);
            } else if (player.equippedEquipment.length < EQUIPMENT_LIMIT && (player.collectedEquipment || []).includes(id) && !isHeartCharmOnCooldown(id)) {
                player.equippedEquipment.push(id);
                if (bonus > 0) player.lives = Math.max(1, (player.lives || 1) + bonus);
            }
            recalculateEquipmentEffects();
            renderEquipmentMenu();
            updateUI();
            saveGame();
        }

        function drawBoss(screenX) {
            ctx.save();
            let t = Date.now();
            let cx = screenX;
            let cy = boss.y + boss.height / 2;
            let def = BOSS_DEFS[boss.kind] || BOSS_DEFS.needle;
            let color = def.color || '#ff3300';
            let pulse = 1 + Math.sin(t * 0.003) * 0.1;
            function hpbar(a,b){let w=260,x=canvas.width/2-w/2,y=36;ctx.shadowBlur=0;ctx.fillStyle='rgba(0,0,0,0.72)';ctx.fillRect(x-2,y-2,w+4,20);let f=Math.max(0,boss.hp/boss.maxHp);let g=ctx.createLinearGradient(x,y,x+w,y);g.addColorStop(0,a);g.addColorStop(1,b);ctx.fillStyle=g;ctx.fillRect(x,y,w*f,16);ctx.strokeStyle=b;ctx.shadowColor=b;ctx.shadowBlur=10;ctx.strokeRect(x,y,w*f,16);ctx.shadowBlur=0;ctx.fillStyle='rgba(255,245,235,0.9)';ctx.font='bold 11px Courier New';ctx.fillText(boss.name,x,y-6);}
            function eye(x,y,r=5,ec='#fff'){ ctx.save(); ctx.shadowBlur=6; ctx.fillStyle=ec; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore(); }
            let aura=ctx.createRadialGradient(cx,cy,10,cx,cy,150*pulse);aura.addColorStop(0,'rgba(255,255,255,.25)');aura.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=aura;ctx.beginPath();ctx.arc(cx,cy,150*pulse,0,Math.PI*2);ctx.fill();
            ctx.shadowColor=color;ctx.shadowBlur=30;ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=3;

            if (boss.kind === 'needle') {
                ctx.beginPath();ctx.moveTo(cx,boss.y+4);ctx.quadraticCurveTo(cx+boss.width+12,cy,cx,boss.y+boss.height-4);ctx.lineTo(cx-18,boss.y+boss.height-12);ctx.lineTo(cx-6,cy+18);ctx.lineTo(cx-6,cy-18);ctx.closePath();ctx.fill();ctx.stroke();
                ctx.beginPath();ctx.moveTo(cx-4,cy);ctx.bezierCurveTo(cx-90,cy+Math.sin(t*.008)*60,cx-160,cy-40,cx-260,cy+30);ctx.stroke(); hpbar('#ff6600','#ff0033');

            } else if (boss.kind === 'weaver') {
                for(let i=0;i<6;i++){ctx.beginPath();ctx.ellipse(cx,cy,64+i*4,28+i*3,t*.002+i,0,Math.PI*2);ctx.stroke();}
                ctx.beginPath();ctx.moveTo(cx,boss.y+8);ctx.lineTo(cx+48,cy-38);ctx.lineTo(cx+38,cy+60);ctx.lineTo(cx,boss.y+boss.height-8);ctx.lineTo(cx-38,cy+60);ctx.lineTo(cx-48,cy-38);ctx.closePath();ctx.fill();ctx.stroke();
                for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(cx+i*13,boss.y);ctx.lineTo(cx+i*18+Math.sin(t*.005+i)*5,boss.y-32);ctx.lineTo(cx+i*13+7,boss.y+6);ctx.fill();}
                ctx.fillStyle='rgba(255,255,255,0.95)';eye(cx-12,cy-6,4);eye(cx+12,cy-6,4); hpbar('#ffe070','#ff7722');

            } else if (boss.kind === 'gearSaint') {
                // Outer ring of meshing teeth + rotating spokes + inner lens eye
                for(let i=0;i<12;i++){let a=t*.0025+i*Math.PI/6;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*54,cy+Math.sin(a)*54);ctx.lineTo(cx+Math.cos(a)*82,cy+Math.sin(a)*82);ctx.stroke();}
                for(let i=0;i<8;i++){let a=-t*.004+i*Math.PI/4;let r1=58,r2=70;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*r1,cy+Math.sin(a)*r1);ctx.lineTo(cx+Math.cos(a+0.18)*r2,cy+Math.sin(a+0.18)*r2);ctx.lineTo(cx+Math.cos(a+0.36)*r1,cy+Math.sin(a+0.36)*r1);ctx.closePath();ctx.fill();}
                ctx.beginPath();ctx.arc(cx,cy,55,0,Math.PI*2);ctx.fill();ctx.stroke();
                ctx.save();ctx.translate(cx,cy);ctx.rotate(t*.0018);ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=2;
                for(let i=0;i<4;i++){let a=i*Math.PI/2;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(a)*44,Math.sin(a)*44);ctx.stroke();}
                ctx.restore();
                ctx.fillStyle='rgba(0,0,0,.55)';ctx.beginPath();ctx.arc(cx,cy,24,0,Math.PI*2);ctx.fill();ctx.strokeStyle='white';ctx.stroke();
                eye(cx,cy,8,'rgba(220,235,255,0.95)'); hpbar('#d7ddff','#778dff');

            } else if (boss.kind === 'thornMother') {
                ctx.beginPath();ctx.moveTo(cx, boss.y-8);ctx.bezierCurveTo(cx+85,cy-40,cx+70,cy+80,cx,boss.y+boss.height+8);ctx.bezierCurveTo(cx-70,cy+80,cx-85,cy-40,cx,boss.y-8);ctx.fill();ctx.stroke();
                for(let i=0;i<10;i++){let a=t*.002+i*Math.PI/5;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*95,cy+Math.sin(a)*80);ctx.stroke();}
                // thorned vine ring + glowing seed core
                ctx.strokeStyle='rgba(180,255,140,0.85)';ctx.lineWidth=2;
                for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(cx,cy,40+i*18,22+i*12,t*.0015+i*0.8,0,Math.PI*2);ctx.stroke();}
                ctx.fillStyle='rgba(220,255,180,0.9)';ctx.beginPath();ctx.arc(cx,cy,10,0,Math.PI*2);ctx.fill();
                eye(cx-14,cy-22,4,'#1a3a14');eye(cx+14,cy-22,4,'#1a3a14');
                hpbar('#b7ff76','#38aa32');

            } else if (boss.kind === 'drownedStar') {
                ctx.beginPath();for(let i=0;i<12;i++){let a=t*.002+i*Math.PI/6,r=i%2?42:90;let px=cx+Math.cos(a)*r,py=cy+Math.sin(a)*r;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();ctx.fill();ctx.stroke();
                for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(cx+Math.cos(t*.004+i)*70,cy+Math.sin(t*.004+i)*42,8,0,Math.PI*2);ctx.fill();ctx.stroke();}
                // submerged bubble trail + bright core
                ctx.fillStyle='rgba(180,245,255,0.5)';
                for(let i=0;i<6;i++){let by=(cy+30+ (t*.05+i*23)%90);ctx.beginPath();ctx.arc(cx+Math.sin(i*2+t*.002)*50,boss.y+boss.height-by%boss.height,3+i%3,0,Math.PI*2);ctx.fill();}
                eye(cx,cy,10,'rgba(255,255,255,0.95)');
                hpbar('#baf7ff','#00aaff');

            } else if (boss.kind === 'prismRegent') {
                for(let i=0;i<9;i++){let a=t*.004+i*Math.PI*2/9;ctx.strokeStyle=i%2?color:'rgba(255,255,255,0.9)';ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*105,cy+Math.sin(a)*78);ctx.stroke();}
                ctx.strokeStyle=color;ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(cx, boss.y-4);ctx.lineTo(cx+70,cy-35);ctx.lineTo(cx+48,cy+78);ctx.lineTo(cx,boss.y+boss.height+6);ctx.lineTo(cx-48,cy+78);ctx.lineTo(cx-70,cy-35);ctx.closePath();ctx.fill();ctx.stroke();
                // refracted rainbow facets
                for(let i=0;i<6;i++){ctx.strokeStyle=`hsla(${(i*60+t*0.05)%360},90%,75%,0.5)`;ctx.beginPath();ctx.moveTo(cx,cy-20);ctx.lineTo(cx+Math.cos(t*.003+i)*46,cy-20+Math.sin(t*.003+i)*30);ctx.stroke();}
                ctx.fillStyle='rgba(255,255,255,0.95)';ctx.beginPath();ctx.arc(cx,cy-20,12,0,Math.PI*2);ctx.fill();
                eye(cx-7,cy-22,3,'#ff77ff');eye(cx+7,cy-22,3,'#77ffff');
                hpbar('#ffffff','#ff77ff');

            } else if (boss.kind === 'ashSeraph') {
                for(let i=0;i<8;i++){let a=t*.005+i*Math.PI/4;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*95,cy+Math.sin(a)*95);ctx.stroke();}
                ctx.beginPath();ctx.moveTo(cx, boss.y);ctx.bezierCurveTo(cx+82,cy-55,cx+55,cy+95,cx,boss.y+boss.height);ctx.bezierCurveTo(cx-55,cy+95,cx-82,cy-55,cx,boss.y);ctx.fill();ctx.stroke();
                // smoldering ember motes drifting up off the wings
                for(let i=0;i<10;i++){let ey=cy+60-((t*.04+i*37)%140);let ex=cx+Math.sin(i*3+t*.003)*70;let al=1-((t*.04+i*37)%140)/140;ctx.fillStyle=`rgba(255,150,70,${0.5*al})`;ctx.beginPath();ctx.arc(ex,ey,2.5,0,Math.PI*2);ctx.fill();}
                ctx.fillStyle='rgba(255,225,190,0.95)';eye(cx-12,cy-30,4);eye(cx+12,cy-30,4);
                hpbar('#ffd2aa','#ff5a22');

            } else if (boss.kind === 'silkJudge') {
                for(let i=-3;i<=3;i++){ctx.beginPath();ctx.moveTo(cx+i*24,boss.y-40);ctx.bezierCurveTo(cx+i*10,cy-20,cx-i*8,cy+40,cx+i*26,boss.y+boss.height+30);ctx.stroke();}
                ctx.beginPath();ctx.roundRect(cx-58,cy-82,116,164,22);ctx.fill();ctx.stroke();
                // hanging thread tassels + judge's scale motif
                ctx.strokeStyle='rgba(215,216,255,0.5)';ctx.lineWidth=1.5;
                for(let i=-2;i<=2;i++){let sway=Math.sin(t*.003+i)*8;ctx.beginPath();ctx.moveTo(cx+i*20,cy+82);ctx.quadraticCurveTo(cx+i*20+sway,cy+105,cx+i*20,cy+128);ctx.stroke();}
                ctx.strokeStyle='rgba(230,230,255,0.8)';ctx.lineWidth=2;
                ctx.beginPath();ctx.moveTo(cx,cy-82);ctx.lineTo(cx,cy-100);ctx.moveTo(cx-34,cy-90);ctx.lineTo(cx+34,cy-90);ctx.moveTo(cx-34,cy-90);ctx.lineTo(cx-34,cy-78);ctx.moveTo(cx+34,cy-90);ctx.lineTo(cx+34,cy-78);ctx.stroke();
                eye(cx-16,cy-28,5);eye(cx+16,cy-28,5);
                hpbar('#ffffff','#a8abff');

            } else if (boss.kind === 'hollowCrown') {
                for(let i=0;i<10;i++){let a=t*.003+i*Math.PI/5;ctx.beginPath();ctx.arc(cx+Math.cos(a)*72,cy+Math.sin(a)*54,10,0,Math.PI*2);ctx.fill();ctx.stroke();}
                ctx.beginPath();ctx.moveTo(cx-65,cy-20);ctx.lineTo(cx-35,boss.y-8);ctx.lineTo(cx,cy-50);ctx.lineTo(cx+35,boss.y-8);ctx.lineTo(cx+65,cy-20);ctx.lineTo(cx+48,cy+82);ctx.lineTo(cx-48,cy+82);ctx.closePath();ctx.fill();ctx.stroke();
                // void cracks across the crown body
                ctx.strokeStyle='rgba(20,0,35,0.85)';ctx.lineWidth=2;
                ctx.beginPath();ctx.moveTo(cx-10,cy-30);ctx.lineTo(cx+6,cy-5);ctx.lineTo(cx-8,cy+15);ctx.lineTo(cx+12,cy+45);ctx.stroke();
                ctx.fillStyle='rgba(40,0,60,0.7)';ctx.beginPath();ctx.arc(cx,cy,20,0,Math.PI*2);ctx.fill();
                eye(cx,cy,7,'rgba(225,180,255,0.95)');
                hpbar('#e2b8ff','#7c22ff');

            } else if (boss.kind === 'neonWarden') {
                for(let i=0;i<12;i++){let a=t*.006+i*Math.PI/6;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*35,cy+Math.sin(a)*35);ctx.lineTo(cx+Math.cos(a)*95,cy+Math.sin(a)*72);ctx.stroke();}
                ctx.beginPath();ctx.ellipse(cx,cy,68,92,Math.sin(t*.002)*0.15,0,Math.PI*2);ctx.fill();ctx.stroke();
                // scanning neon visor band
                ctx.strokeStyle='rgba(255,255,255,.9)';ctx.lineWidth=3;
                ctx.beginPath();ctx.moveTo(cx-40,cy-18+Math.sin(t*.01)*8);ctx.lineTo(cx+40,cy-18+Math.sin(t*.01+1)*8);ctx.stroke();
                ctx.fillStyle='rgba(255,255,255,.9)';ctx.beginPath();ctx.arc(cx,cy-18,10,0,Math.PI*2);ctx.fill();
                hpbar('#aaffee','#20ffbb');

            } else if (boss.kind === 'clockAbyss') {
                for(let i=0;i<16;i++){let a=t*.003+i*Math.PI/8;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*58,cy+Math.sin(a)*58);ctx.lineTo(cx+Math.cos(a)*88,cy+Math.sin(a)*88);ctx.stroke();}
                ctx.beginPath();ctx.arc(cx,cy,72,0,Math.PI*2);ctx.fill();ctx.stroke();
                ctx.strokeStyle='rgba(255,255,255,.85)';ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(t*.006)*58,cy+Math.sin(t*.006)*58);ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(-t*.004)*42,cy+Math.sin(-t*.004)*42);ctx.stroke();
                // tick marks ringing the abyssal clock face
                ctx.strokeStyle='rgba(255,225,150,0.7)';ctx.lineWidth=2;
                for(let i=0;i<12;i++){let a=i*Math.PI/6;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*64,cy+Math.sin(a)*64);ctx.lineTo(cx+Math.cos(a)*72,cy+Math.sin(a)*72);ctx.stroke();}
                eye(cx,cy,6,'rgba(255,240,200,0.9)');
                hpbar('#ffe2a3','#ff9f1a');

            } else if (boss.kind === 'shatteredChoir') {
                // 7 fractured shard-petals rotating around a singing core
                for(let i=0;i<7;i++){let a=t*.0022+i*Math.PI*2/7;ctx.save();ctx.translate(cx+Math.cos(a)*60,cy+Math.sin(a)*46);ctx.rotate(a+Math.PI/2);
                    ctx.beginPath();ctx.moveTo(0,-30);ctx.lineTo(14,8);ctx.lineTo(0,26);ctx.lineTo(-14,8);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
                ctx.beginPath();ctx.arc(cx,cy,34,0,Math.PI*2);ctx.fill();ctx.stroke();
                ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=1.5;
                for(let i=0;i<3;i++){let r=18+i*14+Math.sin(t*.01+i)*4;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.stroke();}
                eye(cx-9,cy-4,4);eye(cx+9,cy-4,4);
                hpbar('#d7fbff','#7fb8ff');

            } else if (boss.kind === 'crimsonArchbishop') {
                // tall cathedral-robe silhouette with stained-glass ribbing
                ctx.beginPath();ctx.moveTo(cx,boss.y-6);ctx.lineTo(cx+46,boss.y+50);ctx.lineTo(cx+62,boss.y+boss.height-10);ctx.lineTo(cx-62,boss.y+boss.height-10);ctx.lineTo(cx-46,boss.y+50);ctx.closePath();ctx.fill();ctx.stroke();
                ctx.strokeStyle='rgba(255,210,210,0.55)';ctx.lineWidth=1.5;
                for(let i=-3;i<=3;i++){ctx.beginPath();ctx.moveTo(cx+i*16,boss.y+30);ctx.lineTo(cx+i*22,boss.y+boss.height-12);ctx.stroke();}
                ctx.fillStyle='rgba(255,255,255,0.92)';ctx.beginPath();ctx.moveTo(cx,boss.y-30);ctx.lineTo(cx+10,boss.y-6);ctx.lineTo(cx-10,boss.y-6);ctx.closePath();ctx.fill();ctx.stroke();
                eye(cx-13,boss.y+44,4,'rgba(255,230,230,.95)');eye(cx+13,boss.y+44,4,'rgba(255,230,230,.95)');
                hpbar('#ffb3b3','#ff1133');

            } else if (boss.kind === 'shadowMerchant') {
                // cloaked figure with coin-disc halo
                ctx.beginPath();ctx.moveTo(cx,boss.y);ctx.bezierCurveTo(cx+58,boss.y+30,cx+50,boss.y+boss.height-10,cx,boss.y+boss.height);ctx.bezierCurveTo(cx-50,boss.y+boss.height-10,cx-58,boss.y+30,cx,boss.y);ctx.fill();ctx.stroke();
                for(let i=0;i<6;i++){let a=t*.003+i*Math.PI/3;ctx.strokeStyle='rgba(255,215,120,0.7)';ctx.beginPath();ctx.arc(cx+Math.cos(a)*78,cy+Math.sin(a)*52,9,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*70,cy+Math.sin(a)*46);ctx.lineTo(cx+Math.cos(a)*86,cy+Math.sin(a)*58);ctx.stroke();}
                ctx.fillStyle='rgba(255,255,255,0.7)';eye(cx-10,cy-16,4,'rgba(255,215,120,0.95)');eye(cx+10,cy-16,4,'rgba(255,215,120,0.95)');
                hpbar('#c8a8ff','#4a1aaa');

            } else if (boss.kind === 'auroraKnight') {
                // armored crest with sweeping aurora cape
                ctx.beginPath();ctx.moveTo(cx,boss.y-4);ctx.lineTo(cx+30,boss.y+20);ctx.lineTo(cx+38,cy+10);ctx.lineTo(cx+18,boss.y+boss.height);ctx.lineTo(cx-18,boss.y+boss.height);ctx.lineTo(cx-38,cy+10);ctx.lineTo(cx-30,boss.y+20);ctx.closePath();ctx.fill();ctx.stroke();
                for(let i=0;i<5;i++){ctx.strokeStyle=`hsla(${160+i*22+t*0.04},90%,75%,0.4)`;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(cx-i*6,boss.y+10);ctx.quadraticCurveTo(cx-70-i*10+Math.sin(t*.002+i)*14,cy+i*16,cx-30,boss.y+boss.height-i*6);ctx.stroke();}
                eye(cx-10,boss.y+34,4);eye(cx+10,boss.y+34,4);
                hpbar('#aaffee','#19caa0');

            } else if (boss.kind === 'marrowQueen') {
                // bone-crowned regal silhouette
                ctx.beginPath();ctx.moveTo(cx,boss.y+4);ctx.bezierCurveTo(cx+64,boss.y+24,cx+56,boss.y+boss.height-14,cx,boss.y+boss.height);ctx.bezierCurveTo(cx-56,boss.y+boss.height-14,cx-64,boss.y+24,cx,boss.y+4);ctx.fill();ctx.stroke();
                ctx.strokeStyle='rgba(255,243,230,0.85)';ctx.lineWidth=2.5;
                for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(cx+i*14,boss.y-4);ctx.lineTo(cx+i*10,boss.y-26-Math.abs(i)*4);ctx.stroke();}
                ctx.fillStyle='rgba(255,243,230,0.95)';ctx.beginPath();ctx.arc(cx,boss.y-2,7,0,Math.PI*2);ctx.fill();
                eye(cx-12,boss.y+36,4,'rgba(255,90,120,0.9)');eye(cx+12,boss.y+36,4,'rgba(255,90,120,0.9)');
                hpbar('#ffe3cf','#a85a3a');

            } else if (boss.kind === 'starlitRelic') {
                // ancient orbiting-glyph monolith
                ctx.beginPath();ctx.roundRect(cx-44,boss.y+6,88,boss.height-20,18);ctx.fill();ctx.stroke();
                for(let i=0;i<8;i++){let a=t*.0026+i*Math.PI/4,r=92;ctx.strokeStyle='rgba(255,246,168,0.55)';ctx.beginPath();ctx.arc(cx+Math.cos(a)*r,cy+Math.sin(a)*r*0.7,5,0,Math.PI*2);ctx.stroke();}
                ctx.strokeStyle='rgba(255,255,255,0.8)';ctx.lineWidth=1.5;
                for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(cx,cy,30+i*22,0,Math.PI*2);ctx.stroke();}
                eye(cx,cy,9,'rgba(255,250,200,0.95)');
                hpbar('#fff6a8','#bb8a1f');

            } else if (boss.kind === 'firstStitch') {
                for(let i=0;i<5;i++){let a=t*.003+i*Math.PI*.4;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*88,cy+Math.sin(a)*52);ctx.bezierCurveTo(cx+Math.cos(a+1)*30,cy-80,cx+Math.cos(a+2)*30,cy+90,cx+Math.cos(a+3)*88,cy+Math.sin(a+3)*52);ctx.stroke();}
                ctx.beginPath();ctx.moveTo(cx,boss.y-2);ctx.bezierCurveTo(cx+78,boss.y+70,cx+55,boss.y+boss.height-20,cx,boss.y+boss.height+2);ctx.bezierCurveTo(cx-55,boss.y+boss.height-20,cx-78,boss.y+70,cx,boss.y-2);ctx.fill();ctx.stroke();
                // final-thread halo, all prior boss colors orbiting as a tribute ring
                const tribute=['#ff3300','#ffaa33','#aab8ff','#88ff66','#66e6ff','#ff9dff','#ff7a44','#d7d8ff','#b45cff','#55ffcc','#ffc85c'];
                for(let i=0;i<tribute.length;i++){let a=t*.0015+i*(Math.PI*2/tribute.length);ctx.fillStyle=tribute[i];ctx.beginPath();ctx.arc(cx+Math.cos(a)*120,cy+Math.sin(a)*86,4,0,Math.PI*2);ctx.fill();}
                eye(cx-10,cy-10,4);eye(cx+10,cy-10,4);
                hpbar('#ffffff','#c090ff');

            } else {
                for(let i=0;i<5;i++){let a=t*.003+i*Math.PI*.4;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*88,cy+Math.sin(a)*52);ctx.bezierCurveTo(cx+Math.cos(a+1)*30,cy-80,cx+Math.cos(a+2)*30,cy+90,cx+Math.cos(a+3)*88,cy+Math.sin(a+3)*52);ctx.stroke();}
                ctx.beginPath();ctx.moveTo(cx,boss.y-2);ctx.bezierCurveTo(cx+78,boss.y+70,cx+55,boss.y+boss.height-20,cx,boss.y+boss.height+2);ctx.bezierCurveTo(cx-55,boss.y+boss.height-20,cx-78,boss.y+70,cx,boss.y-2);ctx.fill();ctx.stroke(); hpbar('#ffffff','#c090ff');
            }
            ctx.restore();
        }

        function addParticles(x, y, color) {
            for(let i=0; i<18; i++) {
                let speed = 1.5 + Math.random() * 4;
                let angle = Math.random() * Math.PI * 2;
                particles.push({
                    x, y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 1,
                    alpha: 1,
                    color,
                    size: 1.5 + Math.random() * 3
                });
            }
        }

        // Helper function to check if the active slice intercepts a targeted hitbox
        function checkAttackCollision(targetX, targetY, targetW, targetH) {
            if (!player.isAttacking) return false;

            let ax = player.worldX - player.attackBox.width / 2;
            let ay = player.worldY - player.attackBox.height / 2;

            // Offset the bounding box coordinates to match calculation profiles
            if (player.attackDir === "up") {
                ay = player.worldY - player.attackBox.height;
            } else if (player.attackDir === "down") {
                ay = player.worldY;
            } else {
                ax = player.worldX + (player.facing === 1 ? 0 : -player.attackBox.width);
                ay = player.worldY - player.attackBox.height / 2;
            }

            return (targetX < ax + player.attackBox.width &&
                    targetX + targetW > ax &&
                    targetY < ay + player.attackBox.height &&
                    targetY + targetH > ay);
        }



        function tryPogoBounce(targetX, targetY, targetW, targetH) {
            if (!(player.isAttacking && player.attackDir === "down")) return;
            const playerBottom = player.worldY + player.height / 2;
            const targetTop = targetY;
            const horizontallyClose = player.worldX + player.width / 2 > targetX && player.worldX - player.width / 2 < targetX + targetW;
            const aboveTarget = playerBottom <= targetTop + 32;
            if (horizontallyClose && aboveTarget) {
                player.vy = Math.min(player.vy, player.needleBoots ? -12.2 : (player.auroraPin ? -11.6 : -10.8));
                // Every successful pogo naturally restores the air dash.
                player.dashReady = true;
                jumpKeyReleased = true;
                player.flapAnim = 18;
                addParticles(player.worldX - worldX, player.worldY + player.height / 2, '#ffffff');
            }
        }
