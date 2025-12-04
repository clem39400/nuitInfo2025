import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise, DepthOfField } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Vector2 } from 'three';

/**
 * Enhanced Post-processing effects stack
 * Creates cinematic visual quality
 */
function PostProcessing({ enableGlitch = false, bloomIntensity = 0.8 }) {
  return (
    <EffectComposer>
      {/* Depth of Field - cinematic focus */}
      <DepthOfField
        focusDistance={0.01}
        focalLength={0.02}
        bokehScale={3}
        height={480}
      />
      
      {/* Bloom - glowing emissive objects */}
      <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.9}
        blendFunction={BlendFunction.ADD}
        mipmapBlur
      />
      
      {/* Chromatic Aberration - lens distortion */}
      <ChromaticAberration
        offset={new Vector2(0.0005, 0.0005)}
        blendFunction={BlendFunction.NORMAL}
        radialModulation={true}
        modulationOffset={0.5}
      />
      
      {/* Film grain - adds texture */}
      <Noise
        opacity={0.04}
        blendFunction={BlendFunction.OVERLAY}
      />
      
      {/* Vignette - darkened corners */}
      <Vignette
        offset={0.3}
        darkness={0.7}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}

export default PostProcessing;
