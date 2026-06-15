import { IsInt, Min, IsArray } from 'class-validator';

export class UpdateAllocationsDto {
  @IsInt({each: true, message: "Identyfikatory powinny być liczbą."})
  @Min(1, {each: true, message: "Identyfikatory powinny być większe od 0."})
  @IsArray()
  workstationIds!: bigint[];
}
