// Noise Film Grain Vertex Shader
// Purpose: Simple pass-through for full-screen quad
// Used for: Post-processing effects

precision mediump float;

varying vec2 vUv;

void main() {
  // Pass UV coordinates to fragment shader
  vUv = uv;
  
  // Standard transformation for full-screen quad
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
