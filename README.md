Github Webhook Resource
===================================

By default, Concourse will clone your `git` resources once per minute to see if they have updated. In order to reduce excessive clones, you must configure webhooks to trigger Concourse externally. This resource automatically configures your GitHub respoitories to send webhooks to your Concourse pipeline the instant a change happens.

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

-	`github_api`: *Required.* The Github API URL for your repo.
-   `github_token`: *Required.* [A Github token with the `admin:repo_hook` scope.](https://github.com/settings/tokens/new?scopes=admin:repo_hook) Additionally, the token's account must [be an administrator of your repo](https://help.github.com/en/articles/managing-an-individuals-access-to-an-organization-repository) to manage the repo's webhooks.

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
```

-	`org`: *Required.* Your github organization.
-	`repo`: *Required.* Your github repository.
-	`resource_name`: *Required.* Name of the resource to be associated with your webhook.
-	`webhook_token`: *Required.* Arbitrary string to identify your webhook. Must match the `webhook_token` property of the resource your webhook points to.
-	`operation`: *Required.*
    -   `create` to create a new webhook. Ignores pre-existing webhooks.
    -   `delete` to delete an existing webhook. Outputs current timestamp on non-existing webhooks.
-   `events`: *Optional*. An array of [events](https://developer.github.com/webhooks/#events) which will trigger your webhook. Default: `push`

## Development
### Prerequisites
- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)

### Making changes
The Concourse entrypoints are in `bin/check`, `bin/in`, and `bin/out`. You can add functionality to these files directly, or you can `require` additional supporing files.

See the [Reference](#Reference) section for some helpful information related to this project's implementation.

### Running the tests
```
npm install
npm test
```
Before submitting your changes for review, ensure all tests are passing.

### Building your changes
```
docker build -t github-webhook-resource .
```

To use the newly built image, push it to a Docker repository which your Concourse pipeline can access and configure your pipeline to use it:

```
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
- [Implementing a Concourse Resource](https://concourse-ci.org/implementing-resources.html)
- [What is a Webhook?](https://help.github.com/articles/about-webhooks/)
- [GitHub's Webhook REST API](https://developer.github.com/v3/repos/hooks/)
- [Concourse Community Resources](https://concourse-ci.org/community.html)