import assert from 'node:assert/strict';
import { test } from 'node:test';
import { syncBoard } from './sync-board-issues.mjs';

const org = 'Nucleo-Estudantes-Informatica-ISEP';
const web = { nameWithOwner: `${org}/antirecurso` };
const api = { nameWithOwner: `${org}/antirecurso-api-adonis` };
const start = '2026-11-20T00:00:00Z';
const mergedAt = '2026-11-21T00:00:00Z';
const merge = { baseRefName: 'dev', mergedAt, repository: web };

function connection(nodes, endCursor = null) {
  return { nodes, pageInfo: { hasNextPage: endCursor !== null, endCursor } };
}

function card(id, { pr = merge, repository = web, reopened, cursor, state = 'OPEN' } = {}) {
  return {
    id,
    content: {
      id,
      state,
      repository,
      timelineItems: connection(reopened ? [{ createdAt: reopened }] : []),
      closedByPullRequestsReferences: connection([pr], cursor)
    }
  };
}

function project(items, cursor) {
  return {
    organization: {
      projectV2: {
        id: 'project',
        field: { id: 'status', options: [{ id: 'done', name: 'Done' }] },
        items: connection(items, cursor)
      }
    }
  };
}

test('updates only eligible board issue cards and follows both connections', async () => {
  const mutations = [];
  const graphql = async (query, variables) => {
    if (query.includes('updateProjectV2ItemFieldValue')) {
      mutations.push(variables);
      return {};
    }
    if (variables.issue) {
      assert.deepEqual(variables, { issue: '2', cursor: 'more-prs' });
      return {
        node: { closedByPullRequestsReferences: connection([{ ...merge, repository: api }]) }
      };
    }
    if (variables.cursor === 'more-items') {
      return project([
        card('2', { repository: api, pr: { ...merge, mergedAt: null }, cursor: 'more-prs' }),
        card('3', { pr: { ...merge, baseRefName: 'stacked-branch' } }),
        card('4', { reopened: '2026-11-22T00:00:00Z' }),
        card('5', { pr: { ...merge, mergedAt: '2026-11-19T23:59:59Z' } }),
        card('6', { pr: { ...merge, mergedAt: null } }),
        card('7', { state: 'CLOSED' }),
        { ...card('8'), isArchived: true },
        { ...card('9'), fieldValueByName: { optionId: 'done' } },
        { id: '10', content: {} },
        card('11', { pr: { ...merge, repository: { nameWithOwner: 'other/repo' } } }),
        card('12', { repository: { nameWithOwner: 'other/repo' } })
      ]);
    }
    return project([card('1')], 'more-items');
  };

  assert.equal(await syncBoard({ graphql, start }), 2);
  assert.deepEqual(mutations, [
    { project: 'project', item: '1', field: 'status', done: 'done' },
    { project: 'project', item: '2', field: 'status', done: 'done' }
  ]);
});

test('dry run reports an eligible issue without any writes', async () => {
  const graphql = async (query) => {
    assert.match(query, /query\(/);
    return project([card('1')]);
  };
  assert.equal(await syncBoard({ graphql, start, dryRun: true }), 1);
});

test('invalid activation date fails before reading the board', async () => {
  const graphql = async () => assert.fail('unexpected API request');
  await assert.rejects(syncBoard({ graphql, start: 'invalid' }), /BOARD_SYNC_START_AT/);
});
