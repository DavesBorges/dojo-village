import {
  ClassConstructor,
  ClassTransformOptions,
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';
import { ValidatorOptions, validateOrReject } from 'class-validator';

/**
 * The default Validaton Options
 */
export const defaultValidationOptions: ValidatorOptions = {
  stopAtFirstError: true,
  whitelist: true,
  forbidNonWhitelisted: true, // If appears any value that is not declared, throw an error
  validationError: { target: false },
};

/**
 * This function will validate if the plain object type matches the type definition
 * in the class and then convert back to another object and check if that object strictly
 * matche3s the param passed in plain
 * @param cls the class with the class validator definitions
 * @param plain a plain object value
 * @param validatorOptions  defaults to the **defaultValidationOptions**
 * @param options the transform option
 */
export const validateOrRejectAssureLayout = async <T extends object, V>(
  cls: ClassConstructor<T>,
  plain: V | V[],
  validatorOptions: ValidatorOptions = defaultValidationOptions,
  options?: ClassTransformOptions,
) => {
  const instance = plainToInstance(cls, plain, options);
  await validateOrReject(instance, validatorOptions);

  // convert back to the plain object and validate again
  // this so that we ensure that the plain json really matches the type defined by cls
  const plainConvertedFromInstance = instanceToPlain(instance);

  expect(plain).toStrictEqual(plainConvertedFromInstance);
};
