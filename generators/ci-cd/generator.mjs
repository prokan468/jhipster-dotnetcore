import chalk from 'chalk';
import CiCdGenerator from 'generator-jhipster/esm/generators/ci-cd';
import {
  PRIORITY_PREFIX,
  PROMPTING_PRIORITY,
  CONFIGURING_PRIORITY,
  INITIALIZING_PRIORITY,
  WRITING_PRIORITY
} from 'generator-jhipster/esm/priorities';

export default class extends CiCdGenerator {
  constructor(args, opts, features) {
    super(args, opts, { taskPrefix: PRIORITY_PREFIX, ...features });

    if (this.options.help) return;

    if (!this.options.jhipsterContext) {
      throw new Error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprints TestFolder2')}`);
    }

  }

  get [PROMPTING_PRIORITY]() {
    return {
      async promptingCiChoices() {

        if (this.existingProject) return;
        if (this.ciType) return;

        const ciTypeChoices = [
          { value: 'gitlab', name: 'Gitlab CI', },
          { value: 'github', name: 'Github Action', },
        ];

        const answers = await this.prompt([
          {
            type: 'list',
            name: 'ciType',
            message: `What CI/CD pipeline do you want to generate ?`,
            choices: ciTypeChoices,
            default: 'github',
          },
        ]);
        this.ciType = this.blueprintConfig.ciType = answers.ciType;
      },
    };
  }

  get [INITIALIZING_PRIORITY]() {
    return {
      async initializingCiConfig() {
        this.ciType = this.blueprintConfig.ciType;
      },
    };
  }

  get [CONFIGURING_PRIORITY]() {
    return {};
  }

  get [WRITING_PRIORITY]() {
    return {
      async writingCiFiles() {
        await this.writeFiles({
          sections: {
            files: [{ templates: ['template-file-app'] }],
          },
          context: this,
        });
      },
    };
  }
}
