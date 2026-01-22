// Fragment shader for fluid displacement transition
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform sampler2D uDisplacementMap;
uniform float uProgress;

varying vec2 vUv;

void main() {
  // Read displacement value from noise texture
  vec4 disp = texture2D(uDisplacementMap, vUv);
  
  // Calculate displacement strength based on progress
  float dispStrength = 0.3;
  
  // Offset UV coordinates for both textures
  vec2 distortedPosition1 = vec2(
    vUv.x + disp.r * uProgress * dispStrength,
    vUv.y + disp.g * uProgress * dispStrength * 0.5
  );
  
  vec2 distortedPosition2 = vec2(
    vUv.x - disp.r * (1.0 - uProgress) * dispStrength,
    vUv.y - disp.g * (1.0 - uProgress) * dispStrength * 0.5
  );
  
  // Sample both textures with displaced UVs
  vec4 tex1 = texture2D(uTexture1, distortedPosition1);
  vec4 tex2 = texture2D(uTexture2, distortedPosition2);
  
  // Smooth transition using smoothstep
  float mixValue = smoothstep(0.0, 1.0, uProgress);
  
  // Mix the two textures
  vec4 finalColor = mix(tex1, tex2, mixValue);
  
  gl_FragColor = finalColor;
}
