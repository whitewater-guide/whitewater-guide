export class IAPError extends Error {
  public description?: string;
  public options?: Record<string, string | undefined>;

  constructor(
    i18nKey: string,
    description?: string,
    options?: Record<string, string | undefined>,
  ) {
    super(i18nKey);
    this.description = description;
    this.options = options;
  }
}
