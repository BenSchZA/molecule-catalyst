import { IsString, IsEmail, MinLength, IsInstance, IsArray } from 'class-validator';
import { isArray } from 'util';

class ProjectAboutDTO {
  title: string;
  abstract: string;
  featuredImage: string;
  context: string;
  approach: string;
  @IsArray()
  collaborators: Collaborator[]
}

export class CreateProjectDTO {
  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  @IsEmail()
  readonly email: string;

  @MinLength(5)
  readonly password: string;
}


interface ProjectAbout {
  title: string,
  abstract: string,
  featuredImage: string,
}

interface Collaborator {
  fullName: string,
  professionalTitle: string,
  affiliatedOrganisation: string
}

interface ProjectBackground {
  context: string,
  approach: string,
  collaborators: Collaborator[]
}

interface ResearchPhase {
  title: string,
  description: string,
  result: string,
  fundingGoal: number,
  duration: number
}

interface ProjectCampaign {
  title: string,
  description: string,
  researchPhases: ResearchPhase[]
}
