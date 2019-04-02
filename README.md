Github Webhook Resource
===================================

This resource creates and deletes Github webhooks which point to resources in a Concourse pipeline. The github-webhook-resource can only manipulate webhooks which point to other resources in its containing pipeline.

Resource Type Configuration
---------------------------

```yaml
resource_types:
- name: github-webhook-resource
  type: docker-image
  source:
    repository: homedepottech/github-webhook-resource
    tag: 'latest'
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


## License

This project is licensed under [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0) - see the [LICENSE.md](LICENSE.md) file for details.

-----------------------

References:
  - https://help.github.com/articles/about-webhooks/
  - https://developer.github.com/webhooks/creating/
  - https://developer.github.com/v3/repos/hooks/
