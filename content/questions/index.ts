import core from "./core.json";
import pace from "./pace.json";
import clientCare from "./client-care.json";
import vulnerability from "./vulnerability.json";
import disclosure from "./disclosure.json";
import interview from "./interview.json";
import evidence from "./evidence.json";
import bail from "./bail.json";
import portfolio from "./portfolio.json";

export const questions = [
  ...(core.questions ?? []),
  ...(pace.questions ?? []),
  ...(clientCare.questions ?? []),
  ...(vulnerability.questions ?? []),
  ...(disclosure.questions ?? []),
  ...(interview.questions ?? []),
  ...(evidence.questions ?? []),
  ...(bail.questions ?? []),
  ...(portfolio.questions ?? []),
];

const questionsModule = { questions };
export default questionsModule;

