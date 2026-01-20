import core from "./core.json";
import pace from "./pace.json";
import paceExtended from "./pace-extended.json";
import clientCare from "./client-care.json";
import clientCareExtended from "./client-care-extended.json";
import vulnerability from "./vulnerability.json";
import vulnerabilityExtended from "./vulnerability-extended.json";
import disclosure from "./disclosure.json";
import disclosureExtended from "./disclosure-extended.json";
import interview from "./interview.json";
import interviewExtended from "./interview-extended.json";
import evidence from "./evidence.json";
import evidenceExtended from "./evidence-extended.json";
import bail from "./bail.json";
import bailExtended from "./bail-extended.json";
import portfolio from "./portfolio.json";
import portfolioExtended from "./portfolio-extended.json";

export const questions = [
  ...(core.questions ?? []),
  ...(pace.questions ?? []),
  ...(paceExtended.questions ?? []),
  ...(clientCare.questions ?? []),
  ...(clientCareExtended.questions ?? []),
  ...(vulnerability.questions ?? []),
  ...(vulnerabilityExtended.questions ?? []),
  ...(disclosure.questions ?? []),
  ...(disclosureExtended.questions ?? []),
  ...(interview.questions ?? []),
  ...(interviewExtended.questions ?? []),
  ...(evidence.questions ?? []),
  ...(evidenceExtended.questions ?? []),
  ...(bail.questions ?? []),
  ...(bailExtended.questions ?? []),
  ...(portfolio.questions ?? []),
  ...(portfolioExtended.questions ?? []),
];

const questionsModule = { questions };
export default questionsModule;

