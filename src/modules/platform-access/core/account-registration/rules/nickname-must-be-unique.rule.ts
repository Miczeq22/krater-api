import { BusinessRule } from '@root/framework/ddd-building-blocks/business-rule';
import { NicknameUniqueCheckerService } from '../../services/nickname-unique-checker.service';

export class NicknameMustBeUniqueRule extends BusinessRule {
  message = 'Provided nickname is already taken. Please use different one.';

  constructor(
    private readonly nickname: string,
    private readonly nicknameUniqueCheckerService: NicknameUniqueCheckerService,
  ) {
    super();
  }

  public async isBroken() {
    return !(await this.nicknameUniqueCheckerService.isUnique(this.nickname));
  }
}
