/*
Copyright 2021 Expedia, Inc.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    https://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { Mocktokit } from '../types';
import { filterPaths } from '../../src/helpers/filter-paths';
import { octokit } from '../../src/octokit';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' } },
  getOctokit: jest.fn(() => ({ rest: { pulls: { listFiles: jest.fn() } } }))
}));

describe('filterPaths', () => {
  const paths = 'file/path/1\nfile/path/2';
  const globs = '**/*.md\nsomething/**/file1.txt';
  const pull_number = '123';

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return true if one of the file paths match the file paths that octokit returns', async () => {
    (octokit.pulls.listFiles as unknown as Mocktokit).mockImplementation(async () => ({
      data: [
        {
          sha: 'bbcd538c8e72b8c175046e27cc8f907076331401',
          filename: 'file/path/1/file1.txt',
          status: 'added',
          additions: 103,
          deletions: 21,
          changes: 124,
          blob_url: 'https://github.com/octocat/Hello-World/blob/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
          raw_url: 'https://github.com/octocat/Hello-World/raw/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
          contents_url: 'https://api.github.com/repos/octocat/Hello-World/contents/file1.txt?ref=6dcb09b5b57875f334f61aebed695e2e4193db5e',
          patch: '@@ -132,7 +132,7 @@ module Test @@ -1000,7 +1000,7 @@ module Test'
        },
        {
          sha: 'bbcd538c8e72b8c175046e27cc8f907076331401',
          filename: 'something/totally/different/file1.txt',
          status: 'added',
          additions: 103,
          deletions: 21,
          changes: 124,
          blob_url: 'https://github.com/octocat/Hello-World/blob/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
          raw_url: 'https://github.com/octocat/Hello-World/raw/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
          contents_url: 'https://api.github.com/repos/octocat/Hello-World/contents/file1.txt?ref=6dcb09b5b57875f334f61aebed695e2e4193db5e',
          patch: '@@ -132,7 +132,7 @@ module Test @@ -1000,7 +1000,7 @@ module Test'
        }
      ]
    }));
    const result = await filterPaths({
      paths,
      pull_number
    });

    expect(result).toBe(true);
  });

  it('should return false if none of the file paths match the file paths that octokit returns', async () => {
    (octokit.pulls.listFiles as unknown as Mocktokit).mockImplementation(async () => ({
      data: [
        {
          sha: 'bbcd538c8e72b8c175046e27cc8f907076331401',
          filename: 'file/bogus/1/file1.txt',
          status: 'added',
          additions: 103,
          deletions: 21,
          changes: 124,
          blob_url: 'https://github.com/octocat/Hello-World/blob/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
          raw_url: 'https://github.com/octocat/Hello-World/raw/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
          contents_url: 'https://api.github.com/repos/octocat/Hello-World/contents/file1.txt?ref=6dcb09b5b57875f334f61aebed695e2e4193db5e',
          patch: '@@ -132,7 +132,7 @@ module Test @@ -1000,7 +1000,7 @@ module Test'
        },
        {
          sha: 'bbcd538c8e72b8c175046e27cc8f907076331401',
          filename: 'something/totally/different/file1.txt',
          status: 'added',
          additions: 103,
          deletions: 21,
          changes: 124,
          blob_url: 'https://github.com/octocat/Hello-World/blob/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
          raw_url: 'https://github.com/octocat/Hello-World/raw/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
          contents_url: 'https://api.github.com/repos/octocat/Hello-World/contents/file1.txt?ref=6dcb09b5b57875f334f61aebed695e2e4193db5e',
          patch: '@@ -132,7 +132,7 @@ module Test @@ -1000,7 +1000,7 @@ module Test'
        }
      ]
    }));
    const result = await filterPaths({
      paths,
      pull_number
    });

    expect(result).toBe(false);
  });

  it('should return true if one of the globs match the file paths that octokit returns', async () => {
    (octokit.pulls.listFiles as unknown as Mocktokit).mockImplementation(async () => ({
      data: [
        {
          sha: 'bbcd538c8e72b8c175046e27cc8f907076331401',
          filename: 'file/bogus/1/file1.txt',
          status: 'added',
          additions: 103,
          deletions: 21,
          changes: 124,
          blob_url: 'https://github.com/octocat/Hello-World/blob/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
          raw_url: 'https://github.com/octocat/Hello-World/raw/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
          contents_url: 'https://api.github.com/repos/octocat/Hello-World/contents/file1.txt?ref=6dcb09b5b57875f334f61aebed695e2e4193db5e',
          patch: '@@ -132,7 +132,7 @@ module Test @@ -1000,7 +1000,7 @@ module Test'
        },
        {
          sha: 'bbcd538c8e72b8c175046e27cc8f907076331401',
          filename: 'something/totally/different/file1.txt',
          status: 'added',
          additions: 103,
          deletions: 21,
          changes: 124,
          blob_url: 'https://github.com/octocat/Hello-World/blob/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
          raw_url: 'https://github.com/octocat/Hello-World/raw/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
          contents_url: 'https://api.github.com/repos/octocat/Hello-World/contents/file1.txt?ref=6dcb09b5b57875f334f61aebed695e2e4193db5e',
          patch: '@@ -132,7 +132,7 @@ module Test @@ -1000,7 +1000,7 @@ module Test'
        }
      ]
    }));
    const result = await filterPaths({
      globs,
      pull_number
    });

    expect(result).toBe(true);
  });

  it('should return false when data is an empty array', async () => {
    const exactFilePath = 'exact/file/path';
    (octokit.pulls.listFiles as unknown as Mocktokit).mockImplementation(async () => ({
      data: []
    }));
    const result = await filterPaths({
      paths: exactFilePath,
      globs,
      pull_number
    });

    expect(result).toBe(false);
  });

  it('exact file path case', async () => {
    const exactFilePath = 'exact/file/path';
    (octokit.pulls.listFiles as unknown as Mocktokit).mockImplementation(async () => ({
      data: [
        {
          sha: 'bbcd538c8e72b8c175046e27cc8f907076331401',
          filename: exactFilePath,
          status: 'added',
          additions: 103,
          deletionsfalse: 124,
          blob_url: 'https://github.com/octocat/Hello-World/blob/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
          raw_url: 'https://github.com/octocat/Hello-World/raw/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
          contents_url: 'https://api.github.com/repos/octocat/Hello-World/contents/file1.txt?ref=6dcb09b5b57875f334f61aebed695e2e4193db5e',
          patch: '@@ -132,7 +132,7 @@ module Test @@ -1000,7 +1000,7 @@ module Test'
        },
        {
          sha: 'bbcd538c8e72b8c175046e27cc8f907076331401',
          filename: 'something/totally/different/file1.txt',
          status: 'added',
          additions: 103,
          deletions: 21,
          changes: 124,
          blob_url: 'https://github.com/octocat/Hello-World/blob/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
          raw_url: 'https://github.com/octocat/Hello-World/raw/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt',
          contents_url: 'https://api.github.com/repos/octocat/Hello-World/contents/file1.txt?ref=6dcb09b5b57875f334f61aebed695e2e4193db5e',
          patch: '@@ -132,7 +132,7 @@ module Test @@ -1000,7 +1000,7 @@ module Test'
        }
      ]
    }));
    const result = await filterPaths({
      paths: exactFilePath,
      pull_number
    });

    expect(result).toBe(true);
  });
});
