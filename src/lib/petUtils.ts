export function calculatePetLevel(xp: number, points: number): number {
  const score = Math.max(xp || 0, points || 0);
  if (score >= 500) return 5;
  if (score >= 250) return 4;
  if (score >= 120 || points >= 150 || xp >= 300) return 3;
  if (score >= 50 || points >= 50 || xp >= 100) return 2;
  return 1;
}

export function calculatePetLevelByFeedings(feedCount: number, globalEvolutions?: any[]): number {
  if (!feedCount || feedCount <= 0) return 1;
  let level = 1;
  if (globalEvolutions && Array.isArray(globalEvolutions) && globalEvolutions.length > 0) {
    const sorted = [...globalEvolutions].sort((a, b) => a.level - b.level);
    for (const evo of sorted) {
      const required = evo.requiredFeedings ?? (evo.level * 3);
      if (feedCount >= required) {
        level = Math.max(level, evo.level);
      }
    }
  } else {
    if (feedCount >= 15) return 5;
    if (feedCount >= 10) return 4;
    if (feedCount >= 6) return 3;
    if (feedCount >= 3) return 2;
  }
  return level;
}

export function getPetImage(petInfo: any, level: number, globalEvolutions?: any[]) {
  if (!petInfo) return '🐾';

  // Check pet-specific evolutions for exact level
  if (petInfo.evolutions && Array.isArray(petInfo.evolutions)) {
    const evo = petInfo.evolutions.find((e: any) => e.level === level);
    if (evo && evo.imageUrl) {
      return evo.imageUrl;
    }
  }

  // Check global evolutions for exact level
  if (globalEvolutions && Array.isArray(globalEvolutions)) {
    const globalEvo = globalEvolutions.find((e: any) => e.level === level);
    if (globalEvo && globalEvo.imageUrl) {
      return globalEvo.imageUrl;
    }
  }

  if (level <= 1) return petInfo.baseImageUrl || '🐾';

  return petInfo.baseImageUrl || '🐾';
}

export function getFeedingsNeededForNextLevel(feedCount: number, currentLevel: number, globalEvolutions?: any[]): { nextLevel: number, feedingsNeeded: number } {
  if (currentLevel >= 5) return { nextLevel: 5, feedingsNeeded: 0 };
  const nextLevel = currentLevel + 1;
  let required = nextLevel * 3;
  if (globalEvolutions && Array.isArray(globalEvolutions) && globalEvolutions.length > 0) {
    const evo = globalEvolutions.find((e: any) => e.level === nextLevel);
    if (evo && evo.requiredFeedings !== undefined) {
      required = evo.requiredFeedings;
    }
  } else {
    const defaults: Record<number, number> = { 2: 3, 3: 6, 4: 10, 5: 15 };
    required = defaults[nextLevel] || (nextLevel * 3);
  }
  const feedingsNeeded = Math.max(0, required - (feedCount || 0));
  return { nextLevel, feedingsNeeded };
}

