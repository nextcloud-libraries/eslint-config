/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { RuleTester } from 'eslint'
import { test } from 'vitest'
import vueParser from 'vue-eslint-parser'
import rule from './no-emit-and-broadcast.ts'

const ruleTester = new RuleTester()

test('rule: no-emit-and-broadcast', () => {
	ruleTester.run('no-emit-and-broadcast', rule, {
		valid: [
			{
				code: `import { broadcast, emit } from '@nextcloud/event-bus'
function save() {
	broadcast('files:node:updated', node)
	emit('files:node:deleted', node)
}`,
			},
			{
				// Different functions
				code: `import { broadcast, emit } from '@nextcloud/event-bus'
function local() {
	emit('files:node:updated', node)
}
function everywhere() {
	broadcast('files:node:updated', node)
}`,
			},
			{
				// Not the event bus
				code: `import { broadcast, emit } from './bus.ts'
broadcast('files:node:updated', node)
emit('files:node:updated', node)`,
			},
			{
				// Event names that are not static
				code: `import { broadcast, emit } from '@nextcloud/event-bus'
broadcast(name, node)
emit(name, node)
broadcast(\`files:node:\${type}\`, node)
emit(\`files:node:\${type}\`, node)`,
			},
		],

		invalid: [
			{
				code: `import { broadcast, emit } from '@nextcloud/event-bus'
function save() {
	emit('files:node:updated', node)
	broadcast('files:node:updated', node)
}`,
				output: `import { broadcast, emit } from '@nextcloud/event-bus'
function save() {
	broadcast('files:node:updated', node)
}`,
				errors: [{ messageId: 'emitAndBroadcast', data: { name: 'files:node:updated' } }],
			},
			{
				// Order does not matter, top level counts as one scope
				code: `import { broadcast, emit } from '@nextcloud/event-bus'
broadcast(\`files:node:updated\`, node)
emit("files:node:updated", node)
`,
				output: `import { broadcast, emit } from '@nextcloud/event-bus'
broadcast(\`files:node:updated\`, node)
`,
				errors: [{ messageId: 'emitAndBroadcast' }],
			},
			{
				// Aliased imports
				code: `import { broadcast as send, emit as fire } from '@nextcloud/event-bus'
const save = () => {
	fire('files:config:updated', { key, value })
	send('files:config:updated', { key, value })
}`,
				output: `import { broadcast as send, emit as fire } from '@nextcloud/event-bus'
const save = () => {
	send('files:config:updated', { key, value })
}`,
				errors: [{ messageId: 'emitAndBroadcast' }],
			},
			{
				// Namespace import
				code: `import * as eventBus from '@nextcloud/event-bus'
async function save() {
	eventBus.emit('files:node:updated', node)
	eventBus.broadcast('files:node:updated', node)
}`,
				output: `import * as eventBus from '@nextcloud/event-bus'
async function save() {
	eventBus.broadcast('files:node:updated', node)
}`,
				errors: [{ messageId: 'emitAndBroadcast' }],
			},
			{
				// Reported but not fixed when the emit() is not its own statement
				code: `import { broadcast, emit } from '@nextcloud/event-bus'
function save() {
	broadcast('files:node:updated', node)
	return emit('files:node:updated', node)
}`,
				output: null,
				errors: [{ messageId: 'emitAndBroadcast' }],
			},
		],
	})
})

test('rule: no-emit-and-broadcast in vue script setup', () => {
	const vueRuleTester = new RuleTester({
		languageOptions: {
			parser: vueParser,
			ecmaVersion: 2022,
			sourceType: 'module',
		},
	})

	vueRuleTester.run('no-emit-and-broadcast', rule, {
		valid: [],
		invalid: [
			{
				code: `<script setup>
import { broadcast, emit } from '@nextcloud/event-bus'
function onDelete() {
	emit('files:node:deleted', node)
	broadcast('files:node:deleted', node)
}
</script>`,
				output: `<script setup>
import { broadcast, emit } from '@nextcloud/event-bus'
function onDelete() {
	broadcast('files:node:deleted', node)
}
</script>`,
				errors: [{ messageId: 'emitAndBroadcast' }],
			},
		],
	})
})
