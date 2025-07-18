import { Command } from '../core/models/command.model';
import * as links from './links.command';

export const commands: Record<string, Command> = {
  links,
};
