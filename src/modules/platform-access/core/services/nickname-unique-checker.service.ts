export interface NicknameUniqueCheckerService {
  isUnique(nickname: string): Promise<boolean>;
}
