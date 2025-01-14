/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Linter } from 'eslint'
import typescriptPlugin from 'typescript-eslint'
import { GLOB_FILES_TESTING, GLOB_FILES_TYPESCRIPT, GLOB_FILES_VUE } from '../globs'
import { restrictConfigFiles } from '../utils'
import { ConfigOptions } from '../types'

/**
 * Typescript related ESLint rules for Nextcloud
 *
 * @param options options defining the config preset flavor
 */
export function typescript(options: ConfigOptions): Linter.Config[] {
	return [
		...restrictConfigFiles(
			typescriptPlugin.configs.recommended as Linter.Config[],
			[
				...GLOB_FILES_TYPESCRIPT,
				...(options.vueIsTypescript ? GLOB_FILES_VUE : []),
			],
		),

		{
			files: [
				...GLOB_FILES_TYPESCRIPT,
				...(options.vueIsTypescript ? GLOB_FILES_VUE : []),
			],
			rules: {
			// Allow expect-error as we can sometimes not prevent it...
				'@typescript-eslint/ban-ts-comment': [
					'error',
					{
						'ts-expect-error': 'allow-with-description',
						minimumDescriptionLength: 9,
					},
				],
				// No nullish coalescing if left side can not be nullish
				'@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
				// Do not use types, variables etc before they are defined
				'no-use-before-define': 'off',
				'@typescript-eslint/no-use-before-define': 'error',
				// Do not shadow outer variables / functions - this can lead to wrong assumptions
				'no-shadow': 'off',
				'@typescript-eslint/no-shadow': 'error',
			},
			name: 'nextcloud/typescript/rules',
		},

		{
			files: GLOB_FILES_TESTING,
			rules: {
			// Allow "any" in tests
				'@typescript-eslint/no-explicit-any': 'off',
			},
			name: 'nextcloud/typescript/test-rules',
		},
	]
}
