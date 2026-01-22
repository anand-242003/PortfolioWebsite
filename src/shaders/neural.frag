// Neural Glow Fragment Shader
// Purpose: Pulsing glow effect for Neural Network nodes
// Effect: Fresnel-based edge glow with animated pulse

precision mediump float;

uniform float uTime;
uniform vec3 uColor; // Acid Green (#ccff00)
uniform float uIntensity; // Glow strength multiplier (0.0 to 2.0)

// From vertex shader
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  /**
   * Fresnel Effect
   * Creates glow at edges where view direction is perpendicular to surface
   * Formula: fresnel = 1.0 - dot(viewDir, normal)
   */
  vec3 viewDir = normalize(cameraPosition - vPosition);
  float fresnel = 1.0 - max(0.0, dot(viewDir, vNormal));
  
  // Power function for sharper falloff
  // Higher exponent = more concentrated edge glow
  fresnel = pow(fresnel, 3.0);
  
  /**
   * Pulse Animation
   * Sine wave oscillation for breathing effect
   * Range: 0.0 to 1.0
   */
  float pulse = sin(uTime * 2.0) * 0.5 + 0.5;
  
  /**
   * Combine Effects
   * Multiply fresnel by pulse for animated glow
   * Add base intensity to prevent complete darkness
   */
  float glowStrength = fresnel * (0.5 + pulse * 0.5) * uIntensity;
  vec3 glow = uColor * glowStrength;
  
  /**
   * Output
   * RGB: Glow color
   * Alpha: Fresnel value for transparency
   * Allows blending with background
   */
  gl_FragColor = vec4(glow, fresnel * 0.8);
}
