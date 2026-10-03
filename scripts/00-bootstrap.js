/* Faded Thread module: 00-bootstrap.js | build 03 Oct 2026 */
const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        const transferFileInputEl = document.getElementById('transfer-file-input');
        if (transferFileInputEl) {
            transferFileInputEl.addEventListener('change', (e) => {
                const file = e.target.files && e.target.files[0];
                if (file) handleTransferFileChosen(file);
            });
        }
