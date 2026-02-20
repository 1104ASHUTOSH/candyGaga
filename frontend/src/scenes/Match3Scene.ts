import Phaser from 'phaser';

export class Match3Scene extends Phaser.Scene {
  constructor() {
    super('Match3Scene');
  }

  create(): void {
    this.add.text(8, 8, 'Match3 Canvas Active', { color: '#ffffff' });
  }
}
