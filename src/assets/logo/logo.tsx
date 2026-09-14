import logoLight from './logo-horizontal.svg';
import logoDark from './logo-horizontal-dark.svg';

type LogoProps = {
  variant?: 'light' | 'dark';
  height?: number;
};

export function Logo({ variant = 'light', height = 40 }: LogoProps) {
  const src = variant === 'dark' ? logoDark : logoLight;
  // El preflight de Tailwind fuerza `img { height: auto }`, que pisa
  // el atributo HTML `height` — por eso va como estilo inline (gana
  // por especificidad) en vez de como prop del <img>.
  return <img src={src} alt="Salvia & Co." style={{ height, width: 'auto' }} />;
}