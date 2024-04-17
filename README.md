Github Webhook Resource
===================================

[![Build Status](https://travis-ci.org/homedepot/github-webhook-resource.svg?branch=master)](https://travis-ci.org/homedepot/github-webhook-resource) [![Docker Pulls](https://img.shields.io/docker/pulls/homedepottech/github-webhook-resource.svg)](https://hub.docker.com/r/homedepottech/github-webhook-resource)

By default, Concourse will `check` your resources once per minute to see if they have updated. In order to reduce excessive `checks`, you must configure webhooks to trigger Concourse externally. This resource automatically configures your GitHub respoitories to send webhooks to your Concourse pipeline the instant a change happens.

Resource Type Configuration
---------------------------

```yaml
resource_types:
- name: github-webhook-resource
  type: docker-image
  source:
    repository: homedepottech/github-webhook-resource
    tag: latest
```
Source Configuration
--------------------

```yaml
resources:
- name: github-webhook
  type: github-webhook-resource
  source:
    github_api: https://github.example.com/api
    github_token: ((github-token))
```

- `github_api`: *Required.* The Github API URL for your repo.
- `github_token`: *Required.* [A Github token with the `admin:repo_hook` scope.](https://github.com/settings/tokens/new?scopes=admin:repo_hook) Additionally, the token's account must [be an administrator of your repo](https://help.github.com/en/articles/managing-an-individuals-access-to-an-organization-repository) to manage the repo's webhooks.

Behavior
--------

### `out`: Manipulate a Github webhook

Create or delete a webhook using the configured parameters.

#### Parameters

```yaml
- put: create-webhook
  resource: github-webhook
  params:
    org: github-org-name
    repo: github-repo-name
    resource_name: your-resource-name
    webhook_token: your-token
    operation: create
    events: [push, pull_request]
    pipeline: pipeline-name
    pipeline_instance_vars: {
        your_instance_var_name: value
    }
    payload_base_url: your-payload-base-url
    payload_content_type: json
    payload_secret: your-payload-secret
```

- `org`: *Required.* Your github organization.
- `repo`: *Required.* Your github repository.
- `resource_name`: *Required.* Name of the resource to be associated with your webhook.
- `webhook_token`: *Required.* Arbitrary string to identify your webhook. Must match the `webhook_token` property of the resource your webhook points to.
- `operation`: *Required.*
  - `create` to create a new webhook. Updates existing webhook if your configuration differs from remote.
  - `delete` to delete an existing webhook. Outputs current timestamp on non-existing webhooks.
- `events`: *Optional*. An array of [events](https://developer.github.com/webhooks/#events) which will trigger your webhook. Default: `push`
- `pipeline`: *Optional.* Defaults to the name of the pipeline executing the task
- `pipeline_instance_vars`: *Optional.* Instance vars to append to the webhook url. These help Concourse identify which [instance pipeline](https://concourse-ci.org/resources.html#schema.resource.webhook_token) it should invoke
- `payload_base_url`: *Optional.* The base URL to send the webhook payload to. Defaults to the external Concourse URL of the pipeline executing the task.
- `payload_content_type`: *Optional.* Default: `json`
  - `json` to serialize payloads to JSON.
  - `form` to serialize payloads to x-www-form-urlencoded.
- `payload_secret`: *Optional.* Secret that is used as the key to generate [delivery signature headers](https://docs.github.com/en/webhooks/webhook-events-and-payloads#delivery-headers), if the destination requires it for delivery validation.

## Example
Include the github-webhook-resource in your pipeline.yml file

```yaml
resource_types:
  - name: github-webhook-resource
    type: docker-image
    source:
      repository: homedepottech/github-webhook-resource
      tag: latest 
```

Now when you set your pipeline, you can optionally include instance variables that will be picked up by the resource. Here is a sample script that sets the pipeline for you. 

```bash
#!/bin/sh

fly -t {your team name} sp -c pipeline.yml -p {your pipeline name} --instance-var {you instance variables}


```

## Development

### Prerequisites
- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)

### Making changes
The Concourse entrypoints are in `bin/check`, `bin/in`, and `bin/out.js`. You can add functionality to these files directly, or you can `require` additional supporing files.

See the [Reference](#Reference) section for some helpful information related to this project's implementation.

### Running the tests
```shell
npm install
npm test
```
Before submitting your changes for review, ensure all tests are passing.

### Building your changes
```shell
docker build -t github-webhook-resource .
```

To use the newly built image, push it to a Docker repository which your Concourse pipeline can access and configure your pipeline to use it:

```shell
docker tag github-webhook-resource example.com/github-webhook-resource
docker push example.com/github-webhook-resource
```

```yaml
resource_types:
- name: github-webhook-resource
  type: docker-image
  source:
    repository: example.com/github-webhook-resource
    tag: latest

resources:
- name: github-webhook
  type: github-webhook-resource
  ...
```

### Contributing
Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file to learn the process for submitting changes to this repo.

## License
This project is licensed under [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0) - see the [LICENSE](LICENSE) file for details.

## Reference
- [Implementing a Concourse Resource](https://concourse-ci.org/implementing-resource-types.html)
- [What is a Webhook?](https://help.github.com/articles/about-webhooks/)
- [GitHub's Webhook REST API](https://developer.github.com/v3/repos/hooks/)
- [Concourse Community Resources](https://github.com/concourse/concourse/wiki/Resource-Types)
