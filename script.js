/* Rust Blackjack Casino Terminal Engine - Final Polish */

// Sound Synthesizer using Web Audio API
class RustAudio {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(450, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(90, this.ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playChipTick() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.03);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.03);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.03);
  }

  playCardDeal() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 0.08;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100, this.ctx.currentTime);
    filter.Q.setValueAtTime(3, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.22, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start();
  }

  playWin() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.2, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.2);
    });
  }

  playBust() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }
}

const audio = new RustAudio();

// Procedural SVG Illustrations for Card Art (Rust Themed)
const RustCardArt = {
  // Rust logo for card backs
  cardBackSvg: `
    <svg class="rust-back-logo" viewBox="0 0 100 100">
      <path d="M 15,20 H 85 V 35 H 15 Z M 40,35 H 60 V 65 H 40 Z M 15,65 H 85 V 80 H 15 Z" fill="#2d0c07" />
      <path d="M 25,25 H 75 V 30 H 25 Z M 45,40 H 55 V 60 H 45 Z M 25,70 H 75 V 75 H 25 Z" fill="#cd412b" />
    </svg>
  `,

  // Ace Illustration: Dome / Oil Rig silhouette
  aceArtSvg: `
    <svg class="card-artwork-svg" viewBox="0 0 100 140" fill="#1a1918">
      <rect x="10" y="110" width="80" height="8" />
      <path d="M 25,110 L 40,40 H 60 L 75,110 Z" fill="none" stroke="#1a1918" stroke-width="4" />
      <line x1="30" y1="85" x2="70" y2="85" stroke="#1a1918" stroke-width="3" />
      <line x1="35" y1="60" x2="65" y2="60" stroke="#1a1918" stroke-width="3" />
      <line x1="30" y1="85" x2="65" y2="60" stroke="#1a1918" stroke-width="2" />
      <line x1="70" y1="85" x2="35" y2="60" stroke="#1a1918" stroke-width="2" />
      <circle cx="50" cy="28" r="10" />
      <polygon points="50,5 45,20 55,20" />
    </svg>
  `,

  // King Illustration: Survivor with Rust flag
  kingArtSvg: `
    <svg class="card-artwork-svg" viewBox="0 0 100 140" fill="#1a1918">
      <!-- Head / Helmet -->
      <circle cx="45" cy="35" r="12" />
      <rect x="35" y="47" width="20" height="40" rx="3" />
      <!-- Legs -->
      <rect x="37" y="87" width="7" height="35" />
      <rect x="46" y="87" width="7" height="35" />
      <!-- Flagpole -->
      <line x1="68" y1="15" x2="68" y2="125" stroke="#1a1918" stroke-width="4" />
      <!-- Flag -->
      <path d="M 68,18 C 50,25 35,15 20,22 V 55 C 35,48 50,58 68,50 Z" />
      <!-- Arm holding flag -->
      <line x1="48" y1="55" x2="68" y2="45" stroke="#1a1918" stroke-width="4" />
    </svg>
  `,

  // Queen Illustration: Hazmat / Rifle survivor
  queenArtSvg: `
    <svg class="card-artwork-svg" viewBox="0 0 100 140" fill="#1a1918">
      <!-- Hazmat Hood -->
      <path d="M 35,35 C 35,20 65,20 65,35 V 50 H 35 Z" />
      <circle cx="50" cy="33" r="6" fill="#fff" stroke="#1a1918" stroke-width="2" />
      <!-- Body -->
      <path d="M 30,50 L 70,50 L 75,95 H 25 Z" />
      <!-- AK Rifle -->
      <rect x="15" y="65" width="65" height="6" transform="rotate(-15 50 65)" />
      <rect x="30" y="70" width="8" height="18" transform="rotate(10 30 70)" />
    </svg>
  `,

  // Jack Illustration: Heavy armor / Gas mask
  jackArtSvg: `
    <svg class="card-artwork-svg" viewBox="0 0 100 140" fill="#1a1918">
      <!-- Heavy Helmet -->
      <rect x="35" y="22" width="30" height="28" rx="4" />
      <rect x="38" y="30" width="24" height="6" fill="#fff" />
      <circle cx="50" cy="44" r="5" />
      <!-- Body Armor -->
      <path d="M 25,52 L 75,52 L 70,100 H 30 Z" />
      <!-- Shoulder pads -->
      <rect x="18" y="52" width="12" height="18" rx="2" />
      <rect x="70" y="52" width="12" height="18" rx="2" />
    </svg>
  `
};

