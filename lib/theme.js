/**
 * Lógica de tema claro/escuro.
 * Funções puras (testáveis) + um script inline que roda antes da hidratação
 * para evitar "flash" de tema errado (FOUC).
 */

export const THEME_STORAGE_KEY = 'nextjs-blog-starter:theme';
export const THEMES = Object.freeze(['light', 'dark']);
export const DEFAULT_THEME = 'light';

/** Retorna o tema apenas se for um valor válido, senão `null`. */
export function normalizeTheme(value) {
  return THEMES.includes(value) ? value : null;
}

/**
 * Resolve o tema efetivo seguindo a precedência:
 * 1. preferência explícita (componente/servidor)
 * 2. valor salvo no storage
 * 3. preferência do sistema (prefers-color-scheme)
 * 4. padrão (light)
 */
export function resolveTheme(preferred, stored, prefersDark = false) {
  const fromPreferred = normalizeTheme(preferred);
  if (fromPreferred) return fromPreferred;
  const fromStored = normalizeTheme(stored);
  if (fromStored) return fromStored;
  return prefersDark ? 'dark' : DEFAULT_THEME;
}

/** Alterna entre os dois temas. */
export function toggleTheme(current) {
  return current === 'dark' ? 'light' : 'dark';
}

/** Rótulo humano de um tema (usado no botão de alternância). */
export function themeLabel(theme) {
  return normalizeTheme(theme) === 'dark' ? 'Escuro' : 'Claro';
}

/**
 * Gera o script inline (string) que aplica o tema assim que o HTML chega ao
 * navegador, lendo localStorage e a preferência do sistema. Injetado no
 * <head>/topo do <body> no layout para evitar FOUC.
 */
export function getInitialThemeScript() {
  const key = THEME_STORAGE_KEY;
  return `(function(){try{var stored=localStorage.getItem(${JSON.stringify(
    key
  )});var prefersDark=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;var theme=(stored==='dark'||stored==='light')?stored:(prefersDark?'dark':'light');document.documentElement.setAttribute('data-theme',theme);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;
}
