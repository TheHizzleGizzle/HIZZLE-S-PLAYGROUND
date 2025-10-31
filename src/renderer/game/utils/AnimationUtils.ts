/**
 * Animation Utilities
 * Provides reusable animation effects for the game
 */

import Phaser from 'phaser';

export class AnimationUtils {
  /**
   * Create a fade in animation
   */
  public static fadeIn(
    scene: Phaser.Scene,
    target: Phaser.GameObjects.GameObject,
    duration: number = 500
  ): Phaser.Tweens.Tween {
    target.setAlpha(0);
    return scene.tweens.add({
      targets: target,
      alpha: 1,
      duration,
      ease: 'Power2'
    });
  }

  /**
   * Create a fade out animation
   */
  public static fadeOut(
    scene: Phaser.Scene,
    target: Phaser.GameObjects.GameObject,
    duration: number = 500
  ): Phaser.Tweens.Tween {
    return scene.tweens.add({
      targets: target,
      alpha: 0,
      duration,
      ease: 'Power2',
      onComplete: () => {
        if (target instanceof Phaser.GameObjects.GameObject) {
          target.destroy();
        }
      }
    });
  }

  /**
   * Create a bounce animation for creatures
   */
  public static bounce(
    scene: Phaser.Scene,
    target: Phaser.GameObjects.Sprite,
    intensity: number = 10
  ): Phaser.Tweens.Tween {
    return scene.tweens.add({
      targets: target,
      y: target.y - intensity,
      duration: 300,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  /**
   * Create a shake animation (for damage)
   */
  public static shake(
    scene: Phaser.Scene,
    target: Phaser.GameObjects.GameObject,
    intensity: number = 5,
    duration: number = 200
  ): Phaser.Tweens.Tween {
    const startX = target instanceof Phaser.GameObjects.Sprite ? target.x : 0;
    return scene.tweens.add({
      targets: target,
      x: startX + intensity,
      duration: duration / 4,
      yoyo: true,
      repeat: 3,
      ease: 'Power2',
      onComplete: () => {
        if (target instanceof Phaser.GameObjects.Sprite) {
          target.x = startX;
        }
      }
    });
  }

  /**
   * Create a pulse animation (for highlighting)
   */
  public static pulse(
    scene: Phaser.Scene,
    target: Phaser.GameObjects.GameObject,
    scale: number = 1.2,
    duration: number = 500
  ): Phaser.Tweens.Tween {
    return scene.tweens.add({
      targets: target,
      scaleX: scale,
      scaleY: scale,
      duration,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  /**
   * Create a slide in animation
   */
  public static slideIn(
    scene: Phaser.Scene,
    target: Phaser.GameObjects.GameObject,
    from: 'left' | 'right' | 'top' | 'bottom' = 'bottom',
    duration: number = 500
  ): Phaser.Tweens.Tween {
    const startX = target instanceof Phaser.GameObjects.Sprite ? target.x : 0;
    const startY = target instanceof Phaser.GameObjects.Sprite ? target.y : 0;
    
    let fromX = startX;
    let fromY = startY;
    
    switch (from) {
      case 'left':
        fromX = startX - 200;
        break;
      case 'right':
        fromX = startX + 200;
        break;
      case 'top':
        fromY = startY - 200;
        break;
      case 'bottom':
        fromY = startY + 200;
        break;
    }
    
    if (target instanceof Phaser.GameObjects.Sprite) {
      target.x = fromX;
      target.y = fromY;
    }
    
    return scene.tweens.add({
      targets: target,
      x: startX,
      y: startY,
      duration,
      ease: 'Back.easeOut'
    });
  }

  /**
   * Create damage number popup
   */
  public static damageNumber(
    scene: Phaser.Scene,
    x: number,
    y: number,
    damage: number,
    color: number = 0xe74c3c
  ): void {
    const text = scene.add.text(x, y, `-${damage}`, {
      fontSize: '32px',
      color: Phaser.Display.Color.ValueToColor(color).getColorString(),
      fontFamily: 'Arial',
      fontWeight: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    });
    
    text.setOrigin(0.5);
    
    scene.tweens.add({
      targets: text,
      y: y - 50,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => text.destroy()
    });
  }

  /**
   * Create heal number popup
   */
  public static healNumber(
    scene: Phaser.Scene,
    x: number,
    y: number,
    heal: number
  ): void {
    const text = scene.add.text(x, y, `+${heal}`, {
      fontSize: '32px',
      color: '#2ecc71',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    });
    
    text.setOrigin(0.5);
    
    scene.tweens.add({
      targets: text,
      y: y - 50,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => text.destroy()
    });
  }

  /**
   * Create screen flash effect
   */
  public static screenFlash(
    scene: Phaser.Scene,
    color: number = 0xffffff,
    duration: number = 200
  ): void {
    const flash = scene.add.rectangle(640, 360, 1280, 720, color);
    flash.setAlpha(0.5);
    flash.setDepth(1000);
    
    scene.tweens.add({
      targets: flash,
      alpha: 0,
      duration,
      ease: 'Power2',
      onComplete: () => flash.destroy()
    });
  }
}
