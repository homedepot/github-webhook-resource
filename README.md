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
-   `github_token`: *Required.* [A Github token with public_repo scope.](https://github.com/settings/tokens/new?scopes=public_repo)

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
```

-	`org`: *Required.* Your github organization.
-	`repo`: *Required.* Your github repository.
-	`resource_name`: *Required.* Name of the resource to be associated with your webhook.
-	`webhook_token`: *Required.* Arbitrary string to identify your webhook. Must match the `webhook_token` property of the resource your webhook points to.
-	`operation`: *Required.*
    -   `create` to create a new webhook. Ignores pre-existing webhooks.
    -   `delete` to delete an existing webhook. Outputs current timestamp on non-existing webhooks.

-----------------------

References:
  - https://help.github.com/articles/about-webhooks/
  - https://developer.github.com/webhooks/creating/
  - https://developer.github.com/v3/repos/hooks/
