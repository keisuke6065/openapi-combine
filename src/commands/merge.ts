import {Command, flags} from '@oclif/command'
import {mergeExecutor} from "../executor/mergeExecutor";
import {cli} from "cli-ux";

export type OutputType = 'yaml' | 'json';


export default class Merge extends Command {
  static description = 'describe the command here'

  static examples = [
    `$ openapi-combine merge -i ./example/openapi.yaml -o ./build/openapi.yaml
`,
  ]

  static flags = {
    input: flags.string(
      {
        char: 'i',
        description: 'input target yaml file',
        required: true,
      },
    ),
    output: flags.string(
      {
        char: 'o',
        description: 'output target yaml file',
        default: './output/openapi.yaml',
      },
    ),
    type: flags.enum<OutputType>(
      {
        options: ['yaml', 'json'],
        char: 't',
        description: 'output format yaml or json',
        default: 'yaml',
      },
    ),
  }

  async run(): Promise<void> {
    cli.action.start('Starting');
    const {flags} = this.parse(Merge)
    await mergeExecutor(flags.input, flags.output, flags.type)
    cli.action.stop('Done');
  }
}
