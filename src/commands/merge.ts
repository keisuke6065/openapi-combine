import {Command, Flags} from '@oclif/core'
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
    input: Flags.string(
      {
        char: 'i',
        description: 'input target yaml file',
        required: true,
      },
    ),
    output: Flags.string(
      {
        char: 'o',
        description: 'output target yaml file',
        default: './output/openapi.yaml',
      },
    ),
    type: Flags.string(
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
    const {flags} = await this.parse(Merge)
    await mergeExecutor(<string>flags.input, <string>flags.output, <OutputType>flags.type)
    cli.action.stop('Done');
  }
}
