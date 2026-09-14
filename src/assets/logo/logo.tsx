import logoLight from './logo-horizontal.svg';
import logoDark from './logo-horizontal-dark.svg';

type LogoProps = {
  variant?: 'light' | 'dark';
  height?: number;
};

export function Logo({ variant = 'light', height = 40 }: LogoProps) {
  const src = variant === 'dark' ? logoDark : logoLight;
  return <img src={src} alt="Salvia & Co." height={height} />;
}