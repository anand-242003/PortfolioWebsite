// Noise Film Grain Shader
// Purpose: Overlay subtle grain texture to prevent color banding
// Usage: Apply as post-processing effect over rendered scene

precision mediump float;

uniform sampler2D uTexture;
uniform float uTime;
uniform float uIntensity; // 0.0 to 1.0 (recommended: 0.03-0.08)
uniform vec2 uResolution;

varying vec2 vUv;

/**
 * Procedural noise function
 * Uses hash function for pseudo-random values
 * @param st - 2D coordinate
 * @return float - Random value between 0.0 and 1.0
 */
float random(vec2 st) {
  // Magic numbers for good distribution
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  // Sample base texture
  vec3 color = texture2D(uTexture, vUv).rgb;
  
  // Generate animated noise
  // Add time to UV for temporal variation (prevents static grain)
  vec2 noiseUv = vUv * uResolution + vec2(uTime * 0.5);
  float noise = random(noiseUv);
  
  // Center noise around 0.0 (range: -0.5 to 0.5)
  noise = (noise - 0.5) * uIntensity;
  
  // Add grain to color
  // Using addition instead of mix for subtle overlay effect
  color += vec3(noise);
  
  // Clamp to prevent overflow
  color = clamp(color, 0.0, 1.0);
  
  gl_FragColor = vec4(color, 1.0);
}
