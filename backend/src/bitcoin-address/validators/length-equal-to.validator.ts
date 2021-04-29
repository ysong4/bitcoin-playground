import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function LengthEqualTo(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'lengthEqualTo',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          // value: publicKeys, string[]
          // relatedValue: m, number
          return (
            Array.isArray(value) &&
            typeof relatedValue === 'number' &&
            value.length === relatedValue
          );
        },
      },
    });
  };
}
