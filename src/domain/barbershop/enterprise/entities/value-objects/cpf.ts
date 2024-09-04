export class CPF {
  public value: string;

  private constructor(value: string) {
    this.value = value;
  }

  /**
   * Cria uma nova instância de CPF após a validação e normalização.
   *
   * @param value {string}
   */
  static create(value: string) {
    const cpf = CPF.normalize(value);

    if (!CPF.isValid(cpf)) {
      throw new Error("Invalid CPF");
    }

    return new CPF(cpf);
  }

  /**
   * Normaliza uma string removendo espaços, caracteres especiais e mantendo apenas números.
   *
   * @param value {string}
   * @returns {string}
   */
  private static normalize(value: string): string {
    return value.replace(/[\s\-_\.]/g, "").replace(/\D/g, "");
  }

  /**
   * Verifica se o CPF tem 11 dígitos.
   *
   * @param cpf {string}
   * @returns {boolean}
   */
  private static isValid(cpf: string): boolean {
    return cpf.length === 11;
  }
}
