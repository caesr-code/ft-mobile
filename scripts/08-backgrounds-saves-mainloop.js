/* Faded Thread module: 08-backgrounds-saves-mainloop.js | build 03 Oct 2026 */
// Stable pseudo-random scatter helper for background decoration.
        // Each realm/index/channel maps to an independent value so free-scattered
        // particles never collapse into diagonal rows, while remaining stable
        // frame-to-frame and across reloads.
        function ftScatter01(seed, index, channel = 0) {
            let x = (Math.imul((index + 1) ^ (channel * 374761393), 668265263) ^ seed) >>> 0;
            x = Math.imul(x ^ (x >>> 13), 1274126177) >>> 0;
            x ^= x >>> 16;
            return (x >>> 0) / 4294967296;
        }
        function ftScatterSeed(label) {
            let h = 2166136261 >>> 0;
            const str = String(label || 'realm');
            for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
            return h >>> 0;
        }

        function drawRealmBackground(W, H, t) {
            const id = currentRealm;
            function baseGradient(top, mid, bottom) {
                let bg = ctx.createLinearGradient(0, 0, 0, H);
                bg.addColorStop(0, top); bg.addColorStop(0.55, mid); bg.addColorStop(1, bottom);
                ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
            }
            function stars(count, speed, color, size) {
                const seed = ftScatterSeed('stars:' + id + ':' + count + ':' + speed);
                for (let s = 0; s < count; s++) {
                    const baseX = ftScatter01(seed, s, 0) * W;
                    const baseY = ftScatter01(seed, s, 1) * H;
                    let sx = ((baseX - worldX * speed) % W + W) % W;
                    let sy = baseY;
                    let tw = 0.45 + Math.sin(t * 0.002 + ftScatter01(seed, s, 2) * Math.PI * 2) * 0.35;
                    ctx.globalAlpha = tw;
                    ctx.fillStyle = color;
                    ctx.beginPath(); ctx.arc(sx, sy, size, 0, Math.PI * 2); ctx.fill();
                }
                ctx.globalAlpha = 1;
            }
            function parallaxDust(count, speed, color, minR, maxR) {
                const seed = ftScatterSeed('dust:' + id + ':' + count + ':' + speed);
                for (let i = 0; i < count; i++) {
                    const dx0 = ftScatter01(seed, i, 0) * (W + 80) - 40;
                    const dx = ((dx0 - worldX * speed + 40) % (W + 80) + W + 80) % (W + 80) - 40;
                    const dy = ftScatter01(seed, i, 1) * H;
                    const r = minR + ftScatter01(seed, i, 2) * (maxR - minR);
                    const al = 0.3 + Math.sin(t * 0.003 + ftScatter01(seed, i, 3) * Math.PI * 2) * 0.25;
                    ctx.globalAlpha = Math.max(0, al);
                    ctx.fillStyle = color;
                    ctx.beginPath(); ctx.arc(dx, dy, r, 0, Math.PI * 2); ctx.fill();
                }
                ctx.globalAlpha = 1;
            }

            if (id.startsWith('boss')) { drawBossArenaBackground(W, H, t, id); return; }

            if (id === 'meadow') {
                // Rolling green hills with firefly dots and wispy fog layer
                baseGradient('#0e2218', '#183220', '#050f08');
                // Far hill silhouettes (parallax layer 1)
                ctx.fillStyle = 'rgba(30,80,45,0.55)';
                ctx.beginPath(); ctx.moveTo(0, H);
                for (let x = 0; x <= W; x += 18) {
                    const hx = ((x - worldX * 0.06) % (W + 200) + W + 200) % (W + 200);
                    ctx.lineTo(x, H * 0.62 + Math.sin(hx * 0.018) * 55 + Math.sin(hx * 0.007) * 30);
                }
                ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
                // Near hill silhouettes (parallax layer 2)
                ctx.fillStyle = 'rgba(18,55,28,0.65)';
                ctx.beginPath(); ctx.moveTo(0, H);
                for (let x = 0; x <= W; x += 18) {
                    const hx = ((x - worldX * 0.14) % (W + 200) + W + 200) % (W + 200);
                    ctx.lineTo(x, H * 0.76 + Math.sin(hx * 0.025) * 38 + Math.sin(hx * 0.011) * 18);
                }
                ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
                // Firefly motes
                const meadowScatterSeed = ftScatterSeed('meadow-fireflies');
                for (let i = 0; i < 22; i++) {
                    const fx0 = ftScatter01(meadowScatterSeed, i, 0) * (W + 60) - 30;
                    const fx = ((fx0 - worldX * 0.22 + 30) % (W + 60) + W + 60) % (W + 60) - 30;
                    const fy = H * (0.35 + ftScatter01(meadowScatterSeed, i, 1) * 0.55);
                    const al = 0.4 + Math.sin(t * 0.005 + ftScatter01(meadowScatterSeed, i, 2) * Math.PI * 2) * 0.4;
                    ctx.globalAlpha = Math.max(0, al);
                    ctx.fillStyle = i % 3 === 0 ? '#aaffcc' : '#ccffaa';
                    ctx.beginPath(); ctx.arc(fx, fy, 2, 0, Math.PI * 2); ctx.fill();
                }
                ctx.globalAlpha = 1;
                // Fog stripe near ground
                const fog = ctx.createLinearGradient(0, H * 0.72, 0, H);
                fog.addColorStop(0, 'rgba(160,240,190,0)');
                fog.addColorStop(1, 'rgba(90,160,110,0.18)');
                ctx.fillStyle = fog; ctx.fillRect(0, H * 0.72, W, H * 0.28);

            } else if (id === 'hollow') {
                // Dark cave with arching stone ribs and glowing fissure cracks
                baseGradient('#0d1128', '#191840', '#04050f');
                // Stone arch ribs
                for (let i = 0; i < W + 120; i += 90) {
                    const x = ((i - worldX * 0.10) % (W + 200) + W + 200) % (W + 200) - 60;
                    ctx.strokeStyle = 'rgba(120,125,200,0.22)'; ctx.lineWidth = 8;
                    ctx.beginPath(); ctx.arc(x, -20, 120 + (i % 3) * 40, 0.15, Math.PI - 0.15); ctx.stroke();
                    ctx.strokeStyle = 'rgba(80,85,160,0.12)'; ctx.lineWidth = 18;
                    ctx.beginPath(); ctx.arc(x, -20, 125 + (i % 3) * 40, 0.15, Math.PI - 0.15); ctx.stroke();
                }
                // Glowing floor fissures
                for (let i = 0; i < 7; i++) {
                    const fx = ((i * 173 - worldX * 0.18) % (W + 100) + W + 100) % (W + 100) - 50;
                    const al = 0.25 + Math.sin(t * 0.004 + i) * 0.2;
                    ctx.strokeStyle = `rgba(170,175,255,${al})`; ctx.lineWidth = 1.5;
                    ctx.beginPath(); ctx.moveTo(fx, H - 4); ctx.bezierCurveTo(fx + 20, H - 60, fx - 18, H - 120, fx + 10, H - 180); ctx.stroke();
                }
                parallaxDust(18, 0.09, 'rgba(180,185,255,0.7)', 1, 2.5);

            } else if (id === 'sadness') {
                // Overcast grey-blue sky with slow diagonal rain streaks and lens flare
                const sky = ctx.createLinearGradient(0, 0, 0, H);
                sky.addColorStop(0, '#c0cedf'); sky.addColorStop(0.5, '#d5e0ee'); sky.addColorStop(1, '#b8c8d8');
                ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
                // Slow rain, independently scattered across the sky.
                ctx.strokeStyle = 'rgba(140,165,200,0.22)'; ctx.lineWidth = 1;
                const sadnessRainSeed = ftScatterSeed('faded-sadness-rain');
                for (let i = 0; i < 60; i++) {
                    const spanX = W + 100, spanY = H + 100;
                    const baseX = ftScatter01(sadnessRainSeed, i, 0) * spanX - 50;
                    const baseY = ftScatter01(sadnessRainSeed, i, 1) * spanY - 50;
                    const rx = ((baseX + worldX * 0.18 + t * (0.04 + ftScatter01(sadnessRainSeed,i,2)*0.035) + 50) % spanX + spanX) % spanX - 50;
                    const ry = ((baseY + t * (0.045 + ftScatter01(sadnessRainSeed,i,3)*0.03) + 50) % spanY + spanY) % spanY - 50;
                    const dx = -6 - ftScatter01(sadnessRainSeed,i,4)*5, dy = 18 + ftScatter01(sadnessRainSeed,i,5)*8;
                    ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx + dx, ry + dy); ctx.stroke();
                }
                // Cloud masses (parallax far)
                for (let ci = 0; ci < 5; ci++) {
                    const cx2 = ((ci * 270 - worldX * 0.04) % (W + 300) + W + 300) % (W + 300) - 100;
                    const cy2 = 60 + ci * 55;
                    const grad = ctx.createRadialGradient(cx2, cy2, 10, cx2, cy2, 130);
                    grad.addColorStop(0, 'rgba(200,215,235,0.32)'); grad.addColorStop(1, 'rgba(200,215,235,0)');
                    ctx.fillStyle = grad; ctx.beginPath(); ctx.ellipse(cx2, cy2, 130, 42, 0, 0, Math.PI * 2); ctx.fill();
                }
                // Puddle reflections at ground
                for (let pi = 0; pi < 5; pi++) {
                    const px2 = ((pi * 220 - worldX * 0.16) % (W + 200) + W + 200) % (W + 200) - 50;
                    ctx.fillStyle = 'rgba(150,175,210,0.18)';
                    ctx.beginPath(); ctx.ellipse(px2, H - 12, 60 + pi * 14, 7, 0, 0, Math.PI * 2); ctx.fill();
                }

            } else if (id === 'hell') {
                // Volcanic floor with lava cracks, rising fire columns, heat haze
                const bg2 = ctx.createRadialGradient(W * 0.5, H * 0.4, 30, W * 0.5, H * 0.5, W * 0.9);
                bg2.addColorStop(0, '#520d0d'); bg2.addColorStop(0.45, '#230404'); bg2.addColorStop(1, '#0a0101');
                ctx.fillStyle = bg2; ctx.fillRect(0, 0, W, H);
                // Lava crack network (static + glow)
                for (let i = 0; i < 8; i++) {
                    const lx = ((i * 180 - worldX * 0.2) % (W + 120) + W + 120) % (W + 120) - 60;
                    const al = 0.3 + Math.sin(t * 0.007 + i) * 0.28;
                    ctx.strokeStyle = `rgba(255,${80 + i * 18},0,${al})`; ctx.lineWidth = 2 + (i % 2);
                    ctx.shadowColor = '#ff4400'; ctx.shadowBlur = 14;
                    ctx.beginPath(); ctx.moveTo(lx, H); ctx.bezierCurveTo(lx + 30, H * 0.72, lx - 20, H * 0.5, lx + 12, H * 0.28); ctx.stroke();
                    ctx.shadowBlur = 0;
                }
                // Rising fire columns
                for (let fi = 0; fi < W + 60; fi += 110) {
                    const fx2 = ((fi - worldX * 0.3 + t * 0.04) % (W + 150) + W + 150) % (W + 150) - 60;
                    const fh = 60 + Math.sin(t * 0.01 + fi) * 30;
                    const fGrad = ctx.createLinearGradient(fx2, H, fx2, H - fh - 40);
                    fGrad.addColorStop(0, 'rgba(255,80,0,0.55)'); fGrad.addColorStop(0.6, 'rgba(255,200,40,0.25)'); fGrad.addColorStop(1, 'rgba(255,80,0,0)');
                    ctx.fillStyle = fGrad;
                    ctx.beginPath(); ctx.moveTo(fx2 - 10, H); ctx.quadraticCurveTo(fx2 + Math.sin(t * 0.006 + fi) * 14, H - fh, fx2 + 10, H); ctx.closePath(); ctx.fill();
                }
                // Ember motes
                parallaxDust(20, 0.25, 'rgba(255,130,30,0.7)', 1.5, 3);

            } else if (id === 'space') {
                // Deep space with layered nebulae, star clusters, and warp streaks
                baseGradient('#01010a', '#050520', '#000004');
                stars(120, 0.05, 'rgba(210,215,255,0.9)', 1.2);
                stars(50, 0.12, 'rgba(255,255,200,0.85)', 1.8);
                // Nebula blobs
                const nebColors = ['rgba(80,50,200,0.18)', 'rgba(200,60,120,0.14)', 'rgba(40,120,200,0.13)'];
                for (let ni = 0; ni < 3; ni++) {
                    const nx = ((ni * 380 - worldX * 0.03) % (W + 400) + W + 400) % (W + 400) - 100;
                    const ny = H * (0.2 + ni * 0.28);
                    const ng = ctx.createRadialGradient(nx, ny, 10, nx, ny, 200 + ni * 60);
                    ng.addColorStop(0, nebColors[ni]); ng.addColorStop(1, 'rgba(0,0,0,0)');
                    ctx.fillStyle = ng; ctx.fillRect(0, 0, W, H);
                }
                // Warp streak lines (very faint)
                ctx.strokeStyle = 'rgba(180,200,255,0.07)'; ctx.lineWidth = 1;
                for (let i = 0; i < 14; i++) {
                    const wx = ((i * 97 - worldX * 0.18) % (W + 60) + W + 60) % (W + 60) - 30;
                    ctx.beginPath(); ctx.moveTo(wx, (i * 67) % H); ctx.lineTo(wx + 60, (i * 67 + 80) % H); ctx.stroke();
                }

            } else if (id === 'storm') {
                // Thundercloud sky with diagonal lightning forks and rain
                baseGradient('#04141e', '#091e2e', '#010608');
                // Cloud banks
                for (let ci = 0; ci < 6; ci++) {
                    const cx2 = ((ci * 240 - worldX * 0.08) % (W + 300) + W + 300) % (W + 300) - 80;
                    const cy2 = 50 + (ci % 3) * 70;
                    const cg = ctx.createRadialGradient(cx2, cy2, 10, cx2, cy2, 120);
                    cg.addColorStop(0, 'rgba(60,100,130,0.35)'); cg.addColorStop(1, 'rgba(20,40,60,0)');
                    ctx.fillStyle = cg; ctx.beginPath(); ctx.ellipse(cx2, cy2, 120, 50, 0, 0, Math.PI * 2); ctx.fill();
                }
                // Lightning forks
                const lTime = Math.floor(t * 0.0015);
                if (lTime % 7 < 2) {
                    const lx = ((lTime * 137) % W);
                    ctx.strokeStyle = 'rgba(140,240,255,0.7)'; ctx.lineWidth = 1.5;
                    ctx.shadowColor = '#88eeff'; ctx.shadowBlur = 12;
                    ctx.beginPath(); ctx.moveTo(lx, 0);
                    let ly = 0, lxc = lx;
                    while (ly < H * 0.7) { ly += 30 + (lx % 20); lxc += -15 + (lx % 30);
                        ctx.lineTo(lxc, ly); }
                    ctx.stroke(); ctx.shadowBlur = 0;
                }
                // Dense rain: each drop has an independent stable X/Y seed so the
                // field stays naturally scattered instead of forming diagonal rows.
                ctx.strokeStyle = 'rgba(100,200,240,0.18)'; ctx.lineWidth = 1;
                const threadstormRainSeed = ftScatterSeed('threadstorm-spire-rain');
                for (let ri = 0; ri < 50; ri++) {
                    const spanX = W + 80, spanY = H + 80;
                    const baseX = ftScatter01(threadstormRainSeed, ri, 0) * spanX - 40;
                    const baseY = ftScatter01(threadstormRainSeed, ri, 1) * spanY - 40;
                    const fallSpeed = 0.055 + ftScatter01(threadstormRainSeed, ri, 2) * 0.045;
                    const driftSpeed = 0.035 + ftScatter01(threadstormRainSeed, ri, 3) * 0.035;
                    const streakX = -4 - ftScatter01(threadstormRainSeed, ri, 4) * 5;
                    const streakY = 14 + ftScatter01(threadstormRainSeed, ri, 5) * 10;
                    const rx = ((baseX + worldX * 0.22 + t * driftSpeed + 40) % spanX + spanX) % spanX - 40;
                    const ry = ((baseY + t * fallSpeed + 40) % spanY + spanY) % spanY - 40;
                    ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx + streakX, ry + streakY); ctx.stroke();
                }

            } else if (id === 'void') {
                // Swirling cosmic void with fractal thread tendrils and void rings
                const bg2 = ctx.createRadialGradient(W * 0.5, H * 0.5, 15, W * 0.5, H * 0.5, W * 0.9);
                bg2.addColorStop(0, '#200c33'); bg2.addColorStop(0.5, '#0b0417'); bg2.addColorStop(1, '#020108');
                ctx.fillStyle = bg2; ctx.fillRect(0, 0, W, H);
                // Void tendrils
                for (let i = 0; i < 10; i++) {
                    const vx = ((i * 167 - worldX * 0.11) % (W + 80) + W + 80) % (W + 80) - 40;
                    const al = 0.18 + Math.sin(t * 0.003 + i) * 0.1;
                    ctx.strokeStyle = `rgba(200,100,255,${al})`; ctx.lineWidth = 1.5;
                    ctx.beginPath(); ctx.moveTo(vx, 0);
                    ctx.bezierCurveTo(vx + 35, H * 0.25, vx - 35, H * 0.55, vx + 18, H * 0.78);
                    ctx.bezierCurveTo(vx - 15, H * 0.9, vx + 25, H * 0.95, vx + 8, H); ctx.stroke();
                }
                // Concentric void rings
                for (let ri = 0; ri < 4; ri++) {
                    const r = 60 + ri * 90 + Math.sin(t * 0.002 + ri) * 20;
                    ctx.strokeStyle = `rgba(190,80,255,${0.07 - ri * 0.014})`;
                    ctx.lineWidth = 3;
                    ctx.beginPath(); ctx.arc(W * 0.5, H * 0.5, r, 0, Math.PI * 2); ctx.stroke();
                }
                parallaxDust(14, 0.1, 'rgba(220,130,255,0.6)', 1, 2);

            } else if (id === 'fractured') {
                // Cracked amber wasteland with floating shard debris and seismic cracks
                baseGradient('#221508', '#361f0a', '#080402');
                // Ground crack lines
                for (let i = 0; i < 12; i++) {
                    const cx2 = ((i * 155 - worldX * 0.2) % (W + 100) + W + 100) % (W + 100) - 50;
                    const al = 0.25 + Math.sin(t * 0.002 + i) * 0.1;
                    ctx.strokeStyle = `rgba(255,185,60,${al})`; ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(cx2, H * 0.6); ctx.lineTo(cx2 + 18, H * 0.78); ctx.lineTo(cx2 - 10, H * 0.9); ctx.lineTo(cx2 + 22, H);
                    ctx.stroke();
                    // Glow from crack
                    const crackGlow = ctx.createLinearGradient(cx2, H * 0.6, cx2, H);
                    crackGlow.addColorStop(0, 'rgba(255,180,40,0)'); crackGlow.addColorStop(1, `rgba(255,150,20,${al * 0.25})`);
                    ctx.fillStyle = crackGlow;
                    ctx.fillRect(cx2 - 3, H * 0.6, 6, H * 0.4);
                }
                // Floating shards
                const fracturedScatterSeed = ftScatterSeed('fractured-shards');
                for (let si = 0; si < 16; si++) {
                    const sx0 = ftScatter01(fracturedScatterSeed, si, 0) * (W + 80) - 40;
                    const sx = ((sx0 - worldX * 0.26 + 40) % (W + 80) + W + 80) % (W + 80) - 40;
                    const sy = H * (0.15 + ftScatter01(fracturedScatterSeed, si, 1) * 0.6) + Math.sin(t * 0.003 + ftScatter01(fracturedScatterSeed, si, 2) * Math.PI * 2) * 12;
                    const rot = t * 0.001 + ftScatter01(fracturedScatterSeed, si, 3) * Math.PI * 2;
                    ctx.save(); ctx.translate(sx, sy); ctx.rotate(rot);
                    ctx.fillStyle = `rgba(255,195,80,${0.12 + si % 3 * 0.04})`;
                    ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(5, 0); ctx.lineTo(0, 6); ctx.lineTo(-5, 0); ctx.closePath(); ctx.fill();
                    ctx.restore();
                }

            } else if (id === 'celestial') {
                // Ethereal golden firmament with rotating constellation lines and shooting stars
                baseGradient('#0e182e', '#2a2850', '#060610');
                stars(100, 0.10, 'rgba(255,245,180,0.85)', 1.5);
                // Constellation arcs
                const celestialArcSeed = ftScatterSeed('celestial-arcs');
                for (let ci = 0; ci < 5; ci++) {
                    const cx0 = ftScatter01(celestialArcSeed, ci, 0) * (W + 300) - 50;
                    const cx2 = ((cx0 - worldX * 0.04 + 50) % (W + 300) + W + 300) % (W + 300) - 50;
                    const cy2 = H * (0.22 + ftScatter01(celestialArcSeed, ci, 1) * 0.36);
                    ctx.strokeStyle = 'rgba(255,240,160,0.11)'; ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.arc(cx2, cy2, 80 + ci * 35, 0, Math.PI * 2); ctx.stroke();
                    ctx.beginPath(); ctx.arc(cx2, cy2, 50 + ci * 20, 0, Math.PI * 2); ctx.stroke();
                }
                // Shooting star
                const sStar = (t * 0.0004) % 1;
                const sx2 = W * sStar;
                const sy2 = H * 0.1 + sStar * H * 0.3;
                ctx.strokeStyle = 'rgba(255,245,200,0.55)'; ctx.lineWidth = 2;
                ctx.shadowColor = '#ffe890'; ctx.shadowBlur = 8;
                ctx.beginPath(); ctx.moveTo(sx2, sy2); ctx.lineTo(sx2 - 45, sy2 - 22); ctx.stroke();
                ctx.shadowBlur = 0;
                // Golden haze
                const haze = ctx.createRadialGradient(W * 0.5, H * 0.6, 50, W * 0.5, H * 0.6, W * 0.55);
                haze.addColorStop(0, 'rgba(255,235,120,0.08)'); haze.addColorStop(1, 'rgba(255,235,120,0)');
                ctx.fillStyle = haze; ctx.fillRect(0, 0, W, H);

            } else if (id === 'machineLoom') {
                // Industrial grid with scrolling conveyor lines and neon gear glow
                baseGradient('#0c0f1e', '#141828', '#040508');
                // Grid floor
                ctx.strokeStyle = 'rgba(130,145,200,0.14)'; ctx.lineWidth = 1;
                const gStep = 55;
                for (let gx = -gStep; gx < W + gStep; gx += gStep) {
                    const ox = ((gx - worldX * 0.3) % (W + gStep * 2) + W + gStep * 2) % (W + gStep * 2) - gStep;
                    ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, H); ctx.stroke();
                }
                for (let gy = 0; gy < H; gy += gStep) {
                    ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
                }
                // Scrolling conveyor bands
                for (let bi = 0; bi < 3; bi++) {
                    const by = H * (0.35 + bi * 0.2);
                    ctx.strokeStyle = `rgba(170,184,255,${0.18 - bi * 0.04})`; ctx.lineWidth = 6 - bi * 1.5;
                    ctx.beginPath(); ctx.moveTo(0, by); ctx.lineTo(W, by); ctx.stroke();
                    // Tick marks
                    ctx.strokeStyle = `rgba(200,210,255,0.22)`; ctx.lineWidth = 1.5;
                    for (let ti = 0; ti < W + 30; ti += 30) {
                        const tx = ((ti - worldX * 0.4 + t * (0.06 + bi * 0.02)) % (W + 60) + W + 60) % (W + 60) - 30;
                        ctx.beginPath(); ctx.moveTo(tx, by - 5); ctx.lineTo(tx, by + 5); ctx.stroke();
                    }
                }
                // Floating gear rings (background deco)
                const machineLoomGearSeed = ftScatterSeed('machineLoom-gears');
                for (let gi = 0; gi < 4; gi++) {
                    const gx0 = ftScatter01(machineLoomGearSeed, gi, 0) * (W + 300) - 150;
                    const gx2 = ((gx0 - worldX * 0.12 + 150) % (W + 300) + W + 300) % (W + 300) - 150;
                    const gy2 = H * (0.18 + ftScatter01(machineLoomGearSeed, gi, 1) * 0.52);
                    const gr = 28 + gi * 8;
                    const spinDir = ftScatter01(machineLoomGearSeed, gi, 2) < 0.5 ? -1 : 1;
                    ctx.save(); ctx.translate(gx2, gy2); ctx.rotate(t * 0.001 * spinDir + ftScatter01(machineLoomGearSeed, gi, 3) * Math.PI * 2);
                    ctx.strokeStyle = `rgba(150,165,255,0.12)`; ctx.lineWidth = 4;
                    ctx.beginPath(); ctx.arc(0, 0, gr, 0, Math.PI * 2); ctx.stroke();
                    for (let tooth = 0; tooth < 8; tooth++) {
                        const ta = tooth * Math.PI / 4;
                        ctx.beginPath(); ctx.moveTo(Math.cos(ta) * (gr - 4), Math.sin(ta) * (gr - 4));
                        ctx.lineTo(Math.cos(ta) * (gr + 8), Math.sin(ta) * (gr + 8)); ctx.stroke();
                    }
                    ctx.restore();
                }

            } else if (id === 'garden') {
                // Bioluminescent nightmare garden with weaving vines and pulsing spores
                baseGradient('#030e04', '#061407', '#010402');
                // Background vine network
                for (let vi = 0; vi < W + 60; vi += 48) {
                    const vx = ((vi - worldX * 0.14) % (W + 100) + W + 100) % (W + 100) - 50;
                    const al = 0.18 + Math.sin(t * 0.003 + vi) * 0.08;
                    ctx.strokeStyle = `rgba(80,200,60,${al})`; ctx.lineWidth = 1.5;
                    ctx.beginPath(); ctx.moveTo(vx, H);
                    ctx.bezierCurveTo(vx - 30 + Math.sin(t * 0.002 + vi) * 20, H * 0.7, vx + 28, H * 0.4, vx + 10, H * 0.12);
                    ctx.stroke();
                    // Leaf nodes
                    for (let li = 0; li < 3; li++) {
                        const leafY = H * (0.85 - li * 0.28);
                        const leafX = vx + Math.sin(t * 0.002 + vi + li) * 16;
                        ctx.fillStyle = `rgba(100,255,70,${0.14 + li * 0.04})`;
                        ctx.beginPath(); ctx.ellipse(leafX, leafY, 8, 4, Math.sin(t * 0.002 + li) * 0.5, 0, Math.PI * 2); ctx.fill();
                    }
                }
                // Spore clouds
                const gardenSporeSeed = ftScatterSeed('garden-spores');
                for (let si = 0; si < 18; si++) {
                    const sx0 = ftScatter01(gardenSporeSeed, si, 0) * (W + 80) - 40;
                    const sx = ((sx0 - worldX * 0.18 + 40) % (W + 80) + W + 80) % (W + 80) - 40;
                    const sy = H * (0.1 + ftScatter01(gardenSporeSeed, si, 1) * 0.75) + Math.sin(t * 0.004 + ftScatter01(gardenSporeSeed, si, 2) * Math.PI * 2) * 15;
                    const al = 0.25 + Math.sin(t * 0.006 + ftScatter01(gardenSporeSeed, si, 3) * Math.PI * 2) * 0.22;
                    ctx.fillStyle = `rgba(${100 + si % 40},255,${60 + si % 80},${al})`;
                    ctx.beginPath(); ctx.arc(sx, sy, 2 + (si % 3), 0, Math.PI * 2); ctx.fill();
                }

            } else if (id === 'ocean') {
                // Abyssal depths with layered wave bands, caustic light, and deep glow
                baseGradient('#010d18', '#022240', '#000509');
                // Caustic light shimmer (top portion)
                const endlessOceanCausticSeed = ftScatterSeed('endlessOcean-caustics');
                for (let ci = 0; ci < 11; ci++) {
                    const cx0 = ftScatter01(endlessOceanCausticSeed, ci, 0) * (W + 60) - 30;
                    const cx2 = ((cx0 - worldX * 0.06 + 30) % (W + 60) + W + 60) % (W + 60) - 30;
                    const cy2 = H * (0.04 + ftScatter01(endlessOceanCausticSeed, ci, 1) * 0.34);
                    const al = 0.06 + Math.sin(t * 0.008 + ftScatter01(endlessOceanCausticSeed, ci, 2) * Math.PI * 2) * 0.05;
                    ctx.fillStyle = `rgba(90,230,255,${al})`;
                    ctx.beginPath(); ctx.ellipse(cx2, cy2, 20 + ci % 4 * 8, 5, Math.sin(t * 0.003 + ftScatter01(endlessOceanCausticSeed, ci, 3) * Math.PI * 2) * 0.4, 0, Math.PI * 2); ctx.fill();
                }
                // Wave bands at multiple depths
                for (let band = 0; band < 5; band++) {
                    const by = H * (0.15 + band * 0.16);
                    const al = 0.18 - band * 0.025;
                    ctx.strokeStyle = `rgba(80,200,240,${al})`; ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    for (let x = 0; x <= W; x += 36) {
                        const wy = by + Math.sin((x + worldX * (0.1 + band * 0.04)) * 0.016 + t * (0.002 + band * 0.0005)) * (8 + band * 3);
                        x === 0 ? ctx.moveTo(x, wy) : ctx.lineTo(x, wy);
                    }
                    ctx.stroke();
                }
                // Bioluminescent deep glow
                const deepGlow = ctx.createLinearGradient(0, H * 0.6, 0, H);
                deepGlow.addColorStop(0, 'rgba(0,80,140,0)'); deepGlow.addColorStop(1, 'rgba(0,40,100,0.22)');
                ctx.fillStyle = deepGlow; ctx.fillRect(0, H * 0.6, W, H * 0.4);
                // Bubble columns
                for (let bi = 0; bi < 4; bi++) {
                    const bx = ((bi * 190 - worldX * 0.12) % (W + 100) + W + 100) % (W + 100) - 50;
                    for (let bj = 0; bj < 3; bj++) {
                        const by2 = H - ((t * 0.03 + bi * 40 + bj * 60) % (H + 30));
                        const bal = 0.2 + Math.sin(t * 0.005 + bi + bj) * 0.15;
                        ctx.strokeStyle = `rgba(140,230,255,${bal})`; ctx.lineWidth = 1;
                        ctx.beginPath(); ctx.arc(bx + Math.sin(t * 0.003 + bj) * 10, by2, 3 + bj, 0, Math.PI * 2); ctx.stroke();
                    }
                }

            } else if (id === 'glassSanctum') {
                // Crystal cathedral with prismatic facets and refracted light beams
                baseGradient('#05101a', '#0e2232', '#020508');
                // Glass facet planes
                for (let fi = 0; fi < W + 100; fi += 70) {
                    const fx = ((fi - worldX * 0.22) % (W + 150) + W + 150) % (W + 150) - 60;
                    ctx.strokeStyle = 'rgba(180,240,255,0.18)'; ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(fx, H); ctx.lineTo(fx + 38, H * 0.22); ctx.lineTo(fx + 80, H); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(fx + 18, H); ctx.lineTo(fx + 52, H * 0.4); ctx.stroke();
                    // Prism color streak
                    ctx.strokeStyle = `hsla(${(fi * 2 + t * 0.025) % 360},80%,80%,0.08)`;
                    ctx.lineWidth = 3;
                    ctx.beginPath(); ctx.moveTo(fx + 38, H * 0.22); ctx.lineTo(fx + 38 + 60, H * 0.22 + 80); ctx.stroke();
                }
                // Floating ice crystal shards
                for (let ci = 0; ci < 12; ci++) {
                    const cx2 = ((ci * 137 - worldX * 0.15) % (W + 80) + W + 80) % (W + 80) - 40;
                    const cy2 = H * 0.1 + (ci * 73) % (H * 0.7) + Math.sin(t * 0.003 + ci) * 18;
                    ctx.save(); ctx.translate(cx2, cy2); ctx.rotate(t * 0.0008 + ci);
                    ctx.strokeStyle = `rgba(200,245,255,${0.16 + ci % 3 * 0.04})`; ctx.lineWidth = 1;
                    ctx.beginPath();
                    for (let p2 = 0; p2 < 6; p2++) {
                        const pa = p2 * Math.PI / 3;
                        ctx.moveTo(0, 0); ctx.lineTo(Math.cos(pa) * 8, Math.sin(pa) * 8);
                    }
                    ctx.stroke(); ctx.restore();
                }

            } else if (id === 'ashLibrary') {
                // Ancient scorched library with drifting ash pages and ember shelf glow
                baseGradient('#180c06', '#2e1608', '#070201');
                // Shelf silhouettes (parallax)
                for (let si = 0; si < 3; si++) {
                    const sy = H * (0.25 + si * 0.22);
                    ctx.fillStyle = `rgba(60,30,15,${0.45 - si * 0.1})`;
                    ctx.fillRect(0, sy, W, 18);
                    // Book spines
                    for (let bi = 0; bi < W; bi += 18) {
                        const bx = ((bi - worldX * (0.1 + si * 0.06)) % (W + 40) + W + 40) % (W + 40) - 20;
                        ctx.fillStyle = `rgba(${80 + (bi * 3) % 60},${30 + (bi * 2) % 25},${10 + bi % 15},0.35)`;
                        ctx.fillRect(bx, sy - 25 - (bi % 5) * 3, 12, 28 + (bi % 5) * 3);
                    }
                }
                // Drifting ash pages
                for (let ai = 0; ai < 14; ai++) {
                    const ax = ((ai * 123 - worldX * 0.18 + t * 0.015) % (W + 80) + W + 80) % (W + 80) - 40;
                    const ay = (ai * 83 + t * 0.022) % (H + 40) - 20;
                    const ar = t * 0.003 + ai;
                    const aal = 0.2 + Math.sin(t * 0.004 + ai) * 0.14;
                    ctx.save(); ctx.translate(ax, ay); ctx.rotate(ar);
                    ctx.fillStyle = `rgba(220,195,165,${aal})`;
                    ctx.fillRect(-5, -4, 10, 7);
                    ctx.strokeStyle = `rgba(180,155,120,${aal * 0.6})`; ctx.lineWidth = 0.5;
                    ctx.beginPath(); ctx.moveTo(-4, -1); ctx.lineTo(4, -1); ctx.moveTo(-4, 1); ctx.lineTo(4, 1); ctx.stroke();
                    ctx.restore();
                }
                // Ember glow from shelves
                parallaxDust(12, 0.16, 'rgba(255,120,50,0.55)', 1.5, 3.5);

            } else if (id === 'cinderVeil') {
                // Smoldering veil with silk-ash curtains, cinder motes, and deep red haze
                baseGradient('#200e0a', '#361810', '#0c0403');
                // Silk-ash curtains
                for (let ci = 0; ci < W + 70; ci += 65) {
                    const cx2 = ((ci - worldX * 0.1) % (W + 130) + W + 130) % (W + 130) - 65;
                    ctx.strokeStyle = 'rgba(230,210,200,0.10)'; ctx.lineWidth = 1;
                    for (let thread = 0; thread < 3; thread++) {
                        const tx = cx2 + thread * 18;
                        ctx.beginPath(); ctx.moveTo(tx, 0);
                        ctx.bezierCurveTo(tx + Math.sin(t * 0.002 + thread) * 22, H * 0.35, tx - 16, H * 0.65, tx + 8, H);
                        ctx.stroke();
                    }
                }
                // Cinder motes (large, slow)
                for (let mi = 0; mi < 22; mi++) {
                    const mx = ((mi * 119 - worldX * 0.16) % (W + 70) + W + 70) % (W + 70) - 35;
                    const my = (mi * 71 + t * 0.022) % (H + 40) - 20;
                    const mal = 0.35 + Math.sin(t * 0.005 + mi) * 0.28;
                    const mc = mi % 3 === 0 ? `rgba(255,100,50,${mal})` : `rgba(255,160,80,${mal * 0.65})`;
                    ctx.fillStyle = mc;
                    ctx.beginPath(); ctx.arc(mx, my, 2 + mi % 3, 0, Math.PI * 2); ctx.fill();
                }
                // Red heat haze
                const haze2 = ctx.createLinearGradient(0, H * 0.55, 0, H);
                haze2.addColorStop(0, 'rgba(180,60,20,0)'); haze2.addColorStop(1, 'rgba(140,40,10,0.14)');
                ctx.fillStyle = haze2; ctx.fillRect(0, H * 0.55, W, H * 0.45);

            } else if (id === 'silkGraveyard') {
                // Ghostly silkworm graveyard with drifting silk threads and faint tombstones
                baseGradient('#0d0d1a', '#1b1b30', '#040409');
                // Silk drift threads
                for (let si = 0; si < W + 70; si += 68) {
                    const sx = ((si - worldX * 0.09) % (W + 100) + W + 100) % (W + 100) - 50;
                    const al = 0.13 + Math.sin(t * 0.002 + si) * 0.08;
                    ctx.strokeStyle = `rgba(220,220,250,${al})`; ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(sx, 0);
                    ctx.bezierCurveTo(sx + 28 + Math.sin(t * 0.0015 + si) * 18, H * 0.3, sx - 22, H * 0.65, sx + 12, H);
                    ctx.stroke();
                }
                // Tombstone silhouettes
                for (let ti = 0; ti < 6; ti++) {
                    const tx = ((ti * 180 - worldX * 0.12) % (W + 200) + W + 200) % (W + 200) - 80;
                    ctx.fillStyle = `rgba(40,40,65,${0.5 + ti % 2 * 0.15})`;
                    const th = 45 + (ti % 3) * 12;
                    ctx.beginPath(); ctx.rect(tx - 10, H - 85 - th, 20, th); ctx.fill();
                    ctx.beginPath(); ctx.arc(tx, H - 85 - th, 10, Math.PI, Math.PI * 2); ctx.fill();
                }
                // Wisps. Use a small shadow glow rather than rebuilding many
                // radial gradients every frame; visually similar, substantially cheaper.
                ctx.save();
                ctx.shadowColor = 'rgba(190,195,255,0.7)';
                ctx.shadowBlur = 12;
                for (let wi = 0; wi < 5; wi++) {
                    const wx = ((wi * 211 - worldX * 0.14) % (W + 80) + W + 80) % (W + 80) - 40;
                    const wy = H * 0.4 + (wi * 97) % (H * 0.45) + Math.sin(t * 0.004 + wi) * 16;
                    const wal = 0.16 + Math.sin(t * 0.006 + wi) * 0.10;
                    ctx.fillStyle = `rgba(205,210,255,${wal})`;
                    ctx.beginPath(); ctx.arc(wx, wy, 5, 0, Math.PI * 2); ctx.fill();
                }
                ctx.restore();

            } else if (id === 'prismCourt') {
                // Rainbow crystalline court with rotating prism beams and spectrum refraction
                baseGradient('#130718', '#22103a', '#060209');
                // Spectrum refraction beams from top corners
                for (let bi = 0; bi < 14; bi++) {
                    const angle = (bi / 14) * Math.PI * 0.55 + Math.sin(t * 0.001 + bi) * 0.05;
                    ctx.strokeStyle = `hsla(${(bi * 26 + t * 0.025) % 360}, 90%, 72%, 0.1)`;
                    ctx.lineWidth = 3;
                    ctx.beginPath(); ctx.moveTo(W * 0.12 - worldX * 0.02, 0);
                    ctx.lineTo(W * 0.12 - worldX * 0.02 + Math.cos(angle) * W * 1.1, Math.sin(angle) * H * 1.4);
                    ctx.stroke();
                }
                // Crystal pillars
                for (let pi = 0; pi < W + 80; pi += 80) {
                    const px = ((pi - worldX * 0.18) % (W + 140) + W + 140) % (W + 140) - 60;
                    const ph = H * 0.45 + (pi % 3) * H * 0.08;
                    ctx.fillStyle = 'rgba(220,190,255,0.07)';
                    ctx.beginPath(); ctx.moveTo(px - 12, H); ctx.lineTo(px - 8, H - ph); ctx.lineTo(px, H - ph - 18); ctx.lineTo(px + 8, H - ph); ctx.lineTo(px + 12, H); ctx.closePath(); ctx.fill();
                    ctx.strokeStyle = 'rgba(255,210,255,0.12)'; ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(px - 12, H); ctx.lineTo(px - 8, H - ph); ctx.lineTo(px, H - ph - 18); ctx.lineTo(px + 8, H - ph); ctx.lineTo(px + 12, H); ctx.closePath(); ctx.stroke();
                }
                parallaxDust(16, 0.12, 'rgba(255,170,255,0.5)', 1, 3);

            } else if (id === 'echoForge') {
                // Resonant forge with standing-wave interference and ringing heat shafts.
                // Keep the look, but avoid hundreds of full-height fills and dozens of
                // freshly-created gradients every frame. This realm used to be a major GPU
                // hotspot on long runs.
                baseGradient('#160702', '#2c0f04', '#050100');

                // Coarser standing-wave bands. 18px spacing is visually continuous once the
                // translucent bands overlap, while cutting this pass to roughly one third cost.
                ctx.save();
                ctx.globalCompositeOperation = 'screen';
                for (let wx = 0; wx < W; wx += 18) {
                    const wv = Math.sin((wx + worldX * 0.2) * 0.022 + t * 0.004) * 0.5 +
                               Math.sin((wx - worldX * 0.1) * 0.038 + t * 0.006) * 0.5;
                    const al = Math.max(0, wv * 0.105);
                    if (al <= 0.004) continue;
                    ctx.fillStyle = `rgba(255,145,55,${al})`;
                    ctx.fillRect(wx, 0, 16, H);
                }

                // One shared vertical gradient for every shaft instead of rebuilding a gradient
                // for every individual column every frame.
                const forgeHeat = ctx.createLinearGradient(0, H, 0, H * 0.1);
                forgeHeat.addColorStop(0, 'rgba(255,100,30,0.18)');
                forgeHeat.addColorStop(1, 'rgba(255,100,30,0)');
                ctx.fillStyle = forgeHeat;
                for (let fi = 0; fi < W + 100; fi += 105) {
                    const fx = ((fi - worldX * 0.28) % (W + 170) + W + 170) % (W + 170) - 70;
                    const fw = 10 + Math.sin(t * 0.004 + fi) * 4;
                    ctx.fillRect(fx - fw / 2, H * 0.1, fw, H * 0.9);
                }
                ctx.restore();
                parallaxDust(10, 0.22, 'rgba(255,110,40,0.55)', 2, 4);

            } else if (id === 'neonOrchard') {
                // Electric orchard with neon blossom trees and chromatic soil glow
                baseGradient('#021510', '#03231a', '#000805');
                // Neon tree silhouettes
                for (let ti = 0; ti < W + 80; ti += 100) {
                    const tx = ((ti - worldX * 0.18) % (W + 160) + W + 160) % (W + 160) - 70;
                    const tc = `hsla(${(ti * 3 + t * 0.02) % 360},90%,65%,0.18)`;
                    // Trunk
                    ctx.fillStyle = 'rgba(40,80,55,0.5)'; ctx.fillRect(tx - 5, H - 80, 10, 80);
                    // Canopy glow
                    const tg = ctx.createRadialGradient(tx, H - 95, 5, tx, H - 95, 55);
                    tg.addColorStop(0, tc); tg.addColorStop(1, 'rgba(0,255,160,0)');
                    ctx.fillStyle = tg; ctx.beginPath(); ctx.arc(tx, H - 95, 55, 0, Math.PI * 2); ctx.fill();
                    // Blossom dots
                    for (let bi = 0; bi < 8; bi++) {
                        const ba = t * 0.002 + bi * Math.PI * 0.25 + ti;
                        const br = 28 + bi * 3;
                        ctx.fillStyle = `rgba(80,255,180,${0.25 + Math.sin(t * 0.006 + bi) * 0.15})`;
                        ctx.beginPath(); ctx.arc(tx + Math.cos(ba) * br, H - 95 + Math.sin(ba) * br * 0.5, 3, 0, Math.PI * 2); ctx.fill();
                    }
                }
                // Ground chromatic soil bands
                for (let li = 0; li < 4; li++) {
                    ctx.fillStyle = `hsla(${(li * 40 + t * 0.015) % 360}, 70%, 40%, 0.05)`;
                    ctx.fillRect(0, H - 20 - li * 8, W, 8);
                }

            } else if (id === 'clockworkAbyss') {
                // Infinite gear-shaft abyss with ticking clock faces and pendulum shadows
                baseGradient('#130f02', '#221a04', '#060400');
                // Ticking gear rings (background)
                const clockworkGearSeed = ftScatterSeed('clockworkAbyss-gears');
                for (let gi = 0; gi < 5; gi++) {
                    const gx0 = ftScatter01(clockworkGearSeed, gi, 0) * (W + 280) - 80;
                    const gx = ((gx0 - worldX * 0.08 + 80) % (W + 280) + W + 280) % (W + 280) - 80;
                    const gy = H * (0.14 + ftScatter01(clockworkGearSeed, gi, 1) * 0.62);
                    const gr = 50 + gi * 22;
                    const spin = t * 0.0008 * (ftScatter01(clockworkGearSeed, gi, 2) < 0.5 ? -1 : 1);
                    ctx.save(); ctx.translate(gx, gy); ctx.rotate(spin + ftScatter01(clockworkGearSeed, gi, 3) * Math.PI * 2);
                    ctx.strokeStyle = `rgba(230,185,70,${0.12 - gi * 0.015})`; ctx.lineWidth = 2.5;
                    ctx.beginPath(); ctx.arc(0, 0, gr, 0, Math.PI * 2); ctx.stroke();
                    for (let tooth = 0; tooth < 12; tooth++) {
                        const ta = tooth * Math.PI / 6;
                        ctx.beginPath(); ctx.moveTo(Math.cos(ta) * gr, Math.sin(ta) * gr);
                        ctx.lineTo(Math.cos(ta) * (gr + 10), Math.sin(ta) * (gr + 10)); ctx.stroke();
                    }
                    ctx.restore();
                }
                // Pendulum shadow sweeps
                for (let pi = 0; pi < 3; pi++) {
                    const px = W * (0.2 + pi * 0.3) + Math.sin(t * 0.002 + pi) * W * 0.06;
                    ctx.strokeStyle = `rgba(200,160,40,0.09)`; ctx.lineWidth = 12 - pi * 3;
                    ctx.beginPath(); ctx.moveTo(px - worldX * 0.04, 0); ctx.lineTo(px - worldX * 0.04 + Math.sin(t * 0.002 + pi) * 40, H); ctx.stroke();
                }

            } else if (id === 'glassCitadel') {
                // Towering glass citadel with soaring buttresses and refracted city lights below
                baseGradient('#030c12', '#071822', '#010508');
                // Buttress spires
                for (let si = 0; si < W + 100; si += 90) {
                    const sx = ((si - worldX * 0.2) % (W + 180) + W + 180) % (W + 180) - 80;
                    ctx.strokeStyle = 'rgba(190,240,255,0.13)'; ctx.lineWidth = 2;
                    ctx.beginPath(); ctx.moveTo(sx, H); ctx.lineTo(sx + 14, H * 0.15); ctx.lineTo(sx + 28, H); ctx.stroke();
                    // Arched window panes
                    for (let wi = 0; wi < 4; wi++) {
                        const wy = H * (0.7 - wi * 0.16);
                        ctx.strokeStyle = `rgba(180,235,255,${0.1 - wi * 0.018})`;
                        ctx.beginPath(); ctx.ellipse(sx + 14, wy, 10, 15, 0, Math.PI, 0); ctx.stroke();
                    }
                }
                // City lights beneath (distance glow)
                const cityGlow = ctx.createLinearGradient(0, H * 0.7, 0, H);
                cityGlow.addColorStop(0, 'rgba(80,160,210,0)'); cityGlow.addColorStop(1, 'rgba(60,130,180,0.12)');
                ctx.fillStyle = cityGlow; ctx.fillRect(0, H * 0.7, W, H * 0.3);
                parallaxDust(15, 0.1, 'rgba(195,245,255,0.45)', 1, 2.5);

            } else if (id === 'bloodMoonCathedral') {
                // Gothic cathedral under blood moon with stained glass streaks and bone rain
                baseGradient('#160204', '#260306', '#080001');
                // Moon glow
                const moonX = ((W * 0.75 - worldX * 0.02) % (W + 80) + W + 80) % (W + 80) - 40;
                const moonGrad = ctx.createRadialGradient(moonX, H * 0.15, 10, moonX, H * 0.15, 120);
                moonGrad.addColorStop(0, 'rgba(255,60,80,0.28)'); moonGrad.addColorStop(1, 'rgba(200,20,30,0)');
                ctx.fillStyle = moonGrad; ctx.fillRect(0, 0, W, H);
                // Gothic arch silhouettes
                for (let ai = 0; ai < W + 80; ai += 80) {
                    const ax = ((ai - worldX * 0.14) % (W + 150) + W + 150) % (W + 150) - 70;
                    ctx.fillStyle = 'rgba(20,2,4,0.55)';
                    ctx.beginPath(); ctx.rect(ax - 14, H - 110, 28, 110); ctx.fill();
                    ctx.beginPath(); ctx.arc(ax, H - 110, 14, Math.PI, Math.PI * 2); ctx.fill();
                }
                // Blood rain (thick, slow), scattered rather than row-aligned.
                ctx.strokeStyle = 'rgba(200,20,40,0.14)'; ctx.lineWidth = 1.5;
                const bloodRainSeed = ftScatterSeed('blood-moon-cathedral-rain');
                for (let ri = 0; ri < 35; ri++) {
                    const spanX = W + 90, spanY = H + 90;
                    const baseX = ftScatter01(bloodRainSeed, ri, 0) * spanX - 45;
                    const baseY = ftScatter01(bloodRainSeed, ri, 1) * spanY - 45;
                    const rx = ((baseX + worldX * 0.2 + t * (0.035 + ftScatter01(bloodRainSeed,ri,2)*0.03) + 45) % spanX + spanX) % spanX - 45;
                    const ry = ((baseY + t * (0.038 + ftScatter01(bloodRainSeed,ri,3)*0.025) + 45) % spanY + spanY) % spanY - 45;
                    const dx = -2 - ftScatter01(bloodRainSeed,ri,4)*3, dy = 16 + ftScatter01(bloodRainSeed,ri,5)*8;
                    ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx + dx, ry + dy); ctx.stroke();
                }

            } else if (id === 'shadowBazaar') {
                // Twilight bazaar with lantern glow, shadow stalls, and purple coin sparks
                baseGradient('#0a0514', '#140822', '#030108');
                // Lantern points
                const shadowBazaarLanternSeed = ftScatterSeed('shadowBazaar-lanterns');
                for (let li = 0; li < 12; li++) {
                    const lx0 = ftScatter01(shadowBazaarLanternSeed, li, 0) * (W + 100) - 50;
                    const lx = ((lx0 - worldX * 0.16 + 50) % (W + 100) + W + 100) % (W + 100) - 50;
                    const ly = H * (0.12 + ftScatter01(shadowBazaarLanternSeed, li, 1) * 0.55);
                    const lal = 0.5 + Math.sin(t * 0.005 + ftScatter01(shadowBazaarLanternSeed, li, 2) * Math.PI * 2) * 0.35;
                    const lg = ctx.createRadialGradient(lx, ly, 1, lx, ly, 40);
                    lg.addColorStop(0, `rgba(200,140,255,${lal * 0.8})`); lg.addColorStop(1, 'rgba(120,60,200,0)');
                    ctx.fillStyle = lg; ctx.beginPath(); ctx.arc(lx, ly, 40, 0, Math.PI * 2); ctx.fill();
                    // Lantern body
                    ctx.fillStyle = `rgba(220,180,255,${lal * 0.6})`;
                    ctx.beginPath(); ctx.rect(lx - 4, ly - 6, 8, 10); ctx.fill();
                }
                // Stall canopy shadows
                for (let si = 0; si < W + 60; si += 120) {
                    const sx = ((si - worldX * 0.12) % (W + 200) + W + 200) % (W + 200) - 80;
                    ctx.fillStyle = 'rgba(25,10,50,0.45)';
                    ctx.beginPath(); ctx.moveTo(sx - 45, H * 0.65); ctx.lineTo(sx + 45, H * 0.65);
                    ctx.lineTo(sx + 55, H * 0.55); ctx.lineTo(sx - 55, H * 0.55); ctx.closePath(); ctx.fill();
                }
                parallaxDust(14, 0.14, 'rgba(200,140,255,0.55)', 1, 2.5);

            } else if (id === 'auroraBridge') {
                // Rainbow aurora suspension bridge over glowing teal void
                baseGradient('#020f0d', '#031e1a', '#010807');
                // Aurora bands
                for (let ai = 0; ai < 8; ai++) {
                    const aHue = (ai * 44 + t * 0.018) % 360;
                    const al = 0.08 + Math.sin(t * 0.003 + ai) * 0.05;
                    ctx.fillStyle = `hsla(${aHue}, 90%, 70%, ${al})`;
                    const aw = W * 0.55 + Math.sin(t * 0.002 + ai) * W * 0.1;
                    ctx.beginPath(); ctx.ellipse(W * 0.5 - worldX * 0.04, H * (0.1 + ai * 0.08), aw, 28 + ai * 6, 0, 0, Math.PI * 2); ctx.fill();
                }
                // Bridge suspension cables
                for (let ci = 0; ci < W + 60; ci += 100) {
                    const cx2 = ((ci - worldX * 0.3) % (W + 150) + W + 150) % (W + 150) - 60;
                    ctx.strokeStyle = 'rgba(100,255,220,0.16)'; ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(cx2, H * 0.28); ctx.quadraticCurveTo(cx2 + 50, H * 0.52, cx2 + 100, H * 0.28); ctx.stroke();
                    // Hanger lines
                    for (let hi = 0; hi <= 4; hi++) {
                        const hx = cx2 + hi * 25;
                        const hy = H * 0.28 + Math.pow(hi - 2, 2) * 6;
                        ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx, H * 0.72); ctx.stroke();
                    }
                }
                parallaxDust(10, 0.08, 'rgba(100,255,220,0.45)', 1.5, 3);

            } else if (id === 'marrowLabyrinth') {
                // Ossuary labyrinth with bone wall patterns and spectral fog layers
                baseGradient('#14100a', '#24190e', '#070503');
                // Bone wall tiles
                for (let bi = 0; bi < W + 80; bi += 60) {
                    const bx = ((bi - worldX * 0.15) % (W + 140) + W + 140) % (W + 140) - 60;
                    for (let bj = 0; bj < 4; bj++) {
                        const by = H * (0.2 + bj * 0.2);
                        ctx.strokeStyle = `rgba(240,220,200,${0.10 - bj * 0.015})`; ctx.lineWidth = 1.5;
                        ctx.beginPath(); ctx.ellipse(bx, by, 12, 7, 0, 0, Math.PI * 2); ctx.stroke();
                        ctx.beginPath(); ctx.ellipse(bx + 28, by + 5, 10, 6, 0.3, 0, Math.PI * 2); ctx.stroke();
                    }
                }
                // Spectral fog layers
                for (let fi = 0; fi < 3; fi++) {
                    const fy = H * (0.5 + fi * 0.16);
                    const fog2 = ctx.createLinearGradient(0, fy, 0, fy + H * 0.14);
                    fog2.addColorStop(0, `rgba(255,235,210,${0.06 - fi * 0.015})`); fog2.addColorStop(1, 'rgba(255,235,210,0)');
                    ctx.fillStyle = fog2; ctx.fillRect(0, fy, W, H * 0.14);
                }
                parallaxDust(10, 0.12, 'rgba(255,230,210,0.4)', 1, 2.5);

            } else if (id === 'starlitReliquary') {
                // Sacred ancient reliquary with floating gold rune tablets and nebula veil
                baseGradient('#0f0d02', '#1e1a04', '#050400');
                stars(80, 0.07, 'rgba(255,248,200,0.75)', 1.3);
                // Gold rune tablets floating
                for (let ti = 0; ti < 9; ti++) {
                    const tx = ((ti * 160 - worldX * 0.15) % (W + 180) + W + 180) % (W + 180) - 80;
                    const ty = H * 0.1 + (ti * 83) % (H * 0.7) + Math.sin(t * 0.002 + ti) * 14;
                    const tr = t * 0.0005 * (ti % 2 === 0 ? 1 : -1);
                    ctx.save(); ctx.translate(tx, ty); ctx.rotate(tr);
                    ctx.fillStyle = `rgba(255,235,120,${0.10 + ti % 3 * 0.03})`;
                    ctx.beginPath(); ctx.roundRect(-14, -9, 28, 18, 3); ctx.fill();
                    ctx.strokeStyle = `rgba(255,220,80,${0.14 + ti % 3 * 0.03})`; ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.roundRect(-14, -9, 28, 18, 3); ctx.stroke();
                    // Rune lines
                    ctx.strokeStyle = `rgba(255,200,60,0.18)`; ctx.lineWidth = 0.7;
                    ctx.beginPath(); ctx.moveTo(-8, -2); ctx.lineTo(8, -2); ctx.moveTo(-8, 2); ctx.lineTo(8, 2); ctx.stroke();
                    ctx.restore();
                }
                // Golden nebula veil
                const nebGold = ctx.createRadialGradient(W * 0.62, H * 0.38, 20, W * 0.62, H * 0.38, 260);
                nebGold.addColorStop(0, 'rgba(255,225,80,0.07)'); nebGold.addColorStop(1, 'rgba(255,180,30,0)');
                ctx.fillStyle = nebGold; ctx.fillRect(0, 0, W, H);

            } else {
                // Fallback: deep starfield
                baseGradient('#06040f', '#0d0820', '#04020a');
                stars(70, 0.12, 'rgba(255,255,255,0.8)', 1.2);
            }
        }

        function drawBossArenaBackground(W, H, t, realmId) {
            const arenas = {
                needle:             { top:'#1a0306', mid:'#2c0408', bot:'#040001', line:'rgba(255,60,30,0.18)' },
                weaver:             { top:'#1f1304', mid:'#3a2206', bot:'#070401', line:'rgba(255,180,60,0.18)' },
                gearSaint:          { top:'#0c0d1d', mid:'#161a36', bot:'#030308', line:'rgba(170,184,255,0.18)' },
                thornMother:        { top:'#06140a', mid:'#0e2814', bot:'#020803', line:'rgba(136,255,102,0.16)' },
                drownedStar:        { top:'#021420', mid:'#053048', bot:'#010810', line:'rgba(102,230,255,0.16)' },
                prismRegent:        { top:'#1a0820', mid:'#2f1040', bot:'#06020a', line:'rgba(255,157,255,0.16)' },
                ashSeraph:          { top:'#1d0c06', mid:'#391708', bot:'#080301', line:'rgba(255,122,68,0.18)' },
                silkJudge:          { top:'#0e0e1c', mid:'#1c1c38', bot:'#040408', line:'rgba(215,216,255,0.16)' },
                hollowCrown:        { top:'#140622', mid:'#240a3e', bot:'#04020a', line:'rgba(180,92,255,0.18)' },
                neonWarden:         { top:'#021a16', mid:'#03332a', bot:'#010808', line:'rgba(85,255,204,0.18)' },
                clockAbyss:         { top:'#1a1304', mid:'#352407', bot:'#070401', line:'rgba(255,200,92,0.18)' },
                shatteredChoir:     { top:'#0a1820', mid:'#143040', bot:'#02060a', line:'rgba(215,251,255,0.16)' },
                crimsonArchbishop:  { top:'#1c0306', mid:'#33060c', bot:'#070101', line:'rgba(255,51,85,0.2)' },
                shadowMerchant:     { top:'#0d0618', mid:'#190c30', bot:'#030208', line:'rgba(122,69,255,0.18)' },
                auroraKnight:       { top:'#021614', mid:'#04302a', bot:'#010807', line:'rgba(118,255,216,0.16)' },
                marrowQueen:        { top:'#1a1108', mid:'#332112', bot:'#080502', line:'rgba(255,227,207,0.16)' },
                starlitRelic:       { top:'#171304', mid:'#2f2708', bot:'#060501', line:'rgba(255,246,168,0.18)' },
                firstStitch:        { top:'#0a0a14', mid:'#16162c', bot:'#030308', line:'rgba(255,255,255,0.16)' }
            };
            const a = arenas[boss.kind] || { top:'#13030a', mid:'#21051f', bot:'#020103', line:'rgba(255,255,255,0.16)' };
            let bg = ctx.createLinearGradient(0, 0, 0, H);
            bg.addColorStop(0, a.top); bg.addColorStop(0.55, a.mid); bg.addColorStop(1, a.bot);
            ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

            // Shared arena floor glow + converging lines, tinted per-boss
            ctx.strokeStyle = a.line;
            ctx.lineWidth = 1.5;
            for (let i = 0; i < W; i += 50) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(W - i, H); ctx.stroke(); }

            // Slow drifting embers/motes unique to each boss arena, using the boss color
            const def = BOSS_DEFS[boss.kind] || {};
            const motecolor = def.color || '#ffffff';
            const bossMoteSeed = ftScatterSeed('boss-motes:' + (boss.kind || realmId));
            for (let i = 0; i < 18; i++) {
                const baseX = ftScatter01(bossMoteSeed, i, 0) * (W + 60) - 30;
                const baseY = ftScatter01(bossMoteSeed, i, 1) * H;
                let mx = ((baseX - worldX * 0.05 + 30) % (W + 60) + W + 60) % (W + 60) - 30;
                let my = (baseY + t * (0.008 + ftScatter01(bossMoteSeed, i, 2) * 0.014)) % H;
                let tw = 0.3 + Math.sin(t * 0.003 + ftScatter01(bossMoteSeed, i, 3) * Math.PI * 2) * 0.25;
                ctx.globalAlpha = Math.max(0, tw);
                ctx.fillStyle = motecolor;
                ctx.beginPath(); ctx.arc(mx, my, 1.6, 0, Math.PI * 2); ctx.fill();
            }
            ctx.globalAlpha = 1;
        }

        // ── v28: boss action entity renderer ────────────────────────────────
        // Draws every live bossAttacks[] entry by shape. Kept data-driven so
        // adding a new boss action's visual is just a new `shape` case here,
        // shared across however many bosses use it.
        function drawBossAttacks() {
            const t = Date.now();
            for (const a of bossAttacks) {
                ctx.save();
                const c = hexToRgb(a.color || '#ffffff');
                const rgb = `${c.r},${c.g},${c.b}`;
                ctx.shadowColor = a.color || '#ffffff';

                if (a.kind === 'hazard' && a.shape === 'ring') {
                    const r = a.radius || 1;
                    ctx.globalAlpha = Math.max(0, Math.min(1, a.life / 20));
                    ctx.shadowBlur = 14;
                    ctx.strokeStyle = `rgba(${rgb},0.85)`;
                    ctx.lineWidth = 4;
                    ctx.beginPath(); ctx.arc(a.x, a.y, r, 0, Math.PI * 2); ctx.stroke();
                    ctx.strokeStyle = `rgba(${rgb},0.3)`;
                    ctx.lineWidth = 14;
                    ctx.beginPath(); ctx.arc(a.x, a.y, Math.max(0, r - 7), 0, Math.PI * 2); ctx.stroke();
                } else if (a.kind === 'hazard') {
                    const gf = a.growFactor !== undefined ? a.growFactor : 1;
                    const w = a.width * gf, h = a.height * gf;
                    ctx.globalAlpha = 0.8;
                    ctx.shadowBlur = 16;
                    if (a.shape === 'water') {
                        const grad = ctx.createLinearGradient(0, a.y - h, 0, a.y + h);
                        grad.addColorStop(0, `rgba(${rgb},0.15)`);
                        grad.addColorStop(1, `rgba(${rgb},0.7)`);
                        ctx.fillStyle = grad;
                        ctx.beginPath();
                        ctx.moveTo(a.x - w / 2, a.y + h);
                        for (let i = 0; i <= w; i += 16) {
                            ctx.lineTo(a.x - w / 2 + i, a.y - h + Math.sin(t * 0.006 + i * 0.1) * 6);
                        }
                        ctx.lineTo(a.x + w / 2, a.y + h);
                        ctx.closePath(); ctx.fill();
                    } else if (a.shape === 'spikes') {
                        ctx.fillStyle = `rgba(${rgb},0.85)`;
                        const spikeCount = 4;
                        for (let i = 0; i < spikeCount; i++) {
                            const sx = a.x - w / 2 + (i + 0.5) * (w / spikeCount);
                            ctx.beginPath();
                            ctx.moveTo(sx - w / spikeCount / 2, a.y + h / 2);
                            ctx.lineTo(sx, a.y - h / 2);
                            ctx.lineTo(sx + w / spikeCount / 2, a.y + h / 2);
                            ctx.closePath(); ctx.fill();
                        }
                    } else if (a.shape === 'roots') {
                        ctx.strokeStyle = `rgba(${rgb},0.9)`;
                        ctx.lineWidth = 4;
                        for (let i = -2; i <= 2; i++) {
                            ctx.beginPath();
                            ctx.moveTo(a.x + i * (w / 5), a.y + h / 2);
                            ctx.quadraticCurveTo(a.x + i * (w / 5) + Math.sin(t * 0.004 + i) * 10, a.y, a.x + i * (w / 5), a.y - h / 2);
                            ctx.stroke();
                        }
                    } else if (a.shape === 'frost') {
                        ctx.fillStyle = `rgba(${rgb},0.45)`;
                        ctx.fillRect(a.x - w / 2, a.y - h / 2, w, h);
                        ctx.strokeStyle = `rgba(255,255,255,0.8)`;
                        ctx.lineWidth = 2;
                        for (let i = 0; i < 5; i++) {
                            const fx = a.x - w / 2 + Math.random() * w;
                            ctx.beginPath(); ctx.moveTo(fx, a.y - h / 2); ctx.lineTo(fx, a.y + h / 2); ctx.stroke();
                        }
                    } else if (a.shape === 'flame') {
                        ctx.fillStyle = `rgba(${rgb},0.8)`;
                        for (let i = -2; i <= 2; i++) {
                            const fx = a.x + i * (w / 6);
                            const flick = Math.sin(t * 0.012 + i) * 8;
                            ctx.beginPath();
                            ctx.moveTo(fx - 8, a.y + h / 2);
                            ctx.quadraticCurveTo(fx, a.y - h / 2 - flick, fx + 8, a.y + h / 2);
                            ctx.closePath(); ctx.fill();
                        }
                    } else if (a.shape === 'thread') {
                        ctx.strokeStyle = `rgba(${rgb},0.85)`;
                        ctx.lineWidth = w;
                        ctx.beginPath(); ctx.moveTo(a.x, 0); ctx.lineTo(a.x, h); ctx.stroke();
                    } else {
                        ctx.fillStyle = `rgba(${rgb},0.6)`;
                        ctx.fillRect(a.x - w / 2, a.y - h / 2, w, h);
                    }
                } else if (a.kind === 'beam') {
                    // Beams telegraph for their first portion of life as a thin
                    // line, then flash full-width while "active."
                    ctx.globalAlpha = 0.85;
                    ctx.shadowBlur = 20;
                    ctx.fillStyle = `rgba(${rgb},${a.life > 25 ? 0.25 : 0.8})`;
                    const w = a.life > 25 ? Math.max(2, a.width * 0.25) : a.width;
                    ctx.fillRect(a.x - w / 2, a.y, w, a.height);
                } else {
                    // projectile shapes
                    ctx.globalAlpha = 0.95;
                    ctx.shadowBlur = 12;
                    ctx.fillStyle = a.color || '#ffffff';
                    ctx.strokeStyle = `rgba(255,255,255,0.7)`;
                    ctx.lineWidth = 1.5;
                    if (a.shape === 'needle') {
                        ctx.save();
                        ctx.translate(a.x, a.y);
                        ctx.rotate(Math.atan2(a.vy || 0, a.vx || -1));
                        ctx.beginPath(); ctx.moveTo(-a.width / 2, 0); ctx.lineTo(a.width / 2, -a.height / 2); ctx.lineTo(a.width / 2, a.height / 2); ctx.closePath();
                        ctx.fill(); ctx.stroke();
                        ctx.restore();
                    } else if (a.shape === 'gear') {
                        ctx.save();
                        ctx.translate(a.x, a.y);
                        ctx.rotate(a.spin || 0);
                        const r = a.width / 2;
                        ctx.beginPath();
                        for (let i = 0; i < 8; i++) {
                            const ang = (i / 8) * Math.PI * 2;
                            const rr = i % 2 === 0 ? r : r * 0.65;
                            ctx.lineTo(Math.cos(ang) * rr, Math.sin(ang) * rr);
                        }
                        ctx.closePath(); ctx.fill(); ctx.stroke();
                        ctx.restore();
                    } else if (a.shape === 'thorn' || a.shape === 'shard') {
                        ctx.save();
                        ctx.translate(a.x, a.y);
                        ctx.rotate(Math.atan2(a.vy || 0, a.vx || -1));
                        ctx.beginPath(); ctx.moveTo(-a.width / 2, 0); ctx.lineTo(0, -a.height / 2); ctx.lineTo(a.width / 2, 0); ctx.lineTo(0, a.height / 2); ctx.closePath();
                        ctx.fill(); ctx.stroke();
                        ctx.restore();
                    } else if (a.shape === 'ember') {
                        ctx.beginPath(); ctx.ellipse(a.x, a.y, a.width / 2, a.height / 2, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                    } else if (a.shape === 'wing') {
                        ctx.save();
                        ctx.translate(a.x, a.y);
                        ctx.beginPath();
                        ctx.moveTo(-a.width / 2, 0);
                        ctx.quadraticCurveTo(0, -a.height, a.width / 2, 0);
                        ctx.quadraticCurveTo(0, a.height, -a.width / 2, 0);
                        ctx.closePath(); ctx.fill(); ctx.stroke();
                        ctx.restore();
                    } else if (a.shape === 'tether') {
                        ctx.beginPath(); ctx.arc(a.x, a.y, a.width / 2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                        ctx.strokeStyle = `rgba(${rgb},0.5)`;
                        ctx.beginPath(); ctx.arc(a.x, a.y, a.width / 2 + 6 + Math.sin(t * 0.02) * 2, 0, Math.PI * 2); ctx.stroke();
                    } else if (a.shape === 'clock') {
                        ctx.beginPath(); ctx.arc(a.x, a.y, a.width / 2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                        ctx.strokeStyle = '#5a3a00'; ctx.lineWidth = 2;
                        const ang = t * 0.01;
                        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(a.x + Math.cos(ang) * a.width / 3, a.y + Math.sin(ang) * a.width / 3); ctx.stroke();
                    } else {
                        // 'orb' default
                        ctx.beginPath(); ctx.arc(a.x, a.y, a.width / 2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                    }
                }
                ctx.restore();
            }
            ctx.globalAlpha = 1; ctx.shadowBlur = 0;

            // Telegraph warning indicator: a pulsing ring at the boss's
            // position during wind-up, so every action — projectile, beam,
            // or hazard — gets a consistent, readable "incoming attack" cue
            // before anything actually appears.
            if (boss.active && boss.telegraphTimer > 0) {
                const screenX = boss.x - worldX;
                const pulse = 0.5 + Math.sin(Date.now() * 0.02) * 0.5;
                ctx.save();
                ctx.globalAlpha = 0.5 + pulse * 0.3;
                ctx.shadowColor = '#ffffff';
                ctx.shadowBlur = 18;
                ctx.strokeStyle = `rgba(255,255,255,${0.5 + pulse * 0.4})`;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(screenX, boss.y + boss.height / 2, boss.width / 2 + 16 + pulse * 6, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            }
        }

        function draw() {
            let t = Date.now();
            let W = canvas.width, H = canvas.height;

            // ── BACKGROUND ───────────────────────────────────────────────
            drawRealmBackground(W, H, t);

            // ── FLOOR ──────────────────────────────────────────────────
            let floorLevel = H - 40;
            let floorGrad = ctx.createLinearGradient(0, floorLevel, 0, H);
            const ftFloor=typeof ftGetBlendedFloorPalette==='function'?ftGetBlendedFloorPalette():{top:'#120a22',bottom:'#060212'};
            floorGrad.addColorStop(0,ftFloor.top); floorGrad.addColorStop(1,ftFloor.bottom);
            ctx.fillStyle = floorGrad;
            ctx.shadowColor = accentHex(); ctx.shadowBlur = 12;
            ctx.strokeStyle = accentRgba(0.5); ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, floorLevel);
            for (let i = 0; i <= W; i += 30) {
                let wave = Math.sin((worldX + i) * 0.012 + t * 0.001) * 5;
                ctx.lineTo(i, floorLevel + wave);
            }
            ctx.lineTo(W, H); ctx.lineTo(0, H);
            ctx.closePath(); ctx.fill(); ctx.stroke();
            ctx.shadowBlur = 0;

            // ── PLATFORMS ─────────────────────────────────────────────
            const visiblePlatforms = ftPlatformRange(worldX - 120, worldX + W + 120);
            for (let p of visiblePlatforms) {
                let screenX = p.x - worldX;
                if (screenX + p.width > 0 && screenX < W) drawClothPlatform(p, screenX);
            }

            // ── HEALS ─────────────────────────────────────────────────
            for (let h of heals) {
                if (Math.abs(h.x - player.worldX) > W + 240) continue;
                let screenX = h.x - worldX;
                if (screenX + h.width > 0 && screenX < W) drawHeal(h, screenX);
            }

            // ── MAGIC ITEMS ───────────────────────────────────────────
            for (let item of magicItems) {
                if (Math.abs(item.x - player.worldX) > W + 240) continue;
                let screenX = item.x - worldX;
                if (screenX + item.width > 0 && screenX < W) drawMagicItem(item, screenX);
            }
            for (let item of cosmeticItems) {
                if (Math.abs(item.x - player.worldX) > W + 240) continue;
                let screenX = item.x - worldX;
                if (screenX + item.width > 0 && screenX < W) drawCosmeticItem(item, screenX);
            }

            // ── ENEMIES ───────────────────────────────────────────────
            for (let e of enemies) {
                if (Math.abs(e.x - player.worldX) > W + 260) continue;
                let screenX = e.x - worldX;
                if (screenX + e.width > 0 && screenX < W) drawEnemy(e, screenX);
            }

            // ── BOSS ──────────────────────────────────────────────────
            if (boss.active) drawBoss(boss.x - worldX);

            // ── BOSS ATTACKS (v28) ───────────────────────────────────────
            drawBossAttacks();

            // ── PARTICLES ─────────────────────────────────────────────
            // Avoid per-particle shadowBlur. Canvas shadow filters are extremely
            // expensive on particle-heavy late-game scenes and were a major source
            // of the mid/end-game slowdown. The particles keep their colour/alpha
            // and receive a cheap soft halo pass instead.
            ctx.shadowBlur = 0;
            for (let p of particles) {
                const a = Math.max(0, Math.min(1, p.alpha || 0));
                const sz = p.size || 3;
                ctx.globalAlpha = a * 0.16;
                ctx.fillStyle = p.color;
                ctx.beginPath(); ctx.arc(p.x, p.y, sz + 2.5, 0, Math.PI*2); ctx.fill();
                ctx.globalAlpha = a;
                ctx.beginPath(); ctx.arc(p.x, p.y, sz, 0, Math.PI*2); ctx.fill();
            }
            ctx.globalAlpha = 1; ctx.shadowBlur = 0;

            // ── PLAYER ────────────────────────────────────────────────
            // Monarch Cloak: render damaging afterimages as fading ghost silhouettes
            if (player.monarchCloak && player.monarchAfterimages) {
                for (const img of player.monarchAfterimages) {
                    const fade = img.life / img.maxLife;
                    ctx.save();
                    ctx.globalAlpha = fade * 0.55;
                    ctx.shadowColor = '#d74488'; ctx.shadowBlur = 18;
                    ctx.fillStyle = `rgba(215,68,136,${fade * 0.7})`;
                    ctx.strokeStyle = `rgba(255,160,210,${fade * 0.9})`;
                    ctx.lineWidth = 1.5;
                    const ix = img.wx - worldX, iy = img.wy;
                    ctx.translate(ix, iy);
                    if (img.facing === -1) ctx.scale(-1, 1);
                    ctx.beginPath();
                    ctx.moveTo(-16, -20); ctx.bezierCurveTo(-16, -48, 16, -48, 16, -20);
                    ctx.lineTo(18, 10); ctx.bezierCurveTo(10, 24, 0, 15, -6, 24);
                    ctx.lineTo(-14, 10); ctx.closePath();
                    ctx.fill(); ctx.stroke();
                    ctx.restore();
                }
            }

            // Warp Spool: shimmer effect while phasing through projectiles
            if (player.warpPhaseTimer > 0) {
                const fade = player.warpPhaseTimer / 40;
                ctx.save();
                ctx.globalAlpha = fade * 0.4;
                ctx.shadowColor = '#e6b86a'; ctx.shadowBlur = 28;
                ctx.fillStyle = `rgba(230,184,106,${fade * 0.3})`;
                ctx.beginPath();
                ctx.ellipse(player.worldX - worldX, player.worldY - 14, 28 + fade * 10, 38 + fade * 12, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            drawGhost(player.worldX - worldX, player.worldY, player.facing, player.isAttacking, player.invulnTimer);

            // Realm transition flash
            if (realmFlash > 0) {
                let c = realmAccent();
                ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${realmFlash / 40 * 0.5})`;
                ctx.fillRect(0, 0, W, H);
                realmFlash--;
            }

            // ── VIGNETTE ─────────────────────────────────────────────
            let vig = ctx.createRadialGradient(W/2, H/2, H*0.3, W/2, H/2, H*0.85);
            vig.addColorStop(0, 'rgba(0,0,0,0)');
            vig.addColorStop(1, 'rgba(0,0,0,0.45)');
            ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);

            // Controls hint
            ctx.fillStyle = 'rgba(180,180,200,0.35)';
            ctx.font = '12px Courier New';
            ctx.fillText('Move  ·  Jump / Flap  ·  Attack  ·  Down + Attack = Pogo  ·  Equipment', 20, H - 15);
        }


        function saveKey(slot) { return SAVE_PREFIX + slot; }
        function findNextAvailableSlot() {
            for (let i = 1; i <= MAX_SAVE_SLOTS; i++) {
                if (!localStorage.getItem(saveKey(i))) return i;
            }
            return 1;
        }
        function makeSaveData() {
            return {
                savedAt: new Date().toLocaleString(),
                worldX, score, gameOver, maxReachedX, realmFlash, currentRealm, realmProgress, targetProgress, highestPlatformTouchedIndex, endgameUnlocked, endgameLoops, endlessRealmPointer,
                player: JSON.parse(JSON.stringify(player)),
                boss: JSON.parse(JSON.stringify(boss)),
                platforms, enemies, heals, magicItems, cosmeticItems, magicSpawnQueue, nextMagicPlatformIndex
            };
        }
        function saveGame() {
            if (!activeSaveSlot) activeSaveSlot = findNextAvailableSlot();
            localStorage.setItem(saveKey(activeSaveSlot), JSON.stringify(makeSaveData()));
            renderHomeButtons();
        }
        function loadGame(slot) {
            const raw = localStorage.getItem(saveKey(slot));
            if (!raw) return;
            const data = JSON.parse(raw);
            worldX = data.worldX || 0;
            score = data.score || 0;
            gameOver = !!data.gameOver;
            maxReachedX = data.maxReachedX || 300;
            realmFlash = data.realmFlash || 0;
            currentRealm = data.currentRealm || "sadness";
            realmProgress = data.realmProgress || 0;
            targetProgress = Number.isFinite(data.targetProgress) ? data.targetProgress : 30;
            highestPlatformTouchedIndex = Number.isFinite(data.highestPlatformTouchedIndex) ? data.highestPlatformTouchedIndex : 0;
            endgameUnlocked = !!data.endgameUnlocked;
            endgameLoops = data.endgameLoops || 0;
            endlessRealmPointer = data.endlessRealmPointer || 0;
            Object.assign(player, data.player || {});
            player.cosmetics = player.cosmetics || {};
            player.heartCharmCooldowns = player.heartCharmCooldowns || {};
            player.bossRewards = player.bossRewards || [];
            player.collectedCosmetics = player.collectedCosmetics || [];
            player.soulFragments = player.soulFragments || 0;
            player.collectedEquipment = (player.collectedEquipment || [...(player.collectedMagic || []), ...(player.collectedCosmetics || [])]).filter(id => id !== 'lantern');
            player.equippedEquipment = (player.equippedEquipment || player.collectedEquipment || []).filter(id => id !== 'lantern').slice(0, EQUIPMENT_LIMIT);
            if (player.cosmetics) delete player.cosmetics.lantern;
            recalculateEquipmentEffects();
            renderEquipmentMenu();
            Object.assign(boss, data.boss || {});
            platforms = data.platforms || [];
            enemies = data.enemies || [];
            heals = data.heals || [];
            magicItems = data.magicItems || [];
            cosmeticItems = data.cosmeticItems || [];
            // older save's queued world-drop pool, since those items can no
            // longer appear from the "Anywhere Drops" pool going forward.
            magicSpawnQueue = (data.magicSpawnQueue || []).filter(id => id && !BOSS_REWARD_EQUIPMENT_IDS.has(id));
            nextMagicPlatformIndex = data.nextMagicPlatformIndex || 5;
            activeSaveSlot = slot;
            // Repair legacy saves captured on the death screen. Loading one must
            // resolve death exactly like the normal respawn, never resume at the
            // death location with a few HP or a frozen gameOver state.
            if (gameOver || !Number.isFinite(player.lives) || player.lives <= 0) {
                gameOver = false;
                respawnKeepingUpgrades(endgameUnlocked);
            }
            hideHomeScreen();
            updateUI();
        }
        function newGame() {
            activeSaveSlot = findNextAvailableSlot();
            resetGame();
            saveGame();
            hideHomeScreen();
        }
        function deleteSave(slot) {
            localStorage.removeItem(saveKey(slot));
            if (activeSaveSlot === slot) activeSaveSlot = null;
            renderHomeButtons();
        }
        function startInSlot(slot) {
            activeSaveSlot = slot;
            resetGame();
            saveGame();
            hideHomeScreen();
        }
        function renderHomeButtons() {
            const box = document.getElementById('home-buttons');
            if (!box) return;
            let html = '';
            for (let i = 1; i <= MAX_SAVE_SLOTS; i++) {
                const raw = localStorage.getItem(saveKey(i));
                if (raw) {
                    try {
                        const data = JSON.parse(raw);
                        const realm = String(data.currentRealm || 'Unknown Realm').replace(/[<>]/g, '');
                        const score = Number.isFinite(Number(data.score)) ? Number(data.score) : 0;
                        const savedAt = String(data.savedAt || '').replace(/[<>]/g, '');
                        html += `<div class="save-card"><div class="save-card-title">SLOT ${i}</div><span class="slot-meta">${realm} · Score ${score}<br>${savedAt}</span><div class="slot-actions"><button onclick="loadGame(${i})">LOAD</button><button class="delete-save" onclick="deleteSave(${i})">DELETE</button></div></div>`;
                    } catch (err) {
                        // Never let one damaged localStorage entry erase the entire save-slot UI.
                        console.warn(`Save slot ${i} could not be parsed`, err);
                        html += `<div class="save-card save-card-corrupt"><div class="save-card-title">SLOT ${i}</div><span class="slot-meta">Save data could not be read. Delete this slot to reuse it.</span><div class="slot-actions single"><button class="delete-save" onclick="deleteSave(${i})">DELETE DAMAGED SAVE</button></div></div>`;
                    }
                } else {
                    html += `<div class="save-card"><div class="save-card-title">EMPTY SLOT ${i}</div><span class="slot-meta">Start a new game here</span><div class="slot-actions single"><button onclick="startInSlot(${i})">START</button></div></div>`;
                }
            }
            box.innerHTML = html;
        }
        function showHomeScreen() {
            equipmentMenuOpen = false;
            const menu = document.getElementById('equipment-menu');
            if (menu) menu.classList.remove('show');
            onHomeScreen = true;
            document.getElementById('home-screen').style.display = 'flex';
            document.getElementById('ui').classList.add('home-hidden');
            renderHomeButtons();
            stopBgTheme();
        }
        function hideHomeScreen() {
            onHomeScreen = false;
            document.getElementById('home-screen').style.display = 'none';
            document.getElementById('ui').classList.remove('home-hidden');
            startBgTheme();
        }

        // ── EXPORT / IMPORT SAVE FILE ───────────────────────────────────
        // Lets a player download any save slot as a standalone .json file,
        // and import a .json file (e.g. from another player) into a chosen
        // slot, overwriting whatever is currently there.
        const SAVE_FILE_TAG = "fadedThreadSave";
        let transferImportTargetSlot = null;

        function openTransferMenu() {
            const menu = document.getElementById('transfer-menu');
            if (!menu) return;
            setTransferStatus('', null);
            renderTransferGrids();
            menu.classList.add('show');
        }
        function closeTransferMenu() {
            const menu = document.getElementById('transfer-menu');
            if (menu) menu.classList.remove('show');
            transferImportTargetSlot = null;
        }
        function setTransferStatus(msg, kind) {
            const el = document.getElementById('transfer-status');
            if (!el) return;
            el.innerText = msg;
            el.className = kind ? kind : '';
        }
        function renderTransferGrids() {
            const exportBox = document.getElementById('transfer-export-grid');
            const importBox = document.getElementById('transfer-import-grid');
            if (!exportBox || !importBox) return;
            let exportHtml = '';
            let importHtml = '';
            for (let i = 1; i <= MAX_SAVE_SLOTS; i++) {
                const raw = localStorage.getItem(saveKey(i));
                if (raw) {
                    let data = {};
                    try { data = JSON.parse(raw); } catch (e) {}
                    const sub = `${data.currentRealm || 'sadness'} · Score ${data.score || 0}`;
                    exportHtml += `<button onclick="exportSlot(${i})">SLOT ${i}<span class="slot-sub">${sub}</span></button>`;
                    importHtml += `<button onclick="importToSlot(${i})">SLOT ${i}<span class="slot-sub">${sub} (overwrite)</span></button>`;
                } else {
                    exportHtml += `<button disabled>SLOT ${i}<span class="slot-sub">Empty</span></button>`;
                    importHtml += `<button onclick="importToSlot(${i})">SLOT ${i}<span class="slot-sub">Empty</span></button>`;
                }
            }
            exportBox.innerHTML = exportHtml;
            importBox.innerHTML = importHtml;
        }

        function exportSlot(slot) {
            const raw = localStorage.getItem(saveKey(slot));
            if (!raw) { setTransferStatus('That slot is empty — nothing to export.', 'err'); return; }
            let data;
            try { data = JSON.parse(raw); } catch (e) {
                setTransferStatus('That save could not be read.', 'err');
                return;
            }
            const payload = {
                tag: SAVE_FILE_TAG,
                formatVersion: 1,
                exportedAt: new Date().toISOString(),
                sourceSlot: slot,
                save: data
            };
            const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const realmPart = (data.currentRealm || 'thread').replace(/[^a-z0-9]/gi, '');
            a.href = url;
            a.download = `faded-thread-slot${slot}-${realmPart}-${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 2000);
            setTransferStatus(`Slot ${slot} exported to a .json file.`, 'ok');
        }

        function importToSlot(slot) {
            transferImportTargetSlot = slot;
            const input = document.getElementById('transfer-file-input');
            if (!input) return;
            input.value = '';
            input.click();
        }

        function handleTransferFileChosen(file) {
            const slot = transferImportTargetSlot;
            if (!file || !slot) return;
            const reader = new FileReader();
            reader.onload = () => {
                let parsed;
                try { parsed = JSON.parse(reader.result); } catch (e) {
                    setTransferStatus('That file is not a valid save (could not parse JSON).', 'err');
                    return;
                }
                // Accept either our wrapped export format, or a raw save object
                // (in case someone exports the localStorage value directly).
                let saveData = (parsed && parsed.tag === SAVE_FILE_TAG && parsed.save) ? parsed.save : parsed;
                if (!saveData || typeof saveData !== 'object' || !('currentRealm' in saveData || 'player' in saveData)) {
                    setTransferStatus('That file does not look like a Faded Thread save.', 'err');
                    return;
                }
                localStorage.setItem(saveKey(slot), JSON.stringify(saveData));
                renderTransferGrids();
                renderHomeButtons();
                setTransferStatus(`Imported into Slot ${slot}. You can now load it from the home screen.`, 'ok');
            };
            reader.onerror = () => setTransferStatus('Could not read that file.', 'err');
            reader.readAsText(file);
        }

        function showMagicNotice(def) {
            const text = {
                ember: '+2 maximum lives while equipped, and an ember scarf is stitched onto your ghost.',
                swift: 'Movement speed, acceleration and glide improve, and bright runner wraps appear on the body.',
                guard: 'Gain a long shield, safer falling, temporary protection, and a glowing button shield outfit piece.',
                reach: 'Slash range becomes much larger, and long ribbon sleeves are added to show the extended attack reach.',
                moon: 'Wings become grander and slashes turn moonlit. Jump physics stay normal.',
                rift: 'Your slash gains a second rift cut and a wider attack range.',
                clock: 'Taking damage grants stronger recovery time.',
                bell: 'Enemies can drop soul fragments. Ten fragments restore one life.',
                ribbon: 'Use your Dash control for one mid-air dash before landing.',
                thorns: 'Touching enemies damages them back.',
                echo: 'Pogo bounces higher and echo slashes reach wider.',
                ash: 'Defeated enemies burst into ash and give bonus score.',
                silk: 'Fall slower and drift more smoothly in the air.',
                crownShard: '+1 maximum life while equipped. If lost, it goes on cooldown.',
                sunSpool: 'Healing pickups restore 2 lives instead of 1.',
                voidBell: 'Soul Bell rewards trigger after 7 fragments instead of 10.',
                needleBoots: 'Downward pogo attacks bounce much harder.',
                cometThread: 'Movement speeds up and Sky Dash travels 18% farther, with a comet trail visible on the ghost.',
                anchorPearl: 'Falling is steadier and damage grants a longer safety window. An anchor pearl glows on the chest.',
                prismHeart: '+1 maximum life while equipped, with a chance to reflect damage. A prism heart shimmers on the chest.',
                cathedralBell: 'Every 25 enemy kills restores 1 life. A cathedral bell orbits the ghost.',
                shadowCoin: 'Enemy kills are worth more score. A shadow coin orbits the ghost.',
                auroraPin: 'Pogo bounces higher and falling is safer. An aurora pin glints on the hat.',
                marrowCharm: '+2 uncapped lives while equipped. A bone charm rests on the chest.',
                relicStar: '+Attack range and enemy score. Star sparkles glint by the hand.',
                threadCrown: '+10% score from enemies. A golden crown rests on the head.',
                weaverHelm: '+20 slash width. A violet helm crest sits on the head.',
                hollowMask: 'Longer invulnerability after respawn. A pale hollow mask.',
                starHalo: '+1 max life on pickup, plus a small score boost. A bright halo overhead.',
                brokenTiara: '+1 life entering boss realms. A cracked tiara on the head.',
                royalCape: '+0.7 movement speed. A crimson cape billows from the back.',
                threadWings: 'Slightly safer falling. Pale feathered wings on the back.',
                crystalMantle: 'A chance to ignore damage. Faceted crystal shards on the back.',
                cosmicCloak: 'Unlocks Sky Dash. A starlit violet cloak on the back.',
                goldenEye: '+15 attack height. A sunburst eye charm on the face.',
                voidEye: 'Rift slash effect while equipped. A swirling void eye on the face.',
                clockEye: 'Longer invulnerability after being hit. A ticking clock eye.',
                starEye: '+10% enemy score. A starburst eye charm on the face.',
                jesusBoots: 'Walk safely on floor and danger water. Glowing sandal straps.',
                mirror: 'Slightly wider attack arc, shown as a faint mirrored sheen on the chest.',
                gear: 'More speed and a taller attack hitbox, with a small spinning gear charm on the hand.',
                thorn: 'Wider slash and safer fall speed, with thorn barbs trailing the ghost.',
                tide: 'Smoother movement control, marked by a pale ring on the face.',
                cosmetic: 'Cosmetic unlocked. It stays with you after death.',
                bossReward: 'Boss reward unlocked. You gained a permanent upgrade and cosmetic.',
                soulLife: 'Soul fragments restored one life.',
                threadRestart: 'Your collected upgrades stayed with you after death.',
                heartCooldown: 'The extra heart charm was spent and unequipped. It can be equipped again after 50 seconds.',
                cosmetic: 'Collected as equipment. Open Equipment to equip it.',
                bossReward: 'Boss reward unlocked as equipment. Open Equipment to manage your build.'
            }[def.id] || def.name;
            const box = document.getElementById('magic-notice');
            const title = document.getElementById('magic-notice-title');
            const body = document.getElementById('magic-notice-body');
            if (!box || !title || !body) return;
            title.innerText = def.name || 'MAGIC UPGRADE';
            body.innerText = text;
            box.classList.add('show');
            clearTimeout(window.magicNoticeTimer);
            window.magicNoticeTimer = setTimeout(() => box.classList.remove('show'), 4200);
        }

        function loop() {
            if (!onHomeScreen) update();
            draw();
            requestAnimationFrame(loop);
        }

        setInterval(() => { if (equipmentMenuOpen) renderEquipmentMenu(); }, 1000);
