import { releaseVersion, releaseChangelog, releasePublish } from 'nx/release';
import * as yargs from 'yargs';

(async function () {
  const options = await yargs
    .version(false)
    .option('version', {
      type: 'string',
      description: 'The explicit version given',
    })
    .option('dryRun', {
      alias: 'd',
      type: 'boolean',
      description: 'weather or not to perform a dry-run of the release process',
      default: true,
    })
    .option('verbose', {
      type: 'boolean',
      description: 'weather or not to enable verbose logging',
      default: false,
    })
    .parseAsync();

  const { workspaceVersion, projectsVersionData } = await releaseVersion({
    dryRun: options.dryRun,
    verbose: options.verbose,
    specifier: options.version,
  });
  await releaseChangelog({
    versionData: projectsVersionData,
    version: workspaceVersion,
    dryRun: options.dryRun,
    verbose: options.verbose,
  });

  // The returned number value from releasePublish will be zero if all projects are published successfully, non-zero if not
  const publishStatus = await releasePublish({
    dryRun: options.dryRun,
    verbose: options.verbose,
  });
  process.exit(publishStatus as unknown as number);
})();
