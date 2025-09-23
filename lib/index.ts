/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export * from './configs/index.ts'

export { default as packageJsonPlugin } from './plugins/packageJson.ts'
export { default as nextcloudPlugin } from './plugins/nextcloud/index.ts'
export { default as l10nPlugin } from './plugins/l10n/index.ts'
