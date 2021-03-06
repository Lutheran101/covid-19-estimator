import {
  getCurrentlyInfected,
  getInfectionsByTime,
  getDays,
  getProjectedSeverePositiveCases,
  getAvailableHospitalBedsByRequestedTime,
  getCasesForICUByRequestedTime,
  getCasesVentilatorsByTime,
  getEconomicImpact
} from './helpers';

/**
 *
 * @param {object} data
 * @returns {object}
 * @description returns an estimate of novel COVID-19 impact on the population
 */
const covid19ImpactEstimator = (data) => {
  const {
    periodType,
    reportedCases,
    timeToElapse,
    totalHospitalBeds,
    region: { avgDailyIncomeInUSD, avgDailyIncomePopulation }
  } = data;

  const days = getDays(periodType, timeToElapse);

  const currentlyInfected = getCurrentlyInfected(reportedCases);
  const infectionsByRequestedTime = getInfectionsByTime(
    currentlyInfected,
    days
  );

  const severeCurrentlyInfected = getCurrentlyInfected(reportedCases, true);
  const severeInfectionByRequestedTime = getInfectionsByTime(
    severeCurrentlyInfected,
    days
  );

  const severeCasesByRequestedTime = getProjectedSeverePositiveCases(
    infectionsByRequestedTime
  );
  const extremeSevereCasesByRequestedTime = getProjectedSeverePositiveCases(
    severeInfectionByRequestedTime
  );

  const hospitalBedsByRequestedTime = getAvailableHospitalBedsByRequestedTime(
    totalHospitalBeds,
    severeCasesByRequestedTime
  );
  const severeHospitalBedsByRequestedTime = getAvailableHospitalBedsByRequestedTime(
    totalHospitalBeds,
    extremeSevereCasesByRequestedTime
  );

  const casesForICUByRequestedTime = getCasesForICUByRequestedTime(
    infectionsByRequestedTime
  );
  const severeCasesForICUByRequestedTime = getCasesForICUByRequestedTime(
    severeInfectionByRequestedTime
  );

  const casesForVentilatorsByRequestedTime = getCasesVentilatorsByTime(
    infectionsByRequestedTime
  );
  const severeCasesForVentilatorsByRequestedTime = getCasesVentilatorsByTime(
    severeInfectionByRequestedTime
  );

  const dollarsInFlight = getEconomicImpact(
    infectionsByRequestedTime,
    avgDailyIncomePopulation,
    avgDailyIncomeInUSD,
    days
  );
  const severeDollarsInFlight = getEconomicImpact(
    severeInfectionByRequestedTime,
    avgDailyIncomePopulation,
    avgDailyIncomeInUSD,
    days
  );

  const impact = {
    currentlyInfected,
    infectionsByRequestedTime,
    severeCasesByRequestedTime,
    hospitalBedsByRequestedTime,
    casesForICUByRequestedTime,
    casesForVentilatorsByRequestedTime,
    dollarsInFlight
  };

  const severeImpact = {
    currentlyInfected: severeCurrentlyInfected,
    infectionsByRequestedTime: severeInfectionByRequestedTime,
    severeCasesByRequestedTime: extremeSevereCasesByRequestedTime,
    hospitalBedsByRequestedTime: severeHospitalBedsByRequestedTime,
    casesForICUByRequestedTime: severeCasesForICUByRequestedTime,
    casesForVentilatorsByRequestedTime: severeCasesForVentilatorsByRequestedTime,
    dollarsInFlight: severeDollarsInFlight
  };

  return { data, impact, severeImpact };
};

export default covid19ImpactEstimator;
