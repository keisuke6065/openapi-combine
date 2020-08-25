import {Command, flags} from '@oclif/command'
import {mergeExecutor} from "../executor/mergeExecutor";
import {cli} from "cli-ux";

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
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async run() {
    cli.action.start('starting');
    const {flags} = this.parse(Merge)
    await mergeExecutor(flags.input, flags.output)
    cli.action.stop('done');
  }
}
