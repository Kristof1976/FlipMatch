import Board from './board.js';

export default class Game {
  constructor(ui, imageProvider, gameManager) {
    this.ui = ui;
    this.imageProvider = imageProvider; // functie die image array terug geeft
    this.gameManager = gameManager;

    this.board = null;
    this.flipped = []; // momenteel open kaarten
    this.locked = false;
    this.isPlaying = false;
    this.onLevelComplete = null; // callback voor level completion
    this.onMatch = null; // callback voor matches

    // bind UI card clicks
    this.ui.bindCardClick(this.handleCardClick.bind(this));
  }

  startLevel(width, height) {
    const images = this.imageProvider();
    this.board = new Board(width, height, images);
    this.flipped = [];
    this.locked = false;
    this.isPlaying = true;
    
    this.gameManager.startLevel();
    this.ui.renderBoard(this.board.cards, width, height);
  }

  handleCardClick(index) {
    if (!this.board) return;
    if (this.locked) return;

    const card = this.board.cards[index];
    if (!card || card.isMatched || card.isFlipped) return;

    card.flip();
    this.ui.updateCardElement(index, card);

    this.flipped.push({ index, card });

    if (this.flipped.length === 2) {
      this.locked = true;
      this.gameManager.recordMove();
      
      const [a, b] = this.flipped;
      if (a.card.key === b.card.key) {
        // match
        a.card.isMatched = true;
        b.card.isMatched = true;
        this.gameManager.recordMatch();
        
        this.ui.updateCardElement(a.index, a.card);
        this.ui.updateCardElement(b.index, b.card);
        
        // Trigger match callback with card elements
        if (this.onMatch) {
          const cardEl1 = document.querySelector(`[data-index='${a.index}']`);
          const cardEl2 = document.querySelector(`[data-index='${b.index}']`);
          this.onMatch(cardEl1, cardEl2);
        }
        
        this.flipped = [];
        this.locked = false;

        if (this.board.allMatched()) {
          // Level completed!
          this.isPlaying = false;
          const levelStats = this.gameManager.completeLevel();
          
          if (this.onLevelComplete) {
            this.onLevelComplete(levelStats);
          }
        }
      } else {
        // mismatch 
        this.gameManager.recordMismatch();
        // Direct verdergaan: kaarten omdraaien en doorspelen
        setTimeout(() => {
          this._hideNonMatched();
        }, 1500); // 1.5s delay zodat speler de kaarten kan zien
      }
    }
  }

  endGame() {
    this.isPlaying = false;
    this.locked = true;
  }

  _hideNonMatched() {
    this.flipped.forEach(({ index, card }) => {
      card.flip();
      this.ui.updateCardElement(index, card);
    });
    this.flipped = [];
    this.locked = false;
  }
}
