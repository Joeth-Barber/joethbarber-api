import { expect, test } from "vitest";
import { CPF } from "./cpf";

test("it should be able to check a cpf", () => {
  const cpf = CPF.create("111.111.111-11");

  expect(cpf.value).toEqual("11111111111");
});
