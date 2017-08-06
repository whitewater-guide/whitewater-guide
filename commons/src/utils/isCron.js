"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("class-validator");
const cronParser = require("cron-parser");
function isCron(validationOptions) {
    return (object, propertyName) => {
        class_validator_1.registerDecorator({
            name: 'isCron',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    if (typeof value !== 'string') {
                        return false;
                    }
                    try {
                        cronParser.parseExpression(value);
                        return true;
                    }
                    catch (e) {
                        return false;
                    }
                },
                defaultMessage(args) {
                    return `${args.property} must be valid crontab expression`;
                },
            },
        });
    };
}
exports.isCron = isCron;
//# sourceMappingURL=isCron.js.map