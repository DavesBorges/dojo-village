import { applyDecorators } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import { ValidateIf, ValidateNested, ValidationOptions } from 'class-validator';

export function IsNullable(validationOptions?: ValidationOptions) {
  return ValidateIf((_object, value) => value !== null, validationOptions);
}
export function IsNestedObject(type: any) {
  return applyDecorators(
    Transform((args) => {
      if (typeof args.value === 'string') {
        args.value = JSON.parse(args.value);
      }
      return args.value && args.value.id === null ? null : args.value;
    }),
    ValidateNested(),
    Type(() => type),
  );
}
