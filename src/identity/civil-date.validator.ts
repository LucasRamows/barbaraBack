import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export interface CivilDateOptions {
  allowFuture?: boolean;
}

export function isValidCivilDate(
  value: unknown,
  options: CivilDateOptions = {},
): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return false;
  }
  if (options.allowFuture === false) {
    const now = new Date();
    const today = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
    );
    return date.getTime() <= today;
  }
  return true;
}

export function IsCivilDate(
  options: CivilDateOptions = {},
  validationOptions?: ValidationOptions,
) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isCivilDate',
      target: object.constructor,
      propertyName,
      constraints: [options],
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          return isValidCivilDate(value, options);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} deve ser uma data civil válida no formato yyyy-MM-dd.`;
        },
      },
    });
  };
}
