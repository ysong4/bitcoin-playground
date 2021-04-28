import { registerDecorator, ValidationOptions } from 'class-validator';
import { HARDENED_OFFSET } from '../constants';

export function IsValidPath(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isValidPath',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          // value: HD path
          try {
            const arr = value.toLowerCase().split('/');
            arr.forEach((val, index) => {
              if (index === 0) {
                if (val !== 'm' && val !== "m'") {
                  throw Error("Path should start with m or m'");
                }
                return;
              }

              if (val.length > 0 && val[val.length - 1] === "'") {
                val = val.slice(0, -1);
              }
              const childIndex = parseInt(val, 10);
              if (Number(val) === NaN) {
                throw Error('ChildIndex is not a number');
              }
              if (Number(val) !== childIndex) {
                throw Error('ChildIndex is not an integer');
              }
              if (childIndex >= HARDENED_OFFSET || childIndex < 0) {
                throw Error(
                  `ChildIndex should be in range [0, ${HARDENED_OFFSET})`,
                );
              }
            });

            return true;
          } catch (err) {
            return false;
          }
        },
      },
    });
  };
}
