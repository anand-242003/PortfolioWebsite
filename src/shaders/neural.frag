uniform float uTime;
uniform vec3 uColor;
uniform float uIntensity;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  // Fresnel effect for edge glow
  vec3 viewDirection = normalize(cameraPosition - vPosition);
  float fresnel = pow(1.0 - dot(viewDirection, vNormal), 3.0);
  
  // Pulsing animation
  float pulse = sin(uTime * 2.0) * 0.5 + 0.5;
  
  // Combine effects
  vec3 glow = uColor * (fresnel + pulse * 0.3) * uIntensity;
  
  gl_FragColor = vec4(glow, 1.0);
}
