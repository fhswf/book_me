module.exports = {
    //"extends": "semantic-release-monorepo",
    "plugins": [
        "@semantic-release/commit-analyzer",
        "@semantic-release/release-notes-generator",
        "@semantic-release/changelog",
        "@semantic-release/git"
    ],
    "preset": "angular"
}