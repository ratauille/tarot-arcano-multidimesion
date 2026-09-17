import { useState, useEffect } from 'react';

const STORAGE_KEY = 'el_umbral_user_alias';

const MYSTIC_TITLES = [
  'Buscador de Avalon',
  'Oráculo del Roble',
  'Caminante de Sombras',
  'Guardián de la Luna',
  'Alquimista del Alba',
  'Vidente de las Runas',
  'Viajero del Umbral',
  'Custodio del Fuego Sagrado',
  'Sacerdote de las Estrellas',
  'Hermano del Viento',
  'Nómada del Destino',
  'Tejedor de Ensueños',
  'Explorador del Arcano',
  'Guardián del Laberinto',
];

export function generateRandomMysticAlias(): string {
  const randomIndex = Math.floor(Math.random() * MYSTIC_TITLES.length);
  const title = MYSTIC_TITLES[randomIndex];
  const runeNumber = Math.floor(10 + Math.random() * 89);
  return `${title} #${runeNumber}`;
}

export function getUserAlias(): string {
  if (typeof window === 'undefined') return 'Buscador del Umbral';
  try {
    let saved = localStorage.getItem(STORAGE_KEY);
    if (!saved || !saved.trim()) {
      saved = generateRandomMysticAlias();
      localStorage.setItem(STORAGE_KEY, saved);
    }
    return saved;
  } catch {
    return 'Buscador del Umbral';
  }
}

export function setUserAlias(alias: string): void {
  if (typeof window === 'undefined') return;
  try {
    const cleaned = alias.trim() || generateRandomMysticAlias();
    localStorage.setItem(STORAGE_KEY, cleaned);
    window.dispatchEvent(new CustomEvent('el_umbral_alias_changed', { detail: cleaned }));
  } catch (err) {
    console.error('Error setting user alias:', err);
  }
}

export function useUserAlias() {
  const [alias, setAliasState] = useState<string>(getUserAlias);

  useEffect(() => {
    const handleAliasChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setAliasState(customEvent.detail);
      } else {
        setAliasState(getUserAlias());
      }
    };

    window.addEventListener('el_umbral_alias_changed', handleAliasChange);
    window.addEventListener('storage', handleAliasChange);

    return () => {
      window.removeEventListener('el_umbral_alias_changed', handleAliasChange);
      window.removeEventListener('storage', handleAliasChange);
    };
  }, []);

  const updateAlias = (newAlias: string) => {
    setUserAlias(newAlias);
    setAliasState(newAlias.trim());
  };

  const regenerateAlias = () => {
    const fresh = generateRandomMysticAlias();
    updateAlias(fresh);
    return fresh;
  };

  return { alias, updateAlias, regenerateAlias };
}
