import { hash } from 'bcrypt';
import { randomFill } from 'crypto';
import {
  RANDOM_TOKEN_SIZE,
  SALT_ROUNDS,
  TOKEN_EXPIRATION_MS,
} from '../../constants';

export interface RandomToken {
  raw: string;
  encrypted: string;
  expires: number;
}

export const randomToken = (size: number = RANDOM_TOKEN_SIZE) =>
  new Promise<RandomToken>((resolve, reject) => {
    const buffer = Buffer.alloc(size);
    randomFill(buffer, (err, buff) => {
      if (err) {
        reject(err);
      } else {
        const raw = buff.toString('hex');
        hash(raw, SALT_ROUNDS)
          .then((encrypted) =>
            resolve({
              raw,
              encrypted,
              expires: new Date().valueOf() + TOKEN_EXPIRATION_MS,
            }),
          )
          .catch((error) => reject(error));
      }
    });
  });
