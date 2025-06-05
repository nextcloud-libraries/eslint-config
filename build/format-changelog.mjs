/*!
 * SPDX-FileCopyrightText: Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 */
/* eslint-disable no-console */

import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

console.info('🔎 checking format of CHANGELOG.md')

const file = join(import.meta.dirname, '..', 'CHANGELOG.md')
const content = await readFile(file, { encoding: 'utf-8' })

const formatted = content.replaceAll(
	/by @([^ ]+) in ((https:\/\/github.com\/)nextcloud-libraries\/eslint-config\/pull\/(\d+))/g,
	'[\\#$4]($2) \\([$1]($3$1)\\)',
)

if (formatted !== content) {
	console.info('✏️ fixing format')
	await writeFile(file, formatted)
	console.info('🎉 done')
} else {
	console.info('✅ no formatting needed - done.')
}
