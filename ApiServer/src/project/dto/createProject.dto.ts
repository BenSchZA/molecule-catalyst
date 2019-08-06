import { IsString, IsArray } from 'class-validator';

export class SubmitProjectDTO {
  @IsString()
  title: string;
  @IsString()
  abstract: string;
  // featuredImage: string;
  @IsString()
  context: string;
  @IsString()
  approach: string;
  @IsArray()
  collaborators: Array<Collaborator>;
  @IsString()
  campaignTitle: string;
  @IsString()
  campaignDescription: string;
  @IsArray()
  researchPhases: Array<ResearchPhase>;
}

interface Collaborator {
  fullName: string,
  professionalTitle: string,
  affiliatedOrganisation: string
}

interface ResearchPhase {
  title: string,
  description: string,
  result: string,
  fundingGoal: number,
  duration: number
}
