import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeViewport() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#10131b');
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(3.8, 2.8, 5.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const knot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1, 0.29, 180, 24),
      new THREE.MeshStandardMaterial({ color: '#8a7cff', metalness: 0.5, roughness: 0.24 }),
    );
    scene.add(knot);
    scene.add(new THREE.HemisphereLight('#d8dcff', '#25243c', 2.1));
    const keyLight = new THREE.DirectionalLight('#ffffff', 3.2);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);

    const grid = new THREE.GridHelper(12, 24, '#34384b', '#242735');
    grid.position.y = -1.45;
    scene.add(grid);

    const resize = () => {
      const width = Math.max(mount.clientWidth, 1);
      const height = Math.max(mount.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      knot.rotation.y += 0.004;
      knot.rotation.x += 0.0015;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      knot.geometry.dispose();
      (knot.material as THREE.Material).dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="three-viewport" ref={mountRef}><div className="scene-badge">SCENE PREVIEW</div><div className="scene-gizmo">Y<br/><span>◉</span><br/>X</div></div>;
}