// Suits and ranks definition
const SUITS = [
  { name: 'hearts', symbol: '♥', color: 'red' },
  { name: 'diamonds', symbol: '♦', color: 'red' },
  { name: 'clubs', symbol: '♣', color: 'black' },
  { name: 'spades', symbol: '♠', color: 'black' }
];

const RANKS = [
  { name: '2', val: 2 },
  { name: '3', val: 3 },
  { name: '4', val: 4 },
  { name: '5', val: 5 },
  { name: '6', val: 6 },
  { name: '7', val: 7 },
  { name: '8', val: 8 },
  { name: '9', val: 9 },
  { name: '10', val: 10 },
  { name: 'J', val: 10, art: RustCardArt.jackArtSvg },
  { name: 'Q', val: 10, art: RustCardArt.queenArtSvg },
  { name: 'K', val: 10, art: RustCardArt.kingArtSvg },
  { name: 'A', val: 11, art: RustCardArt.aceArtSvg }
];

// Main Game Controller State
class RustBlackjackGame {
  constructor() {
    this.scrap = parseInt(localStorage.getItem('rust_bj_scrap')) || 500;
    this.nickname = localStorage.getItem('rust_bj_nickname') || 'Survivor';
    this.difficulty = localStorage.getItem('rust_bj_diff') || 'medium';
    this.currentBet = 0;
    this.deck = [];
    this.playerHand = [];
    this.dealerHand = [];
    this.gameState = 'BETTING'; // BETTING, PLAYING, DEALER_TURN, ENDED

    this.initDOM();
    this.bindEvents();
    this.initBuyinControls();
    this.updateHUD();
  }

  initDOM() {
    this.elements = {
      mainMenu: document.getElementById('mainMenu'),
      gameStage: document.getElementById('gameStage'),
      nicknameInput: document.getElementById('nicknameInput'),
      startGameBtn: document.getElementById('startGameBtn'),
      btnOpenMenu: document.getElementById('btnOpenMenu'),

      buyinSlider: document.getElementById('buyinSlider'),
      buyinInput: document.getElementById('buyinInput'),
      stackBadgeVal: document.getElementById('stackBadgeVal'),

      hudScrap: document.getElementById('hudScrap'),
      hudBet: document.getElementById('hudBet'),
      hudNickname: document.getElementById('hudNickname'),
      hudDiffTag: document.getElementById('hudDiffTag'),
      hudPlayerScore: document.getElementById('hudPlayerScore'),
      hudDealerScore: document.getElementById('hudDealerScore'),

      crtDealerScore: document.getElementById('crtDealerScore'),
      crtDealerCards: document.getElementById('crtDealerCards'),
      crtDealerStatus: document.getElementById('crtDealerStatus'),

      crtPlayerScore: document.getElementById('crtPlayerScore'),
      crtPlayerCards: document.getElementById('crtPlayerCards'),
      crtPlayerStatus: document.getElementById('crtPlayerStatus'),

      dealerCardsArea: document.getElementById('dealerCardsArea'),
      playerCardsArea: document.getElementById('playerCardsArea'),

      bettingControls: document.getElementById('bettingControls'),
      playControls: document.getElementById('playControls'),
      postControls: document.getElementById('postControls'),

      btnDeal: document.getElementById('btnDeal'),
      currentBetDisplay: document.getElementById('currentBetDisplay'),
      btnHit: document.getElementById('btnHit'),
      btnStand: document.getElementById('btnStand'),
      btnDouble: document.getElementById('btnDouble'),

      btnNewRound: document.getElementById('btnNewRound'),
      btnChangeBet: document.getElementById('btnChangeBet'),
      btnMaxBet: document.getElementById('btnMaxBet'),
      btnClearBet: document.getElementById('btnClearBet'),

      resultBanner: document.getElementById('resultBanner'),
      resultTitle: document.getElementById('resultTitle'),
      resultSub: document.getElementById('resultSub')
    };

    this.elements.nicknameInput.value = this.nickname;
    const currentDiffRadio = document.querySelector(`input[name="difficulty"][value="${this.difficulty}"]`);
    if (currentDiffRadio) currentDiffRadio.checked = true;
  }

