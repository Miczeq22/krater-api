/* eslint-disable @typescript-eslint/quotes */
import { UniqueEntityID } from '@root/framework/unique-entity-id';
import { AccountStatusValue } from '@root/modules/shared/core/account-status/account-status.value-object';
import { createMockProxy } from '@tools/mock-proxy';
import { VerificationCodeProviderService } from '../services/verification-code-provider.service';
import { Account } from './account.aggregate-root';
import { EmailVerificationCodeGeneratedEvent } from './events/email-verification-code-generated.event';

describe('[DOMAIN] Platform Access/Account', () => {
  const verificationCodeProviderService = createMockProxy<VerificationCodeProviderService>();

  beforeEach(() => {
    verificationCodeProviderService.mockClear();
  });

  test('should throw an error if account is already confirmed on activation code generation', () => {
    const account = Account.fromPersistence({
      activationCode: '1234',
      id: new UniqueEntityID().getValue(),
      status: AccountStatusValue.EmailConfirmed,
      verificationCodeProviderService,
    });

    expect(() => account.generateActivationCode()).toThrowError(
      "Can't confirm email address. Email is already confirmed.",
    );
  });

  test('should re-generate confirmation code', () => {
    verificationCodeProviderService.generateEmailVerificationCode.mockReturnValue('4321');

    const account = Account.fromPersistence({
      activationCode: '1234',
      id: new UniqueEntityID().getValue(),
      status: AccountStatusValue.WaitingForEmailConfirmation,
      verificationCodeProviderService,
    });

    expect(account.generateActivationCode()).toEqual('4321');
    expect(account.getActivationCode()).toEqual('4321');
    expect(
      account.getDomainEvents()[0] instanceof EmailVerificationCodeGeneratedEvent,
    ).toBeTruthy();
  });

  test('should throw an error if activation code is invalid on email confirmation', () => {
    const account = Account.fromPersistence({
      activationCode: '1234',
      id: new UniqueEntityID().getValue(),
      status: AccountStatusValue.WaitingForEmailConfirmation,
      verificationCodeProviderService,
    });

    expect(() => account.confirmEmailAddress('4321')).toThrowError(
      "Can't confirm email address. Provided activation code is invalid.",
    );
  });

  test('should throw an error if  email is already confirmed on email confirmation', () => {
    const account = Account.fromPersistence({
      activationCode: '1234',
      id: new UniqueEntityID().getValue(),
      status: AccountStatusValue.EmailConfirmed,
      verificationCodeProviderService,
    });

    expect(() => account.confirmEmailAddress('1234')).toThrowError(
      "Can't confirm email address. Email is already confirmed.",
    );
  });

  test('should confirm email address', () => {
    const account = Account.fromPersistence({
      activationCode: '1234',
      id: new UniqueEntityID().getValue(),
      status: AccountStatusValue.WaitingForEmailConfirmation,
      verificationCodeProviderService,
    });

    account.confirmEmailAddress('1234');

    expect(account.getStatus()).toEqual(AccountStatusValue.EmailConfirmed);
  });
});
