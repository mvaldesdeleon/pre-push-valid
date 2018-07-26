#!/usr/bin/env node

const semver = require('semver');
const toString = require('stream-to-string');

const toLines = text => text.split('\n');

const validBranchNameSegment = /^[a-z0-9-]+$/;

const isValidBranchNameSegment = nameSegment => validBranchNameSegment
    .test(nameSegment);

const isTruthy = error => error;

const toError = line => {
    const upstreamRef = line.split(' ')[2];
    const refSections = upstreamRef.split('/');
    const refType = refSections[1];

    if (refType === 'heads') {
        const branchType = refSections[2];

        if (branchType === 'master' || branchType === 'develop') {
            if (refSections.length > 3) {
                return `${upstreamRef}: ${branchType} cannot be a prefix`;
            }
        } else if (branchType === 'release' || branchType === 'feature' || branchType === 'hotfix') {
            if (refSections.length < 4) {
                return `${upstreamRef}: ${branchType} must be a prefix`;
            }

            const branchNameSegments = refSections.slice(3);

            if (!branchNameSegments.every(isValidBranchNameSegment)) {
                return `${upstreamRef}: ${refSections.slice(2).join('/')} is not a valid branch name. use only lowercase letters, numbers or hyphens.`;
            }
        } else {
            return `${upstreamRef}: non-gitflow branch`;
        }
    } else if (refType === 'tags') {
        const tag = refSections[2];
        const valid = semver.valid(tag);

        if (!valid || valid !== tag) {
            return `${upstreamRef}: non-semver tag`;
        }
    } else {
        return `${upstreamRef}: invalid refType`;
    }
};

process.stdin.setEncoding('utf8');

toString(process.stdin)
    .then(stdin => {
        return toLines(stdin).filter(isTruthy).map(toError).filter(isTruthy);
    })
    .then(errors => {
        if (errors.length) {
            console.error('pre-push-valid failed for the following refs'); // eslint-disable-line no-console
            errors.forEach(error => {
                console.error(error); // eslint-disable-line no-console
            });
            process.exit(1);
        } else {
            process.exit(0);
        }
    });
