import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

/**
 * Simplified Post-processing effects stack
 * Only essential effects for better performance
 */
function PostProcessing({ bloomIntensity = 0.5 }) {
  return (
    <EffectComposer multisampling={0}>
      {/* Bloom - optimized settings */}
      <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={0.8}
        luminanceSmoothing={0.3}
        blendFunction={BlendFunction.ADD}
      />

      {/* Vignette - cheap effect */}
      <Vignette
        offset={0.3}
        darkness={0.5}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}

export default PostProcessing;
