"use client";

class AudioController {
  private ctx: AudioContext | null = null;
  private initialized = false;

  private init() {
    if (typeof window === "undefined") return false;
    
    // Resume or create AudioContext upon user interaction
    if (!this.ctx) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    
    this.initialized = !!this.ctx;
    return this.initialized;
  }

  // Play a soft click sound for buttons
  playClick() {
    if (!this.init() || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // Play a satisfying pop sound for balloons
  playPop() {
    if (!this.init() || !this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    // Quick pitch drop for a pop sound
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  // Play a "tada" sound for confetti/success moments
  playTada() {
    if (!this.init() || !this.ctx) return;
    
    // Play a major chord (C4, E4, G4) and then C5
    const freqs1 = [261.63, 329.63, 392.00]; // C4, E4, G4
    const freq2 = 523.25; // C5
    
    const t0 = this.ctx.currentTime;
    const t1 = t0 + 0.15;
    
    // First chord
    freqs1.forEach(f => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      
      osc.type = "triangle";
      osc.frequency.value = f;
      
      gain.gain.setValueAtTime(0, t0);
      gain.gain.linearRampToValueAtTime(0.2, t0 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, t1);
      
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t0);
      osc.stop(t1);
    });
    
    // High note
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    
    osc2.type = "triangle";
    osc2.frequency.value = freq2;
    
    gain2.gain.setValueAtTime(0, t1);
    gain2.gain.linearRampToValueAtTime(0.3, t1 + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.01, t1 + 1.5);
    
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(t1);
    osc2.stop(t1 + 1.5);
  }
}

export const audio = new AudioController();
