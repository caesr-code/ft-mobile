/* Faded Thread module: 01-audio-synthesis.js | build 03 Oct 2026 */
// ─────────────────────────────────────────────────────────────────
        // Everything below is synthesized at runtime via raw oscillator/gain
        // nodes — 
        // ─────────────────────────────────────────────────────────────────

        let audioCtx = null;
        let masterGain = null;
        let audioUnlocked = false;

        // Lazily instantiate (and resume) the AudioContext. Browsers require
        // this to happen after a user gesture, so we call ensureAudioContext()
        // from the existing keydown handler rather than on page load.
        function ensureAudioContext() {
            if (!audioCtx) {
                const AC = window.AudioContext || window.webkitAudioContext;
                if (!AC) return null; // Web Audio unsupported — fail silently
                audioCtx = new AC();
                masterGain = audioCtx.createGain();
                masterGain.gain.value = 0.35;
                masterGain.connect(audioCtx.destination);
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume().catch(() => {});
            }
            audioUnlocked = true;
            return audioCtx;
        }

        /**
         * Reusable lightweight synth-tone player built on raw OscillatorNode +
         * GainNode. Always ramps gain to (near) zero before the node stops, so
         * there's no audible click/pop from an abrupt cutoff.
         *
         * @param {Object} opts
         * @param {string}  [opts.type='sine']      Oscillator waveform.
         * @param {number}  [opts.startFreq=440]     Starting frequency (Hz).
         * @param {number}  [opts.endFreq]           Optional end frequency for a
         *                                           pitch slide (Hz). If omitted,
         *                                           pitch stays at startFreq.
         * @param {number}  [opts.duration=0.12]     Total tone duration (seconds).
         * @param {number}  [opts.volume=0.5]        Peak gain (0–1) before ramp-down.
         * @param {string}  [opts.rampType='exponential'] 'exponential' | 'linear'
         *                                           ramp-to-zero shape.
         */
        function playTone(opts = {}) {
            const ac = ensureAudioContext();
            if (!ac) return;

            const {
                type = 'sine',
                startFreq = 440,
                endFreq = null,
                duration = 0.12,
                volume = 0.5,
                rampType = 'exponential'
            } = opts;

            const osc = ac.createOscillator();
            const gain = ac.createGain();
            osc.type = type;

            const now = ac.currentTime;
            osc.frequency.setValueAtTime(Math.max(1, startFreq), now);
            if (endFreq !== null) {
                // exponentialRampToValueAtTime cannot target 0/negative values,
                // so pitch slides always clamp the floor to 1Hz.
                osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), now + duration);
            }

            // Fast attack, then a clean ramp-to-(near)zero release so the node
            // never gets disconnected/stopped while gain is still audible
            // (that's what causes popping).
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), now + 0.008);
            if (rampType === 'linear') {
                gain.gain.linearRampToValueAtTime(0.0001, now + duration);
            } else {
                gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
            }

            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(now);
            osc.stop(now + duration + 0.02);
            // Tidy up references once the node is done (GC-friendly).
            osc.onended = () => { osc.disconnect(); gain.disconnect(); };
        }

        // Weapon slash SFX: a rapid descending sawtooth pitch slide, ~0.12s.
        function playSlashSound() {
            playTone({
                type: 'sawtooth',
                startFreq: 980,
                endFreq: 180,
                duration: 0.12,
                volume: 0.22,
                rampType: 'exponential'
            });
            // A thin high-frequency "edge" layered on top gives the slash a
            // sharper transient without needing a second oscillator type.
            playTone({
                type: 'triangle',
                startFreq: 1800,
                endFreq: 600,
                duration: 0.07,
                volume: 0.12,
                rampType: 'linear'
            });
        }

        // Needle Boots puncture SFX: a short, sharp downward pluck distinct
        // from the regular slash, used by the auto-pogo mechanic.
        function playNeedlePuncture() {
            playTone({
                type: 'square',
                startFreq: 1200,
                endFreq: 300,
                duration: 0.09,
                volume: 0.16,
                rampType: 'exponential'
            });
        }

        // ── v28: noise burst helper ─────────────────────────────────────────
        // Builds a short buffer of white noise through a bandpass filter, used
        // for percussion (hats/snare-ish ticks) and impact/whoosh SFX — gives
        // the all-synth palette something other than pure tonal oscillators.
        function playNoiseBurst(opts = {}) {
            const ac = ensureAudioContext();
            if (!ac) return;
            const {
                duration = 0.05,
                volume = 0.12,
                filterFreq = 4000,
                filterQ = 1.0,
                filterType = 'bandpass'
            } = opts;

            const bufferSize = Math.max(1, Math.floor(ac.sampleRate * duration));
            const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

            const noise = ac.createBufferSource();
            noise.buffer = buffer;

            const filter = ac.createBiquadFilter();
            filter.type = filterType;
            filter.frequency.value = filterFreq;
            filter.Q.value = filterQ;

            const gain = ac.createGain();
            const now = ac.currentTime;
            gain.gain.setValueAtTime(Math.max(0.0001, volume), now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(masterGain);
            noise.start(now);
            noise.stop(now + duration + 0.02);
            noise.onended = () => { noise.disconnect(); filter.disconnect(); gain.disconnect(); };
        }

        // ── v28: expanded SFX palette ────────────────────────────────────────
        // Boss-hit: a tight double-stab — bright square transient over a low
        // thump — distinct from a regular enemy hit so landing a shot on a
        // boss reads as heavier feedback.
        function playBossHitSound() {
            playTone({ type: 'square', startFreq: 520, endFreq: 140, duration: 0.1, volume: 0.2, rampType: 'exponential' });
            playTone({ type: 'sine', startFreq: 90, duration: 0.16, volume: 0.22, rampType: 'exponential' });
        }

        // Boss-defeat fanfare: short ascending three-note arpeggio.
        function playBossDefeatFanfare() {
            const ac = ensureAudioContext();
            if (!ac) return;
            const notes = [392.0, 523.25, 783.99]; // G4, C5, G5
            notes.forEach((freq, i) => {
                setTimeout(() => {
                    playTone({ type: 'triangle', startFreq: freq, duration: 0.28, volume: 0.26, rampType: 'exponential' });
                    playTone({ type: 'square', startFreq: freq * 2, duration: 0.12, volume: 0.08, rampType: 'exponential' });
                }, i * 110);
            });
        }

        // Player-hurt sting: harsh descending square, cuts through the mix.
        function playPlayerHurtSound() {
            playTone({ type: 'square', startFreq: 300, endFreq: 70, duration: 0.18, volume: 0.24, rampType: 'exponential' });
            playNoiseBurst({ duration: 0.06, volume: 0.1, filterFreq: 1200, filterQ: 0.6 });
        }

        // Item pickup chime: bright quick blip, pitch varies slightly so
        // repeated pickups don't feel identical.
        function playPickupChime(variance = 0) {
            playTone({
                type: 'sine',
                startFreq: 880 + variance * 60,
                endFreq: 1320 + variance * 60,
                duration: 0.1,
                volume: 0.18,
                rampType: 'exponential'
            });
        }

        // Generic boss-attack telegraph "wind-up" tick — a short rising
        // filtered noise sweep used right before a boss action fires, so
        // every new boss action has a consistent audible warning cue.
        function playTelegraphSound() {
            playNoiseBurst({ duration: 0.22, volume: 0.09, filterFreq: 2200, filterQ: 1.4 });
            playTone({ type: 'sine', startFreq: 220, endFreq: 440, duration: 0.22, volume: 0.07, rampType: 'linear' });
        }

        // Projectile launch SFX — quick low-to-mid pitch flick.
        function playProjectileLaunch() {
            playTone({ type: 'sawtooth', startFreq: 340, endFreq: 720, duration: 0.08, volume: 0.13, rampType: 'exponential' });
        }

        // Field hazard trigger SFX — a heavier noise thud, for ground/zone
        // effects (floods, slams, freezes) rather than thrown projectiles.
        function playHazardTrigger() {
            playNoiseBurst({ duration: 0.18, volume: 0.16, filterFreq: 600, filterQ: 0.8, filterType: 'lowpass' });
            playTone({ type: 'sine', startFreq: 110, endFreq: 50, duration: 0.22, volume: 0.18, rampType: 'exponential' });
        }

        // ── Step-sequencer background theme ────────────────────────────────
        // A fuller, fully procedural retro loop. No samples — every step
        // triggers short synth tones via playTone()/playNoiseBurst(). Runs on
        // a plain setInterval "clock," advancing one step of a repeating
        // pattern. v28 adds a melody layer (triangle lead) and a light hi-hat
        // percussion layer on top of the original bassline, plus a boss-fight
        // "intensified" variant (faster tempo, extra harmony layer, brighter
        // lead waveform) of the same theme rather than a separate composition.
        const BG_THEME_STEP_MS = 180;           // base tempo: ms per 16th-note step
        const BG_THEME_PATTERN = [               // low-frequency bass pattern (Hz), null = rest
            65.4, null, 65.4, null, 73.4, null, 65.4, null,
            55.0, null, 55.0, null, 61.7, null, 49.0, null
        ];
        // Melody layer: a simple 16-step lead line that answers the bassline,
        // built from the same A-minor-ish palette so it stays consonant.
        const BG_THEME_MELODY = [
            null, 261.6, null, 293.7, null, 329.6, null, 261.6,
            null, 220.0, null, 246.9, null, 196.0, null, null
        ];
        // Percussion layer: true = closed-hat tick on that 16th step.
        const BG_THEME_HATS = [
            true, false, true, false, true, false, true, false,
            true, false, true, true, true, false, true, false
        ];
        // Harmony layer used only in boss-intensified mode — a sparser,
        // higher countermelody that stacks on top of the lead for urgency.
        const BG_THEME_HARMONY = [
            null, null, 392.0, null, null, null, 440.0, null,
            null, null, 329.6, null, null, null, 369.99, null
        ];

        let bgThemeStep = 0;
        let bgThemeInterval = null;
        let bgThemeEnabled = true;
        let bgThemeIntensified = false; // true during boss fights

        function playBgThemeStep() {
            if (!bgThemeEnabled || !audioUnlocked) return;
            const i = bgThemeStep % BG_THEME_PATTERN.length;
            const stepDur = (bgThemeIntensified ? BG_THEME_STEP_MS * 0.78 : BG_THEME_STEP_MS) / 1000;

            // Bassline — always present, slightly louder/sharper when intensified.
            const bassFreq = BG_THEME_PATTERN[i];
            if (bassFreq !== null) {
                playTone({
                    type: bgThemeIntensified ? 'sawtooth' : 'triangle',
                    startFreq: bassFreq,
                    duration: stepDur * 0.85,
                    volume: bgThemeIntensified ? 0.17 : 0.13,
                    rampType: 'linear'
                });
            }

            // Melody — lead line, brighter waveform and a touch louder in boss mode.
            const leadFreq = BG_THEME_MELODY[i];
            if (leadFreq !== null) {
                playTone({
                    type: bgThemeIntensified ? 'square' : 'triangle',
                    startFreq: leadFreq,
                    duration: stepDur * 0.7,
                    volume: bgThemeIntensified ? 0.12 : 0.09,
                    rampType: 'exponential'
                });
            }

            // Harmony — boss fights only, stacks urgency on top of the melody.
            if (bgThemeIntensified) {
                const harmFreq = BG_THEME_HARMONY[i];
                if (harmFreq !== null) {
                    playTone({ type: 'sawtooth', startFreq: harmFreq, duration: stepDur * 0.55, volume: 0.07, rampType: 'exponential' });
                }
            }

            // Percussion — light closed-hat tick every pattern step it's flagged on.
            if (BG_THEME_HATS[i]) {
                playNoiseBurst({
                    duration: bgThemeIntensified ? 0.035 : 0.03,
                    volume: bgThemeIntensified ? 0.06 : 0.045,
                    filterFreq: 8000,
                    filterQ: 0.7
                });
            }
            // Boss mode adds a low kick-like thud on the strong beats (every 4th step).
            if (bgThemeIntensified && i % 4 === 0) {
                playTone({ type: 'sine', startFreq: 70, endFreq: 38, duration: stepDur * 0.6, volume: 0.16, rampType: 'exponential' });
            }

            bgThemeStep++;
        }

        function startBgTheme() {
            ensureAudioContext();
            if (bgThemeInterval !== null) clearInterval(bgThemeInterval);
            const ms = bgThemeIntensified ? BG_THEME_STEP_MS * 0.78 : BG_THEME_STEP_MS;
            bgThemeInterval = setInterval(playBgThemeStep, ms);
        }

        function stopBgTheme() {
            if (bgThemeInterval !== null) {
                clearInterval(bgThemeInterval);
                bgThemeInterval = null;
            }
        }

        function toggleBgTheme() {
            bgThemeEnabled = !bgThemeEnabled;
        }

        // Switches the running theme between normal and boss-intensified
        // variants. Restarts the clock at the new tempo so the tempo change
        // takes effect immediately rather than on the next loop-around.
        function setBgThemeIntensified(on) {
            if (bgThemeIntensified === on) return;
            bgThemeIntensified = on;
            if (bgThemeInterval !== null) startBgTheme();
        }
