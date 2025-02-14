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

import { CreateDeploymentResponse, DeploymentState } from '../types';
import { GITHUB_OPTIONS } from '../constants';
import { context } from '@actions/github';
import { octokit } from '../octokit';

interface InitiateDeployment {
  sha: string;
  environment: string;
  state?: DeploymentState;
  environment_url?: string;
  description?: string;
  target_url?: string;
}

export const initiateDeployment = ({
  sha,
  state = 'in_progress',
  environment,
  environment_url,
  description,
  target_url
}: InitiateDeployment) =>
  octokit.repos
    .createDeployment({
      ref: sha,
      environment,
      required_contexts: [],
      ...context.repo,
      ...GITHUB_OPTIONS
    })
    .then(newDeploymentResponse => {
      const deployment_id = (newDeploymentResponse.data as CreateDeploymentResponse).id;
      return octokit.repos.createDeploymentStatus({
        state,
        deployment_id,
        description,
        environment_url,
        target_url,
        ...context.repo,
        ...GITHUB_OPTIONS
      });
    });
