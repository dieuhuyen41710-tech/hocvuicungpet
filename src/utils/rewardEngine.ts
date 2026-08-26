// Reward Engine Logic

export const rewardConfig = {
  lessonCompletion: 10,
  quiz: {
    below65: 0,
    from65To8: 5,
    from8To9: 7,
    from9To10: 9,
    perfect10: 10,
  },
  game: {
    below50: 0,
    from50To70: 3,
    from70To90: 4,
    from90To100: 6,
    perfect100: 10,
  },
};

export const calculateLessonReward = () => {
  return { points: rewardConfig.lessonCompletion, xp: rewardConfig.lessonCompletion * 2 };
};

export const calculateQuizReward = (score: number) => {
  let points = 0;
  if (score >= 10) points = rewardConfig.quiz.perfect10;
  else if (score >= 9) points = rewardConfig.quiz.from9To10;
  else if (score >= 8) points = rewardConfig.quiz.from8To9;
  else if (score >= 6.5) points = rewardConfig.quiz.from65To8;
  
  return { points, xp: points * 2 };
};

export const calculateGameReward = (percentage: number) => {
  let points = 0;
  if (percentage >= 100) points = rewardConfig.game.perfect100;
  else if (percentage >= 90) points = rewardConfig.game.from90To100;
  else if (percentage >= 70) points = rewardConfig.game.from70To90;
  else if (percentage >= 50) points = rewardConfig.game.from50To70;

  return { points, xp: points * 2 };
};

export const calculatePetEvolution = (xp: number) => {
  if (xp >= 1000) return 5;
  if (xp >= 600) return 4;
  if (xp >= 300) return 3;
  if (xp >= 100) return 2;
  return 1;
};
