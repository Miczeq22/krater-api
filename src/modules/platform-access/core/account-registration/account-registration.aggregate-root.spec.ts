import { AccountEmailCheckerService } from '@root/modules/shared/core/account-email/account-email-checker.service';
import { PasswordHashProviderService } from '@root/modules/shared/core/account-password/password-hash-provider.service';
import { AccountStatus } from '@root/modules/shared/core/account-status/account-status.value-object';
import { createMockProxy } from '@tools/mock-proxy';
import { AccountRegistration } from './account-registration.aggregate-root';
import { NewAccountRegisteredEvent } from './events/new-account-registered.event';

describe('[DOMAIN] Platform Access/Account Registration', () => {
  const accountEmailCheckerService = createMockProxy<AccountEmailCheckerService>();
  const passwordHashProviderService = createMockProxy<PasswordHashProviderService>();

  beforeEach(() => {
    accountEmailCheckerService.mockClear();
    passwordHashProviderService.mockClear();
  });

  test('should throw an error if email have invalid format', async () => {
    await expect(() =>
      AccountRegistration.registerNew({
        email: 'invalid-email',
        password: '#password',
        accountEmailCheckerService,
        passwordHashProviderService,
        nickname: '#name',
      }),
    ).rejects.toThrowError('Provided email format is not valid.');
  });

  test('should throw an error if email is not unique', async () => {
    accountEmailCheckerService.isUnique.mockResolvedValue(false);

    await expect(() =>
      AccountRegistration.registerNew({
        email: 'john@gmail.com',
        password: '#password',
        accountEmailCheckerService,
        passwordHashProviderService,
        nickname: '#name',
      }),
    ).rejects.toThrowError('Provided email address is already in use.');
  });

  test('should throw an error if email domain is invalid', async () => {
    accountEmailCheckerService.isUnique.mockResolvedValue(true);

    await expect(() =>
      AccountRegistration.registerNew({
        email: 'john@doe.com',
        password: '#password',
        accountEmailCheckerService,
        passwordHashProviderService,
        nickname: '#name',
      }),
    ).rejects.toThrowError(
      'Provided email domain is not supported. Please use supported domain: gmail.com',
    );
  });

  test('should throw an error if password is not strong enough and requires digit', async () => {
    accountEmailCheckerService.isUnique.mockResolvedValue(true);

    await expect(() =>
      AccountRegistration.registerNew({
        email: 'john@gmail.com',
        password: 'invalid-password',
        accountEmailCheckerService,
        passwordHashProviderService,
        nickname: '#name',
      }),
    ).rejects.toThrowError(
      'Provided password is not strong enough. Provide password with minimum one digit.',
    );
  });

  test('should throw an error if password requires min 6 characters', async () => {
    accountEmailCheckerService.isUnique.mockResolvedValue(true);

    await expect(() =>
      AccountRegistration.registerNew({
        email: 'john@gmail.com',
        password: 'bad',
        accountEmailCheckerService,
        passwordHashProviderService,
        nickname: '#name',
      }),
    ).rejects.toThrowError(
      'Provided password is not strong enough. Provide at least 6 characters.',
    );
  });

  test('should throw an error if password has more than 50 characters', async () => {
    accountEmailCheckerService.isUnique.mockResolvedValue(true);

    await expect(() =>
      AccountRegistration.registerNew({
        email: 'john@gmail.com',
        password: Array(51).fill('1').join(''),
        accountEmailCheckerService,
        passwordHashProviderService,
        nickname: '#name',
      }),
    ).rejects.toThrowError(
      'Provided password is not strong enough. Password can contain max of 50 characters.',
    );
  });

  test('should register new account and dispatch domain event', async () => {
    accountEmailCheckerService.isUnique.mockResolvedValue(true);

    const account = await AccountRegistration.registerNew({
      email: 'john@gmail.com',
      password: 'test123',
      accountEmailCheckerService,
      passwordHashProviderService,
      nickname: '#name',
    });

    expect(account.getDomainEvents()[0] instanceof NewAccountRegisteredEvent).toBeTruthy();
    expect(
      account.getStatus() === AccountStatus.WaitingForEmailConfirmation.getValue(),
    ).toBeTruthy();
  });

  test('should thrown an error if account status is not supported', async () => {
    accountEmailCheckerService.isUnique.mockResolvedValue(true);

    expect(() =>
      AccountRegistration.fromPersistence({
        id: '#id',
        email: 'john@gmail.com',
        email_confirmation_date: null,
        password: 'test123',
        registration_date: new Date().toISOString(),
        status: 'NotSupported',
        nickname: '#name',
      }),
    ).toThrowError('Provided Account Status is not supported.');
  });
});
