import { basename } from "node:path";

const packageName = basename(process.cwd());

export default {
  commitAndTagVersion: {
    releaseAs: "patch",
    releaseCount: 0,
    tagPrefix: `${packageName}@v`,
    npmPublishHint: `npm publish --access public --workspace ${packageName}`,
    releaseCommitMessageFormat: `chore(release): ${packageName}@{{currentTag}}`,
  },
};
