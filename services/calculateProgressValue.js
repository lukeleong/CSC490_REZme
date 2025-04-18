module.exports = function calculateProgressValue({ SetsCompleted, RepsCompleted, TimeTaken, Exercise }) {
  const setWeight = 0.4;
  const repWeight = 0.4;
  const timeWeight = 0.2;

  const expectedSets = Exercise.Sets;
  const expectedReps = Exercise.Reps;
  const targetTime = Exercise.TargetTime;
  const restTime = Exercise.RestTime;

  const totalExpectedTime = (targetTime * expectedSets) + (restTime * (expectedSets - 1));

  // Allow overshoot but cap at a 10% bonus (i.e., maximum normalized value of 1.1)
  const normalizedSets = Math.min(SetsCompleted / expectedSets, 1.1);
  const normalizedReps = Math.min(RepsCompleted / expectedReps, 1.1);
  // Allow a maximum bonus of 10% if the user is significantly faster than the target.
  const normalizedTime = Math.min(TimeTaken / totalExpectedTime, 1.1);
  const timeScore = 1 - normalizedTime;  // a lower TimeTaken yields a higher (positive) timeScore

  const value = (
    setWeight * normalizedSets +
    repWeight * normalizedReps +
    timeWeight * timeScore
  ) * 100;

  return Math.min(parseFloat(value.toFixed(2)), 100);
};
