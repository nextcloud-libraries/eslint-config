/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export interface PluginOption {
	/**
	 * If we should try to find an appinfo and only handle APIs removed before the max-version
	 */
	parseAppInfo?: boolean

	/**
	 * Set a Nextcloud target version, only APIs removed before that versions are checked
	 */
	targetVersion?: string
}
