// Neural Glow Vertex Shader
// Purpose: Pass position and normal data to fragment shader
// Used for: Fresnel effect calculation in fragment shader

precision highp float;

// Outputs to fragment shader
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  // Transform normal to world space
  // normalMatrix = inverse transpose of modelViewMatrix
  vNormal = normalize(normalMatrix * normal);
  
  // Transform position to world space
  vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  
  // Standard MVP transformation
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
