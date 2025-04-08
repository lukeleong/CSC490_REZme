// calculateProgressValue.js
module.exports = function calculateProgressValue({ SetsCompleted, RepsCompleted, TimeTaken }) {
    const setWeight = 0.4;
    const repWeight = 0.4;
    const timeWeight = 0.2;
  
    const normalizedSets = Math.min(SetsCompleted / 5, 1);  // normalize by expected max sets
    const normalizedReps = Math.min(RepsCompleted / 20, 1); // normalize by expected max reps
    const normalizedTime = 1 - Math.min(TimeTaken / 300, 1); // less time is better
  
    const value = (
      setWeight * normalizedSets +
      repWeight * normalizedReps +
      timeWeight * normalizedTime
    ) * 100;
  
    return parseFloat(value.toFixed(2));
  };
  