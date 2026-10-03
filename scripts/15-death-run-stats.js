/* Faded Thread module: 15-death-run-stats.js | build 03 Oct 2026 */
// ── Reliable death screen + custom run summary ───────────────────
        const FT_DEATH_PREF_KEY = 'fadedThreadDeathStatsV1';
        const FT_DEATH_DEFAULTS = ['realm','platforms','score','bosses','equipment','time'];
        let ftRunStartedAt = performance.now();
        let ftDeathPending = false;
        let ftDeathTimer = null;
        let ftDeathCountdownTimer = null;
        let ftDeathSnapshot = null;

        function ftLoadDeathPrefs() {
            try {
                const parsed = JSON.parse(localStorage.getItem(FT_DEATH_PREF_KEY) || 'null');
                return Array.isArray(parsed) && parsed.length ? parsed : [...FT_DEATH_DEFAULTS];
            } catch (_) { return [...FT_DEATH_DEFAULTS]; }
        }
        function ftSaveDeathPrefs() {
            const selected = [...document.querySelectorAll('[data-death-stat]:checked')].map(el => el.dataset.deathStat);
            localStorage.setItem(FT_DEATH_PREF_KEY, JSON.stringify(selected.length ? selected : FT_DEATH_DEFAULTS));
        }
        function ftSyncDeathPrefControls() {
            const selected = new Set(ftLoadDeathPrefs());
            document.querySelectorAll('[data-death-stat]').forEach(el => {
                el.checked = selected.has(el.dataset.deathStat);
                el.onchange = ftSaveDeathPrefs;
            });
        }
        function openHomeSettings() {
            ftSyncDeathPrefControls();
            document.getElementById('home-settings-drawer')?.classList.add('show');
        }
        function closeHomeSettings() { document.getElementById('home-settings-drawer')?.classList.remove('show'); }
        function ftFormatRunTime(ms) {
            const total = Math.max(0, Math.floor(ms / 1000));
            const m = Math.floor(total / 60), s = total % 60;
            return `${m}:${String(s).padStart(2,'0')}`;
        }
        function ftRealmDisplayName() {
            const entry = (typeof REALM_FLOW !== 'undefined' ? REALM_FLOW : []).find(r => r.id === currentRealm);
            return entry?.name || String(currentRealm || 'Unknown Realm').replace(/([A-Z])/g,' $1').trim();
        }
        function ftBuildDeathSnapshot() {
            return {
                realm: ftRealmDisplayName(),
                platforms: `${Math.max(0, realmProgress || 0)} / ${Math.max(0, targetProgress || 0)}`,
                score: Number(score || 0).toLocaleString(),
                bosses: String((player.bossRewards || []).length),
                equipment: String((player.collectedEquipment || []).length),
                time: ftFormatRunTime(performance.now() - ftRunStartedAt),
                distance: `${Math.max(0, Math.floor((player.worldX || 0) / 100))} m`
            };
        }
        function ftRenderDeathStats(snapshot) {
            const labels = {realm:'REALM REACHED',platforms:'PLATFORM PROGRESS',score:'RUN SCORE',bosses:'BOSS REWARDS',equipment:'EQUIPMENT FOUND',time:'RUN TIME',distance:'DISTANCE'};
            const selected = ftLoadDeathPrefs();
            const box = document.getElementById('death-stats');
            if (!box) return;
            box.innerHTML = selected.map(key => `<div class="death-stat"><div class="death-stat-label">${labels[key]}</div><div class="death-stat-value">${snapshot[key]}</div></div>`).join('');
        }
        let ftLastDeathCause = 'Unknown cause';
        function triggerDeathScreen(cause) {
            if (cause) ftLastDeathCause = cause;
            if (ftDeathPending) return;
            ftDeathPending = true;
            gameOver = true;
            Object.keys(keys).forEach(key => { keys[key] = false; });
            player.vx = 0; player.vy = 0; player.isAttacking = false;
            ftDeathSnapshot = ftBuildDeathSnapshot();
            ftRenderDeathStats(ftDeathSnapshot);
            const causeEl = document.getElementById('death-cause');
            if (causeEl) causeEl.textContent = `Killed by ${ftLastDeathCause}.`;
            document.getElementById('death-screen')?.classList.add('show');
            let remaining = 20;
            const countdown = document.getElementById('death-countdown');
            if (countdown) countdown.textContent = `Respawning in ${remaining}…`;
            clearInterval(ftDeathCountdownTimer);
            ftDeathCountdownTimer = setInterval(() => {
                remaining--;
                if (countdown) countdown.textContent = remaining > 0 ? `Respawning in ${remaining}…` : 'Reforming thread…';
            }, 1000);
            clearTimeout(ftDeathTimer);
            ftDeathTimer = setTimeout(completeDeathRespawn, 20000);
        }
        function ftCloseDeathScreen() {
            clearTimeout(ftDeathTimer); clearInterval(ftDeathCountdownTimer);
            document.getElementById('death-screen')?.classList.remove('show');
            try { document.querySelectorAll('#death-screen .ft-controller-focus').forEach(el=>el.classList.remove('ft-controller-focus')); } catch (_) {}
        }
        function completeDeathRespawn() {
            if (!ftDeathPending) return;
            ftCloseDeathScreen();
            // Run reset outside the collision/update iteration to prevent the historical freeze.
            requestAnimationFrame(() => {
                try {
                    respawnKeepingUpgrades(endgameUnlocked);
                    gameOver = false;
                    ftRunStartedAt = performance.now();
                } finally {
                    ftDeathPending = false;
                }
            });
        }
        function deathReturnHome() {
            if (!ftDeathPending) return;
            ftCloseDeathScreen();

            // SAVE & RETURN HOME must use the exact same death resolution as the
            // automatic respawn. It is not a checkpoint escape from the death spot.
            // Resolve the death first, including the normal run reset/health reset,
            // then save that respawned state and return to the title screen.
            ftDeathPending = false;
            gameOver = false;
            try {
                respawnKeepingUpgrades(endgameUnlocked);
                saveGame();
            } finally {
                showHomeScreen();
            }
        }
        document.addEventListener('keydown', e => {
            if (!ftDeathPending) return;
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); completeDeathRespawn(); }
            if (e.key === 'Escape') { e.preventDefault(); deathReturnHome(); }
        });

        // Keep the run timer meaningful across fresh starts and loaded worlds.
        const ftResetGameBeforeDeathStats = resetGame;
        resetGame = function resetGameWithRunStats() {
            const result = ftResetGameBeforeDeathStats.apply(this, arguments);
            ftRunStartedAt = performance.now();
            ftDeathPending = false;
            ftCloseDeathScreen();
            return result;
        };
