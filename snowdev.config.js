import { basename } from "node:path";

const packageName = basename(process.cwd());

export default {
  commitAndTagVersion: {
    tagPrefix: `${packageName}@v`,
    npmPublishHint: `npm publish --workspace ${packageName}`,
    releaseCommitMessageFormat: `chore(release): ${packageName}@{{currentTag}}`,
  },
};
