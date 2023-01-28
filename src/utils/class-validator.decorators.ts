import { applyDecorators } from '@nestjs/common';
import {
  Transform,
  Type,
  plainToInstance,
  instanceToPlain,
} from 'class-transformer';

import {
  IsArray,
  IsDefined,
  ValidateIf,
  ValidateNested,
  ValidationOptions,
} from 'class-validator';

export function IsNullable(validationOptions?: ValidationOptions) {
  return ValidateIf((_object, value) => value !== null, validationOptions);
}
import {} from 'class-transformer';

export const DB_GROUP = 'db_group';
export const transformValueOfBoolean = (args: any) => {
  if (args.value === null) {
    return null;
  }
  const value = args.value;
  if (typeof value === 'number') {
    return !!value;
  }

  if (typeof value === 'string') {
    if (value === 'base64:type16:AA==') {
      return false;
    }
    if (value === 'base64:type16:AQ==') {
      return true;
    }

    if (value === 'false') {
      return false;
    }

    if (value === 'true') {
      return true;
    }
  }

  if (Buffer.isBuffer(value)) {
    return Boolean(Number(value.readUintLE(0, value.length).toString()));
  }

  return value as boolean;
};

export const TransformValueOfBoolean = (strict = true) => {
  const extra = [];
  if (strict) {
    extra.push(
      Transform((args) => Number(args.value), {
        toPlainOnly: true,
        groups: [DB_GROUP],
      }),
    );
  }
  return applyDecorators(
    Transform((args) => {
      const value = args.value;
      if (typeof value === 'number') {
        return !!value;
      }

      if (typeof value === 'string') {
        if (value === 'base64:type16:AA==') {
          return false;
        }
        if (value === 'base64:type16:AQ==') {
          return true;
        }

        if (value === 'false') {
          return false;
        }

        if (value === 'true') {
          return true;
        }
      }

      if (Buffer.isBuffer(value)) {
        return Boolean(Number(value.readUintLE(0, value.length).toString()));
      }

      return value as boolean;
    }),
    ...extra,
  );
};

export function IsNestedObject(
  type: any,
  options: { each: boolean } = { each: false },
  strict = true,
) {
  const extra = [];
  if (options.each) {
    extra.push(IsArray());
  }
  if (strict) {
    extra.push(
      Transform(
        (args) =>
          args.value
            ? args.value.length
              ? instanceToPlain(args.value, { groups: [DB_GROUP] })
              : `${args.value.id.toString()}`
            : args.value,
        {
          toPlainOnly: true,
          groups: [DB_GROUP],
        },
      ),
    );
  }
  return applyDecorators(
    Transform(
      (args) => {
        if (typeof args.value === 'string') {
          args.value = JSON.parse(args.value);
        }
        return args.value && args.value.id === null
          ? null
          : plainToInstance(type, args.value);
      },
      { toClassOnly: true },
    ),
    ValidateNested(options),
    Type(() => type),
    IsDefined(),
    ...extra,
  );
}
