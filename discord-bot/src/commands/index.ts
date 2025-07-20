import { Command } from '../core/models/command.model';

import * as help from './help/help.command';
import * as links from './links/links.command';

export const commands: Record<string, Command> = {
  help,
  links,
};
