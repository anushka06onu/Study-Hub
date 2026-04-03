// AI endpoint placeholder; integrate Gemini/OpenAI here later.
export const suggestTasks = (_req, res) => {
  const suggestions = [
    { title: 'Review key formulas', subject: 'Math', due: 'Today' },
    { title: 'Create flashcards for chapters 3-4', subject: 'Math', due: 'Tonight' },
    { title: 'Do 20 practice problems', subject: 'Math', due: 'Tomorrow' }
  ];
  res.json({ suggestions, model: 'gemini-stub' });
};
