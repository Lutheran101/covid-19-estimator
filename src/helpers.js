/**
 * normalize duration input into days
 * @param {string} duration
 * @param {number} figure
 * @returns {number}
 */
const getDays = (duration, figure) => {
  switch (duration) {
    case 'weeks':
      return figure * 7;
    case 'months':
      return figure * 30;
    default:
      return figure;
  }
};

/**
 * computes an estimate of currently infected people
 * @param {number} reportedCases
 * @param {boolean} isSevere
 * @returns {number}
 */
const getCurrentlyInfected = (reportedCases, isSevere = false) => {
  const estimated = isSevere ? 50 : 10;
  return reportedCases * estimated;
};

/**
 * computes an estimation of infected people after a given period of time(in days)
 * @param {number} currentlyInfected
 * @param {number} time
 * @returns {number}
 */
const getInfectionsByTime = (currentlyInfected, time) => {
  const numberOfSets = Number(time / 3);
  return currentlyInfected * 2 ** numberOfSets;
};

export { getCurrentlyInfected, getInfectionsByTime, getDays };
