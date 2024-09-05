import { expect, test } from "vitest";
import { CPF } from "./cpf";

test("it should be able to check a cpf", () => {
  const cpf = CPF.create("401.238.038-96");

  expect(cpf.value).toEqual("40123803896");
});
