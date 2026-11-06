"use client";

import { useCallback, useEffect, useId, useState } from "react";

const VERTEX = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

// Original broad blue flow and monochrome grain, drawn from the visible surface,
// not from the reference's restricted shader implementation.
const FRAGMENT = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;

float grain(vec2 point) {
  return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float bend = 0.010 * sin(uv.y * 6.283185 + u_time * 0.5);
  bend += 0.004 * sin(uv.y * 13.0 + uv.x * 3.0 - u_time * 0.3) - 0.020 * (1.0 - uv.y);
  float flow = uv.x + bend;
  vec3 pale = vec3(0.78, 0.90, 1.15);
  vec3 blue = vec3(0.26, 0.48, 1.05);
  vec3 deep = vec3(0.125, 0.335, 0.92);
  vec3 color = mix(pale, blue, smoothstep(0.27, 0.50, flow));
  color = mix(color, deep, smoothstep(0.57, 0.77, flow));
  vec2 drift = vec2(floor(u_time * 60.0), 0.0);
  color += (grain(gl_FragCoord.xy + drift) - 0.5) * 0.08;
  gl_FragColor = vec4(color, 1.0);
}
`;

/** Independently rendered preferences artwork with a static unsupported-WebGL surface. */
export function NewsletterPreferencesBackground() {
  const [contextSession, setContextSession] = useState<{ canvas: HTMLCanvasElement } | null>(null);
  const noiseId = useId();
  const [ready, setReady] = useState(false);
  const attachCanvas = useCallback((canvas: HTMLCanvasElement | null) => {
    setContextSession(canvas ? { canvas } : null);
  }, []);

  useEffect(() => {
    const canvas = contextSession?.canvas;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, stencil: false });
    if (!gl) return;
    const vertex = gl.createShader(gl.VERTEX_SHADER);
    const fragment = gl.createShader(gl.FRAGMENT_SHADER);
    const program = gl.createProgram();
    const buffer = gl.createBuffer();
    const dispose = () => {
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
      if (vertex) gl.deleteShader(vertex);
      if (fragment) gl.deleteShader(fragment);
    };
    if (!vertex || !fragment || !program || !buffer) { dispose(); return; }
    gl.shaderSource(vertex, VERTEX);
    gl.shaderSource(fragment, FRAGMENT);
    gl.compileShader(vertex);
    gl.compileShader(fragment);
    if (!gl.getShaderParameter(vertex, gl.COMPILE_STATUS) || !gl.getShaderParameter(fragment, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(vertex) || gl.getShaderInfoLog(fragment) || "Unknown shader compilation error";
      dispose();
      throw new Error(`Newsletter preferences background: ${message}`);
    }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const message = gl.getProgramInfoLog(program) || "Unknown shader link error";
      dispose();
      throw new Error(`Newsletter preferences background: ${message}`);
    }
    gl.useProgram.call(gl, program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const resolution = gl.getUniformLocation(program, "u_resolution");
    const time = gl.getUniformLocation(program, "u_time");
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const started = performance.now();
    let frame: number | null = null;
    let visible = true;
    let lost = false;
    let width = 0;
    let height = 0;
    let lastDraw = -Infinity;
    let painted = false;
    const draw = (timestamp: number) => {
      frame = null;
      if (lost) return;
      if (timestamp - lastDraw >= 1000 / 30 || preference.matches) {
        gl.uniform1f(time, preference.matches ? 0 : (timestamp - started) / 4000);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        lastDraw = timestamp;
        if (!painted) { painted = true; setReady(true); }
      }
      if (!preference.matches && visible && !document.hidden) frame = requestAnimationFrame(draw);
    };
    const sync = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      if (!width || !height || document.hidden || !visible || lost) return;
      lastDraw = -Infinity;
      draw(performance.now());
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const nextWidth = Math.round(rect.width);
      const nextHeight = Math.round(rect.height);
      if (nextWidth === width && nextHeight === height) return;
      width = nextWidth;
      height = nextHeight;
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(1, height);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resolution, canvas.width, canvas.height);
      sync();
    };
    const contextLost = (event: Event) => {
      event.preventDefault();
      lost = true;
      setReady(false);
      sync();
    };
    const contextRestored = () => setContextSession({ canvas });
    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(entries => { visible = entries[0]?.isIntersecting ?? false; sync(); });
    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    preference.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    canvas.addEventListener("webglcontextlost", contextLost);
    canvas.addEventListener("webglcontextrestored", contextRestored);
    resize();
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      preference.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      canvas.removeEventListener("webglcontextlost", contextLost);
      canvas.removeEventListener("webglcontextrestored", contextRestored);
      dispose();
    };
  }, [contextSession]);

  return <div aria-hidden="true" className="relative h-full w-full overflow-hidden" style={{ background: "linear-gradient(90deg, #c7e5ff 27%, #427aff 50%, #2055eb 77%)" }}>
    <svg aria-hidden="true" className="absolute inset-0 h-full w-full opacity-[0.08]" preserveAspectRatio="none"><filter id={noiseId}><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="1" seed="7" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter><rect width="100%" height="100%" filter={`url(#${noiseId})`} /></svg>
    <canvas ref={attachCanvas} className="absolute inset-0 block h-full w-full" style={{ opacity: ready ? 1 : 0 }} />
  </div>;
}
