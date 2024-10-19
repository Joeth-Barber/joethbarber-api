import { Module } from "@nestjs/common";
import { JwtEncrypter } from "./jwt-encrypter";
import { BcryptHasher } from "./bcrypt-hasher";
import { Encrypter } from "@/domain/barbershop/application/cryptography/encrypter";
import { HashComparer } from "@/domain/barbershop/application/cryptography/hash-comparer";
import { HashGenerator } from "@/domain/barbershop/application/cryptography/hash-generator";

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
    {
      provide: HashComparer,
      useClass: BcryptHasher,
    },
    {
      provide: HashGenerator,
      useClass: BcryptHasher,
    },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}
