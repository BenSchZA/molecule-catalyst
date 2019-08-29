import { IsString, IsNumber } from 'class-validator';

export class LaunchProjectDTO {
  @IsNumber()
  block: number;
  @IsNumber()
  index: number;
  @IsString()
  marketAddress: string;
  @IsString()
  vaultAddress: string;
  @IsString()
  creatorAddress: string;
}
