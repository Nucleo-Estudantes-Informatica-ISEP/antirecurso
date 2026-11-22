import { pathToFileURL } from 'node:url';

const organization = 'Nucleo-Estudantes-Informatica-ISEP';
const repositories = new Set(
  ['antirecurso', 'antirecurso-api-adonis'].map((name) => `${organization}/${name}`)
);

const linkedPullRequests = `
  nodes { baseRefName mergedAt repository { nameWithOwner } }
  pageInfo { hasNextPage endCursor }
`;

const boardQuery = `
  query($cursor: String) {
    organization(login: "${organization}") {
      projectV2(number: 10) {
        id
        field(name: "Status") {
          ... on ProjectV2SingleSelectField { id options { id name } }
        }
        items(first: 30, after: $cursor) {
          pageInfo { hasNextPage endCursor }
          nodes {
            id
            isArchived
            fieldValueByName(name: "Status") {
              ... on ProjectV2ItemFieldSingleSelectValue { optionId }
            }
            content {
              ... on Issue {
                id
                state
                repository { nameWithOwner }
                timelineItems(last: 1, itemTypes: [REOPENED_EVENT]) {
                  nodes { ... on ReopenedEvent { createdAt } }
                }
                closedByPullRequestsReferences(first: 20, includeClosedPrs: true) {
                  ${linkedPullRequests}
                }
              }
            }
          }
        }
      }
    }
  }
`;

const morePullRequestsQuery = `
  query($issue: ID!, $cursor: String) {
    node(id: $issue) {
      ... on Issue {
        closedByPullRequestsReferences(first: 100, after: $cursor, includeClosedPrs: true) {
          ${linkedPullRequests}
        }
      }
    }
  }
`;

const updateStatus = `
  mutation($project: ID!, $item: ID!, $field: ID!, $done: String!) {
    updateProjectV2ItemFieldValue(input: {
      projectId: $project, itemId: $item, fieldId: $field, value: { singleSelectOptionId: $done }
    }) { projectV2Item { id } }
  }
`;

export async function syncBoard({ graphql, start, dryRun = false }) {
  const cutoff = Date.parse(start);
  if (!Number.isFinite(cutoff)) {
    throw new Error('Set BOARD_SYNC_START_AT to the activation timestamp in ISO 8601 format.');
  }

  const updates = [];
  let page;
  do {
    const data = await graphql(boardQuery, { cursor: page?.endCursor });
    const project = data.organization?.projectV2;
    const done = project?.field?.options?.find((option) => option.name === 'Done');
    if (!done) throw new Error('Project 10 or its Done status is unavailable.');

    for (const item of project.items.nodes) {
      const issue = item.content;
      if (
        item.isArchived ||
        item.fieldValueByName?.optionId === done.id ||
        issue?.state !== 'OPEN' ||
        !repositories.has(issue.repository.nameWithOwner)
      )
        continue;

      const reopenedAt = Date.parse(issue.timelineItems.nodes[0]?.createdAt);
      const eligibleMerge = (pr) => {
        const mergedAt = Date.parse(pr.mergedAt);
        return (
          pr.baseRefName === 'dev' &&
          repositories.has(pr.repository.nameWithOwner) &&
          mergedAt >= cutoff &&
          (Number.isNaN(reopenedAt) || mergedAt > reopenedAt)
        );
      };

      let links = issue.closedByPullRequestsReferences;
      while (!links.nodes.some(eligibleMerge) && links.pageInfo.hasNextPage) {
        const result = await graphql(morePullRequestsQuery, {
          issue: issue.id,
          cursor: links.pageInfo.endCursor
        });
        links = result.node.closedByPullRequestsReferences;
      }
      if (links.nodes.some(eligibleMerge)) {
        updates.push({
          project: project.id,
          item: item.id,
          field: project.field.id,
          done: done.id
        });
      }
    }
    page = project.items.pageInfo;
  } while (page.hasNextPage);

  if (!dryRun) {
    for (const variables of updates) await graphql(updateStatus, variables);
  }
  return updates.length;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const token = process.env.GH_TOKEN;
  if (!token) throw new Error('GH_TOKEN is required.');

  async function graphql(query, variables) {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query, variables })
    });
    if (!response.ok) throw new Error(`GitHub GraphQL returned HTTP ${response.status}.`);
    const { data, errors } = await response.json();
    if (errors?.length) throw new Error(errors.map(({ message }) => message).join('\n'));
    return data;
  }

  const count = await syncBoard({
    graphql,
    start: process.env.BOARD_SYNC_START_AT,
    dryRun: process.argv.includes('--dry-run')
  });
  console.log(
    `${process.argv.includes('--dry-run') ? 'Eligible' : 'Updated'} issue cards: ${count}`
  );
}