  initBuyinControls() {
    const updateBuyin = (val) => {
      let num = parseInt(val) || 5;
      num = Math.max(5, num);
      this.elements.buyinInput.value = num;
      this.elements.buyinSlider.value = Math.min(num, 5000);
      this.elements.stackBadgeVal.textContent = `x${num}`;
    };

    this.elements.buyinSlider.value = this.scrap;
    updateBuyin(this.scrap);

    this.elements.buyinSlider.addEventListener('input', (e) => {
      audio.playChipTick();
      updateBuyin(e.target.value);
    });

    this.elements.buyinInput.addEventListener('input', (e) => {
      audio.playChipTick();
      updateBuyin(e.target.value);
    });

    document.querySelectorAll('.stack-quick-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        audio.init();
        audio.playChipTick();
        const delta = parseInt(e.target.getAttribute('data-add'));
        const current = parseInt(this.elements.buyinInput.value) || 500;
        updateBuyin(current + delta);
      });
    });
  }

  bindEvents() {
    // Menu start
    this.elements.startGameBtn.addEventListener('click', () => {
      audio.init();
      audio.playClick();
      this.saveSettingsAndStart();
    });

    this.elements.btnOpenMenu.addEventListener('click', () => {
      audio.playClick();
      this.elements.mainMenu.classList.remove('hidden');
    });

    // Chip selections
    document.querySelectorAll('.chip-btn[data-amount]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        audio.init();
        audio.playChipTick();
        const amt = parseInt(e.target.getAttribute('data-amount'));
        this.addBet(amt);
      });
    });

    this.elements.btnMaxBet.addEventListener('click', () => {
      audio.init();
      audio.playChipTick();
      this.setBet(this.scrap);
    });

    this.elements.btnClearBet.addEventListener('click', () => {
      audio.init();
      audio.playClick();
      this.setBet(0);
    });

    this.elements.btnDeal.addEventListener('click', () => {
      audio.init();
      audio.playClick();
      this.startRound();
    });

    this.elements.btnHit.addEventListener('click', () => {
      audio.init();
      audio.playClick();
      this.playerHit();
    });

    this.elements.btnStand.addEventListener('click', () => {
      audio.init();
      audio.playClick();
      this.playerStand();
    });

    this.elements.btnDouble.addEventListener('click', () => {
      audio.init();
      audio.playClick();
      this.playerDouble();
    });

    this.elements.btnNewRound.addEventListener('click', () => {
      audio.init();
      audio.playClick();
      this.resetRound(false);
    });

    this.elements.btnChangeBet.addEventListener('click', () => {
      audio.init();
      audio.playClick();
      this.resetRound(true);
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      audio.init();
      if (this.elements.mainMenu.classList.contains('hidden')) {
        if (e.key === 'h' || e.key === 'H' || e.key === 'р' || e.key === 'Р') {
          if (this.gameState === 'PLAYING') this.playerHit();
        } else if (e.key === 's' || e.key === 'S' || e.key === 'ы' || e.key === 'Ы') {
          if (this.gameState === 'PLAYING') this.playerStand();
        } else if (e.key === 'd' || e.key === 'D' || e.key === 'в' || e.key === 'В') {
          if (this.gameState === 'PLAYING' && this.playerHand.length === 2 && this.scrap >= this.currentBet) {
            this.playerDouble();
          }
        } else if (e.code === 'Space') {
          if (this.gameState === 'BETTING' && this.currentBet > 0) {
            this.startRound();
          } else if (this.gameState === 'ENDED') {
            this.resetRound(false);
          }
        }
      }
    });
  }

  saveSettingsAndStart() {
    this.nickname = this.elements.nicknameInput.value.trim() || 'Survivor';
    const selectedDiff = document.querySelector('input[name="difficulty"]:checked');
    if (selectedDiff) this.difficulty = selectedDiff.value;

    const buyinVal = Math.max(5, parseInt(this.elements.buyinInput.value) || 500);
    this.scrap = buyinVal;

    localStorage.setItem('rust_bj_nickname', this.nickname);
    localStorage.setItem('rust_bj_diff', this.difficulty);
    localStorage.setItem('rust_bj_scrap', this.scrap);

    this.elements.mainMenu.classList.add('hidden');
    this.elements.gameStage.classList.remove('hidden');

    this.resetRound(true);
  }

  updateHUD() {
    this.elements.hudScrap.textContent = this.scrap;
    this.elements.hudBet.textContent = this.currentBet;
    this.elements.hudNickname.textContent = this.nickname;
    this.elements.hudDiffTag.textContent = this.difficulty.toUpperCase();
    this.elements.currentBetDisplay.textContent = this.currentBet;

    this.elements.btnDeal.disabled = (this.currentBet <= 0 || this.currentBet > this.scrap);
    localStorage.setItem('rust_bj_scrap', this.scrap);
  }

  addBet(amount) {
    if (this.gameState !== 'BETTING') return;
    if (this.currentBet + amount <= this.scrap) {
      this.currentBet += amount;
      this.updateHUD();
    }
  }

  setBet(amount) {
    if (this.gameState !== 'BETTING') return;
    this.currentBet = Math.min(amount, this.scrap);
    this.updateHUD();
  }

  // Build standard 52-card deck
  createStandardDeck() {
    const deck = [];
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        deck.push({ suit, rank });
      }
    }
    return deck;
  }

  // Shuffle deck with difficulty modifier
  buildDeck() {
    let deck = this.createStandardDeck();
    // Standard Fisher-Yates shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    this.deck = deck;
  }

  // Draw card algorithm respecting difficulty levels
  drawCard(targetRole = 'player') {
    if (this.deck.length < 10) {
      this.buildDeck();
    }

    if (targetRole === 'dealer') {
      const dealerScore = this.calculateHandValue(this.dealerHand);

      if (this.difficulty === 'easy') {
        // Easy mode: If dealer is drawing and score is between 12 and 16, favor giving dealer a 10-value card to force Bust
        if (dealerScore >= 12 && dealerScore <= 16 && Math.random() < 0.65) {
          const bustCardIdx = this.deck.findIndex(c => c.rank.val === 10);
          if (bustCardIdx !== -1) {
            return this.deck.splice(bustCardIdx, 1)[0];
          }
        }
      } else if (this.difficulty === 'hard') {
        // Hard mode: Rig dealer to get total 20 or 21 when drawing
        const neededFor20Or21 = [20 - dealerScore, 21 - dealerScore];

        if (dealerScore >= 10 && dealerScore <= 16 && Math.random() < 0.6) {
          const clutchCardIdx = this.deck.findIndex(c => neededFor20Or21.includes(c.rank.val));
          if (clutchCardIdx !== -1) {
            return this.deck.splice(clutchCardIdx, 1)[0];
          }
        }
      }
    }

    return this.deck.pop();
  }

  calculateHandValue(hand) {
    let sum = 0;
    let aces = 0;

    for (const card of hand) {
      if (card.hidden) continue;
      sum += card.rank.val;
      if (card.rank.name === 'A') aces++;
    }

    while (sum > 21 && aces > 0) {
      sum -= 10;
      aces--;
    }

    return sum;
  }

  startRound() {
    if (this.currentBet <= 0 || this.currentBet > this.scrap) return;

    this.scrap -= this.currentBet;
    this.gameState = 'PLAYING';
    this.buildDeck();

    this.playerHand = [];
    this.dealerHand = [];

    this.elements.resultBanner.classList.add('hidden');
    this.elements.bettingControls.classList.add('hidden');
    this.elements.playControls.classList.remove('hidden');

    // Enable / disable double button based on scrap
    this.elements.btnDouble.disabled = (this.scrap < this.currentBet);

    // Initial deal: 2 player cards, 2 dealer cards (1 face down)
    audio.playCardDeal();
    this.playerHand.push(this.drawCard('player'));

    setTimeout(() => {
      audio.playCardDeal();
      this.dealerHand.push(this.drawCard('dealer'));

      setTimeout(() => {
        audio.playCardDeal();
        this.playerHand.push(this.drawCard('player'));

        setTimeout(() => {
          audio.playCardDeal();
          this.dealerHand.push({ ...this.drawCard('dealer'), hidden: true });

          this.renderBoard();
          this.checkInitialBlackjack();
        }, 150);
      }, 150);
    }, 150);
  }

  checkInitialBlackjack() {
    const playerVal = this.calculateHandValue(this.playerHand);
    if (playerVal === 21) {
      // Reveal dealer hidden card
      this.dealerHand[1].hidden = false;
      this.renderBoard();

      const dealerVal = this.calculateHandValue(this.dealerHand);
      if (dealerVal === 21) {
        this.endRound('PUSH', 'Both hit Blackjack! Bet returned.');
      } else {
        const payout = Math.floor(this.currentBet * 2.5); // 3:2 payout (profit 1.5x + bet)
        this.endRound('WIN', `BLACKJACK! Scrap Won: ${payout}`, payout);
      }
    }
  }

  playerHit() {
    if (this.gameState !== 'PLAYING') return;

    audio.playCardDeal();
    this.playerHand.push(this.drawCard('player'));
    this.elements.btnDouble.disabled = true; // Can only double on first move
    this.renderBoard();

    const playerVal = this.calculateHandValue(this.playerHand);
    if (playerVal > 21) {
      // Bust
      this.dealerHand[1].hidden = false;
      this.renderBoard();
      this.endRound('LOSS', 'PLAYER BUST! Total exceeds 21.');
    } else if (playerVal === 21) {
      this.playerStand();
    }
  }

  playerDouble() {
    if (this.gameState !== 'PLAYING') return;
    if (this.scrap < this.currentBet) return;

    this.scrap -= this.currentBet;
    this.currentBet *= 2;
    this.updateHUD();

    audio.playCardDeal();
    this.playerHand.push(this.drawCard('player'));
    this.renderBoard();

    const playerVal = this.calculateHandValue(this.playerHand);
    if (playerVal > 21) {
      this.dealerHand[1].hidden = false;
      this.renderBoard();
      this.endRound('LOSS', 'PLAYER BUST ON DOUBLE!');
    } else {
      this.playerStand();
    }
  }

  playerStand() {
    if (this.gameState !== 'PLAYING') return;

    this.gameState = 'DEALER_TURN';
    this.elements.playControls.classList.add('hidden');

    // Reveal dealer hidden card
    this.dealerHand[1].hidden = false;
    this.renderBoard();

    this.dealerTurnLoop();
  }

  dealerTurnLoop() {
    const dealerVal = this.calculateHandValue(this.dealerHand);

    if (dealerVal < 17) {
      setTimeout(() => {
        audio.playCardDeal();
        this.dealerHand.push(this.drawCard('dealer'));
        this.renderBoard();
        this.dealerTurnLoop();
      }, 500);
    } else {
      // Compare scores
      const playerVal = this.calculateHandValue(this.playerHand);

      if (dealerVal > 21) {
        const payout = this.currentBet * 2;
        this.endRound('WIN', `DEALER BUST! Scrap Won: ${payout}`, payout);
      } else if (dealerVal > playerVal) {
        this.endRound('LOSS', `DEALER WINS (${dealerVal} vs ${playerVal})`);
      } else if (playerVal > dealerVal) {
        const payout = this.currentBet * 2;
        this.endRound('WIN', `YOU WIN! Scrap Won: ${payout}`, payout);
      } else {
        this.endRound('PUSH', `PUSH / DRAW (${playerVal} vs ${dealerVal})`, this.currentBet);
      }
    }
  }

  endRound(result, message, payoutAmount = 0) {
    this.gameState = 'ENDED';
    this.scrap += payoutAmount;
    this.updateHUD();

    this.elements.playControls.classList.add('hidden');
    this.elements.postControls.classList.remove('hidden');

    this.elements.resultBanner.className = 'result-banner';
    if (result === 'WIN') {
      audio.playWin();
      this.elements.resultBanner.classList.add('win');
      this.elements.resultTitle.textContent = 'YOU WIN!';
    } else if (result === 'LOSS') {
      audio.playBust();
      this.elements.resultBanner.classList.add('loss');
      this.elements.resultTitle.textContent = 'YOU LOST!';
    } else {
      this.elements.resultBanner.classList.add('push');
      this.elements.resultTitle.textContent = 'PUSH';
    }

    this.elements.resultSub.textContent = message;
    this.elements.resultBanner.classList.remove('hidden');

    // Check if player is completely out of Scrap
    if (this.scrap <= 0 && result === 'LOSS') {
      setTimeout(() => {
        alert('You ran out of Scrap! Emergency crate dropped +500 Scrap.');
        this.scrap = 500;
        this.updateHUD();
      }, 1000);
    }
  }

  resetRound(changeBet = false) {
    this.gameState = 'BETTING';
    this.playerHand = [];
    this.dealerHand = [];

    this.elements.resultBanner.classList.add('hidden');
    this.elements.postControls.classList.add('hidden');
    this.elements.bettingControls.classList.remove('hidden');

    if (changeBet) {
      this.currentBet = 0;
    } else if (this.currentBet > this.scrap) {
      this.currentBet = this.scrap;
    }

    this.renderBoard();
    this.updateHUD();
  }

  // Rendering graphics to CRT terminals & table
  renderBoard() {
    const playerVal = this.calculateHandValue(this.playerHand);
    const dealerVal = this.calculateHandValue(this.dealerHand);

    // Update HUD Score Bubbles
    this.elements.hudPlayerScore.textContent = playerVal;
    this.elements.hudDealerScore.textContent = this.dealerHand.some(c => c.hidden) ? '?' : dealerVal;

    // Update CRT Green Screens
    this.elements.crtPlayerScore.textContent = playerVal;
    this.elements.crtDealerScore.textContent = this.dealerHand.some(c => c.hidden) ? '?' : dealerVal;

    this.renderCRTMiniCards(this.elements.crtPlayerCards, this.playerHand);
    this.renderCRTMiniCards(this.elements.crtDealerCards, this.dealerHand);

    // Update CRT Status Messages
    if (this.gameState === 'BETTING') {
      this.elements.crtPlayerStatus.textContent = 'PLACE BET';
      this.elements.crtDealerStatus.textContent = 'READY';
    } else if (this.gameState === 'PLAYING') {
      this.elements.crtPlayerStatus.textContent = 'YOUR TURN';
      this.elements.crtDealerStatus.textContent = 'WAITING...';
    } else if (this.gameState === 'DEALER_TURN') {
      this.elements.crtPlayerStatus.textContent = 'HOLD...';
      this.elements.crtDealerStatus.textContent = 'DEALING...';
    } else if (this.gameState === 'ENDED') {
      this.elements.crtPlayerStatus.textContent = 'HAND OVER';
      if (dealerVal > 21) {
        this.elements.crtDealerStatus.textContent = 'BUST!';
      } else {
        this.elements.crtDealerStatus.textContent = `TOTAL: ${dealerVal}`;
      }
    }

    // Render Physical Cards
    this.renderPhysicalCards(this.elements.playerCardsArea, this.playerHand);
    this.renderPhysicalCards(this.elements.dealerCardsArea, this.dealerHand);
  }

  renderCRTMiniCards(container, hand) {
    container.innerHTML = '';
    hand.forEach(card => {
      const cardEl = document.createElement('div');
      cardEl.className = 'crt-mini-card';
      if (card.hidden) {
        cardEl.textContent = '░░';
      } else {
        cardEl.textContent = `${card.rank.name}${card.suit.symbol}`;
      }
      container.appendChild(cardEl);
    });
  }

  renderPhysicalCards(container, hand) {
    container.innerHTML = '';
    hand.forEach(card => {
      const cardEl = document.createElement('div');
      cardEl.className = `rust-card ${card.suit ? card.suit.color : ''}`;

      if (card.hidden) {
        cardEl.classList.add('card-back');
        cardEl.innerHTML = `<div class="card-back-inner">${RustCardArt.cardBackSvg}</div>`;
      } else {
        let centerContent = '';
        if (card.rank.art) {
          centerContent = card.rank.art;
        } else {
          // Generate pip symbols for numbers
          let pipsHtml = '';
          const pipCount = typeof card.rank.val === 'number' && card.rank.val <= 10 ? card.rank.val : 1;
          for (let i = 0; i < Math.min(pipCount, 6); i++) {
            pipsHtml += `<span>${card.suit.symbol}</span>`;
          }
          centerContent = `<div class="card-pips">${pipsHtml}</div>`;
        }

        cardEl.innerHTML = `
          <div class="card-top">
            <span class="card-rank">${card.rank.name}</span>
            <span class="card-suit">${card.suit.symbol}</span>
          </div>
          <div class="card-center-art">
            ${centerContent}
          </div>
          <div class="card-bottom">
            <span class="card-rank">${card.rank.name}</span>
            <span class="card-suit">${card.suit.symbol}</span>
          </div>
        `;
      }

      container.appendChild(cardEl);
    });
  }
}

// Initialize when page loads
window.addEventListener('DOMContentLoaded', () => {
  window.rustGame = new RustBlackjackGame();
});
