import * as THREE from 'three';

/**
 * Simplex noise implementation for displacement map
 */
class SimplexNoise {
  private grad3 = [
    [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
    [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
    [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
  ];

  private p: number[] = [];
  private perm: number[] = [];

  constructor(seed = Math.random()) {
    // Initialize permutation table
    for (let i = 0; i < 256; i++) {
      this.p[i] = Math.floor(seed * 256);
    }
    
    // Shuffle
    for (let i = 255; i > 0; i--) {
      const j = Math.floor((seed * (i + 1)));
      [this.p[i], this.p[j]] = [this.p[j], this.p[i]];
    }
    
    // Extend
    for (let i = 0; i < 512; i++) {
      this.perm[i] = this.p[i & 255];
    }
  }

  private dot(g: number[], x: number, y: number): number {
    return g[0] * x + g[1] * y;
  }

  noise(xin: number, yin: number): number {
    const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
    const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;

    const s = (xin + yin) * F2;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);

    const t = (i + j) * G2;
    const X0 = i - t;
    const Y0 = j - t;
    const x0 = xin - X0;
    const y0 = yin - Y0;

    const i1 = x0 > y0 ? 1 : 0;
    const j1 = x0 > y0 ? 0 : 1;

    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1.0 + 2.0 * G2;
    const y2 = y0 - 1.0 + 2.0 * G2;

    const ii = i & 255;
    const jj = j & 255;
    const gi0 = this.perm[ii + this.perm[jj]] % 12;
    const gi1 = this.perm[ii + i1 + this.perm[jj + j1]] % 12;
    const gi2 = this.perm[ii + 1 + this.perm[jj + 1]] % 12;

    let n0 = 0, n1 = 0, n2 = 0;
    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 >= 0) {
      t0 *= t0;
      n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0);
    }

    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 >= 0) {
      t1 *= t1;
      n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1);
    }

    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 >= 0) {
      t2 *= t2;
      n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2);
    }

    return 70.0 * (n0 + n1 + n2);
  }
}

/**
 * Generate a noise texture for displacement
 */
export function generateNoiseTexture(width = 512, height = 512): THREE.DataTexture {
  const simplex = new SimplexNoise();
  const size = width * height;
  const data = new Uint8Array(4 * size);

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const x = j / width;
      const y = i / height;
      
      // Multi-octave noise for more detail
      let noise = 0;
      noise += simplex.noise(x * 4, y * 4) * 0.5;
      noise += simplex.noise(x * 8, y * 8) * 0.25;
      noise += simplex.noise(x * 16, y * 16) * 0.125;
      
      // Normalize to 0-255
      const value = Math.floor(((noise + 1) / 2) * 255);
      
      const stride = (i * width + j) * 4;
      data[stride] = value;
      data[stride + 1] = value;
      data[stride + 2] = value;
      data[stride + 3] = 255;
    }
  }

  const texture = new THREE.DataTexture(data, width, height);
  texture.needsUpdate = true;
  return texture;
}
